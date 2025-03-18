import React, { useState, useContext, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Droplet } from 'lucide-react';
import { LanguageContext } from '../App';
import { Medicine } from './MedicineList';

// Interface for water intake records
interface WaterIntakeRecord {
  [date: string]: number; // ml of water consumed per day
}

// Function to check if medicine should be shown on selected date
const shouldShowMedicine = (medicine: Medicine, dateStr: string): boolean => {
  if (!medicine.startDate) {
    // Nếu không có ngày bắt đầu, hiển thị thuốc cho mọi ngày
    return true;
  }

  // Chuẩn hóa chuỗi ngày bắt đầu để đảm bảo định dạng YYYY-MM-DD
  const startDateParts = medicine.startDate.split('-');
  // Đảm bảo chúng ta có đầy đủ 3 phần (năm, tháng, ngày)
  if (startDateParts.length !== 3) {
    return true; // Nếu định dạng không hợp lệ, hiển thị thuốc để an toàn
  }

  // Tạo đối tượng Date từ chuỗi ngày bắt đầu với giờ là 12 trưa
  const startDateYear = parseInt(startDateParts[0]);
  const startDateMonth = parseInt(startDateParts[1]) - 1; // Tháng trong JS bắt đầu từ 0
  const startDateDay = parseInt(startDateParts[2]);
  const startDate = new Date(startDateYear, startDateMonth, startDateDay, 12, 0, 0, 0);

  // Tạo đối tượng Date từ chuỗi ngày được chọn với giờ là 12 trưa
  const selectedDateParts = dateStr.split('-');
  if (selectedDateParts.length !== 3) {
    return true; // Nếu định dạng không hợp lệ, hiển thị thuốc để an toàn
  }
  
  const selectedDateYear = parseInt(selectedDateParts[0]);
  const selectedDateMonth = parseInt(selectedDateParts[1]) - 1;
  const selectedDateDay = parseInt(selectedDateParts[2]);
  const selectedDateTime = new Date(selectedDateYear, selectedDateMonth, selectedDateDay, 12, 0, 0, 0);

  // Chuyển đối tượng Date thành timestamps để so sánh
  const startTimestamp = startDate.getTime();
  const selectedTimestamp = selectedDateTime.getTime();

  // Nếu ngày được chọn trước ngày bắt đầu, không hiển thị
  if (selectedTimestamp < startTimestamp) {
    return false;
  }

  // Kiểm tra dựa trên thời gian điều trị
  if (medicine.duration) {
    const durationMap: { [key: string]: number } = {
      '1 Ngày': 1,
      'One Day': 1,
      '1 Week': 7,
      '1 Tuần': 7,
      '2 Weeks': 14,
      '2 Tuần': 14,
      '1 Month': 30,
      '1 Tháng': 30,
      '3 Months': 90,
      '3 Tháng': 90,
      '6 Months': 180,
      '6 Tháng': 180,
      '1 Year': 365,
      '1 Năm': 365,
      'Ongoing': Infinity,
      'Liên tục': Infinity
    };

    const durationDays = durationMap[medicine.duration] || Infinity;
    
    if (durationDays !== Infinity) {
      // Tính ngày kết thúc (bao gồm cả ngày bắt đầu và ngày cuối cùng)
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + durationDays - 1); // Trừ 1 vì đã tính cả ngày bắt đầu
      
      // Nếu ngày được chọn sau ngày kết thúc, không hiển thị
      if (selectedTimestamp > endDate.getTime()) {
        return false;
      }
    }
  }
  
  // Kiểm tra tần suất (frequency)
  if (medicine.frequency) {
    // Nếu trùng ngày bắt đầu, luôn hiển thị
    if (selectedTimestamp === startTimestamp) {
      return true;
    }
    
    // Tính khoảng cách ngày từ ngày bắt đầu đến ngày được chọn
    const diffTime = Math.abs(selectedTimestamp - startTimestamp);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    switch (medicine.frequency) {
      case 'Daily':
      case 'Hằng ngày':
        // Hiển thị mỗi ngày
        return true;
        
      case 'Every 2 days':
      case 'Cách 1 ngày':
        // Hiển thị ngày đầu tiên và mỗi 2 ngày sau đó
        return diffDays % 2 === 0;
        
      case 'Every 3 days':
      case 'Cách 3 ngày':
        // Hiển thị ngày đầu tiên và mỗi 3 ngày sau đó
        return diffDays % 3 === 0;
        
      case 'Weekly':
      case 'Hàng tuần':
        // Hiển thị ngày đầu tiên và mỗi 7 ngày sau đó
        return diffDays % 7 === 0;
        
      case 'Biweekly':
      case 'Hai tuần một lần':
        // Hiển thị ngày đầu tiên và mỗi 14 ngày sau đó
        return diffDays % 14 === 0;
        
      case 'Monthly':
      case 'Hàng tháng':
        // Kiểm tra nếu là cùng ngày trong tháng
        return selectedDateDay === startDateDay;
        
      default:
        // Nếu không có hoặc không nhận dạng được tần suất, hiển thị mỗi ngày
        return true;
    }
  }

  return true;
};

