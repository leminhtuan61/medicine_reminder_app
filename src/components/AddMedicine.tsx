import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Bell } from 'lucide-react';
import { Pill, Capsule, TabletBottle, Tablets, Syringe } from './MedicineIcons';
import { LanguageContext } from '../App';

const AddMedicine = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [iconType, setIconType] = useState('pill');
  const [iconColor, setIconColor] = useState('');
  const [type, setType] = useState<'medicine' | 'injection'>('medicine');
  const [schedules, setSchedules] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('');
  const [frequency, setFrequency] = useState('');

  const handleBack = () => {
    navigate('/');
  };

  const handleAddSchedule = (schedule: string) => {
    if (!schedules.includes(schedule)) {
      setSchedules([...schedules, schedule]);
    }
  };

  const handleRemoveSchedule = (schedule: string) => {
    setSchedules(schedules.filter(s => s !== schedule));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert(language === 'vi' ? 'Vui lòng nhập tên thuốc' : 'Please enter a medicine name');
      return;
    }
    
    if (schedules.length === 0) {
      alert(language === 'vi' 
        ? (type === 'medicine' ? 'Vui lòng chọn thời gian uống thuốc' : 'Vui lòng chọn ngày tiêm') 
        : (type === 'medicine' ? 'Please select medicine schedule' : 'Please select injection days'));
      return;
    }
    
    if (!duration) {
      alert(language === 'vi' ? 'Vui lòng chọn thời gian' : 'Please select duration');
      return;
    }
    
    if (duration !== '1 Ngày' && !frequency) {
      alert(language === 'vi' ? 'Vui lòng chọn tần suất' : 'Please select frequency');
      return;
    }
    
    const storedMedicines = localStorage.getItem('medicines');
    const medicines = storedMedicines ? JSON.parse(storedMedicines) : [];
    
    const maxId = medicines.length > 0 ? Math.max(...medicines.map((m: any) => m.id)) : 0;
    const newId = maxId + 1;
    
    const newMedicine = {
      id: newId,
      name,
      iconType,
      iconColor: iconColor || undefined,
      schedules: schedules.map(time => ({ time, color: type === 'medicine' ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800' })),
      takenRecords: {},
      type,
      startDate,
      duration,
      frequency
    };
    
    medicines.push(newMedicine);
    localStorage.setItem('medicines', JSON.stringify(medicines));
    
    window.dispatchEvent(new CustomEvent('medicineStatusChanged'));
    
    navigate('/');
  };

  const typeOptions = [
    { 
      id: 'medicine', 
      label: language === 'vi' ? 'Thuốc' : 'Medicine',
      icon: <div className="w-12 h-12 flex items-center justify-center">
        <Pill size={40} color="#FF5757" />
      </div>
    },
    { 
      id: 'injection', 
      label: language === 'vi' ? 'Tiêm' : 'Injection',
      icon: <div className="w-12 h-12 flex items-center justify-center">
        <Syringe size={40} color="#4F46E5" />
      </div>
    }
  ];

  const getScheduleOptions = () => {
    if (type === 'medicine') {
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
    { value: '', label: language === 'vi' ? 'Chọn thời gian' : 'Select duration' },
    { value: '1 Ngày', label: language === 'vi' ? '1 Ngày' : 'One Day' },
    { value: '1 Week', label: language === 'vi' ? '1 Tuần' : '1 Week' },
    { value: '2 Weeks', label: language === 'vi' ? '2 Tuần' : '2 Weeks' },
    { value: '1 Month', label: language === 'vi' ? '1 Tháng' : '1 Month' },
    { value: '3 Months', label: language === 'vi' ? '3 Tháng' : '3 Months' },
    { value: '6 Months', label: language === 'vi' ? '6 Tháng' : '6 Months' },
    { value: '1 Year', label: language === 'vi' ? '1 Năm' : '1 Year' },
    { value: 'Ongoing', label: language === 'vi' ? 'Liên tục' : 'Ongoing' }
  ];

  const frequencyOptions = type === 'medicine' ? [
    { value: '', label: language === 'vi' ? 'Chọn tần suất' : 'Select frequency' },
    { value: 'Daily', label: language === 'vi' ? 'Hàng ngày' : 'Daily' },
    { value: 'Every Other Day', label: language === 'vi' ? 'Cách ngày' : 'Every Other Day' },
    { value: 'Weekly', label: language === 'vi' ? 'Hàng tuần' : 'Weekly' },
    { value: 'Monthly', label: language === 'vi' ? 'Hàng tháng' : 'Monthly' }
  ] : [
    { value: '', label: language === 'vi' ? 'Chọn tần suất' : 'Select frequency' },
    { value: 'Weekly', label: language === 'vi' ? 'Hàng tuần' : 'Weekly' },
    { value: 'Bi-weekly', label: language === 'vi' ? 'Hai tuần một lần' : 'Bi-weekly' },
    { value: 'Monthly', label: language === 'vi' ? 'Hàng tháng' : 'Monthly' },
    { value: 'Quarterly', label: language === 'vi' ? 'Hàng quý' : 'Quarterly' },
    { value: 'Yearly', label: language === 'vi' ? 'Hàng năm' : 'Yearly' }
  ];

  return (
    <div className="p-6 pb-28 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <button onClick={handleBack} className="p-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">
          {language === 'vi' ? 'Nhắc nhở mới' : 'New Reminder'}
        </h1>
        <button className="p-2 bg-indigo-400 rounded-lg">
          <Bell size={20} className="text-white" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-600 text-lg mb-2">
            {type === 'medicine' 
              ? (language === 'vi' ? 'Tên thuốc' : 'Medicine Name')
              : (language === 'vi' ? 'Tên mũi tiêm' : 'Injection Name')}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={type === 'medicine'
              ? (language === 'vi' ? 'Nhập tên thuốc' : 'Enter medicine name')
              : (language === 'vi' ? 'Nhập tên mũi tiêm' : 'Enter injection name')}
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-600 text-lg mb-2">
            {language === 'vi' ? 'Loại' : 'Type'}
          </label>
          <div className="grid grid-cols-2 gap-4">
            {typeOptions.map(option => (
              <button
                key={option.id}
                type="button"
                className={`p-4 rounded-xl flex flex-col items-center justify-center ${
                  type === option.id ? 'bg-indigo-400 text-white' : 'bg-white shadow'
                }`}
                onClick={() => setType(option.id as any)}
              >
                {option.icon}
                <span className="mt-2">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-gray-600 text-lg mb-2">
            {type === 'medicine'
              ? (language === 'vi' ? 'Thời gian & Lịch' : 'Time & Schedule')
              : (language === 'vi' ? 'Ngày tiêm' : 'Injection Days')}
          </label>
          
          {type === 'medicine' ? (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {getScheduleOptions().map(schedule => (
                <div 
                  key={schedule} 
                  className={`px-4 py-3 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                    schedules.includes(schedule) 
                      ? 'bg-indigo-200 text-indigo-800 font-medium' 
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  onClick={() => {
                    if (schedules.includes(schedule)) {
                      handleRemoveSchedule(schedule);
                    } else {
                      handleAddSchedule(schedule);
                    }
                  }}
                >
                  <span>{schedule}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {getScheduleOptions().map(schedule => (
                <div 
                  key={schedule} 
                  className={`px-3 py-3 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                    schedules.includes(schedule) 
                      ? 'bg-purple-200 text-purple-800 font-medium' 
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  onClick={() => {
                    if (schedules.includes(schedule)) {
                      handleRemoveSchedule(schedule);
                    } else {
                      handleAddSchedule(schedule);
                    }
                  }}
                >
                  <span className="text-sm">{schedule}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-600 text-lg mb-2">
              {language === 'vi' ? 'Thời gian' : 'Duration'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {durationOptions.filter(option => option.value !== '').map(option => (
                <div
                  key={option.value}
                  className={`px-3 py-3 rounded-lg flex items-center justify-center cursor-pointer transition-colors text-center ${
                    duration === option.value
                      ? 'bg-pink-200 text-pink-800 font-medium'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  onClick={() => setDuration(option.value)}
                >
                  <span className="text-sm">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {duration !== '1 Ngày' && duration !== '' && (
            <div>
              <label className="block text-gray-600 text-lg mb-2">
                {language === 'vi' ? 'Tần suất' : 'Frequency'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {frequencyOptions.filter(option => option.value !== '').map(option => (
                  <div
                    key={option.value}
                    className={`px-3 py-3 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                      frequency === option.value
                        ? 'bg-indigo-200 text-indigo-800 font-medium'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                    onClick={() => setFrequency(option.value)}
                  >
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-600 text-lg mb-2">
              {language === 'vi' ? 'Ngày bắt đầu' : 'Start Date'}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-pink-400 text-white font-medium text-lg mt-8"
        >
          {language === 'vi' ? 'Thêm nhắc nhở' : 'Add Reminder'}
        </button>
      </form>
    </div>
  );
};

export default AddMedicine;
