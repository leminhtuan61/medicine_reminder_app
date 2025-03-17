import React from 'react';
import { Check } from 'lucide-react';

interface Schedule {
  time: string;
  color: string;
}

interface MedicineItemProps {
  id: number;
  name: string;
  icon: React.ReactNode;
  schedules: Schedule[];
  taken: boolean;
  onTakenChange: (id: number, taken: boolean) => void;
}

const MedicineItem: React.FC<MedicineItemProps> = ({ 
  id, 
  name, 
  icon, 
  schedules, 
  taken, 
  onTakenChange 
}) => {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the checkbox
    onTakenChange(id, !taken);
  };

  return (
    <div className={`bg-white rounded-xl mb-4 shadow-sm flex items-center ${taken ? 'opacity-50' : ''}`}>
      <div className="p-4 mr-2 flex-shrink-0">
        {icon}
      </div>
      <div className="py-4 pr-4 flex-1">
        <h3 className="font-bold text-lg mb-2">{name}</h3>
        <div className="flex flex-wrap gap-2">
          {schedules.map((schedule, index) => (
            <span 
              key={index} 
              className={`${schedule.color} px-3 py-1 rounded-full text-xs font-medium`}
            >
              {schedule.time}
            </span>
          ))}
          {schedules.length === 0 && (
            <span className="text-gray-400 text-sm">Chưa có lịch uống thuốc</span>
          )}
        </div>
      </div>
      <div className="pr-4 flex items-center">
        <div 
          className={`w-8 h-8 flex items-center justify-center rounded cursor-pointer ${taken ? 'bg-green-500' : 'bg-gray-100 border border-gray-300'}`}
          onClick={handleCheckboxClick}
        >
          {taken && <Check size={20} color="white" />}
        </div>
      </div>
    </div>
  );
};

export default MedicineItem;
