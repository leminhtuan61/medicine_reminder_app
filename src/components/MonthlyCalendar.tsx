import React, { useState, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight, X, Check, Droplet } from 'lucide-react';
import { LanguageContext } from '../App';
import { Medicine } from './MedicineList';
import { Pill, Capsule, TabletBottle, Tablets } from './MedicineIcons';
import { useNavigate } from 'react-router-dom';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  medicineCount: number;
  injectionCount: number;
  medicineCompleted: boolean;
  injectionCompleted: boolean;
  uncompletedMedicineCount: number;
  uncompletedInjectionCount: number;
  waterIntake: number;
  waterPercentage: number;
  waterCompleted: boolean;
}

interface DayDetailProps {
  date: Date;
  onClose: () => void;
}

// Function to check if medicine should be shown on selected date
const shouldShowMedicine = (medicine: Medicine, dateStr: string): boolean => {
  if (!medicine.startDate) {
    // Nếu không có ngày bắt đầu, hiển thị thuốc cho mọi ngày
    return true;
  }

  const startDate = new Date(medicine.startDate);
  const selectedDateTime = new Date(dateStr);
  
  // Chuyển về đầu ngày để so sánh chính xác
  startDate.setHours(0, 0, 0, 0);
  selectedDateTime.setHours(0, 0, 0, 0);

  // Nếu ngày được chọn trước ngày bắt đầu, không hiển thị
  if (selectedDateTime < startDate) {
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
      if (selectedDateTime > endDate) {
        return false;
      }
    }
  }
  
  // Kiểm tra tần suất (frequency)
  if (medicine.frequency) {
    // Nếu trùng ngày bắt đầu, luôn hiển thị
    if (selectedDateTime.getTime() === startDate.getTime()) {
      return true;
    }
    
    // Tính khoảng cách ngày từ ngày bắt đầu đến ngày được chọn
    const diffTime = Math.abs(selectedDateTime.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    switch (medicine.frequency) {
      case 'Daily':
      case 'Hằng ngày':
        // Hiển thị mỗi ngày
        return true;
        
      case 'Every 2 days':
      case 'Cách 2 ngày':
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
        return selectedDateTime.getDate() === startDate.getDate();
        
      default:
        // Nếu không có hoặc không nhận dạng được tần suất, hiển thị mỗi ngày
        return true;
    }
  }

  return true;
};

