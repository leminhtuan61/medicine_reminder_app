import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, Clock, User, Ruler, Weight, Edit, Calendar, List } from 'lucide-react';
import { LanguageContext } from '../App';
import { Medicine } from './MedicineList';

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
  const [medicines, setMedicines] = useState<Medicine[]>([]);

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
      window.removeEventListener('profileChanged' as any, handleProfileChange);
      window.removeEventListener('medicineStatusChanged', loadMedicines);
    };
  }, []);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const navigateToScheduleList = () => {
    navigate('/schedule-list');
  };

  // Lấy 3 lịch trình đầu tiên để hiển thị trong màn hình Profile
  const recentSchedules = medicines.slice(0, 3);

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
      
      {/* Schedules Section */}
      <div className="mt-6 mx-4 bg-white rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {language === 'vi' ? 'Danh sách lịch trình' : 'Schedule List'}
          </h3>
          <button 
            onClick={navigateToScheduleList}
            className="text-indigo-500 flex items-center text-sm"
          >
            {language === 'vi' ? 'Xem tất cả' : 'View all'}
          </button>
        </div>
        
        {recentSchedules.length > 0 ? (
          <div className="space-y-3">
            {recentSchedules.map(medicine => (
              <div key={medicine.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <Calendar size={16} className="text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">{medicine.name}</h4>
                    <p className="text-gray-500 text-sm">
                      {medicine.schedules.length > 0 ? 
                        medicine.schedules.map(s => s.time).join(', ') : 
                        (language === 'vi' ? 'Chưa có lịch' : 'No schedule')}
                    </p>
                  </div>
                </div>
                <Link to={`/edit-schedule/${medicine.id}`} className="text-indigo-500">
                  <Edit size={16} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Calendar size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">
              {language === 'vi' ? 'Chưa có lịch trình nào' : 'No schedules yet'}
            </p>
          </div>
        )}
        
        <button 
          onClick={navigateToScheduleList}
          className="mt-4 bg-indigo-500 text-white py-3 w-full rounded-lg flex items-center justify-center"
        >
          <List size={18} className="mr-2" />
          {language === 'vi' ? 'Quản lý lịch trình' : 'Manage Schedules'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
