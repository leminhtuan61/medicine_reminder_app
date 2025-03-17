import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, Clock, User, Ruler, Weight, Edit } from 'lucide-react';
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

const Profile = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Dollay Husen',
    age: '25',
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

    // Listen for profile changes
    const handleProfileChange = (event: CustomEvent) => {
      if (event.detail) {
        setProfile(event.detail);
      }
    };

    window.addEventListener('profileChanged' as any, handleProfileChange);
    
    return () => {
      window.removeEventListener('profileChanged' as any, handleProfileChange);
    };
  }, []);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="pb-28 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-white">
        <Link to="/" className="p-2">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">
          {language === 'vi' ? 'Hồ sơ cá nhân' : 'Profile'}
        </h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center bg-white pt-6 pb-8 shadow-sm">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4">
          <img 
            src="https://cdn.pixabay.com/photo/2021/11/12/03/04/woman-6788784_1280.png" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold mb-1">{profile.name}</h2>
        <p className="text-gray-600">
          {language === 'vi' ? `Tuổi: ${profile.age}` : `Age: ${profile.age}`}
        </p>
        
        {/* Height and Weight */}
        <div className="flex mt-2 space-x-4">
          {profile.height && (
            <div className="flex items-center text-gray-600">
              <Ruler size={16} className="mr-1" />
              <span>{profile.height} cm</span>
            </div>
          )}
          
          {profile.weight && (
            <div className="flex items-center text-gray-600">
              <Weight size={16} className="mr-1" />
              <span>{profile.weight} kg</span>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleEditProfile}
          className="mt-6 bg-pink-400 text-white py-3 px-8 rounded-full w-3/4 max-w-xs flex items-center justify-center"
        >
          <Edit size={18} className="mr-2" />
          {language === 'vi' ? 'Chỉnh sửa thông tin' : 'Edit Profile'}
        </button>
      </div>

      {/* Meal Times Section */}
      <div className="mt-6 mx-4 bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          {language === 'vi' ? 'Thời gian ăn uống' : 'Meal Times'}
        </h3>
        
        <div className="space-y-4">
          {/* Breakfast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Clock size={20} className="text-blue-500" />
              </div>
              <span className="font-medium">
                {language === 'vi' ? 'Bữa sáng' : 'Breakfast'}
              </span>
            </div>
            <span className="text-gray-700">{profile.mealTimes.breakfast}</span>
          </div>
          
          {/* Lunch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                <Clock size={20} className="text-orange-500" />
              </div>
              <span className="font-medium">
                {language === 'vi' ? 'Bữa trưa' : 'Lunch'}
              </span>
            </div>
            <span className="text-gray-700">{profile.mealTimes.lunch}</span>
          </div>
          
          {/* Dinner */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <Clock size={20} className="text-purple-500" />
              </div>
              <span className="font-medium">
                {language === 'vi' ? 'Bữa tối' : 'Dinner'}
              </span>
            </div>
            <span className="text-gray-700">{profile.mealTimes.dinner}</span>
          </div>
        </div>
      </div>

      {/* Ongoing Course Section */}
      <div className="mt-6 mx-4 mb-6">
        <h3 className="text-xl font-bold mb-4">
          {language === 'vi' ? 'Đang điều trị' : 'Ongoing Course'}
        </h3>
        
        {/* Medicine Items */}
        <div className="space-y-4">
          {/* Paracetamol */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 mr-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="#FFD700" />
                    <rect x="30" y="30" width="20" height="40" rx="5" fill="#FF6B6B" />
                    <circle cx="60" cy="50" r="15" fill="#4CAF50" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Paracetamol XL2</h4>
                </div>
              </div>
              <button>
                <MoreVertical size={20} />
              </button>
            </div>
            <div className="flex mt-3 gap-2">
              <span className="bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm">
                {language === 'vi' ? 'Sau bữa sáng' : 'After Breakfast'}
              </span>
              <span className="bg-pink-200 text-pink-800 px-4 py-1 rounded-full text-sm">
                {language === 'vi' ? 'Sau bữa tối' : 'After Dinner'}
              </span>
            </div>
          </div>

          {/* Abacavir */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 mr-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect x="20" y="20" width="60" height="60" rx="5" fill="#C0C0C0" />
                    <rect x="30" y="30" width="40" height="40" rx="5" fill="#FF0000" />
                    <circle cx="50" cy="50" r="15" fill="#4CAF50" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Abacavir</h4>
                </div>
              </div>
              <button>
                <MoreVertical size={20} />
              </button>
            </div>
            <div className="flex mt-3 gap-2">
              <span className="bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm">
                {language === 'vi' ? 'Trước bữa trưa' : 'Before Lunch'}
              </span>
              <span className="bg-pink-200 text-pink-800 px-4 py-1 rounded-full text-sm">
                {language === 'vi' ? 'Sau bữa tối' : 'After Dinner'}
              </span>
            </div>
          </div>

          {/* Dpp-4 inhibitors */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 mr-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <g>
                      {[...Array(10)].map((_, i) => (
                        <circle 
                          key={i} 
                          cx={30 + (i % 5) * 10} 
                          cy={40 + Math.floor(i / 5) * 20} 
                          r="5" 
                          fill="#4A3AFF" 
                        />
                      ))}
                    </g>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Dpp-4 inhibitors</h4>
                </div>
              </div>
              <button>
                <MoreVertical size={20} />
              </button>
            </div>
            <div className="flex mt-3 gap-2">
              <span className="bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm">
                {language === 'vi' ? 'Trước bữa trưa' : 'Before Lunch'}
              </span>
              <span className="bg-pink-200 text-pink-800 px-4 py-1 rounded-full text-sm">
                {language === 'vi' ? 'Sau bữa tối' : 'After Dinner'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
