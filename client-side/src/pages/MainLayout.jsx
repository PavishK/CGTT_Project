import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { getUserData, storeUserData } from '../service/StorageService';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loader from '../Loader.jsx';

function MainLayout() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', email: '' ,id:'',role:''});
  const apiUrl = import.meta.env.VITE_SERVER_API;
  const [makeLoading,setMakeLoading]=useState(false);

  useEffect(() => {
    const sessionCheck = async () => {
      setMakeLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/api/protect/session-check`, {
          withCredentials: true,
        });
        storeUserData(res.data.user_data);
        setUserData(getUserData());
        setMakeLoading(false);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Session expired');
        setMakeLoading(false);
        navigate('/user-login_register');
      }
    };
    sessionCheck();
  }, [apiUrl, navigate]);

  return (
    <>
      <div>
        <nav>
          <ul>
            <li>
              <NavLink to="/home">Home</NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <Outlet />
      <Loader loading={makeLoading}/>
    </>
  );
}

export default MainLayout;
