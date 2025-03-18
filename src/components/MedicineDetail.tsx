import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Edit2, Trash2 } from 'lucide-react';
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
    
    return () => {
      window.removeEventListener('medicineStatusChanged', loadMedicine);
    };
  }, [id, navigate]);
    
    // Listen for date selection
  useEffect(() => {
    const handleDateSelect = (event: CustomEvent) => {
      if (event.detail && event.detail.date) {
        setSelectedDate(event.detail.date);
      }
    };
    
    window.addEventListener('dateSelected' as any, handleDateSelect);
    
    // Lắng nghe sự kiện forceRefresh để cập nhật component
    const handleForceRefresh = () => {
      // Tải lại ngày đã chọn từ localStorage
      const savedDate = localStorage.getItem('selectedDate');
      if (savedDate) {
        setSelectedDate(savedDate);
      }
    };
    
    window.addEventListener('forceRefresh', handleForceRefresh);
    
    // Khôi phục ngày đã chọn từ localStorage khi load component
    const savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
      setSelectedDate(savedDate);
    }
    
    return () => {
      window.removeEventListener('dateSelected' as any, handleDateSelect);
      window.removeEventListener('forceRefresh', handleForceRefresh);
    };
  }, []);
  
  // Force re-render when selectedDate changes
  useEffect(() => {
    // This effect will trigger a re-render when selectedDate changes
  }, [selectedDate]);

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

  // Check if medicine should be shown on selected date based on startDate and duration
  const shouldShowMedicine = (medicine: Medicine): boolean => {
    // Nếu thuốc không có ngày bắt đầu
    if (!medicine.startDate) {
      return true;
    }

    // Chuẩn hóa chuỗi ngày bắt đầu để đảm bảo định dạng YYYY-MM-DD
    const startDateParts = medicine.startDate.split('-');
    // Đảm bảo chúng ta có đầy đủ 3 phần (năm, tháng, ngày)
    if (startDateParts.length !== 3) {
      return true; // Nếu định dạng không hợp lệ, hiển thị thuốc để an toàn
    }

    // Tạo đối tượng Date từ chuỗi ngày bắt đầu với giờ là 12 trưa
    const startDateYear = parseInt(startDateParts[0]);
    const startDateMonth = parseInt(startDateParts[1]) - 1; // Tháng trong JS bắt đầu từ 0
    const startDateDay = parseInt(startDateParts[2]);
    const startDate = new Date(startDateYear, startDateMonth, startDateDay, 12, 0, 0, 0);

    // Tạo đối tượng Date từ chuỗi ngày được chọn với giờ là 12 trưa
    const selectedDateParts = selectedDate.split('-');
    if (selectedDateParts.length !== 3) {
      return true; // Nếu định dạng không hợp lệ, hiển thị thuốc để an toàn
    }
    
    const selectedDateYear = parseInt(selectedDateParts[0]);
    const selectedDateMonth = parseInt(selectedDateParts[1]) - 1;
    const selectedDateDay = parseInt(selectedDateParts[2]);
    const selectedDateTime = new Date(selectedDateYear, selectedDateMonth, selectedDateDay, 12, 0, 0, 0);

    // Chuyển đối tượng Date thành timestamps để so sánh
    const startTimestamp = startDate.getTime();
    const selectedTimestamp = selectedDateTime.getTime();

    // Kiểm tra xem ngày được chọn có >= ngày bắt đầu không
    // Nếu ngày được chọn nhỏ hơn ngày bắt đầu (tức là trước ngày bắt đầu uống thuốc) thì không hiển thị
    if (selectedTimestamp < startTimestamp) {
      return false;
    }

    // Kiểm tra dựa trên thời gian điều trị
    if (medicine.duration) {
      const durationMap: { [key: string]: number } = {
        '1 Ngày': 1,
        'One Day': 1,
        '1 Week': 7,
        '1 Tuần': 7,
        '2 Weeks': 14,
        '2 Tuần': 14,
        '1 Month': 30,
        '1 Tháng': 30,
        '3 Months': 90,
        '3 Tháng': 90,
        '6 Months': 180,
        '6 Tháng': 180,
        '1 Year': 365,
        '1 Năm': 365,
        'Ongoing': Infinity,
        'Liên tục': Infinity
      };

      const durationDays = durationMap[medicine.duration] || Infinity;
      
      if (durationDays !== Infinity) {
        // Tính ngày kết thúc (bao gồm cả ngày bắt đầu và ngày cuối cùng)
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + durationDays - 1); // Trừ 1 vì đã tính cả ngày bắt đầu
        
        // Nếu ngày được chọn sau ngày kết thúc, không hiển thị
        if (selectedTimestamp > endDate.getTime()) {
          return false;
        }
      }
    }
    
    // Kiểm tra tần suất (frequency)
    if (medicine.frequency) {
      // Nếu trùng ngày bắt đầu, luôn hiển thị
      if (selectedTimestamp === startTimestamp) {
        return true;
      }
      
      // Tính khoảng cách ngày từ ngày bắt đầu đến ngày được chọn
      const diffTime = Math.abs(selectedTimestamp - startTimestamp);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      switch (medicine.frequency) {
        case 'Daily':
        case 'Hằng ngày':
          // Hiển thị mỗi ngày
          return true;
          
        case 'Every 2 days':
        case 'Cách 2 ngày':
          // Hiển thị ngày đầu tiên và mỗi 2 ngày sau đó
          return diffDays % 2 === 0;
          
        case 'Every 3 days':
        case 'Cách 3 ngày':
          // Hiển thị ngày đầu tiên và mỗi 3 ngày sau đó
          return diffDays % 3 === 0;
          
        case 'Weekly':
        case 'Hàng tuần':
          // Hiển thị ngày đầu tiên và mỗi 7 ngày sau đó
          return diffDays % 7 === 0;
          
        case 'Biweekly':
        case 'Hai tuần một lần':
          // Hiển thị ngày đầu tiên và mỗi 14 ngày sau đó
          return diffDays % 14 === 0;
          
        case 'Monthly':
        case 'Hàng tháng':
          // Kiểm tra nếu là cùng ngày trong tháng
          return selectedDateDay === startDateDay;
          
        default:
          // Nếu không có hoặc không nhận dạng được tần suất, hiển thị mỗi ngày
          return true;
      }
    }

    return true;
  };
  
  // Kiểm tra lý do không hiển thị thuốc
  const getTreatmentStatusReason = (): string => {
    if (!medicine || !medicine.startDate) {
      return '';
    }

    // Chuẩn hóa chuỗi ngày bắt đầu
    const startDateParts = medicine.startDate.split('-');
    if (startDateParts.length !== 3) {
      return '';
    }
    
    const startDateYear = parseInt(startDateParts[0]);
    const startDateMonth = parseInt(startDateParts[1]) - 1;
    const startDateDay = parseInt(startDateParts[2]);
    const startDate = new Date(startDateYear, startDateMonth, startDateDay, 12, 0, 0, 0);

    // Chuẩn hóa chuỗi ngày được chọn
    const selectedDateParts = selectedDate.split('-');
    if (selectedDateParts.length !== 3) {
      return '';
    }
    
    const selectedDateYear = parseInt(selectedDateParts[0]);
    const selectedDateMonth = parseInt(selectedDateParts[1]) - 1;
    const selectedDateDay = parseInt(selectedDateParts[2]);
    const selectedDateTime = new Date(selectedDateYear, selectedDateMonth, selectedDateDay, 12, 0, 0, 0);

    const startTimestamp = startDate.getTime();
    const selectedTimestamp = selectedDateTime.getTime();

    // Nếu ngày được chọn trùng với ngày bắt đầu, hiển thị thuốc
    if (selectedTimestamp === startTimestamp) {
      return '';
    }

    // Nếu ngày được chọn trước ngày bắt đầu
    if (selectedTimestamp < startTimestamp) {
      return language === 'vi' 
        ? `Lịch điều trị của thuốc này bắt đầu vào ${medicine.startDate}` 
        : `Treatment for this medicine starts on ${medicine.startDate}`;
    }

    // Kiểm tra dựa trên thời gian điều trị
    if (medicine.duration) {
      const durationMap: { [key: string]: number } = {
        '1 Ngày': 1,
        'One Day': 1,
        '1 Week': 7,
        '1 Tuần': 7,
        '2 Weeks': 14,
        '2 Tuần': 14,
        '1 Month': 30,
        '1 Tháng': 30,
        '3 Months': 90,
        '3 Tháng': 90,
        '6 Months': 180,
        '6 Tháng': 180,
        '1 Year': 365,
        '1 Năm': 365,
        'Ongoing': Infinity,
        'Liên tục': Infinity
      };

      const durationDays = durationMap[medicine.duration] || Infinity;
      
      if (durationDays !== Infinity) {
        // Tính ngày kết thúc
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + durationDays - 1);
        
        // Nếu ngày được chọn sau ngày kết thúc
        if (selectedTimestamp > endDate.getTime()) {
          return language === 'vi'
            ? `Thuốc này đã kết thúc điều trị vào ${endDate.toISOString().split('T')[0]}`
            : `Treatment for this medicine ended on ${endDate.toISOString().split('T')[0]}`;
        }
      }
    }

    // Kiểm tra tần suất sử dụng thuốc
    if (medicine.frequency) {
      // Tính số ngày giữa ngày bắt đầu và ngày được chọn
      const diffTime = Math.abs(selectedTimestamp - startTimestamp);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      switch (medicine.frequency) {
        case 'Daily':
        case 'Hằng ngày':
          // Hiển thị mỗi ngày, không cần thông báo
          return '';
          
        case 'Every 2 days':
        case 'Cách 2 ngày':
          if (diffDays % 2 !== 0) {
            return language === 'vi'
              ? 'Không cần uống thuốc này hôm nay. Lần uống kế tiếp là ngày mai.'
              : 'No dose today. Next dose is tomorrow.';
          }
          return '';
          
        case 'Every 3 days':
        case 'Cách 3 ngày':
          if (diffDays % 3 !== 0) {
            const nextDoseIn = 3 - (diffDays % 3);
            return language === 'vi'
              ? `Không cần uống thuốc này hôm nay. Lần uống kế tiếp là sau ${nextDoseIn} ngày.`
              : `No dose today. Next dose is in ${nextDoseIn} days.`;
          }
          return '';
          
        case 'Weekly':
        case 'Hàng tuần':
          if (diffDays % 7 !== 0) {
            const nextDoseIn = 7 - (diffDays % 7);
            return language === 'vi'
              ? `Không cần uống thuốc này hôm nay. Lần uống kế tiếp là sau ${nextDoseIn} ngày.`
              : `No dose today. Next dose is in ${nextDoseIn} days.`;
          }
          return '';
          
        case 'Biweekly':
        case 'Hai tuần một lần':
          if (diffDays % 14 !== 0) {
            const nextDoseIn = 14 - (diffDays % 14);
            return language === 'vi'
              ? `Không cần uống thuốc này hôm nay. Lần uống kế tiếp là sau ${nextDoseIn} ngày.`
              : `No dose today. Next dose is in ${nextDoseIn} days.`;
          }
          return '';
          
        case 'Monthly':
        case 'Hàng tháng':
          if (selectedDateDay !== startDateDay) {
            // Tính số ngày đến lần uống kế tiếp
            const nextMonth = new Date(selectedDateTime);
            
            // Nếu ngày hiện tại lớn hơn ngày uống thuốc, chuyển đến tháng tiếp theo
            if (selectedDateDay > startDateDay) {
              nextMonth.setMonth(nextMonth.getMonth() + 1);
            }
            
            // Đặt ngày trong tháng là ngày uống thuốc
            nextMonth.setDate(startDateDay);
            
            // Đảm bảo ngày hợp lệ (nếu tháng không có ngày đó)
            if (nextMonth.getDate() !== startDateDay) {
              // Nếu tháng không có ngày đó, chuyển về ngày cuối cùng của tháng trước
              nextMonth.setDate(0);
            }
            
            // Tính số ngày còn lại
            const daysUntilNextDose = Math.ceil((nextMonth.getTime() - selectedTimestamp) / (1000 * 60 * 60 * 24));
            
            return language === 'vi'
              ? `Không cần uống thuốc này hôm nay. Lần uống kế tiếp là sau ${daysUntilNextDose} ngày.`
              : `No dose today. Next dose is in ${daysUntilNextDose} days.`;
          }
          return '';
          
        default:
          return '';
      }
    }

    return '';
  };
  
  // Tính ngày uống thuốc tiếp theo dựa trên ngày bắt đầu, ngày hiện tại và tần suất
  const getNextDoseDate = (startDate: Date, currentDate: Date, frequency: string): Date => {
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const nextDoseDate = new Date(currentDate);
    
    switch (frequency) {
      case 'Every 2 days':
      case 'Cách 2 ngày':
        nextDoseDate.setDate(currentDate.getDate() + (diffDays % 2 === 0 ? 2 : 1));
        break;
        
      case 'Every 3 days':
      case 'Cách 3 ngày':
        nextDoseDate.setDate(currentDate.getDate() + (3 - (diffDays % 3)));
        break;
        
      case 'Weekly':
      case 'Hàng tuần':
        nextDoseDate.setDate(currentDate.getDate() + (7 - (diffDays % 7)));
        break;
        
      case 'Biweekly':
      case 'Hai tuần một lần':
        nextDoseDate.setDate(currentDate.getDate() + (14 - (diffDays % 14)));
        break;
        
      case 'Monthly':
      case 'Hàng tháng':
        // Đi tới tháng tiếp theo, giữ ngày giống với ngày bắt đầu
        nextDoseDate.setMonth(currentDate.getMonth() + 1);
        nextDoseDate.setDate(startDate.getDate());
        // Kiểm tra nếu ngày vượt quá số ngày trong tháng
        if (nextDoseDate.getDate() !== startDate.getDate()) {
          nextDoseDate.setDate(0); // Quay lại ngày cuối cùng của tháng trước
        }
        break;
        
      default:
        nextDoseDate.setDate(currentDate.getDate() + 1);
    }
    
    return nextDoseDate;
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
          
          {/* Treatment Status */}
          {!shouldShowMedicine(medicine) && medicine.startDate && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-700 mb-2">
                {language === 'vi' ? 'Trạng thái điều trị' : 'Treatment Status'}
              </h3>
              <p className="text-blue-700">
                {getTreatmentStatusReason()}
              </p>
              {medicine.duration && medicine.startDate && (
                <div className="mt-2 p-2 bg-white rounded-lg">
                  <p className="text-gray-700 font-medium">
                    {language === 'vi' ? 'Thời gian điều trị:' : 'Treatment period:'}
                  </p>
                  <p className="text-gray-600">
                    {(() => {
                      const startDate = new Date(medicine.startDate);
                      startDate.setHours(0, 0, 0, 0);
                      
                      const durationMap: { [key: string]: number } = {
                        '1 Ngày': 1,
                        'One Day': 1,
                        '1 Week': 7,
                        '1 Tuần': 7,
                        '2 Weeks': 14,
                        '2 Tuần': 14,
                        '1 Month': 30,
                        '1 Tháng': 30,
                        '3 Months': 90,
                        '3 Tháng': 90,
                        '6 Months': 180,
                        '6 Tháng': 180,
                        '1 Year': 365,
                        '1 Năm': 365,
                        'Ongoing': Infinity,
                        'Liên tục': Infinity
                      };
                      
                      const durationDays = durationMap[medicine.duration] || Infinity;
                      
                      if (durationDays !== Infinity) {
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + durationDays - 1); // Trừ 1 vì đã tính cả ngày bắt đầu
                        
                        return `${startDate.toLocaleDateString()} → ${endDate.toLocaleDateString()} (${medicine.duration})`;
                      }
                      
                      return `${startDate.toLocaleDateString()} → ${language === 'vi' ? 'Không giới hạn' : 'Unlimited'}`;
                    })()}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Schedule Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">
              {language === 'vi' ? 'Thông tin lịch điều trị' : 'Treatment Schedule'}
            </h3>
            {shouldShowMedicine(medicine) ? (
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm">
                          {language === 'vi' ? 'Ngày bắt đầu' : 'Start Date'}
                        </p>
                        <p className="font-medium">
                          {medicine.startDate || (language === 'vi' ? 'Không xác định' : 'Not specified')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">
                          {language === 'vi' ? 'Thời gian' : 'Duration'}
                        </p>
                        <p className="font-medium">
                          {medicine.duration || (language === 'vi' ? 'Không xác định' : 'Not specified')}
                          {medicine.duration && medicine.startDate && (
                            <>
                              {" "}
                              <span className="text-sm text-gray-500">
                                {(() => {
                                  const startDate = new Date(medicine.startDate);
                                  startDate.setHours(0, 0, 0, 0);
                                  
                                  const durationMap: { [key: string]: number } = {
                                    '1 Ngày': 1,
                                    'One Day': 1,
                                    '1 Week': 7,
                                    '1 Tuần': 7,
                                    '2 Weeks': 14,
                                    '2 Tuần': 14,
                                    '1 Month': 30,
                                    '1 Tháng': 30,
                                    '3 Months': 90,
                                    '3 Tháng': 90,
                                    '6 Months': 180,
                                    '6 Tháng': 180,
                                    '1 Year': 365,
                                    '1 Năm': 365,
                                    'Ongoing': Infinity,
                                    'Liên tục': Infinity
                                  };
                                  
                                  const durationDays = durationMap[medicine.duration] || Infinity;
                                  
                                  if (durationDays !== Infinity) {
                                    const endDate = new Date(startDate);
                                    endDate.setDate(startDate.getDate() + durationDays);
                                    
                                    return `(${language === 'vi' ? 'đến' : 'until'} ${endDate.toLocaleDateString()})`;
                                  }
                                  
                                  return '';
                                })()}
                              </span>
                            </>
                          )}
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
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-700">
                  {getTreatmentStatusReason() || 
                    (language === 'vi' 
                      ? 'Lịch điều trị không được hiển thị cho ngày đã chọn.' 
                      : 'Treatment schedule is not available for the selected date.')
                  }
                </p>
              </div>
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
                  {language === 'vi' ? 'Loại thuốc' : 'Medicine Type'}
                </p>
                <p className="font-medium">
                  {medicine.type === 'medicine' ? 
                    (language === 'vi' ? 'Thuốc' : 'Medicine') : 
                    medicine.type === 'tablet' ?
                      (language === 'vi' ? 'Viên nén' : 'Tablet') :
                      medicine.type === 'injection' ?
                        (language === 'vi' ? 'Tiêm' : 'Injection') :
                        (language === 'vi' ? 'Khác' : 'Other')}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">
                  {language === 'vi' ? 'Ngày cập nhật' : 'Last Updated'}
                </p>
                <p className="font-medium">
                  {new Date().toLocaleDateString()}
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

