import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, Clock } from 'lucide-react';
import { Pill, Capsule, TabletBottle, Tablets } from './MedicineIcons';
import { LanguageContext } from '../App';
import ConfirmModal from './ConfirmModal';

export interface Schedule {
  time: string;
  color: string;
}

export interface Medicine {
  id: number;
  name: string;
  iconType: string;
  iconColor?: string;
  schedules: Schedule[];
  takenRecords: Record<string, boolean[]>;
  type: 'medicine' | 'injection' | 'tablet' | 'other';
  startDate?: string;
  duration?: string;
  frequency?: string;
  note?: string;
}

const MedicineList = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeCategory, setActiveCategory] = useState('medicine');
  const { language } = useContext(LanguageContext);
  const [modalData, setModalData] = useState<{ 
    isOpen: boolean;
    medicineId: number | null;
    scheduleIndex: number | null;
    medicineName: string;
    currentStatus: boolean;
  }>({
    isOpen: false,
    medicineId: null,
    scheduleIndex: null,
    medicineName: '',
    currentStatus: false
  });

  // Load medicines from localStorage
  useEffect(() => {
    const loadMedicines = () => {
      const storedMedicines = localStorage.getItem('medicines');
      if (storedMedicines) {
        try {
          const parsedMedicines = JSON.parse(storedMedicines);
          setMedicines(parsedMedicines);
        } catch (error) {
          console.error('Error parsing medicines:', error);
          setMedicines([]);
        }
      }
    };

    loadMedicines();

    // Listen for changes in medicine status
    window.addEventListener('medicineStatusChanged', loadMedicines);
    
    // Listen for category tab changes
    const handleCategoryChange = (event: CustomEvent) => {
      if (event.detail && event.detail.tab) {
        setActiveCategory(event.detail.tab);
      }
    };
    
    window.addEventListener('categoryTabChanged' as any, handleCategoryChange);
    
    return () => {
      window.removeEventListener('medicineStatusChanged', loadMedicines);
      window.removeEventListener('categoryTabChanged' as any, handleCategoryChange);
    };
  }, []);
  
  // Listen for date selection and handle date changes
  useEffect(() => {
    // Listen for date selection from Calendar or MonthlyCalendar
    const handleDateSelect = (event: CustomEvent) => {
      if (event.detail && event.detail.date) {
        const newDate = event.detail.date;
        setSelectedDate(newDate);
      }
    };
    
    window.addEventListener('dateSelected' as any, handleDateSelect);
    
    // Lắng nghe sự kiện forceRefresh để cập nhật component
    const handleForceRefresh = () => {
      // Tải lại ngày đã chọn từ localStorage
      const savedDate = localStorage.getItem('selectedDate');
      if (savedDate) {
        setSelectedDate(savedDate);
      }
    };
    
    window.addEventListener('forceRefresh', handleForceRefresh);
    
    // Khôi phục ngày đã chọn từ localStorage khi load component
    const savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
      setSelectedDate(savedDate);
    }
    
    return () => {
      window.removeEventListener('dateSelected' as any, handleDateSelect);
      window.removeEventListener('forceRefresh', handleForceRefresh);
    };
  }, []);

  // Force re-render when selectedDate changes
  useEffect(() => {
    // This effect will trigger a re-render when selectedDate changes
  }, [selectedDate]);

  // Check if medicine should be shown on selected date based on startDate, duration and frequency
  const shouldShowMedicine = (medicine: Medicine, selectedDate: string): boolean => {
    // Nếu thuốc không có ngày bắt đầu
    if (!medicine.startDate) {
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
    const selectedDateParts = selectedDate.split('-');
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

    // Kiểm tra xem ngày được chọn có >= ngày bắt đầu không
    // Nếu ngày được chọn nhỏ hơn ngày bắt đầu (tức là trước ngày bắt đầu uống thuốc) thì không hiển thị
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
          // Hiển thị ngày đầu tiên và cứ 2 ngày uống 1 lần (mỗi lần cách nhau 1 ngày)
          return diffDays % 2 === 0;
          
        case 'Every 3 days':
        case 'Cách 2 ngày':
          // Hiển thị ngày đầu tiên và cứ 3 ngày uống 1 lần (mỗi lần cách nhau 2 ngày)
          return diffDays % 3 === 0;
          
        case 'Every 4 days':
        case 'Cách 3 ngày':
          // Hiển thị ngày đầu tiên và cứ 4 ngày uống 1 lần (mỗi lần cách nhau 3 ngày)
          return diffDays % 4 === 0;
          
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

  // Filter medicines by type
  const filteredMedicines = medicines.filter(med => {
    // Filter by medicine type based on active category tab
    if (activeCategory === 'medicine') {
      return med.type === 'medicine' || med.type === 'tablet' || med.type === 'other';
    }
    return false;
  }).filter(med => shouldShowMedicine(med, selectedDate));

  // Toggle medicine taken status
  const toggleMedicineTaken = (medicineId: number, scheduleIndex: number) => {
    const medicine = medicines.find(med => med.id === medicineId);
    if (!medicine) return;
    
    // Get current status to determine confirmation message
    const currentStatus = medicine.takenRecords[selectedDate]?.[scheduleIndex] || false;
    
    // Open confirmation modal
    setModalData({
      isOpen: true,
      medicineId,
      scheduleIndex,
      medicineName: medicine.name,
      currentStatus
    });
  };

  // Handle modal confirm action
  const handleConfirm = () => {
    if (modalData.medicineId === null || modalData.scheduleIndex === null) return;
    
    const medicineId = modalData.medicineId;
    const scheduleIndex = modalData.scheduleIndex;
    
    const updatedMedicines = medicines.map(medicine => {
      if (medicine.id === medicineId) {
        const takenRecords = { ...medicine.takenRecords };
        
        // Initialize array for this date if it doesn't exist
        if (!takenRecords[selectedDate]) {
          takenRecords[selectedDate] = medicine.schedules.map(() => false);
        }
        
        // Toggle the status
        takenRecords[selectedDate][scheduleIndex] = !takenRecords[selectedDate][scheduleIndex];
        
        return { ...medicine, takenRecords };
      }
      return medicine;
    });
    
    setMedicines(updatedMedicines);
    localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
    
    // Notify other components that medicine data has changed
    window.dispatchEvent(new CustomEvent('medicineStatusChanged'));
  };

  // Get icon component based on medicine type
  const getMedicineIcon = (medicine: Medicine) => {
    const size = 40;
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

  // Check if a medicine has been taken
  const isMedicineTaken = (medicine: Medicine, scheduleIndex: number) => {
    return medicine.takenRecords[selectedDate]?.[scheduleIndex] || false;
  };

  // Lấy danh sách thuốc cần hiển thị cho ngày được chọn
  const displayMedicines = filteredMedicines
    // Chỉ lấy thuốc nên hiển thị trong ngày được chọn
    .filter(medicine => shouldShowMedicine(medicine, selectedDate));

  // Nhóm thuốc theo thời gian uống
  interface MedicineWithSchedule {
    medicine: Medicine;
    scheduleIndex: number;
    scheduleTime: string;
  }

  const groupedByTime: Record<string, MedicineWithSchedule[]> = {};
  
  // Tạo danh sách chi tiết từng thuốc với từng lịch uống
  displayMedicines.forEach(medicine => {
    if (medicine.schedules && medicine.schedules.length > 0) {
      medicine.schedules.forEach((schedule, scheduleIndex) => {
        if (!groupedByTime[schedule.time]) {
          groupedByTime[schedule.time] = [];
        }
        
        groupedByTime[schedule.time].push({
          medicine,
          scheduleIndex,
          scheduleTime: schedule.time
        });
      });
    }
  });

  // Hàm chuyển đổi thời gian từ AM/PM sang định dạng 24h
  function convertTo24Hour(time12h: string): string {
    if (!time12h.includes('AM') && !time12h.includes('PM')) {
      return time12h; // Đã là định dạng 24h hoặc không có định dạng rõ ràng
    }
    
    const [timePart, modifier] = time12h.split(' ');
    let [hours, minutes] = timePart.split(':');
    
    let hoursNum = parseInt(hours, 10);
    
    if (modifier === 'PM' && hoursNum < 12) {
      hoursNum += 12;
    }
    if (modifier === 'AM' && hoursNum === 12) {
      hoursNum = 0;
    }
    
    return `${hoursNum.toString().padStart(2, '0')}:${minutes || '00'}`;
  }
  
  // Sắp xếp các khung giờ
  const sortedTimeSlots = Object.keys(groupedByTime).sort((a, b) => {
    // Chuyển đổi thời gian sang định dạng 24h để so sánh
    const timeA = a.includes('AM') || a.includes('PM') 
      ? convertTo24Hour(a) 
      : a;
    const timeB = b.includes('AM') || b.includes('PM') 
      ? convertTo24Hour(b) 
      : b;
    return timeA.localeCompare(timeB);
  });

  // Hàm dịch tần suất sang tiếng Việt
  const translateFrequency = (frequency: string): string => {
    if (!frequency) return '';
    
    if (language === 'vi') {
      switch (frequency) {
        case 'Daily': return 'Hàng ngày';
        case 'Every 2 days': return 'Cách 1 ngày';
        case 'Every 3 days': return 'Cách 2 ngày';
        case 'Every 4 days': return 'Cách 3 ngày';
        case 'Weekly': return 'Hàng tuần';
        case 'Monthly': return 'Hàng tháng';
        default: return frequency;
      }
    }
    
    return frequency;
  };

  return (
    <div className="px-6">
      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={modalData.isOpen}
        onClose={() => setModalData(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirm}
        title={language === 'vi' ? 'Xác nhận' : 'Confirmation'}
        message={modalData.currentStatus 
          ? (language === 'vi' ? `Bạn chưa uống thuốc ${modalData.medicineName}?` : `You haven't taken ${modalData.medicineName}?`)
          : (language === 'vi' ? `Bạn đã uống thuốc ${modalData.medicineName}?` : `Have you taken ${modalData.medicineName}?`)}
        confirmText={language === 'vi' ? 'Xác nhận' : 'Confirm'}
        cancelText={language === 'vi' ? 'Hủy' : 'Cancel'}
      />
      
      {sortedTimeSlots.length > 0 ? (
        <div className="space-y-6 mt-5">
          {sortedTimeSlots.map(timeSlot => (
            <div key={timeSlot} className="mb-3">
              <div className="flex items-center mb-2">
                <Clock size={16} className="text-gray-500 mr-2" />
                <h3 className="text-md font-medium text-gray-700">
                  {timeSlot}
                </h3>
              </div>
              
              <div className="space-y-3">
                {groupedByTime[timeSlot].map((item: MedicineWithSchedule, index: number) => (
                  <div 
                    key={`${item.medicine.id}-${item.scheduleIndex}`}
                    className="bg-white rounded-xl p-4 shadow-sm flex items-center"
                  >
                    <div className="mr-3">
                      {getMedicineIcon(item.medicine)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{item.medicine.name}</h3>
                      <div className="flex items-center flex-wrap text-sm text-gray-500 mt-1">
                        {item.medicine.note && (
                          <span className="mr-2 text-gray-600 italic bg-gray-100 px-2 py-0.5 rounded-md text-xs">{item.medicine.note}</span>
                        )}
                        {item.medicine.frequency && (
                          <span className="mr-2">{translateFrequency(item.medicine.frequency)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div 
                        className={`w-8 h-8 rounded-md mr-2 flex items-center justify-center cursor-pointer ${
                          isMedicineTaken(item.medicine, item.scheduleIndex) 
                            ? 'bg-green-500' 
                            : 'bg-gray-200'
                        }`}
                        onClick={() => toggleMedicineTaken(item.medicine.id, item.scheduleIndex)}
                      >
                        {isMedicineTaken(item.medicine, item.scheduleIndex) && (
                          <Check size={18} className="text-white" />
                        )}
                      </div>
                      
                      <Link to={`/medicine/${item.medicine.id}`} className="p-2">
                        <ChevronRight size={20} className="text-gray-400" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="text-gray-400 mb-4">
            <TabletBottle size={64} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-500">
            {language === 'vi' 
              ? 'Không có thuốc nào cho ngày này' 
              : 'No medications for this date'}
          </h3>
          <p className="text-gray-400 mt-2">
            {language === 'vi'
              ? 'Nhấn nút + để thêm mới'
              : 'Tap the + button to add new'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicineList;
