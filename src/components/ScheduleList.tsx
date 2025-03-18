import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Edit2, Trash2, Clock, Calendar, Repeat } from 'lucide-react';
import { Medicine } from './MedicineList';
import { Pill, Capsule, TabletBottle, Tablets } from './MedicineIcons';
import { LanguageContext } from '../App';

const ScheduleList = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    // Load medicines from localStorage
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
    
    return () => {
      window.removeEventListener('medicineStatusChanged', loadMedicines);
    };
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handleDelete = (id: number) => {
    const updatedMedicines = medicines.filter(medicine => medicine.id !== id);
    localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
    setMedicines(updatedMedicines);
    setShowConfirmDelete(null);
    
    // Notify other components that medicine data has changed
    window.dispatchEvent(new CustomEvent('medicineStatusChanged'));
  };

  // Get icon component based on medicine type
  const getMedicineIcon = (medicine: Medicine) => {
    const size = 32;
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

  // Hàm dịch thời gian lịch trình
  const translateScheduleTime = (time: string): string => {
    if (!time) return '';
    
    if (language === 'vi') {
      switch (time) {
        case 'Before Breakfast': return 'Trước Bữa Sáng';
        case 'After Breakfast': return 'Sau Bữa Sáng';
        case 'Before Lunch': return 'Trước Bữa Trưa';
        case 'After Lunch': return 'Sau Bữa Trưa';
        case 'Before Dinner': return 'Trước Bữa Tối';
        case 'After Dinner': return 'Sau Bữa Tối';
        case 'Before Bed': return 'Trước Khi Ngủ';
        default: return time;
      }
    }
    
    return time;
  };

  // Hàm dịch quãng thời gian uống thuốc
  const translateDuration = (duration: string): string => {
    if (!duration) return '';
    
    if (language === 'vi') {
      switch (duration) {
        case 'One Day': return '1 Ngày';
        case '1 Week': return '1 Tuần';
        case '2 Weeks': return '2 Tuần';
        case '1 Month': return '1 Tháng';
        case '3 Months': return '3 Tháng';
        case '6 Months': return '6 Tháng';
        case '1 Year': return '1 Năm';
        case 'Ongoing': return 'Liên tục';
        default: return duration;
      }
    }
    
    return duration;
  };

  return (
    <div className="p-6 pb-28 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">
          {language === 'vi' ? 'Danh sách lịch trình' : 'Schedule List'}
        </h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>
      
      {medicines.length > 0 ? (
        <div className="space-y-4">
          {medicines.map(medicine => (
            <div key={medicine.id} className="bg-white rounded-xl p-4 shadow-sm">
              {/* Medicine header with actions */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="mr-3">
                    {getMedicineIcon(medicine)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{medicine.name}</h3>
                    <span className="text-sm text-gray-500">
                      {medicine.type === 'medicine' ? 
                        (language === 'vi' ? 'Thuốc' : 'Medicine') : 
                        (language === 'vi' ? 'Tiêm' : 'Injection')}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    to={`/edit-schedule/${medicine.id}`} 
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label={language === 'vi' ? 'Sửa' : 'Edit'}
                  >
                    <Edit2 size={20} className="text-indigo-500" />
                  </Link>
                  <button 
                    onClick={() => setShowConfirmDelete(medicine.id)}
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label={language === 'vi' ? 'Xóa' : 'Delete'}
                  >
                    <Trash2 size={20} className="text-red-500" />
                  </button>
                </div>
              </div>
              
              {/* Medicine details */}
              <div className="space-y-2 text-sm text-gray-600">
                {/* Schedule times */}
                <div className="flex items-start">
                  <Clock size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    {medicine.schedules.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {medicine.schedules.map((schedule, index) => (
                          <span 
                            key={index} 
                            className={`${schedule.color} px-2 py-0.5 rounded-full text-xs`}
                          >
                            {translateScheduleTime(schedule.time)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span>{language === 'vi' ? 'Chưa có lịch' : 'No schedule'}</span>
                    )}
                  </div>
                </div>
                
                {/* Duration */}
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 flex-shrink-0" />
                  <span>
                    {medicine.duration ? translateDuration(medicine.duration) : (language === 'vi' ? 'Không xác định' : 'Not specified')}
                  </span>
                </div>
                
                {/* Frequency - only show if not "1 Lần" */}
                {medicine.duration !== '1 Lần' && (
                  <div className="flex items-center">
                    <Repeat size={16} className="mr-2 flex-shrink-0" />
                    <span>
                      {medicine.frequency ? translateFrequency(medicine.frequency) : (language === 'vi' ? 'Không xác định' : 'Not specified')}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Confirmation dialog */}
              {showConfirmDelete === medicine.id && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 mb-2">
                    {language === 'vi' 
                      ? 'Bạn có chắc muốn xóa lịch trình này?' 
                      : 'Are you sure you want to delete this schedule?'}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowConfirmDelete(null)}
                      className="px-3 py-1 text-sm bg-gray-200 rounded-lg"
                    >
                      {language === 'vi' ? 'Hủy' : 'Cancel'}
                    </button>
                    <button
                      onClick={() => handleDelete(medicine.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg"
                    >
                      {language === 'vi' ? 'Xóa' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="text-gray-400 mb-4">
            <Calendar size={64} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-500">
            {language === 'vi' ? 'Chưa có lịch trình nào' : 'No schedules yet'}
          </h3>
          <p className="text-gray-400 mt-2">
            {language === 'vi' ? 'Nhấn nút + để thêm mới' : 'Tap the + button to add new'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
