import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { Medicine } from './MedicineList';
import { LanguageContext } from '../App';

interface Schedule {
  time: string;
  color: string;
}

const EditSchedule = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [newSchedule, setNewSchedule] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-indigo-100 text-indigo-800');
  const [duration, setDuration] = useState('1 Lần');
  const [frequency, setFrequency] = useState('Daily');

  useEffect(() => {
    // Load medicine from localStorage
    const storedMedicines = localStorage.getItem('medicines');
    if (storedMedicines && id) {
      const parsedMedicines: Medicine[] = JSON.parse(storedMedicines);
      const foundMedicine = parsedMedicines.find(med => med.id === parseInt(id));
      if (foundMedicine) {
        setMedicine(foundMedicine);
        setSchedules([...foundMedicine.schedules]);
        if (foundMedicine.duration) setDuration(foundMedicine.duration);
        if (foundMedicine.frequency) setFrequency(foundMedicine.frequency);
      }
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    if (!medicine || !id) return;
    
    const storedMedicines = localStorage.getItem('medicines');
    if (storedMedicines) {
      const parsedMedicines: Medicine[] = JSON.parse(storedMedicines);
      const updatedMedicines = parsedMedicines.map(med => {
        if (med.id === parseInt(id)) {
          return { ...med, schedules, duration, frequency };
        }
        return med;
      });
      
      localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
      
      // Notify other components that medicine data has changed
      window.dispatchEvent(new CustomEvent('medicineStatusChanged'));
      
      navigate(`/medicine/${id}`);
    }
  };

  const handleAddSchedule = () => {
    if (!newSchedule.trim()) return;
    
    const newScheduleItem: Schedule = {
      time: newSchedule,
      color: selectedColor
    };
    
    setSchedules([...schedules, newScheduleItem]);
    setNewSchedule('');
  };

  const handleRemoveSchedule = (index: number) => {
    const updatedSchedules = [...schedules];
    updatedSchedules.splice(index, 1);
    setSchedules(updatedSchedules);
  };

  const colorOptions = [
    { id: 'bg-indigo-100 text-indigo-800', color: '#EEF2FF' },
    { id: 'bg-pink-100 text-pink-800', color: '#FCE7F3' },
    { id: 'bg-green-100 text-green-800', color: '#D1FAE5' },
    { id: 'bg-blue-100 text-blue-800', color: '#DBEAFE' },
    { id: 'bg-yellow-100 text-yellow-800', color: '#FEF3C7' },
    { id: 'bg-purple-100 text-purple-800', color: '#EDE9FE' },
    { id: 'bg-red-100 text-red-800', color: '#FEE2E2' },
    { id: 'bg-orange-100 text-orange-800', color: '#FFEDD5' }
  ];

  // Default schedule suggestions based on medicine type
  const getScheduleSuggestions = () => {
    if (!medicine) return [];
    
    if (medicine.type === 'medicine' || medicine.type === 'tablet') {
      return [
        language === 'vi' ? 'Trước Bữa Sáng' : 'Before Breakfast',
        language === 'vi' ? 'Sau Bữa Sáng' : 'After Breakfast',
        language === 'vi' ? 'Trước Bữa Trưa' : 'Before Lunch',
        language === 'vi' ? 'Sau Bữa Trưa' : 'After Lunch',
        language === 'vi' ? 'Trước Bữa Tối' : 'Before Dinner',
        language === 'vi' ? 'Sau Bữa Tối' : 'After Dinner',
        language === 'vi' ? 'Trước Khi Ngủ' : 'Before Bed'
      ];
    } else {
      return [
        language === 'vi' ? 'Thứ 2' : 'Monday',
        language === 'vi' ? 'Thứ 3' : 'Tuesday',
        language === 'vi' ? 'Thứ 4' : 'Wednesday',
        language === 'vi' ? 'Thứ 5' : 'Thursday',
        language === 'vi' ? 'Thứ 6' : 'Friday',
        language === 'vi' ? 'Thứ 7' : 'Saturday',
        language === 'vi' ? 'Chủ Nhật' : 'Sunday'
      ];
    }
  };

  const durationOptions = [
    { value: '1 Lần', label: language === 'vi' ? '1 Lần' : 'One Time' },
    { value: '1 Week', label: language === 'vi' ? '1 Tuần' : '1 Week' },
    { value: '2 Weeks', label: language === 'vi' ? '2 Tuần' : '2 Weeks' },
    { value: '1 Month', label: language === 'vi' ? '1 Tháng' : '1 Month' },
    { value: '3 Months', label: language === 'vi' ? '3 Tháng' : '3 Months' },
    { value: '6 Months', label: language === 'vi' ? '6 Tháng' : '6 Months' },
    { value: '1 Year', label: language === 'vi' ? '1 Năm' : '1 Year' },
    { value: 'Ongoing', label: language === 'vi' ? 'Liên tục' : 'Ongoing' }
  ];

  const frequencyOptions = [
    { value: 'Daily', label: language === 'vi' ? 'Hàng ngày' : 'Daily' },
    { value: 'Every Other Day', label: language === 'vi' ? 'Cách ngày' : 'Every Other Day' },
    { value: 'Weekly', label: language === 'vi' ? 'Hàng tuần' : 'Weekly' },
    { value: 'Monthly', label: language === 'vi' ? 'Hàng tháng' : 'Monthly' }
  ];

  return (
    <div className="p-6 pb-28 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-6">
        <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold ml-2">
          {language === 'vi' ? 'Chỉnh sửa lịch' : 'Edit Schedule'}
        </h1>
      </div>
      
      {medicine && (
        <div>
          <h2 className="text-xl font-bold mb-4">{medicine.name}</h2>
          
          {/* Current Schedules */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">
              {language === 'vi' ? 'Lịch hiện tại' : 'Current Schedule'}
            </h3>
            {schedules.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {schedules.map((schedule, index) => (
                  <div 
                    key={index} 
                    className={`${schedule.color} px-3 py-2 rounded-full text-sm font-medium flex items-center`}
                  >
                    <span>{schedule.time}</span>
                    <button 
                      onClick={() => handleRemoveSchedule(index)}
                      className="ml-2 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                {language === 'vi' ? 'Chưa có lịch nào' : 'No schedules yet'}
              </p>
            )}
          </div>
          
          {/* Add New Schedule */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">
              {language === 'vi' ? 'Thêm lịch mới' : 'Add New Schedule'}
            </h3>
            
            {/* Schedule Input */}
            <div className="mb-4">
              <label htmlFor="schedule" className="block text-gray-700 mb-2">
                {medicine.type === 'medicine' || medicine.type === 'tablet' ? 
                  (language === 'vi' ? 'Thời gian uống thuốc' : 'Medication Time') : 
                  (language === 'vi' ? 'Ngày tiêm' : 'Injection Day')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="schedule"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={language === 'vi' ? 'Nhập thời gian' : 'Enter time'}
                />
                <button
                  type="button"
                  onClick={handleAddSchedule}
                  className="px-4 py-2 rounded-lg bg-pink-400 text-white"
                  disabled={!newSchedule.trim()}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            
            {/* Color Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                {language === 'vi' ? 'Màu sắc' : 'Color'}
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    className={`w-8 h-8 rounded-full border ${
                      selectedColor === option.id ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                    }`}
                    style={{ backgroundColor: option.color }}
                    onClick={() => setSelectedColor(option.id)}
                  ></button>
                ))}
              </div>
            </div>
            
            {/* Quick Suggestions */}
            <div>
              <label className="block text-gray-700 mb-2">
                {language === 'vi' ? 'Gợi ý nhanh' : 'Quick Suggestions'}
              </label>
              <div className="flex flex-wrap gap-2">
                {getScheduleSuggestions().map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm"
                    onClick={() => setNewSchedule(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Duration & Frequency */}
          <div className="mb-8">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                {language === 'vi' ? 'Thời gian điều trị' : 'Duration'}
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {durationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Only show frequency if duration is not "1 Lần" */}
            {duration !== '1 Lần' && (
              <div>
                <label className="block text-gray-700 mb-2">
                  {language === 'vi' ? 'Tần suất' : 'Frequency'}
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {frequencyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* Save Button */}
          <div className="fixed bottom-20 left-0 right-0 px-6 pb-4 bg-gray-50">
            <button
              onClick={handleSave}
              className="w-full py-3 px-4 rounded-xl bg-pink-400 text-white font-medium"
            >
              {language === 'vi' ? 'Lưu lịch' : 'Save Schedule'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSchedule;