// Component to display day details in popup
const DayDetail: React.FC<DayDetailProps> = ({ date, onClose }) => {
  const { language } = useContext(LanguageContext);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [waterIntake, setWaterIntake] = useState<number>(0);
  const dateStr = date.toISOString().split('T')[0];
  
  useEffect(() => {
    // Load medicines from localStorage
    const storedMedicines = localStorage.getItem('medicines');
    if (storedMedicines) {
      const parsedMedicines = JSON.parse(storedMedicines);
      setMedicines(parsedMedicines);
    }
    
    // Load water intake
    const storedWaterIntake = localStorage.getItem('waterIntake');
    if (storedWaterIntake) {
      const parsedWaterIntake = JSON.parse(storedWaterIntake);
      setWaterIntake(parsedWaterIntake[dateStr] || 0);
    }
  }, [dateStr]);
  
  // Filter medicines for this date
  const medicinesForDate = medicines.filter(med => 
    (med.type === 'medicine' || med.type === 'tablet' || med.type === 'other') &&
    shouldShowMedicine(med, dateStr)
  );
  
  // Filter injections for this date
  const injectionsForDate = medicines.filter(med => 
    med.type === 'injection' &&
    shouldShowMedicine(med, dateStr)
  );
  
  // Get icon component based on medicine type
  const getMedicineIcon = (medicine: Medicine) => {
    const size = 24;
    const color = medicine.iconColor || undefined;
    
    switch (medicine.iconType) {
      case 'pill':
        return <Pill size={size} color={color} />;
      case 'capsule':
        return <Capsule size={size} color={color} />;
      case 'tabletBottle':
        return <TabletBottle size={size} />;
      case 'tablets':
        return <Tablets size={size} />;
      default:
        return <Pill size={size} color={color} />;
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', options);
  };
  
  // Check if a medicine has been taken
  const isMedicineTaken = (medicine: Medicine, scheduleIndex: number) => {
    if (!medicine.takenRecords || !medicine.takenRecords[dateStr]) return false;
    
    if (typeof medicine.takenRecords[dateStr] === 'boolean') {
      return scheduleIndex === 0 ? medicine.takenRecords[dateStr] : false;
    }
    
    return medicine.takenRecords[dateStr][scheduleIndex] || false;
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">{formatDate(date)}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {/* Medications Section */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2 flex items-center">
              <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
              {language === 'vi' ? 'Thuốc' : 'Medications'}
            </h3>
            
            {medicinesForDate.length > 0 ? (
              <div className="space-y-2">
                {medicinesForDate.map((medicine) => (
                  medicine.schedules.map((schedule, scheduleIndex) => (
                    <div 
                      key={`${medicine.id}-${scheduleIndex}`}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="mr-2">
                          {getMedicineIcon(medicine)}
                        </div>
                        <div>
                          <div className="font-medium">{medicine.name}</div>
                          <div className="text-sm text-gray-500">{schedule.time}</div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        isMedicineTaken(medicine, scheduleIndex) 
                          ? 'bg-green-500 text-white' 
                          : 'border-2 border-gray-300'
                      }`}>
                        {isMedicineTaken(medicine, scheduleIndex) && <Check size={16} />}
                      </div>
                    </div>
                  ))
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                {language === 'vi' ? 'Không có thuốc nào cho ngày này' : 'No medications for this date'}
              </p>
            )}
          </div>
          
          {/* Injections Section */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2 flex items-center">
              <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
              {language === 'vi' ? 'Lịch tiêm' : 'Injection Schedule'}
            </h3>
            
            {injectionsForDate.length > 0 ? (
              <div className="space-y-2">
                {injectionsForDate.map((injection) => (
                  injection.schedules.map((schedule, scheduleIndex) => (
                    <div 
                      key={`${injection.id}-${scheduleIndex}`}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="mr-2">
                          {getMedicineIcon(injection)}
                        </div>
                        <div>
                          <div className="font-medium">{injection.name}</div>
                          <div className="text-sm text-gray-500">{schedule.time}</div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        isMedicineTaken(injection, scheduleIndex) 
                          ? 'bg-green-500 text-white' 
                          : 'border-2 border-gray-300'
                      }`}>
                        {isMedicineTaken(injection, scheduleIndex) && <Check size={16} />}
                      </div>
                    </div>
                  ))
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                {language === 'vi' ? 'Không có lịch tiêm nào cho ngày này' : 'No injections for this date'}
              </p>
            )}
          </div>
          
          {/* Water Intake Section */}
          <div>
            <h3 className="text-md font-semibold mb-2 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              {language === 'vi' ? 'Lượng nước uống' : 'Water Intake'}
            </h3>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Droplet size={20} className="text-blue-500 mr-2" />
                  <span className="font-medium">
                    {waterIntake > 0 
                      ? (waterIntake >= 1000 ? `${(waterIntake / 1000).toFixed(1)}L` : `${waterIntake}ml`) 
                      : language === 'vi' ? 'Chưa có dữ liệu' : 'No data'}
                  </span>
                </div>
                <span className="text-sm text-blue-600">
                  {waterIntake > 0 && `${Math.min(100, Math.round((waterIntake / 2000) * 100))}%`}
                </span>
              </div>
              
              {waterIntake > 0 && (
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, Math.round((waterIntake / 2000) * 100))}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MonthlyCalendar: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [waterIntake, setWaterIntake] = useState<Record<string, number>>({});
  const [showDayDetail, setShowDayDetail] = useState(false);
  const navigate = useNavigate();
  
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
  
  // Load medicines and water intake data
  useEffect(() => {
    const loadData = () => {
      // Load medicines
      const storedMedicines = localStorage.getItem('medicines');
      if (storedMedicines) {
        setMedicines(JSON.parse(storedMedicines));
      }
      
      // Load water intake
      const storedWaterIntake = localStorage.getItem('waterIntake');
      if (storedWaterIntake) {
        setWaterIntake(JSON.parse(storedWaterIntake));
      }
    };
    
    loadData();
    
    // Listen for changes
    window.addEventListener('medicineStatusChanged', loadData);
    window.addEventListener('waterIntakeChanged', loadData);
    
    return () => {
      window.removeEventListener('medicineStatusChanged', loadData);
      window.removeEventListener('waterIntakeChanged', loadData);
    };
  }, []);
  
  // Generate calendar days for the current month
  useEffect(() => {
    const generateCalendarDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const today = new Date();
      
      // First day of the month
      const firstDayOfMonth = new Date(year, month, 1);
      // Last day of the month
      const lastDayOfMonth = new Date(year, month + 1, 0);
      
      // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
      const firstDayOfWeek = firstDayOfMonth.getDay();
      
      // Calculate days from previous month to show
      const daysFromPrevMonth = firstDayOfWeek;
      
      // Calculate total days to show (previous month + current month + next month)
      // We'll show 6 weeks (42 days) to ensure we have enough space for all months
      const totalDays = 42;
      
      const result: CalendarDay[] = [];
      
      // Add days from previous month
      const prevMonth = new Date(year, month, 0);
      const prevMonthDays = prevMonth.getDate();
      
      for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
        const day = new Date(year, month - 1, i);
        const dateStr = day.toISOString().split('T')[0];
        
        // Count medicines and check completion
        const medicinesForDay = medicines.filter(med => 
          (med.type === 'medicine' || med.type === 'tablet' || med.type === 'other') &&
          shouldShowMedicine(med, dateStr)
        );
        
        const injectionsForDay = medicines.filter(med => 
          med.type === 'injection' &&
          shouldShowMedicine(med, dateStr)
        );
        
        // Calculate total schedules count instead of just medicine count
        let medicineCount = 0;
        medicinesForDay.forEach(medicine => {
          medicineCount += medicine.schedules.length;
        });
        
        let injectionCount = 0;
        injectionsForDay.forEach(injection => {
          injectionCount += injection.schedules.length;
        });
        
        // Count completed medicine schedules
        let completedMedicineCount = 0;
        medicinesForDay.forEach(medicine => {
          if (medicine.takenRecords && medicine.takenRecords[dateStr]) {
            if (Array.isArray(medicine.takenRecords[dateStr])) {
              completedMedicineCount += medicine.takenRecords[dateStr].filter(taken => taken === true).length;
            } else if (medicine.takenRecords[dateStr] === true) {
              completedMedicineCount += 1;
            }
          }
        });
        
        // Count completed injection schedules
        let completedInjectionCount = 0;
        injectionsForDay.forEach(injection => {
          if (injection.takenRecords && injection.takenRecords[dateStr]) {
            if (Array.isArray(injection.takenRecords[dateStr])) {
              completedInjectionCount += injection.takenRecords[dateStr].filter(taken => taken === true).length;
            } else if (injection.takenRecords[dateStr] === true) {
              completedInjectionCount += 1;
            }
          }
        });
        
        // Check if all medicines are completed
        const allMedicinesCompleted = medicineCount > 0 && completedMedicineCount === medicineCount;
        
        // Check if all injections are completed
        const allInjectionsCompleted = injectionCount > 0 && completedInjectionCount === injectionCount;
        
        // Calculate uncompleted counts for display
        const uncompletedMedicineCount = medicineCount - completedMedicineCount;
        const uncompletedInjectionCount = injectionCount - completedInjectionCount;
        
        // Get water intake data
        const intake = waterIntake[dateStr] || 0;
        const percentage = Math.min(100, Math.round((intake / 2000) * 100));
        
        result.push({
          date: day,
          isCurrentMonth: false,
          isToday: day.toDateString() === today.toDateString(),
          isSelected: selectedDate ? day.toDateString() === selectedDate.toDateString() : false,
          medicineCount,
          injectionCount,
          medicineCompleted: allMedicinesCompleted,
          injectionCompleted: allInjectionsCompleted,
          uncompletedMedicineCount,
          uncompletedInjectionCount,
          waterIntake: intake,
          waterPercentage: percentage,
          waterCompleted: percentage >= 100
        });
      }
      
      // Add days from current month
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const day = new Date(year, month, i);
        const dateStr = day.toISOString().split('T')[0];
        
        // Count medicines and check completion
        const medicinesForDay = medicines.filter(med => 
          (med.type === 'medicine' || med.type === 'tablet' || med.type === 'other') &&
          shouldShowMedicine(med, dateStr)
        );
        
        const injectionsForDay = medicines.filter(med => 
          med.type === 'injection' &&
          shouldShowMedicine(med, dateStr)
        );
        
        // Calculate total schedules count instead of just medicine count
        let medicineCount = 0;
        medicinesForDay.forEach(medicine => {
          medicineCount += medicine.schedules.length;
        });
        
        let injectionCount = 0;
        injectionsForDay.forEach(injection => {
          injectionCount += injection.schedules.length;
        });
        
        // Count completed medicine schedules
        let completedMedicineCount = 0;
        medicinesForDay.forEach(medicine => {
          if (medicine.takenRecords && medicine.takenRecords[dateStr]) {
            if (Array.isArray(medicine.takenRecords[dateStr])) {
              completedMedicineCount += medicine.takenRecords[dateStr].filter(taken => taken === true).length;
            } else if (medicine.takenRecords[dateStr] === true) {
              completedMedicineCount += 1;
            }
          }
        });
        
        // Count completed injection schedules
        let completedInjectionCount = 0;
        injectionsForDay.forEach(injection => {
          if (injection.takenRecords && injection.takenRecords[dateStr]) {
            if (Array.isArray(injection.takenRecords[dateStr])) {
              completedInjectionCount += injection.takenRecords[dateStr].filter(taken => taken === true).length;
            } else if (injection.takenRecords[dateStr] === true) {
              completedInjectionCount += 1;
            }
          }
        });
        
        // Check if all medicines are completed
        const allMedicinesCompleted = medicineCount > 0 && completedMedicineCount === medicineCount;
        
        // Check if all injections are completed
        const allInjectionsCompleted = injectionCount > 0 && completedInjectionCount === injectionCount;
        
        // Calculate uncompleted counts for display
        const uncompletedMedicineCount = medicineCount - completedMedicineCount;
        const uncompletedInjectionCount = injectionCount - completedInjectionCount;
        
        // Get water intake data
        const intake = waterIntake[dateStr] || 0;
        const percentage = Math.min(100, Math.round((intake / 2000) * 100));
        
        result.push({
          date: day,
          isCurrentMonth: true,
          isToday: day.toDateString() === today.toDateString(),
          isSelected: selectedDate ? day.toDateString() === selectedDate.toDateString() : false,
          medicineCount,
          injectionCount,
          medicineCompleted: allMedicinesCompleted,
          injectionCompleted: allInjectionsCompleted,
          uncompletedMedicineCount,
          uncompletedInjectionCount,
          waterIntake: intake,
          waterPercentage: percentage,
          waterCompleted: percentage >= 100
        });
      }
      
      // Add days from next month to fill the grid
      const remainingDays = totalDays - result.length;
      for (let i = 1; i <= remainingDays; i++) {
        const day = new Date(year, month + 1, i);
        const dateStr = day.toISOString().split('T')[0];
        
        // Count medicines and check completion
        const medicinesForDay = medicines.filter(med => 
          (med.type === 'medicine' || med.type === 'tablet' || med.type === 'other') &&
          shouldShowMedicine(med, dateStr)
        );
        
        const injectionsForDay = medicines.filter(med => 
          med.type === 'injection' &&
          shouldShowMedicine(med, dateStr)
        );
        
        // Calculate total schedules count instead of just medicine count
        let medicineCount = 0;
        medicinesForDay.forEach(medicine => {
          medicineCount += medicine.schedules.length;
        });
        
        let injectionCount = 0;
        injectionsForDay.forEach(injection => {
          injectionCount += injection.schedules.length;
        });
        
        // Count completed medicine schedules
        let completedMedicineCount = 0;
        medicinesForDay.forEach(medicine => {
          if (medicine.takenRecords && medicine.takenRecords[dateStr]) {
            if (Array.isArray(medicine.takenRecords[dateStr])) {
              completedMedicineCount += medicine.takenRecords[dateStr].filter(taken => taken === true).length;
            } else if (medicine.takenRecords[dateStr] === true) {
              completedMedicineCount += 1;
            }
          }
        });
        
        // Count completed injection schedules
        let completedInjectionCount = 0;
        injectionsForDay.forEach(injection => {
          if (injection.takenRecords && injection.takenRecords[dateStr]) {
            if (Array.isArray(injection.takenRecords[dateStr])) {
              completedInjectionCount += injection.takenRecords[dateStr].filter(taken => taken === true).length;
            } else if (injection.takenRecords[dateStr] === true) {
              completedInjectionCount += 1;
            }
          }
        });
        
        // Check if all medicines are completed
        const allMedicinesCompleted = medicineCount > 0 && completedMedicineCount === medicineCount;
        
        // Check if all injections are completed
        const allInjectionsCompleted = injectionCount > 0 && completedInjectionCount === injectionCount;
        
        // Calculate uncompleted counts for display
        const uncompletedMedicineCount = medicineCount - completedMedicineCount;
        const uncompletedInjectionCount = injectionCount - completedInjectionCount;
        
        // Get water intake data
        const intake = waterIntake[dateStr] || 0;
        const percentage = Math.min(100, Math.round((intake / 2000) * 100));
        
        result.push({
          date: day,
          isCurrentMonth: false,
          isToday: day.toDateString() === today.toDateString(),
          isSelected: selectedDate ? day.toDateString() === selectedDate.toDateString() : false,
          medicineCount,
          injectionCount,
          medicineCompleted: allMedicinesCompleted,
          injectionCompleted: allInjectionsCompleted,
          uncompletedMedicineCount,
          uncompletedInjectionCount,
          waterIntake: intake,
          waterPercentage: percentage,
          waterCompleted: percentage >= 100
        });
      }
      
      setCalendarDays(result);
    };
    
    generateCalendarDays();
  }, [currentDate, selectedDate, medicines, waterIntake]);
  
  // Go to previous month
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  // Go to next month
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  
  // Handle date selection
  const handleDateSelect = (day: CalendarDay) => {
    setSelectedDate(day.date);
    
    // Dispatch an event to notify other components about date change
    const dateStr = day.date.toISOString().split('T')[0];
    
    // Điều hướng về trang chủ để hiển thị chi tiết sử dụng React Router
    navigate('/');
    
    // Đợi một chút để trang chủ được tải, sau đó mới phát sự kiện chọn ngày
    // Sử dụng setTimeout để đảm bảo sự kiện được phát sau khi chuyển trang
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('dateSelected', { 
        detail: { date: dateStr } 
      }));
    }, 100);
  };
  
  // Close day detail popup
  const closeDayDetail = () => {
    setShowDayDetail(false);
  };
  
  return (
    <div className="p-6 pb-28">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">
          {language === 'vi' ? 'Lịch' : 'Calendar'}
        </h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>
      
      {/* Month and Year Display with Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        
        <h2 className="text-lg font-semibold text-gray-800">
          {monthNames[language as keyof typeof monthNames][currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button 
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>
      
      {/* Day names header */}
      <div className="grid grid-cols-7 mb-2">
        {dayNames[language as keyof typeof dayNames].map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div 
            key={index} 
            className={`aspect-square p-1 relative ${
              day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
            } ${day.isSelected ? 'ring-2 ring-indigo-500' : ''}`}
            onClick={() => handleDateSelect(day)}
          >
            <div 
              className={`w-full h-full flex items-center justify-center rounded-full cursor-pointer
                ${day.isSelected ? 'bg-indigo-500 text-white' : 
                  day.isToday ? 'bg-indigo-100 text-indigo-600' : 
                  'hover:bg-gray-100'}`}
            >
              <span className={`text-sm ${
                day.isCurrentMonth ? 
                  (day.isSelected ? 'text-white' : 'text-gray-900') : 
                  'text-gray-400'
              }`}>
                {day.date.getDate()}
              </span>
            </div>
            
            {/* Indicators */}
            <div className="absolute bottom-0 right-0 flex space-x-0.5 p-0.5">
              {/* Medicine indicator */}
              {day.medicineCount > 0 && (
                <div className="relative">
                  <div className={`w-2 h-2 rounded-full ${
                    day.medicineCompleted ? 'bg-green-500' : 'bg-pink-500'
                  }`}></div>
                </div>
              )}
              
              {/* Injection indicator */}
              {day.injectionCount > 0 && (
                <div className="relative">
                  <div className={`w-2 h-2 rounded-full ${
                    day.injectionCompleted ? 'bg-green-500' : 'bg-purple-600'
                  }`}></div>
                </div>
              )}
              
              {/* Water intake indicator */}
              {day.waterIntake > 0 && (
                <div className={`w-2 h-2 rounded-full ${
                  day.waterCompleted ? 'bg-blue-500' : 'bg-blue-300'
                }`}></div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-pink-500 mr-1"></div>
          <span>{language === 'vi' ? 'Thuốc' : 'Medicine'}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-600 mr-1"></div>
          <span>{language === 'vi' ? 'Tiêm' : 'Injection'}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
          <span>{language === 'vi' ? 'Nước' : 'Water'}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span>{language === 'vi' ? 'Hoàn thành' : 'Completed'}</span>
        </div>
      </div>
      
      {/* Day Detail Popup */}
      {showDayDetail && selectedDate && (
        <DayDetail 
          date={selectedDate} 
          onClose={closeDayDetail} 
        />
      )}
    </div>
  );
};

export default MonthlyCalendar;
