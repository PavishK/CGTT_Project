import React, { useEffect, useState, lazy, Suspense } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../service/StorageService.jsx';
import Loader from '../Loader.jsx';
const PieChartReport=lazy(()=>import('./PieChartReport.jsx'));

function Dashboard() {
  const navigate = useNavigate();
  const [dataCount, setDataCount] = useState({});
  const [userData, setUserData] = useState({});
  const [makeLoading, setMakeLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_SERVER_API;

  useEffect(() => {
    const user = getUserData();
    setUserData(user);

    const fetchCount = async () => {
      setMakeLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/api/admin/get-datas-count/${user._id}/${user.email}`);
        setDataCount(res.data.data);
      } catch (error) {
        toast.error("Session expired.");
        navigate('/');
      } finally {
        setMakeLoading(false);
      }
    };

    fetchCount();
  }, [apiUrl]);

  // Data for Pie Chart
  const pieData = [
    { name: 'Users', value: dataCount.users || 0 },
    { name: 'Courses', value: dataCount.courses || 0 },
    { name: 'Certificates', value: dataCount.certificates || 0 },
    { name: 'Enrollments', value: dataCount.enrollments || 0 },
  ];

  return (
    <div className='flex items-start justify-normal flex-col px-1 w-full'>
      {/* Metric Cards */}
      <div className='flex items-center sm:justify-between justify-center w-full sm:flex-row sm:gap-3 flex-col gap-y-3 mt-2'>
        
        <div className='w-full h-32 rounded-lg bg-blue-500 flex items-center justify-center'>
          <div className='flex items-center justify-center flex-col gap-y-2.5 text-2xl font-bold text-white'>
            <h1>USERS</h1>
            <span>{dataCount.users}</span>
          </div>
        </div>

        <div className='w-full h-32 rounded-lg bg-green-500 flex items-center justify-center'>
          <div className='flex items-center justify-center flex-col gap-y-2.5 text-2xl font-bold text-white'>
            <h1>COURSES</h1>
            <span>{dataCount.courses}</span>
          </div>
        </div>

        <div className='w-full h-32 rounded-lg bg-yellow-400 flex items-center justify-center'>
          <div className='flex items-center justify-center flex-col gap-y-2.5 text-2xl font-bold text-white'>
            <h1>CERTIFICATES</h1>
            <span>{dataCount.certificates}</span>
          </div>
        </div>

        <div className='w-full h-32 rounded-lg bg-orange-400 flex items-center justify-center'>
          <div className='flex items-center justify-center flex-col gap-y-2.5 text-2xl font-bold text-white'>
            <h1>ENROLLMENTS</h1>
            <span>{dataCount.enrollments}</span>
          </div>
        </div>
      </div>

      {/* Pie Chart Section */}
      <Suspense fallback={`<div>Loading...</div>`}>
        <PieChartReport pieData={pieData}/>
      </Suspense>

      <Loader loading={makeLoading} />
    </div>
  );
}

export default Dashboard;