// Function to get medication data for a specific date
const getMedicationData = (date: Date, medicines: Medicine[], activeTab: string) => {
  // Format date to string for comparison (YYYY-MM-DD)
  const dateStr = date.toISOString().split('T')[0];
  
  // Filter medicines by type based on active tab
  let filteredMedicines: Medicine[] = [];
  
  if (activeTab === 'medicine') {
    filteredMedicines = medicines.filter(med => 
      med.type === 'medicine' || med.type === 'tablet' || med.type === 'other'
    );
  } else if (activeTab === 'injection') {
    filteredMedicines = medicines.filter(med => med.type === 'injection');
  } else {
    // For water tab or other tabs
    filteredMedicines = [];
  }
  
  // Filter medicines that should be shown on this date based on startDate, duration and frequency
  const medicationsForDay = filteredMedicines.filter(med => 
    shouldShowMedicine(med, dateStr) && med.schedules && med.schedules.length > 0
  );
  
  // Count total schedules instead of just medicines count
  let totalCount = 0;
  medicationsForDay.forEach(med => {
    totalCount += med.schedules.length;
  });
  
  // Count completed schedules for all medicines
  let completedCount = 0;
  medicationsForDay.forEach(med => {
    if (med.takenRecords && med.takenRecords[dateStr]) {
      if (Array.isArray(med.takenRecords[dateStr])) {
        completedCount += med.takenRecords[dateStr].filter(taken => taken === true).length;
      } else if (med.takenRecords[dateStr] === true) {
        completedCount += 1; // If it's a boolean true, count as one completed
      }
    }
  });
  
  // Calculate uncompleted count and check if all are completed
  const uncompletedCount = totalCount - completedCount;
  const allCompleted = totalCount > 0 && uncompletedCount === 0;
  
  return { 
    totalCount, 
    completedCount, 
    uncompletedCount, 
    allCompleted 
  };
};

// Function to get water intake data for a specific date
const getWaterIntakeData = (date: Date, waterIntake: WaterIntakeRecord) => {
  // Format date to string for comparison (YYYY-MM-DD)
  const dateStr = date.toISOString().split('T')[0];
  
  // Get water intake for this date (default to 0 if not found)
  const intake = waterIntake[dateStr] || 0;
  
  // Calculate percentage of daily goal (2000ml)
  const percentage = Math.min(100, Math.round((intake / 2000) * 100));
  
  return { 
    intake, 
    percentage, 
    completed: percentage >= 100
  };
};

