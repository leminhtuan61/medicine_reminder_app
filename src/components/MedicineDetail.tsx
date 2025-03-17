import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Edit2, Trash2, Check } from 'lucide-react';
import { Medicine } from './MedicineList';
import { Pill, Capsule, TabletBottle, Tablets } from './MedicineIcons';
import { LanguageContext } from '../App';

const MedicineDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Load medicine from localStorage
    const loadMedicine = () => {
      const storedMedicines = localStorage.getItem('medicines');
      if (storedMedicines && id) {
        const parsedMedicines: Medicine[] = JSON.parse(storedMedicines);
        const foundMedicine = parsedMedicines.find(med => med.id === parseInt(id));
        if (foundMedicine) {
          setMedicine(foundMedicine);
        } else {
          navigate('/');
        }
      }
    };

    loadMedicine();

    // Listen for changes in medicine status
    window.addEventListener('medicineStatusChanged', loadMedicine);
    
    // Listen for date selection
    const handleDateSelect = (event: CustomEvent) => {
      if (event.detail && event.detail.date) {
        setSelectedDate(event.detail.date);
      }
    };
    
    window.addEventListener('dateSelected' as any, handleDateSelect);
    
    return () => {
      window.removeEventListener('medicineStatusChanged', loadMedicine);
      window.removeEventListener('dateSelected' as any, handleDateSelect);
    };
  }, [id, navigate]);

  const handleBack = () => {
    navigate('/');
  };

  const handleDelete = () => {
    if (!medicine || !id) return;
    
    if (window.confirm(language === 'vi' ? 'Bạn có chắc muốn xóa thuốc này?' : 'Are you sure you want to delete this medicine?')) {
      const storedMedicines = localStorage.getItem('medicines');
      if (storedMedicines) {
        const parsedMedicines: Medicine[] = JSON.parse(storedMedicines);
        const updatedMedicines = parsedMedicines.filter(med => med.id !== parseInt(id));
        localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
        
        // Notify other components that medicine data has changed
        window.dispatchEvent(new CustomEvent('medicineStatusChanged'));
        
        navigate('/');
      }
    }
  };

  const toggleMedicineTaken = (scheduleIndex: number) => {
    if (!medicine || !id) return;
    
    const storedMedicines = localStorage.getItem('medicines');
    if (storedMedicines) {
      const parsedMedicines: Medicine[] = JSON.parse(storedMedicines);
      const updatedMedicines = parsedMedicines.map(med => {
        if (med.id === parseInt(id)) {
          const takenRecords = { ...med.takenRecords };
          
          // Initialize array for this date if it doesn't exist
          if (!takenRecords[selectedDate]) {
            takenRecords[selectedDate] = [];
          }
          
          // Ensure takenRecords[selectedDate] is an array
          if (typeof takenRecords[selectedDate] === 'boolean') {
            takenRecords[selectedDate] = [takenRecords[selectedDate]];
          }
          
          // Ensure the array has enough elements
          while (takenRecords[selectedDate].length <= scheduleIndex) {
            takenRecords[selectedDate].push(false);
          }
          
          // Toggle the status
          takenRecords[selectedDate][scheduleIndex] = !takenRecords[selectedDate][scheduleIndex];
          
          return { ...med, takenRecords };
        }
        return med;
      });
      
      localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
      
      // Update local state
      const updatedMedicine = updatedMedicines.find(med => med.id === parseInt(id));
      if (updatedMedicine) {
        setMedicine(updatedMedicine);
      }
      
      // Notify other components that medicine data has changed
      window.dispatchEvent(new CustomEvent('medicineStatusChanged'));
    }
  };

  // Get icon component based on medicine type
  const getMedicineIcon = () => {
    if (!medicine) return null;
    
    const size = 64;
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
  const isMedicineTaken = (scheduleIndex: number) => {
    if (!medicine?.takenRecords[selectedDate]) return false;
    
    // Handle case where takenRecords[selectedDate] might be a boolean instead of an array
    if (typeof medicine.takenRecords[selectedDate] === 'boolean') {
      return scheduleIndex === 0 ? medicine.takenRecords[selectedDate] : false;
    }
    
    return medicine.takenRecords[selectedDate][scheduleIndex] || false;
  };

  return (
    <div className="p-6 pb-28">
      <div className="flex items-center justify-between mb-6">
        <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">
          {language === 'vi' ? 'Chi tiết thuốc' : 'Medicine Details'}
        </h1>
        <div className="flex">
          <Link to={`/edit-schedule/${id}`} className="p-2 rounded-full hover:bg-gray-100 mr-1">
            <Edit2 size={20} className="text-indigo-500" />
          </Link>
          <button onClick={handleDelete} className="p-2 rounded-full hover:bg-gray-100">
            <Trash2 size={20} className="text-red-500" />
          </button>
        </div>
      </div>
      
      {medicine && (
        <div>
          <div className="flex items-center mb-6">
            <div className="mr-4">
              {getMedicineIcon()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{medicine.name}</h2>
              <p className="text-gray-500">
                {medicine.type === 'medicine' ? 
                  (language === 'vi' ? 'Thuốc' : 'Medicine') : 
                  medicine.type === 'tablet' ?
                    (language === 'vi' ? 'Viên nén' : 'Tablet') :
                    medicine.type === 'injection' ?
                      (language === 'vi' ? 'Tiêm' : 'Injection') :
                      (language === 'vi' ? 'Khác' : 'Other')}
              </p>
            </div>
          </div>
          
          {/* Schedule Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">
              {language === 'vi' ? 'Lịch uống thuốc' : 'Schedule'}
            </h3>
            {medicine.schedules.length > 0 ? (
              <div className="space-y-3">
                {medicine.schedules.map((schedule, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${schedule.color.replace('text-', 'bg-').replace('-800', '-500')}`}></div>
                      <span className="ml-2">{schedule.time}</span>
                    </div>
                    <button
                      onClick={() => toggleMedicineTaken(index)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isMedicineTaken(index)
                          ? 'bg-green-500 text-white'
                          : 'border-2 border-gray-300'
                      }`}
                    >
                      {isMedicineTaken(index) && <Check size={20} />}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                {language === 'vi' ? 'Chưa có lịch nào' : 'No schedules yet'}
              </p>
            )}
          </div>
          
          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">
              {language === 'vi' ? 'Thông tin thêm' : 'Additional Information'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">
                  {language === 'vi' ? 'Thời gian' : 'Duration'}
                </p>
                <p className="font-medium">
                  {medicine.duration || (language === 'vi' ? 'Không xác định' : 'Not specified')}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">
                  {language === 'vi' ? 'Tần suất' : 'Frequency'}
                </p>
                <p className="font-medium">
                  {medicine.frequency || (language === 'vi' ? 'Không xác định' : 'Not specified')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineDetail;
