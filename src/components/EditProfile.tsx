import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Save, User, Ruler, Weight } from 'lucide-react';
import { LanguageContext } from '../App';

interface UserProfile {
  name: string;
  age: string;
  height: string;
  weight: string;
  mealTimes: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

const EditProfile = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    height: '',
    weight: '',
    mealTimes: {
      breakfast: '07:00',
      lunch: '12:00',
      dinner: '18:00'
    }
  });

  useEffect(() => {
    // Load profile from localStorage
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
      } catch (error) {
        console.error('Error parsing profile:', error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (mealTimes)
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof UserProfile] as object,
          [child]: value
        }
      }));
    } else {
      // Handle top-level properties
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    // Save profile to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // Notify other components that profile has changed
    window.dispatchEvent(new CustomEvent('profileChanged', { detail: profile }));
    
    // Navigate back to profile page
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="p-6 pb-28 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={handleCancel} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">
          {language === 'vi' ? 'Chỉnh sửa thông tin' : 'Edit Profile'}
        </h1>
        <button 
          onClick={handleSave}
          className="p-2 rounded-full text-pink-500 hover:bg-pink-50"
        >
          <Save size={24} />
        </button>
      </div>
      
      {/* Personal Information Section */}
      <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {language === 'vi' ? 'Thông tin cá nhân' : 'Personal Information'}
        </h2>
        
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'vi' ? 'Họ và tên' : 'Full Name'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition-colors"
                placeholder={language === 'vi' ? 'Nhập họ và tên' : 'Enter your name'}
              />
            </div>
          </div>
          
          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'vi' ? 'Tuổi' : 'Age'}
            </label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition-colors"
              placeholder={language === 'vi' ? 'Nhập tuổi' : 'Enter your age'}
            />
          </div>
          
          {/* Height and Weight in a row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'vi' ? 'Chiều cao (cm)' : 'Height (cm)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Ruler size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="height"
                  value={profile.height}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition-colors"
                  placeholder={language === 'vi' ? 'Chiều cao' : 'Height'}
                />
              </div>
            </div>
            
            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'vi' ? 'Cân nặng (kg)' : 'Weight (kg)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Weight size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="weight"
                  value={profile.weight}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition-colors"
                  placeholder={language === 'vi' ? 'Cân nặng' : 'Weight'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Meal Times Section */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          {language === 'vi' ? 'Thời gian ăn uống' : 'Meal Times'}
        </h2>
        
        <div className="space-y-4">
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
                name="mealTimes.breakfast"
                value={profile.mealTimes.breakfast}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition-colors"
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
                name="mealTimes.lunch"
                value={profile.mealTimes.lunch}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition-colors"
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
                name="mealTimes.dinner"
                value={profile.mealTimes.dinner}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Button - Fixed at bottom */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t">
        <button
          onClick={handleSave}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full font-medium transition-colors"
        >
          {language === 'vi' ? 'Lưu thông tin' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
