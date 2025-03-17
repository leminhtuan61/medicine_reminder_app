import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Bell } from 'lucide-react';
import { Pill, Capsule, TabletBottle, Tablets } from './MedicineIcons';
import { LanguageContext } from '../App';

const AddMedicine = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [iconType, setIconType] = useState('pill');
  const [iconColor, setIconColor] = useState('');
  const [type, setType] = useState<'medicine' | 'injection'>('medicine');
  const [schedules, setSchedules] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [frequency, setFrequency] = useState('');
  const [waterAmount, setWaterAmount] = useState('');

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
      schedules: schedules.map(time => ({ time, color: 'bg-indigo-100 text-indigo-800' })),
      takenRecords: {},
      type,
      duration,
      frequency,
      waterAmount: waterAmount || undefined
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
        <div className="relative">
          <TabletBottle size={40} />
          <div className="absolute -right-1 -bottom-1 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold text-xs">+</div>
        </div>
      </div>
    },
    { 
      id: 'injection', 
      label: language === 'vi' ? 'Tiêm' : 'Injection',
      icon: <div className="w-12 h-12 flex items-center justify-center">
        <div className="w-8 h-16 relative">
          <div className="w-2 h-10 bg-gray-300 absolute left-3 top-0"></div>
          <div className="w-8 h-4 bg-gray-300 absolute top-10 rounded-b-lg"></div>
          <div className="w-1 h-2 bg-gray-400 absolute left-3.5 bottom-0"></div>
        </div>
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
          <div className="flex flex-wrap gap-2 mb-2">
            {schedules.map(schedule => (
              <div 
                key={schedule} 
                className="px-4 py-2 rounded-full bg-indigo-200 text-indigo-800 flex items-center"
                onClick={() => handleRemoveSchedule(schedule)}
              >
                <span>{schedule}</span>
              </div>
            ))}
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
              onClick={() => {
                const nextSchedule = getScheduleOptions().find(s => !schedules.includes(s));
                if (nextSchedule) handleAddSchedule(nextSchedule);
              }}
            >
              <Plus size={20} className="text-pink-500" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 text-lg mb-2">
              {language === 'vi' ? 'Thời gian' : 'Duration'}
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {durationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {duration !== '1 Ngày' && (
            <div>
              <label className="block text-gray-600 text-lg mb-2">
                {language === 'vi' ? 'Tần suất' : 'Frequency'}
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {frequencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {type === 'medicine' && (
            <div>
              <label className="block text-gray-600 text-lg mb-2">
                {language === 'vi' ? 'Lượng nước uống (ml)' : 'Water Amount (ml)'}
              </label>
              <input
                type="number"
                value={waterAmount}
                onChange={(e) => setWaterAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={language === 'vi' ? 'Nhập lượng nước' : 'Enter water amount'}
                min="0"
                step="50"
              />
            </div>
          )}
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