const CalendarComponent = () => {
  const { language } = useContext(LanguageContext);
  const [displayWeek, setDisplayWeek] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [waterIntake, setWaterIntake] = useState<WaterIntakeRecord>({});
  const [weekDays, setWeekDays] = useState<Array<{
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    totalMedicationCount: number;
    uncompletedCount: number;
    allCompleted: boolean;
    waterIntake: number;
    waterPercentage: number;
    waterCompleted: boolean;
  }>>([]);
  const [activeTab, setActiveTab] = useState<string>('medicine');

  // Load medicines from localStorage
  useEffect(() => {
    const loadMedicines = () => {
      const storedMedicines = localStorage.getItem('medicines');
      if (storedMedicines) {
        setMedicines(JSON.parse(storedMedicines));
      }
    };
    
    loadMedicines();
    
    // Listen for medicine status changes
    window.addEventListener('medicineStatusChanged', loadMedicines);
    
    return () => {
      window.removeEventListener('medicineStatusChanged', loadMedicines);
    };
  }, []);

  // Load water intake data from localStorage
  useEffect(() => {
    const loadWaterIntake = () => {
      const storedWaterIntake = localStorage.getItem('waterIntake');
      if (storedWaterIntake) {
        setWaterIntake(JSON.parse(storedWaterIntake));
      } else {
        // Initialize with some sample data
        const sampleData: WaterIntakeRecord = {};
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);
        
        sampleData[today.toISOString().split('T')[0]] = 1500; // 1500ml today
        sampleData[yesterday.toISOString().split('T')[0]] = 2000; // 2000ml yesterday
        sampleData[twoDaysAgo.toISOString().split('T')[0]] = 1200; // 1200ml two days ago
        
        setWaterIntake(sampleData);
        localStorage.setItem('waterIntake', JSON.stringify(sampleData));
      }
    };
    
    loadWaterIntake();
    
    // Listen for water intake changes
    window.addEventListener('waterIntakeChanged', loadWaterIntake);
    
    return () => {
      window.removeEventListener('waterIntakeChanged', loadWaterIntake);
    };
  }, []);

  // Lắng nghe sự kiện dateSelected từ bất kỳ component nào
  useEffect(() => {
    const handleDateSelected = (event: CustomEvent) => {
      if (event.detail && event.detail.date) {
        const dateStr = event.detail.date;
        
        // Phân tích chuỗi ngày YYYY-MM-DD
        const [year, month, day] = dateStr.split('-').map((num: string) => parseInt(num));
        
        // Tạo đối tượng Date mới, đặt giờ là 12 trưa để tránh vấn đề múi giờ
        const newSelectedDate = new Date(year, month - 1, day, 12, 0, 0, 0);
        
        // Cập nhật selectedDate
        setSelectedDate(newSelectedDate);
        
        // Cập nhật displayWeek để đảm bảo ngày được chọn hiển thị
        adjustDisplayWeekForSelectedDate(newSelectedDate);
      }
    };
    
    // Lắng nghe sự kiện forceRefresh để cập nhật component
    const handleForceRefresh = () => {
      // Tải lại ngày đã chọn từ localStorage
      const savedDate = localStorage.getItem('selectedDate');
      if (savedDate) {
        const [year, month, day] = savedDate.split('-').map((num: string) => parseInt(num));
        const newSelectedDate = new Date(year, month - 1, day, 12, 0, 0, 0);
        setSelectedDate(newSelectedDate);
        adjustDisplayWeekForSelectedDate(newSelectedDate);
      }
    };
    
    window.addEventListener('dateSelected' as any, handleDateSelected);
    window.addEventListener('forceRefresh', handleForceRefresh);
    
    // Khôi phục ngày đã chọn từ localStorage khi load component
    const savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
      const [year, month, day] = savedDate.split('-').map((num: string) => parseInt(num));
      const newSelectedDate = new Date(year, month - 1, day, 12, 0, 0, 0);
      setSelectedDate(newSelectedDate);
      adjustDisplayWeekForSelectedDate(newSelectedDate);
    }
    
    return () => {
      window.removeEventListener('dateSelected' as any, handleDateSelected);
      window.removeEventListener('forceRefresh', handleForceRefresh);
    };
  }, []);

  // Điều chỉnh tuần hiển thị để đảm bảo ngày được chọn nằm trong tuần đó
  const adjustDisplayWeekForSelectedDate = (date: Date) => {
    const newDate = new Date(date);
    const day = newDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Tìm ngày đầu tuần (Chủ nhật)
    const firstDayOfWeek = new Date(newDate);
    firstDayOfWeek.setDate(newDate.getDate() - day);
    
    // So sánh với ngày đầu tuần hiện tại
    const currentFirstDayOfWeek = getFirstDayOfWeek(displayWeek);
    
    // Chỉ cập nhật nếu ngày đầu tuần khác nhau
    if (firstDayOfWeek.toDateString() !== currentFirstDayOfWeek.toDateString()) {
      setDisplayWeek(firstDayOfWeek);
    }
  };

  // Lấy ngày đầu tuần (Chủ nhật) từ một ngày bất kỳ
  const getFirstDayOfWeek = (date: Date) => {
    const newDate = new Date(date);
    const day = newDate.getDay();
    newDate.setDate(newDate.getDate() - day);
    return newDate;
  };

  // Listen for category tab changes
  useEffect(() => {
    const handleCategoryTabChange = (event: CustomEvent) => {
      if (event.detail && event.detail.tab) {
        setActiveTab(event.detail.tab);
      }
    };

    window.addEventListener('categoryTabChanged' as any, handleCategoryTabChange);
    
    return () => {
      window.removeEventListener('categoryTabChanged' as any, handleCategoryTabChange);
    };
  }, []);

  // Day names in Vietnamese and English
  const dayNames = {
    vi: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  };

  // Month names in Vietnamese and English
  const monthNames = {
    vi: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
         'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    en: ['January', 'February', 'March', 'April', 'May', 'June',
         'July', 'August', 'September', 'October', 'November', 'December']
  };

  // Update week days whenever displayWeek, medicines, or waterIntake changes
  useEffect(() => {
    const generateWeekDays = () => {
      const today = new Date();
      const firstDayOfWeek = getFirstDayOfWeek(displayWeek);
      const result = [];
      
      // Generate 7 days starting from the first day of the week (Sunday)
      for (let i = 0; i < 7; i++) {
        const day = new Date(firstDayOfWeek);
        day.setDate(firstDayOfWeek.getDate() + i);
        
        // Get medication data for this specific day
        const { totalCount, uncompletedCount, allCompleted } = getMedicationData(day, medicines, activeTab);
        
        // Get water intake data for this specific day
        const { intake, percentage, completed } = getWaterIntakeData(day, waterIntake);
        
        result.push({
          date: day,
          isCurrentMonth: day.getMonth() === displayWeek.getMonth(),
          isToday: day.toDateString() === today.toDateString(),
          isSelected: day.toDateString() === selectedDate.toDateString(),
          totalMedicationCount: totalCount,
          uncompletedCount: uncompletedCount,
          allCompleted,
          waterIntake: intake,
          waterPercentage: percentage,
          waterCompleted: completed
        });
      }
      
      return result;
    };
    
    setWeekDays(generateWeekDays());
  }, [displayWeek, medicines, waterIntake, activeTab, selectedDate]);

  // Go to previous week
  const goToPreviousWeek = (event: React.MouseEvent) => {
    event.stopPropagation(); // Ngăn sự kiện click lan truyền
    
    const newDate = new Date(displayWeek);
    newDate.setDate(displayWeek.getDate() - 7);
    setDisplayWeek(newDate);
  };

  // Go to next week
  const goToNextWeek = (event: React.MouseEvent) => {
    event.stopPropagation(); // Ngăn sự kiện click lan truyền
    
    const newDate = new Date(displayWeek);
    newDate.setDate(displayWeek.getDate() + 7);
    setDisplayWeek(newDate);
  };

  // Handle date selection
  const handleDateSelect = (day: Date) => {
    // Cập nhật ngày đã chọn
    setSelectedDate(day);
    
    // Tạo đối tượng Date mới để đảm bảo định dạng đúng
    const selectedDay = new Date(day);
    // Đặt giờ về 12 trưa để tránh vấn đề múi giờ
    selectedDay.setHours(12, 0, 0, 0);
    
    // Định dạng ngày với múi giờ địa phương: YYYY-MM-DD
    const year = selectedDay.getFullYear();
    const month = String(selectedDay.getMonth() + 1).padStart(2, '0');
    const date = String(selectedDay.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${date}`;
    
    // Lưu ngày được chọn vào localStorage
    localStorage.setItem('selectedDate', dateStr);
    
    // Dispatch an event to notify other components about date change
    window.dispatchEvent(new CustomEvent('dateSelected', { 
      detail: { date: dateStr } 
    }));
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.getDate();
  };

  // Format water intake for display
  const formatWaterIntake = (ml: number) => {
    if (ml >= 1000) {
      return `${(ml / 1000).toFixed(1)}L`;
    }
    return `${ml}ml`;
  };

  // Get month title for display
  const getMonthTitle = () => {
    // Lấy ngày đầu và cuối tuần
    const firstDay = weekDays[0]?.date;
    const lastDay = weekDays[6]?.date;
    
    if (!firstDay || !lastDay) {
      return monthNames[language as keyof typeof monthNames][displayWeek.getMonth()];
    }
    
    // Nếu tuần nằm trong cùng một tháng
    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${monthNames[language as keyof typeof monthNames][firstDay.getMonth()]} ${firstDay.getFullYear()}`;
    }
    
    // Nếu tuần nằm giữa hai tháng
    return `${dayNames[language as keyof typeof dayNames][firstDay.getDay()]} ${firstDay.getDate()} ${monthNames[language as keyof typeof monthNames][firstDay.getMonth()]} - ${dayNames[language as keyof typeof dayNames][lastDay.getDay()]} ${lastDay.getDate()} ${monthNames[language as keyof typeof monthNames][lastDay.getMonth()]} ${lastDay.getFullYear()}`;
  };

  return (
    <div className="px-6 py-4 bg-white">
      {/* Month and Year Display with Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button 
          type="button"
          onClick={goToPreviousWeek}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          aria-label={language === 'vi' ? 'Tuần trước' : 'Previous week'}
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        
        <h2 className="text-lg font-semibold text-gray-800">
          {getMonthTitle()}
        </h2>
        
        <button 
          type="button"
          onClick={goToNextWeek}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          aria-label={language === 'vi' ? 'Tuần sau' : 'Next week'}
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Week View */}
      <div className="flex justify-between">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center"
            onClick={() => handleDateSelect(day.date)}
          >
            <span className={`text-sm ${day.isCurrentMonth ? 'text-gray-600' : 'text-gray-400'}`}>
              {dayNames[language as keyof typeof dayNames][day.date.getDay()]}
            </span>
            <div className="relative">
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full mt-1 cursor-pointer
                  ${day.isSelected ? 'bg-indigo-500 text-white' : 
                    day.isToday ? 'bg-indigo-100 text-indigo-600' : 
                    'hover:bg-gray-100'}`}
              >
                {formatDate(day.date)}
              </div>
              
              {/* Medication count indicator or completed checkmark */}
              {activeTab !== 'water' && day.totalMedicationCount > 0 && (
                <div className="absolute -top-1 -right-1 rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {day.allCompleted ? (
                    <div className="bg-green-500 rounded-full p-0.5">
                      <Check size={12} className="text-white" />
                    </div>
                  ) : (
                    <div className={`rounded-full w-4 h-4 flex items-center justify-center text-white ${
                      activeTab === 'injection' ? 'bg-purple-600' : 'bg-pink-500'
                    }`}>
                      {day.uncompletedCount}
                    </div>
                  )}
                </div>
              )}
              
              {/* Water intake indicator */}
              {activeTab === 'water' && day.waterIntake > 0 && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                  <div className={`flex items-center ${day.waterCompleted ? 'text-blue-600' : 'text-blue-400'}`}>
                    <Droplet size={10} className="mr-0.5" />
                    {formatWaterIntake(day.waterIntake)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Water intake legend (only show when water tab is active) */}
      {activeTab === 'water' && (
        <div className="mt-6 flex justify-center">
          <div className="bg-blue-50 rounded-lg p-2 flex items-center text-sm text-blue-600">
            <Droplet size={16} className="mr-1 text-blue-500" />
            {language === 'vi' ? 'Mục tiêu: 2L mỗi ngày' : 'Goal: 2L per day'}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
