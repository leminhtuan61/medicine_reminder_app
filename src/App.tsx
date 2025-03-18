import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Home, FileText, User, ChevronLeft, Globe, Check, Droplet, List } from 'lucide-react';
import CalendarComponent from './components/Calendar';
import MedicineList from './components/MedicineList';
import TabBar from './components/TabBar';
import MedicineDetail from './components/MedicineDetail';
import AddMedicine from './components/AddMedicine';
import EditSchedule from './components/EditSchedule';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import ScheduleList from './components/ScheduleList';
import Onboarding from './components/Onboarding';

// Create language context
export const LanguageContext = createContext({
  language: 'vi',
  setLanguage: (lang: string) => {}
});

function MainScreen() {
  const [activeTab, setActiveTab] = useState('medicine');
  const { language, setLanguage } = useContext(LanguageContext);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentWaterIntake, setCurrentWaterIntake] = useState(0);
  
  // Load current water intake when selectedDate changes
  useEffect(() => {
    try {
      const storedWaterIntake = localStorage.getItem('waterIntake') || '{}';
      const waterIntake = JSON.parse(storedWaterIntake);
      setCurrentWaterIntake(waterIntake[selectedDate] || 0);
    } catch (e) {
      setCurrentWaterIntake(0);
    }
  }, [selectedDate]);
  
  // Close language menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageOptions(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Listen for date selection
  useEffect(() => {
    const handleDateSelect = (event: CustomEvent) => {
      if (event.detail && event.detail.date) {
        const dateStr = event.detail.date;
        
        // Cập nhật ngày đã chọn vào state và localStorage
        setSelectedDate(dateStr);
        localStorage.setItem('selectedDate', dateStr);
        
        // Cải tiến: Gửi sự kiện forceRefresh để buộc các component cập nhật
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('forceRefresh'));
        }, 10);
      }
    };
    
    window.addEventListener('dateSelected' as any, handleDateSelect);
    
    // Khôi phục ngày đã chọn từ localStorage khi load trang
    const savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
      setSelectedDate(savedDate);
    }
    
    return () => {
      window.removeEventListener('dateSelected' as any, handleDateSelect);
    };
  }, []); // Không phụ thuộc vào selectedDate để tránh vòng lặp
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Dispatch an event to notify Calendar component about tab change
    window.dispatchEvent(new CustomEvent('tabChanged', { 
      detail: { tab } 
    }));
    
    // Dispatch an event to notify MedicineList component about category change
    window.dispatchEvent(new CustomEvent('categoryTabChanged', { 
      detail: { tab } 
    }));
  };
  
  // Handle water intake update
  const updateWaterIntake = () => {
    // Get current water intake data
    const storedWaterIntake = localStorage.getItem('waterIntake') || '{}';
    const waterIntake = JSON.parse(storedWaterIntake);
    
    // Add 250ml to selected date's intake
    const newIntake = (waterIntake[selectedDate] || 0) + 250;
    waterIntake[selectedDate] = newIntake;
    
    // Update state for immediate UI refresh
    setCurrentWaterIntake(newIntake);
    
    // Save updated water intake
    localStorage.setItem('waterIntake', JSON.stringify(waterIntake));
    
    // Notify components about the change
    window.dispatchEvent(new CustomEvent('waterIntakeChanged'));
  };
  
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {language === 'vi' ? 'Nhắc Nhở' : 'Medicine'}
            </h1>
            <h1 className="text-3xl font-bold">
              {language === 'vi' ? 'Uống Thuốc' : 'Reminder'}
            </h1>
          </div>
          <div className="relative" ref={languageMenuRef}>
            <button 
              onClick={() => setShowLanguageOptions(!showLanguageOptions)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Toggle language"
            >
              <Globe size={24} className="text-indigo-500" />
              <span className="sr-only">
                {language === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
              </span>
            </button>
            
            {/* Language Options Dropdown */}
            {showLanguageOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setLanguage('vi');
                      setShowLanguageOptions(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <span className="flex-grow text-left">Tiếng Việt</span>
                    {language === 'vi' && <Check size={16} className="text-indigo-500" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setShowLanguageOptions(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <span className="flex-grow text-left">English</span>
                    {language === 'en' && <Check size={16} className="text-indigo-500" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Calendar - Fixed */}
      <div className="sticky top-0 bg-white z-10">
        <CalendarComponent />
        
        {/* Tabs */}
        <div className="flex justify-around border-b mb-4">
          <button 
            className={`py-2 px-4 ${activeTab === 'medicine' ? 'border-b-2 border-indigo-500 text-indigo-500' : 'text-gray-500'}`}
            onClick={() => handleTabChange('medicine')}
          >
            {language === 'vi' ? 'Thuốc' : 'Medications'}
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'water' ? 'border-b-2 border-indigo-500 text-indigo-500' : 'text-gray-500'}`}
            onClick={() => handleTabChange('water')}
          >
            <div className="flex items-center">
              <Droplet size={16} className="mr-1" />
              {language === 'vi' ? 'Nước' : 'Water'}
            </div>
          </button>
        </div>
      </div>
      
      {/* Medicine List - Scrollable */}
      <div className="flex-1 overflow-auto pb-28">
        {activeTab === 'water' ? (
          <div className="p-6 text-center">
            <div className="mb-4">
              <Droplet size={64} className="mx-auto text-blue-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              {language === 'vi' ? 'Theo dõi lượng nước uống' : 'Daily Water Intake'}
            </h2>
            <p className="text-gray-600 mb-6">
              {language === 'vi' ? 
                'Hãy uống đủ nước mỗi ngày để giữ cơ thể khỏe mạnh' : 
                'Stay hydrated for better health'}
            </p>
            
            {/* Water intake for selected date */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-800 mb-2">
                {language === 'vi' ? `Lượng nước uống (${selectedDate})` : `Water intake (${selectedDate})`}
              </h3>
              <div className="flex items-center justify-center">
                <Droplet size={24} className="text-blue-500 mr-2" />
                <span className="text-2xl font-bold text-blue-700">
                  {currentWaterIntake >= 1000 ? `${(currentWaterIntake / 1000).toFixed(1)}L` : `${currentWaterIntake}ml`}
                </span>
                <span className="text-blue-500 ml-2">/2L</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-blue-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, (currentWaterIntake / 2000) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            {/* Add water button */}
            <div className="flex flex-col items-center">
              <button
                onClick={updateWaterIntake}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-3 flex items-center shadow-md transition-colors"
              >
                <Droplet size={20} className="mr-2" />
                {language === 'vi' ? 'Thêm 250ml nước' : 'Add 250ml water'}
              </button>
              
              <div className="mt-8 text-sm text-gray-500">
                <p>
                  {language === 'vi' 
                    ? 'Mục tiêu: 2 lít nước mỗi ngày' 
                    : 'Goal: 2 liters of water per day'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <MedicineList />
        )}
      </div>
    </div>
  );
}

// Layout component that includes the TabBar for all routes
function Layout() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      <Outlet />
      
      {/* Bottom Tab Bar - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-10">
        <TabBar />
      </div>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState('vi'); // Default to Vietnamese
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    setShowOnboarding(onboardingCompleted !== 'true');
    setOnboardingChecked(true);
  }, []);
  
  if (!onboardingChecked) {
    // Show loading or splash screen while checking
    return <div className="flex items-center justify-center min-h-screen bg-indigo-50">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <Router>
        <Routes>
          {showOnboarding ? (
            <Route path="*" element={<Onboarding />} />
          ) : (
            <>
              <Route element={<Layout />}>
                <Route path="/" element={<MainScreen />} />
                <Route path="/medicine/:id" element={<MedicineDetail />} />
                <Route path="/add-medicine" element={<AddMedicine />} />
                <Route path="/edit-schedule/:id" element={<EditSchedule />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/schedule-list" element={<ScheduleList />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </LanguageContext.Provider>
  );
}

export default App;
