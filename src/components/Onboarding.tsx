import React, { useState, useContext } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { LanguageContext } from '../App';

const Onboarding = () => {
  const { language } = useContext(LanguageContext);
  const [mealTimes, setMealTimes] = useState({
    breakfast: '07:00',
    lunch: '12:00',
    dinner: '18:00'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMealTimes(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    // Save meal times to user profile
    const storedProfile = localStorage.getItem('userProfile');
    let profile = storedProfile ? JSON.parse(storedProfile) : {
      name: 'Dollay Husen',
      age: '25',
      height: '',
      weight: '',
      mealTimes: mealTimes
    };
    
    // Update meal times
    profile.mealTimes = mealTimes;
    
    // Save updated profile
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // Mark onboarding as completed
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Notify other components that profile has changed
    window.dispatchEvent(new CustomEvent('profileChanged', { detail: profile }));
    
    // Force reload to apply the onboarding completion
    window.location.href = '/';
  };

  const handleSkip = () => {
    // Mark onboarding as completed without saving meal times
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Force reload to apply the onboarding completion
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
      {/* Skip button */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={handleSkip}
          className="px-6 py-2 rounded-full bg-indigo-100 text-indigo-600 font-medium hover:bg-indigo-200 transition-colors"
        >
          {language === 'vi' ? 'Bỏ qua' : 'Skip'}
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-4">
          {language === 'vi' ? 'Thời gian ăn uống' : 'Meal Times'}
        </h1>
        
        {/* Description */}
        <p className="text-gray-600 mb-6 max-w-xs mx-auto">
          {language === 'vi'
            ? 'Hãy thiết lập thời gian ăn uống hàng ngày của bạn để chúng tôi có thể nhắc nhở bạn uống thuốc đúng giờ.'
            : 'Set up your daily meal times so we can remind you to take your medicine at the right time.'}
        </p>
        
        {/* Meal Times Component */}
        <div className="space-y-4 w-full max-w-xs mx-auto mt-4">
          {/* Breakfast */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'vi' ? 'Bữa sáng' : 'Breakfast'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={18} className="text-gray-400" />
              </div>
              <input
                type="time"
                name="breakfast"
                value={mealTimes.breakfast}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          </div>
          
          {/* Lunch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'vi' ? 'Bữa trưa' : 'Lunch'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={18} className="text-gray-400" />
              </div>
              <input
                type="time"
                name="lunch"
                value={mealTimes.lunch}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          </div>
          
          {/* Dinner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'vi' ? 'Bữa tối' : 'Dinner'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={18} className="text-gray-400" />
              </div>
              <input
                type="time"
                name="dinner"
                value={mealTimes.dinner}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>
        
        {/* Navigation button */}
        <div className="mt-8">
          <button
            onClick={handleNext}
            className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg hover:bg-indigo-600 transition-colors"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
