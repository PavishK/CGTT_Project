import React, { useState } from 'react';
import {toast} from 'react-hot-toast';
import Loader from '../Loader.jsx';
import axios from 'axios';


function ChangePassword({ data, close }) {

    const [newPassword,setNewPassword]=useState({newPassword:"",cNewPassword:""});
    const [makeLoading,setMakeLoading]=useState(false);
    const [visiblePassword,setVisiblePassword]=useState(false);

    const apiUrl=import.meta.env.VITE_SERVER_API;

    const onInputChange=(e)=>{
        setNewPassword({...newPassword,[e.target.name]:e.target.value});
    }

    const onSubmit=async(e)=>{
        e.preventDefault();
        const {_id,name,email}=data;

        if(newPassword.cNewPassword=="" || newPassword.newPassword==""){
            toast.error("Please fill the fields.")
        }

        else if(newPassword.newPassword!==newPassword.cNewPassword){
            toast.error("Password not matching.");
        }

        else if(newPassword.newPassword.length<5 || newPassword.newPassword.length>15){
            toast.error("Password length must be between 5 and 15");
        }

        else{

            setMakeLoading(true);
            try {
                await axios.put(`${apiUrl}/api/profile/change-user-password/${_id}`,{name,email,newPassword:newPassword.newPassword});
                toast.success("Password changed successfully.");
                close();
            } catch (error) {
                toast.error("Unable to change password.");
            } finally {
                setMakeLoading(false);
            }
        }
    }

  return (
    <div className='flex items-center justify-center flex-col gap-y-5'>
    <div className='flex items-start justify-normal flex-col gap-y-3 w-full'>
        <div className='flex items-start justify-normal flex-col gap-y-1.5 w-full'>
            <label className='text-xl font-bold'>New Password</label>
            <input type={visiblePassword?'text':'password'} name='newPassword' value={newPassword.newPassword} onChange={onInputChange} className='text-lg p-1 w-full border rounded-lg' required/>
        </div>

        <div className='flex items-start justify-normal flex-col gap-y-1.5 w-full'>
            <label className='text-xl font-bold'>Confirm Password</label>
            <input type={visiblePassword?'text':'password'} name='cNewPassword' value={newPassword.cNewPassword} onChange={onInputChange} className='text-lg p-1 w-full border rounded-lg' required/>
        </div>

        <div className='flex items-center text-gray-500 justify-normal gap-x-1 text-lg p-1 -mt-2'>
            <input type='checkbox' value={visiblePassword} onChange={()=>setVisiblePassword(!visiblePassword)} className='scale-110'/>
            Show password
        </div>
    </div>
    <button className='bg-blue-500 text-white text-xl p-2 w-40 rounded-lg font-bold' onClick={onSubmit}>Confirm</button>
    
    
    <Loader loading={makeLoading}/>
    </div>
  )
}

export default ChangePassword