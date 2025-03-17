import React, { useContext } from 'react';
import { Home, User, Plus, List, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageContext } from '../App';

const TabBar = () => {
  const location = useLocation();
  const path = location.pathname;
  const { language } = useContext(LanguageContext);

  return (
    <div className="flex justify-around items-center py-3 border-t bg-white w-full">
      <Link to="/" className={`p-2 ${path === '/' ? 'text-indigo-500' : 'text-gray-400'}`}>
        <Home size={28} />
      </Link>
      
      <Link to="/calendar" className={`p-2 ${path === '/calendar' ? 'text-indigo-500' : 'text-gray-400'}`}>
        <Calendar size={28} />
      </Link>
      
      <div className="relative">
        <div className="absolute -top-8 -translate-x-1/2 left-1/2">
          <Link 
            to="/add-medicine" 
            className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-500 shadow-lg"
            aria-label={language === 'vi' ? 'Thêm nhắc nhở' : 'Add reminder'}
          >
            <Plus size={30} className="text-white" />
          </Link>
        </div>
      </div>
      
      <Link to="/schedule-list" className={`p-2 ${path === '/schedule-list' ? 'text-indigo-500' : 'text-gray-400'}`}>
        <List size={28} />
      </Link>
      
      <Link to="/profile" className={`p-2 ${path === '/profile' ? 'text-indigo-500' : 'text-gray-400'}`}>
        <User size={28} />
      </Link>
    </div>
  );
};

export default TabBar;
