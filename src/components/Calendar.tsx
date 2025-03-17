import React, { useState, useContext, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Droplet } from 'lucide-react';
import { LanguageContext } from '../App';
import { Medicine, MedicineTakenRecord } from './MedicineList';

// Interface for water intake records
interface WaterIntakeRecord {
  [date: string]: number; // ml of water consumed per day
}

// Function to get medication data for a specific date
const getMedicationData = (date: Date, medicines: Medicine[], activeTab: string) => {
  // Format date to string for comparison (YYYY-MM-DD)
  const dateStr = date.toISOString().split('T')[0];
  
  // Filter medicines by type based on active tab
  const filteredMedicines = medicines.filter(med => med.type === activeTab);
  
  // Count medications and check if all are completed for this specific date
  const medicationsForDay = filteredMedicines.filter(med => {
    // In a real app, you would check if this medication is scheduled for this date
    // For now, we'll assume all medicines are scheduled for all days
    return true;
  });
  
  const totalCount = medicationsForDay.length;
  const completedCount = medicationsForDay.filter(med => 
    med.takenRecords[dateStr] === true
  ).length;
  
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
    isCompleted: percentage >= 100
  };
};

const CalendarComponent = () => {
  const { language } = useContext(LanguageContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [waterIntake, setWaterIntake] = useState<WaterIntakeRecord>({});
  const [calendarDays, setCalendarDays] = useState<Array<{
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
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
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

  // Listen for tab changes
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      if (event.detail && event.detail.tab) {
        if (event.detail.tab === 'week') {
          setViewMode('week');
        } else if (event.detail.tab === 'month') {
          setViewMode('month');
        }
      }
    };

    window.addEventListener('tabChanged' as any, handleTabChange);
    
    return () => {
      window.removeEventListener('tabChanged' as any, handleTabChange);
    };
  }, []);

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

  // Generate calendar days for the current week
  const generateWeekCalendarDays = (date: Date) => {
    const today = new Date();
    const currentDay = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const result = [];
    
    // Get the first day of the week (Sunday)
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() - currentDay);
    
    // Generate 7 days starting from the first day of the week
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      
      // Get medication data for this specific day
      const { totalCount, uncompletedCount, allCompleted } = getMedicationData(day, medicines, activeTab);
      
      // Get water intake data for this specific day
      const { intake, percentage, isCompleted } = getWaterIntakeData(day, waterIntake);
      
      result.push({
        date: day,
        isCurrentMonth: day.getMonth() === date.getMonth(),
        isToday: day.toDateString() === today.toDateString(),
        isSelected: day.toDateString() === selectedDate.toDateString(),
        totalMedicationCount: totalCount,
        uncompletedCount: uncompletedCount,
        allCompleted: allCompleted,
        waterIntake: intake,
        waterPercentage: percentage,
        waterCompleted: isCompleted
      });
    }
    
    return result;
  };

  // Generate calendar days for the current month
  const generateMonthCalendarDays = (date: Date) => {
    const today = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    
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
    
    const result = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      const day = new Date(year, month - 1, i);
      
      // Get medication data for this specific day
      const { totalCount, uncompletedCount, allCompleted } = getMedicationData(day, medicines, activeTab);
      
      // Get water intake data for this specific day
      const { intake, percentage, isCompleted } = getWaterIntakeData(day, waterIntake);
      
      result.push({
        date: day,
        isCurrentMonth: false,
        isToday: day.toDateString() === today.toDateString(),
        isSelected: day.toDateString() === selectedDate.toDateString(),
        totalMedicationCount: totalCount,
        uncompletedCount: uncompletedCount,
        allCompleted: allCompleted,
        waterIntake: intake,
        waterPercentage: percentage,
        waterCompleted: isCompleted
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const day = new Date(year, month, i);
      
      // Get medication data for this specific day
      const { totalCount, uncompletedCount, allCompleted } = getMedicationData(day, medicines, activeTab);
      
      // Get water intake data for this specific day
      const { intake, percentage, isCompleted } = getWaterIntakeData(day, waterIntake);
      
      result.push({
        date: day,
        isCurrentMonth: true,
        isToday: day.toDateString() === today.toDateString(),
        isSelected: day.toDateString() === selectedDate.toDateString(),
        totalMedicationCount: totalCount,
        uncompletedCount: uncompletedCount,
        allCompleted: allCompleted,
        waterIntake: intake,
        waterPercentage: percentage,
        waterCompleted: isCompleted
      });
    }
    
    // Add days from next month to fill the grid
    const remainingDays = totalDays - result.length;
    for (let i = 1; i <= remainingDays; i++) {
      const day = new Date(year, month + 1, i);
      
      // Get medication data for this specific day
      const { totalCount, uncompletedCount, allCompleted } = getMedicationData(day, medicines, activeTab);
      
      // Get water intake data for this specific day
      const { intake, percentage, isCompleted } = getWaterIntakeData(day, waterIntake);
      
      result.push({
        date: day,
        isCurrentMonth: false,
        isToday: day.toDateString() === today.toDateString(),
        isSelected: day.toDateString() === selectedDate.toDateString(),
        totalMedicationCount: totalCount,
        uncompletedCount: uncompletedCount,
        allCompleted: allCompleted,
        waterIntake: intake,
        waterPercentage: percentage,
        waterCompleted: isCompleted
      });
    }
    
    return result;
  };

  // Update calendar when current date or medicines change
  useEffect(() => {
    if (viewMode === 'week') {
      setCalendarDays(generateWeekCalendarDays(currentDate));
    } else {
      setCalendarDays(generateMonthCalendarDays(currentDate));
    }
  }, [currentDate, selectedDate, medicines, waterIntake, viewMode, activeTab]);

  // Go to previous period (week or month)
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  // Go to next period (week or month)
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Handle date selection
  const handleDateSelect = (day: Date) => {
    setSelectedDate(day);
    
    // Dispatch an event to notify MedicineList component about date change
    const dateStr = day.toISOString().split('T')[0];
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

  // Render week view
  const renderWeekView = () => {
    return (
      <div className="flex justify-between">
        {calendarDays.map((day, index) => (
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
    );
  };

  // Render month view
  const renderMonthView = () => {
    return (
      <div>
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
              onClick={() => handleDateSelect(day.date)}
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
                  {formatDate(day.date)}
                </span>
              </div>
              
              {/* Medication indicator */}
              {activeTab !== 'water' && day.totalMedicationCount > 0 && (
                <div className="absolute bottom-0 right-0 rounded-full w-3 h-3 flex items-center justify-center">
                  {day.allCompleted ? (
                    <div className="bg-green-500 rounded-full w-3 h-3"></div>
                  ) : (
                    <div className={`rounded-full w-3 h-3 ${
                      activeTab === 'injection' ? 'bg-purple-600' : 'bg-pink-500'
                    }`}></div>
                  )}
                </div>
              )}
              
              {/* Water intake indicator */}
              {activeTab === 'water' && day.waterIntake > 0 && (
                <div className="absolute bottom-0 right-0 flex items-center">
                  <div 
                    className={`rounded-full w-3 h-3 ${
                      day.waterCompleted ? 'bg-blue-500' : 'bg-blue-300'
                    }`}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="px-6 py-4 bg-white">
      {/* Month and Year Display with Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPrevious}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        
        <h2 className="text-lg font-semibold text-gray-800">
          {monthNames[language as keyof typeof monthNames][currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button 
          onClick={goToNext}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Calendar View */}
      {viewMode === 'week' ? renderWeekView() : renderMonthView()}
      
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
