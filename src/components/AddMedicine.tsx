import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { LanguageContext } from '../App';

const AddMedicine = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [schedules, setSchedules] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('');
  const [frequency, setFrequency] = useState('');
  const [note, setNote] = useState('');

  // Cập nhật lại frequency khi duration thay đổi
  useEffect(() => {
    // Nếu chọn 1 tuần nhưng frequency không phù hợp
    if (duration === '1 Week') {
      // Kiểm tra xem frequency có phù hợp với 1 tuần không
      const validFrequencies = ['Daily', 'Every 2 days', 'Every 3 days', 'Every 4 days'];
      if (frequency && !validFrequencies.includes(frequency)) {
        setFrequency(''); // Đặt lại frequency
      }
    }
    
    // Nếu chọn 2 tuần nhưng frequency không phù hợp
    if (duration === '2 Weeks') {
      // Kiểm tra xem frequency có phù hợp với 2 tuần không
      const validFrequencies = ['Daily', 'Every 2 days', 'Every 3 days', 'Every 4 days', 'Weekly'];
      if (frequency && !validFrequencies.includes(frequency)) {
        setFrequency(''); // Đặt lại frequency nếu không phù hợp
      }
    }
  }, [duration, frequency]);

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
        ? 'Vui lòng chọn thời gian uống thuốc'
        : 'Please select medicine schedule');
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
      iconType: 'pill',
      iconColor: '#6366F1',
      schedules: schedules.map(time => ({ time, color: 'bg-indigo-100 text-indigo-800' })),
      takenRecords: {},
      type: 'medicine',
      startDate,
      duration,
      frequency,
      note
    };
    
    medicines.push(newMedicine);
    localStorage.setItem('medicines', JSON.stringify(medicines));
    
    window.dispatchEvent(new CustomEvent('medicineStatusChanged'));
    
    navigate('/');
  };

  const getScheduleOptions = () => {
    return [
      language === 'vi' ? 'Trước Bữa Sáng' : 'Before Breakfast',
      language === 'vi' ? 'Sau Bữa Sáng' : 'After Breakfast',
      language === 'vi' ? 'Trước Bữa Trưa' : 'Before Lunch',
      language === 'vi' ? 'Sau Bữa Trưa' : 'After Lunch',
      language === 'vi' ? 'Trước Bữa Tối' : 'Before Dinner',
      language === 'vi' ? 'Sau Bữa Tối' : 'After Dinner',
      language === 'vi' ? 'Trước Khi Ngủ' : 'Before Bed'
    ];
  };

  const durationOptions = [
    { value: '', label: language === 'vi' ? 'Chọn thời gian' : 'Select duration' },
    { value: '1 Ngày', label: language === 'vi' ? '1 Ngày' : 'One Day' },
    { value: '1 Week', label: language === 'vi' ? '1 Tuần' : '1 Week' },
    { value: '2 Weeks', label: language === 'vi' ? '2 Tuần' : '2 Weeks' },
    { value: '1 Month', label: language === 'vi' ? '1 Tháng' : '1 Month' },
    { value: '3 Months', label: language === 'vi' ? '3 Tháng' : '3 Months' },
    { value: '6 Months', label: language === 'vi' ? '6 Tháng' : '6 Months' }
  ];

  const frequencyOptions = [
    { value: '', label: language === 'vi' ? 'Chọn tần suất' : 'Select frequency' },
    { value: 'Daily', label: language === 'vi' ? 'Hàng ngày' : 'Daily' },
    { value: 'Every 2 days', label: language === 'vi' ? 'Cách 1 ngày' : 'Every 2 days' },
    { value: 'Every 3 days', label: language === 'vi' ? 'Cách 2 ngày' : 'Every 3 days' },
    { value: 'Every 4 days', label: language === 'vi' ? 'Cách 3 ngày' : 'Every 4 days' },
    { value: 'Weekly', label: language === 'vi' ? 'Hàng tuần' : 'Weekly' }
  ];

  // Lọc danh sách tần suất dựa trên thời gian điều trị đã chọn
  const getFilteredFrequencyOptions = () => {
    // Nếu chọn 1 tuần, hiển thị hàng ngày, cách 1 ngày, cách 2 ngày, cách 3 ngày
    if (duration === '1 Week') {
      return frequencyOptions.filter(option => 
        option.value === '' || 
        option.value === 'Daily' || 
        option.value === 'Every 2 days' ||
        option.value === 'Every 3 days' ||
        option.value === 'Every 4 days'
      );
    }
    
    // Nếu chọn 2 tuần
    if (duration === '2 Weeks') {
      return frequencyOptions.filter(option => 
        option.value === '' || 
        option.value === 'Daily' || 
        option.value === 'Every 2 days' ||
        option.value === 'Every 3 days' ||
        option.value === 'Every 4 days' ||
        option.value === 'Weekly'
      );
    }
    
    // Với các lựa chọn khác, hiển thị tất cả
    return frequencyOptions;
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-white">
        <button onClick={handleBack} className="mr-4">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">
          {language === 'vi' ? 'Thêm Thuốc Mới' : 'Add New Medicine'}
        </h1>
      </div>
      
      {/* Form */}
      <div className="flex-grow p-6 overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          <div>
            <label htmlFor="name" className="block text-gray-600 text-lg mb-2">
              {language === 'vi' ? 'Tên thuốc' : 'Medicine Name'}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={language === 'vi' ? 'Nhập tên thuốc' : 'Enter medicine name'}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-600 text-lg mb-2">
              {language === 'vi' ? 'Thời gian & Lịch' : 'Time & Schedule'}
            </label>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {getScheduleOptions().map(schedule => (
                <div 
                  key={schedule} 
                  className={`px-3 py-3 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
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
                  <span className="text-sm">{schedule}</span>
                </div>
              ))}
            </div>
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
                  {getFilteredFrequencyOptions().filter(option => option.value !== '').map(option => (
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

            <div>
              <label className="block text-gray-600 text-lg mb-2">
                {language === 'vi' ? 'Ghi chú' : 'Notes'}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                placeholder={language === 'vi' ? 'Thêm ghi chú về thuốc này...' : 'Add notes about this medicine...'}
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
    </div>
  );
};

export default AddMedicine;
