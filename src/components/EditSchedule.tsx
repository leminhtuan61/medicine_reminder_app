import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Medicine } from './MedicineList';
import { LanguageContext } from '../App';

const EditSchedule = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('1 Lần');
  const [frequency, setFrequency] = useState('Daily');

  useEffect(() => {
    // Load medicine from localStorage
    const storedMedicines = localStorage.getItem('medicines');
    if (storedMedicines && id) {
      const parsedMedicines: Medicine[] = JSON.parse(storedMedicines);
      const foundMedicine = parsedMedicines.find(med => med.id === parseInt(id));
      if (foundMedicine) {
        setMedicine(foundMedicine);
        if (foundMedicine.startDate) setStartDate(foundMedicine.startDate);
        if (foundMedicine.duration) setDuration(foundMedicine.duration);
        if (foundMedicine.frequency) setFrequency(foundMedicine.frequency);
      }
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    if (!medicine || !id) return;
    
    const storedMedicines = localStorage.getItem('medicines');
    if (storedMedicines) {
      const parsedMedicines: Medicine[] = JSON.parse(storedMedicines);
      const updatedMedicines = parsedMedicines.map(med => {
        if (med.id === parseInt(id)) {
          return { ...med, startDate, duration, frequency };
        }
        return med;
      });
      
      localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
      
      // Notify other components that medicine data has changed
      window.dispatchEvent(new CustomEvent('medicineStatusChanged'));
      
      navigate(`/medicine/${id}`);
    }
  };

  return (
    <div className="p-6 pb-28">
      <div className="flex items-center justify-between mb-6">
        <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">
          {language === 'vi' ? 'Chỉnh sửa lịch điều trị' : 'Edit Treatment Schedule'}
        </h1>
        <div className="w-9"></div> {/* Empty div for flex alignment */}
      </div>
      
      {medicine && (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          
          {/* Duration, Frequency, Start Date Selection */}
          <div className="mb-6">
            <div className="mb-4">
              <label htmlFor="startDate" className="block text-gray-700 mb-2">
                {language === 'vi' ? 'Ngày bắt đầu' : 'Start Date'}
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="duration" className="block text-gray-700 mb-2">
                {language === 'vi' ? 'Thời gian điều trị' : 'Treatment Duration'}
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {language === 'vi' ? (
                  <>
                    <option value="1 Ngày">1 Ngày</option>
                    <option value="1 Tuần">1 Tuần</option>
                    <option value="2 Tuần">2 Tuần</option>
                    <option value="1 Tháng">1 Tháng</option>
                    <option value="3 Tháng">3 Tháng</option>
                    <option value="6 Tháng">6 Tháng</option>
                    <option value="1 Năm">1 Năm</option>
                    <option value="Liên tục">Liên tục</option>
                  </>
                ) : (
                  <>
                    <option value="One Day">One Day</option>
                    <option value="1 Week">1 Week</option>
                    <option value="2 Weeks">2 Weeks</option>
                    <option value="1 Month">1 Month</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="1 Year">1 Year</option>
                    <option value="Ongoing">Ongoing</option>
                  </>
                )}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="frequency" className="block text-gray-700 mb-2">
                {language === 'vi' ? 'Tần suất' : 'Frequency'}
              </label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {language === 'vi' ? (
                  <>
                    <option value="Hằng ngày">Hằng ngày</option>
                    <option value="Cách 2 ngày">Cách 2 ngày</option>
                    <option value="Cách 3 ngày">Cách 3 ngày</option>
                    <option value="Hàng tuần">Hàng tuần</option>
                    <option value="Hai tuần một lần">Hai tuần một lần</option>
                    <option value="Hàng tháng">Hàng tháng</option>
                  </>
                ) : (
                  <>
                    <option value="Daily">Daily</option>
                    <option value="Every 2 days">Every 2 days</option>
                    <option value="Every 3 days">Every 3 days</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Biweekly">Biweekly</option>
                    <option value="Monthly">Monthly</option>
                  </>
                )}
              </select>
            </div>
          </div>
          
          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-500 text-white font-medium"
          >
            {language === 'vi' ? 'Lưu thay đổi' : 'Save Changes'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditSchedule;
