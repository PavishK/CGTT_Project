import React, { useEffect, useState } from 'react'
import {
  UserPen,
  KeyRound,
  UserCog,
  XSquareIcon,
  AlertTriangle,
  KeyRoundIcon,
  LockKeyhole
} from 'lucide-react';
import axios from 'axios';
import { getUserData, removeUserData } from '../service/StorageService.jsx';
import {toast} from 'react-hot-toast';
import Loader from '../Loader.jsx';
import {useNavigate} from 'react-router-dom';
import OTPComponent from '../authPages/OTPComponent.jsx';
import { getOTPLimit, setOTPLimit, removeOTPLimit } from '../service/StorageService.jsx';
import ChangePassword from '../authPages/ChangePassword.jsx';

function Profile() {

  const navigate=useNavigate(null);
  const [userData,setUserData]=useState({});
  const [profileData, setProfileData] = useState({
  _id: '',
  name: '',
  email: '',
  passLength: '',
  full_name: '',
  created_at: ''
});
  const [fullName,setFullName]=useState("");
  const [makeLoading,setMakeLoading]=useState(false);
  const [confirmPopup,setConfirmPopup]=useState(false);
  const [verificationPopup,setVerificationPopup]=useState(false);
  const [passwordCheck,setPasswordCheck]=useState('');
  const [visibility,setVisibility]=useState(false);

  const [changePasswordPopup,setChangePasswordPopup]=useState(false);
  const [Otp,setOtp]=useState(0);
  const [showCpPopup,setShowCpPopup]=useState(false);

  const [errorMessage,setErrorMessage]=useState(false);
  const [userConfirmation,setUserConfirmation]=useState('');

  const apiUrl=import.meta.env.VITE_SERVER_API;
  const otpKey=import.meta.env.VITE_XOR_OTP_KEY;

  useEffect(()=>{
    const fetchProfileData=async()=>{
      setMakeLoading(true);
      try {
        const res=await axios.post(apiUrl+'/api/profile/get-user-profile-data',{_id:getUserData()._id});
        setProfileData(res.data.data);
        setFullName(res?.data?.data?.full_name==null?"":"");
      } catch (error) {
        toast.error("Session expired.");
        navigate('/');
      } finally {
        setMakeLoading(false);
      }

    }
    setUserData(getUserData());
    fetchProfileData();
  },[apiUrl]);

  const updateUserProfile=async()=>{
    setMakeLoading(true);
    try {
      await axios.put(`${apiUrl}/api/profile/update-user-profile-data/${userData._id}`,{full_name:fullName});
      setProfileData({...profileData,full_name:fullName});
      toast.success("User profile updated.");
    } catch (error) {
      toast.error('Unable to update.')
    } finally {
      setMakeLoading(false);
    }
  }

  const ConfirmPopupClicked=()=>{
    setVerificationPopup(true);
  }

  const verifyPassword=async()=>{

    if(passwordCheck===''){
      toast.error("Fill the password field.")
    }
    else{
      setMakeLoading(true);
      try {
        await axios.post(apiUrl+"/api/profile/check-password-valid",{...userData,password:passwordCheck});
        toast.success("Valid password.");
        setConfirmPopup(true);
        setVerificationPopup(false);
      } catch (error) {
        toast.error("Invalid password.");
      } finally {
        setMakeLoading(false);
      }
    }
  }

  const DeleteUserData=async()=>{

    if(userConfirmation.toLowerCase()==='')
      setErrorMessage(true);
    else if(userConfirmation.toLowerCase()!=="delete "+profileData.name)
      setErrorMessage(true);

    else{
      setErrorMessage(false);
      setMakeLoading(true);
      try {
        await axios.post(`${apiUrl}/api/profile/delete-user-data`,userData);
        toast.success("Account deleted successfully.");
        removeUserData();
        setTimeout(()=>window.location.reload(),1000);
        navigate('/');
        setConfirmPopup(false);
      } catch (error) {
        toast.error("Unable to delete your account.");
      } finally {
        setMakeLoading(false);
      }
    }
  }

  const generateOTP=async()=>{
    setMakeLoading(true);
    try {
      const res=await axios.post(apiUrl+'/api/profile/change-password-otp',userData);
      toast.success("OTP has been sent successfully.");
      setOtp(window.atob(res.data.otp));
      setChangePasswordPopup(true);
    } catch (error) {
      toast.error("Unable to send OTP.");
    } finally {
      setMakeLoading(false);
    }
  }

const ShowPopup = () => {
    const resendInfo = getOTPLimit() || {};
    const MAX_RESEND_COUNT = 4;
    const COOLDOWN_PERIOD = 8 * 60 * 60 * 1000;
    const now = Date.now();
    const isCooldownOver = now - (resendInfo.time || 0) >= COOLDOWN_PERIOD;

    if (resendInfo.count >= MAX_RESEND_COUNT && isCooldownOver) {
      setOTPLimit({ count: 0, time: now });
    }

    const updatedResendInfo = getOTPLimit() || {};
    if (updatedResendInfo.count >= MAX_RESEND_COUNT) {
      toast.error("You've reached the resend limit. Try again after 8 hrs.");
      return;
    }

    setOTPLimit({
      count: (updatedResendInfo.count || 0) + 1,
      time: updatedResendInfo.time || now,
      attempts: updatedResendInfo.attempts || 0
    });

    generateOTP();
  };

  const OtpHandler = (OTP) => {
    const MAX_ATTEMPT = 3;
    const resendInfo = getOTPLimit() || {};
    const currentAttempts = resendInfo.attempts || 0;

    if (!/^[0-9]{6}$/.test(OTP)) {
      toast.error('Invalid OTP format. Please enter a 6-digit number.');
      return;
    }

    if (currentAttempts >= MAX_ATTEMPT) {
      toast.error('Maximum verification attempts reached. Try again tomorrow.');
      return;
    }

    //Compare OTP
    const isCorrectOTP = Number(OTP) === Number(Otp);

    if (isCorrectOTP) {
      toast.success('OTP Verified Successfully!');
      removeOTPLimit();
      setChangePasswordPopup(false);
      setShowCpPopup(true);
    } else {
      setOTPLimit({
        ...resendInfo,
        attempts: currentAttempts + 1
      });

      if (currentAttempts + 1 >= MAX_ATTEMPT) {
        toast.error('Maximum verification attempts reached. Try again tomorrow.');
      } else {
        toast.error('Incorrect OTP. Please try again.');
      }
    }
  };

  return (
  <>
  <div className='w-full h-full'> 
    
  <div className='flex items-start justify-normal flex-col gap-y-1  border-b pb-4'>
  <h1 className='text-2xl font-bold pb-2 gap-x-1 flex'>
  <UserPen size={28}/>User Profile Data
  </h1>
    <div className='w-full sm:grid sm:grid-cols-[repeat(auto-fit,minmax(500px,1fr))] overflow-x-hidden gap-y-4 sm:gap-x-6 pb-0.5 text-xl'>

    <div className='flex items-start justify-normal flex-col gap-y-1.5 p-2 w-full'>
      <label className='text-xl font-bold capitalize'>User ID</label>
      <input className='border p-1.5 rounded-lg w-full bg-gray-200' name='_id' value={profileData._id} disabled/>
    </div>

    <div className='flex items-start justify-normal flex-col gap-y-1.5 p-2 w-full'>
      <label className='text-xl font-bold capitalize'>User Name</label>
      <input className='border p-1.5 rounded-lg w-full bg-gray-200' name='name' value={profileData.name} disabled/>
    </div>

    <div className='flex items-start justify-normal flex-col gap-y-1.5 p-2 w-full'>
      <label className='text-xl font-bold capitalize'>Full Name</label>
      <input className='border p-1.5 rounded-lg w-full' name='full_name' value={fullName} onChange={(e)=>setFullName(e.target.value)}/>
    </div>

    <div className='flex items-start justify-normal flex-col gap-y-1.5 p-2 w-full'>
      <label className='text-xl font-bold capitalize'>Email ID</label>
      <input className='border p-1.5 rounded-lg w-full bg-gray-200' name="email" value={profileData.email} disabled/>
    </div>

    </div>

    <div className='flex items-center justify-center flex-col gap-y-1.5 p-2 w-full '>
      <button className='bg-black text-white capitalize text-xl p-2 sm:w-60 w-full rounded-lg font-bold cursor-pointer' onClick={updateUserProfile}>save</button>
    </div>
  </div>


  <div className='flex items-start justify-normal flex-col gap-y-1.5 mt-2 border-b pb-4'>
    <h1 className='text-2xl font-bold pb-1.5 flex items-center justify-normal gap-x-1'>
    <KeyRound size={28}/>Manage password</h1>
    
    <div className='flex items-center sm:justify-between sm:gap-x-10 flex-col sm:flex-row p-2 w-full'>

    <div className='flex items-start justify-normal flex-col gap-y-1.5 w-full'>
      <label className='text-xl font-bold capitalize'>Current Password</label>
      <input className='w-full border p-2 rounded-lg bg-gray-200 text-xl' name='current_password' value={profileData.passLength} disabled/>
    </div>

    <div className='flex items-start justify-normal flex-col gap-y-1.5 w-full'>
      <label className='text-xl font-bold capitalize invisible'>KIRA</label>
      <button className='bg-black text-xl w-full font-bold text-white p-2 rounded-lg cursor-pointer' onClick={ShowPopup}>Change Password</button>
    </div>
    </div>
  </div>

  <div className='flex items-start justify-normal flex-col gap-y-1.5 mt-2 border-b pb-4'>
    <h1 className='text-2xl font-bold pb-1.5 flex items-center justify-normal gap-x-1'>
    <UserCog size={28}/>Manage Account</h1>

    <div className='w-full mt-3 flex items-center justify-center'>
      <button className='bg-red-500 text-xl p-2 rounded-lg w-60 font-bold text-white cursor-pointer ' onClick={ConfirmPopupClicked}>Delete Account</button>
    </div>
  </div>

  <div className='mt-3 flex items-center justify-center text-sm'>
    <p>Account created at {new Date(profileData.created_at).toDateString()}.</p>
  </div>
  </div>
  
{verificationPopup && (
  <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center bg-black/70">
    <div className="relative w-[90%] max-w-sm bg-white p-5 rounded-lg shadow-lg border">
    
    <div className='flex items-start justify-between mb-3 pb-3 border-b'>
    <div className='flex items-start justify-normal gap-x-1 text-2xl font-bold text-blue-500'>
      <LockKeyhole size={28}/>
      <span>Enter Password</span>
    </div>
      <XSquareIcon
        className="text-red-500 cursor-pointer"
        size={28}
        onClick={() => setVerificationPopup(false)}
      />
    </div>
      <p className="text-lg font-semibold pb-3">
       Enter your account password.
      </p>
      <input className={`w-full border p-2.5 rounded-lg text-lg`} placeholder='Enter password' type={visibility?'text':'password'} name='password' value={passwordCheck} onChange={(e)=>setPasswordCheck(e.target.value)}/>
      <div className='flex gap-x-1 mt-0.5 p-0.5 text-gray-500'><input type='checkbox' className='scale-105' value={visibility} onChange={()=>setVisibility(!visibility)}/>Show password</div>
      <button className="mt-4 w-full font-bold bg-blue-500 text-white p-2 rounded-lg cursor-pointer" onClick={verifyPassword}>
        Next
      </button>
    </div>
  </div>
)}

{confirmPopup && (
  <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center bg-black/70">
    <div className="relative w-[90%] max-w-sm bg-white p-5 rounded-lg shadow-lg border">
    
    <div className='flex items-start justify-between mb-3 pb-3 border-b'>
    <div className='flex items-start justify-normal gap-x-1 text-2xl font-bold text-red-500'>
      <AlertTriangle size={28}/>
      <span>Delete Account</span>
    </div>
      <XSquareIcon
        className="text-red-500 cursor-pointer"
        size={28}
        onClick={() => setConfirmPopup(false)}
      />
    </div>
      <p className="text-lg font-semibold">
        Are you sure you want to delete your account permanently?
      </p>
      <p className='text-lg font-bold mt-1.5 mb-1.5'>
        Type "{"delete "+profileData.name}" to confirm your action.
      </p>
      <input className={`w-full border p-2.5 rounded-lg lowercase text-lg ${errorMessage?'border-red-500':'border-black'}`} placeholder='delete user name' value={userConfirmation ?? ""} onChange={(e)=>{setUserConfirmation(e.target.value); setErrorMessage(false);}}/>
      <span className={`text-lg mt-0.5 text-red-500 ${!errorMessage?'hidden':'block'}`}>Confirmation text incorrect. Try again.</span>
      <button className="mt-4 w-full font-bold bg-green-500 text-white p-2 rounded-lg cursor-pointer" onClick={DeleteUserData}>
        Confirm
      </button>
    </div>
  </div>
)}
  
  {changePasswordPopup && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
    <div className="relative w-[90%] max-w-sm bg-white p-6 rounded-xl shadow-2xl border-gray-200">
      <button
        onClick={() => setChangePasswordPopup(false)}
        className="absolute top-3 right-3 text-red-500 hover:text-red-600 cursor-pointer"
        aria-label="Close popup"
      >
        <XSquareIcon size={24} />
      </button>
      <OTPComponent onSubmit={OtpHandler} resend={()=>generateOTP()}/>
    </div>
  </div>
)}

 {showCpPopup && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
    <div className="relative w-[90%] max-w-sm bg-white p-6 rounded-xl shadow-2xl border border-gray-200">
      
      <div className="absolute w-[90%] top-3 flex items-start justify-between border-b pb-2">
        <div className="text-2xl font-bold flex items-center gap-x-0.5 text-blue-500">
          <KeyRoundIcon size={28} />
          <span className='line-clamp-1'>Change Password</span>
        </div>

        <button
          onClick={() => setShowCpPopup(false)}
          className="text-red-500 hover:text-red-600 cursor-pointer"
          aria-label="Close popup"
        >
          <XSquareIcon size={24} />
        </button>
      </div>

      <div className="mt-12"> {/* Give space below header */}
        <ChangePassword data={userData} close={()=>setShowCpPopup(false)}/>
      </div>
      
    </div>
  </div>
)}


  <Loader loading={makeLoading}/>
  </>
  )
}

export default Profile