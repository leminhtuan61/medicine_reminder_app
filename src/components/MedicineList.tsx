import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import { Pill, Capsule, TabletBottle, Tablets } from './MedicineIcons';
import { LanguageContext } from '../App';

export interface Schedule {
  time: string;
  color: string;
}

export interface Medicine {
  id: number;
  name: string;
  iconType: string;
  iconColor?: string;
  schedules: Schedule[];
  takenRecords: Record<string, boolean[]>;
  type: 'medicine' | 'injection' | 'tablet' | 'other';
  duration?: string;
  frequency?: string;
}

const MedicineList = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeCategory, setActiveCategory] = useState('medicine');
  const { language } = useContext(LanguageContext);

  // Load medicines from localStorage
  useEffect(() => {
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
    
    // Listen for date selection
    const handleDateSelect = (event: CustomEvent) => {
      if (event.detail && event.detail.date) {
        setSelectedDate(event.detail.date);
      }
    };
    
    window.addEventListener('dateSelected' as any, handleDateSelect);
    
    // Listen for category tab changes
    const handleCategoryChange = (event: CustomEvent) => {
      if (event.detail && event.detail.tab) {
        setActiveCategory(event.detail.tab);
      }
    };
    
    window.addEventListener('categoryTabChanged' as any, handleCategoryChange);
    
    return () => {
      window.removeEventListener('medicineStatusChanged', loadMedicines);
      window.removeEventListener('dateSelected' as any, handleDateSelect);
      window.removeEventListener('categoryTabChanged' as any, handleCategoryChange);
    };
  }, []);

  // Filter medicines by type
  const filteredMedicines = medicines.filter(medicine => 
    activeCategory === 'medicine' ? 
      (medicine.type === 'medicine' || medicine.type === 'tablet' || medicine.type === 'other') : 
      medicine.type === 'injection'
  );

  // Toggle medicine taken status
  const toggleMedicineTaken = (medicineId: number, scheduleIndex: number) => {
    const updatedMedicines = medicines.map(medicine => {
      if (medicine.id === medicineId) {
        const takenRecords = { ...medicine.takenRecords };
        
        // Initialize array for this date if it doesn't exist
        if (!takenRecords[selectedDate]) {
          takenRecords[selectedDate] = medicine.schedules.map(() => false);
        }
        
        // Toggle the status
        takenRecords[selectedDate][scheduleIndex] = !takenRecords[selectedDate][scheduleIndex];
        
        return { ...medicine, takenRecords };
      }
      return medicine;
    });
    
    setMedicines(updatedMedicines);
    localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
    
    // Notify other components that medicine data has changed
    window.dispatchEvent(new CustomEvent('medicineStatusChanged'));
  };

  // Get icon component based on medicine type
  const getMedicineIcon = (medicine: Medicine) => {
    const size = 40;
    const color = medicine.iconColor || undefined;
    
    switch (medicine.iconType) {
      case 'pill':
        return <Pill size={size} color={color} />;
      case 'capsule':
        return <Capsule size={size} color={color} />;
      case 'tabletBottle':
        return <TabletBottle size={size} />;
      case 'tablets':
        return <Tablets size={size} />;
      default:
        return <Pill size={size} color={color} />;
    }
  };

  // Check if a medicine has been taken
  const isMedicineTaken = (medicine: Medicine, scheduleIndex: number) => {
    return medicine.takenRecords[selectedDate]?.[scheduleIndex] || false;
  };

  // Group medicines by their schedules
  const groupedMedicines = filteredMedicines.reduce((acc, medicine) => {
    medicine.schedules.forEach((schedule, index) => {
      const time = schedule.time;
      if (!acc[time]) {
        acc[time] = [];
      }
      acc[time].push({ medicine, scheduleIndex: index });
    });
    return acc;
  }, {} as Record<string, { medicine: Medicine; scheduleIndex: number }[]>);

  // Sort schedule times
  const sortedScheduleTimes = Object.keys(groupedMedicines).sort();

  return (
    <div className="px-6">
      {sortedScheduleTimes.length > 0 ? (
        sortedScheduleTimes.map(time => (
          <div key={time} className="mb-6">
            <h2 className="text-lg font-bold mb-3">{time}</h2>
            <div className="space-y-3">
              {groupedMedicines[time].map(({ medicine, scheduleIndex }) => (
                <div 
                  key={`${medicine.id}-${scheduleIndex}`}
                  className="bg-white rounded-xl p-4 shadow-sm flex items-center"
                >
                  <div className="mr-4">
                    {getMedicineIcon(medicine)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{medicine.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${medicine.schedules[scheduleIndex].color}`}>
                        {time}
                      </span>
                      {medicine.frequency && (
                        <span className="ml-2">{medicine.frequency}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleMedicineTaken(medicine.id, scheduleIndex)}
                      className={`w-8 h-8 mr-2 rounded-lg flex items-center justify-center ${
                        isMedicineTaken(medicine, scheduleIndex)
                          ? 'bg-green-500 text-white'
                          : 'border-2 border-gray-300'
                      }`}
                    >
                      {isMedicineTaken(medicine, scheduleIndex) && <Check size={20} />}
                    </button>
                    <Link to={`/medicine/${medicine.id}`} className="p-2">
                      <ChevronRight size={20} className="text-gray-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10">
          <div className="text-gray-400 mb-4">
            {activeCategory === 'medicine' ? (
              <TabletBottle size={64} className="mx-auto" />
            ) : (
              <div className="w-16 h-16 mx-auto relative">
                <div className="w-2 h-10 bg-gray-300 absolute left-7 top-0"></div>
                <div className="w-8 h-4 bg-gray-300 absolute left-4 top-10 rounded-b-lg"></div>
                <div className="w-1 h-2 bg-gray-400 absolute left-7.5 bottom-0"></div>
              </div>
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-500">
            {language === 'vi' 
              ? `Không có ${activeCategory === 'medicine' ? 'thuốc' : 'lịch tiêm'} nào cho ngày này` 
              : `No ${activeCategory === 'medicine' ? 'medications' : 'injections'} for this date`}
          </h3>
          <p className="text-gray-400 mt-2">
            {language === 'vi'
              ? 'Nhấn nút + để thêm mới'
              : 'Tap the + button to add new'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicineList;
