import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../Loader';
import { storeUserData } from '../service/StorageService';
import {
    RotateCcw,
    XSquareIcon
} from 'lucide-react';

function LoginRegister() {
    const [loginData, setLoginData] = useState({ userID: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirm_password: '' });
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    const [FpPopup,setFpPopup]=useState(false);
    const [forgotInput,setForgotInput]=useState('');

    const [toggleForm, setToggleForm] = useState(true);
    const [makeLoading,setMakeLoading]=useState(false);
    const navigate=useNavigate(null);


    const turnstileRef = useRef(null);
    const widgetIdRef = useRef(null);
    const [token, setToken] = useState('');

    const api = import.meta.env.VITE_SERVER_API;

    //Make Toast
    const MakeToast=(status,message)=>{
        status==="success"?
            toast.success(message):
            toast.error(message)
    }

    // Login
    const handleLoginInputChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    }

    const loginDataHandler = async () => {
        setMakeLoading(true);
        const data = { name: loginData.userID, email: loginData.userID, password: loginData.password,turnstileToken :token }

        try {
            const res = await axios.post(api + "/api/user/login", data, { withCredentials: true });
            //console.log(res);
            setMakeLoading(false);
            MakeToast('success','Login successful!');
            storeUserData(res.data.user_data);
            navigate(res.data.path);
        } catch (error) {
            setMakeLoading(false);
            MakeToast('error',error.response.data.message);
        }
    }

    const onLoginFormSubmit = (e) => {
        e.preventDefault();
        setMakeLoading(true);
        if (loginData.userID === "" || loginData.password === "") {
            MakeToast('error','Please fill in all the fields.');
        }

        if (loginData.password.length < 8 || loginData.password.length > 15) {
            MakeToast('error','Password should be between 8 and 15 characters.');
        }

        if (!token) {
            MakeToast('error','Please verify you are human.');
        }
        setMakeLoading(false);
        loginDataHandler();
    }

    //Forgot password
    const onForgotPassClicked=()=>{
        setFpPopup(true);
    }

    const handleForgotPassword = async () => {
    if (!forgotInput.trim()) {
        toast.error("Please enter your User ID or Email");
        return;
    }

    else{
        setMakeLoading(true);
        try {
            await axios.post(api+'/api/user/reset-user-password',{ID:forgotInput});
            setForgotInput('');
            toast.success("Password reset email sent.");
            setFpPopup(false);
            setMakeLoading(false);
        } catch (err) {
            toast.error(err.response.data.message);
            setMakeLoading(false);
        }
    }

};

        // Register 
        const onRegisterInputChange = (e) => {
            setRegisterData({ ...registerData, [e.target.name]: e.target.value });
        }

        const registerDataHandler=async()=>{
            const userRegisterData={...registerData,...{turnstileToken:token}}
            setMakeLoading(true);
            try {
                const res=await axios.post(api+'/api/user/register',userRegisterData,{withCredentials:true});
                setMakeLoading(false);
                MakeToast('success','Registered successfully!');
                storeUserData(res.data.user_data);
                navigate(res.data.path);
            } catch (error) {
                setMakeLoading(false);
                MakeToast('error',error.response.data.message);
            }
        }


    const onRegisterFormSubmit = (e) => {
        e.preventDefault();
        setMakeLoading(true);

        if(registerData.name=="" || registerData.email=="" || registerData.password=="" ||registerData.confirm_password==""){
            MakeToast('error','Please fill in all the fields.');
            setMakeLoading(false);
            return;
        }

        if(!/^[a-zA-Z][a-zA-Z0-9_]{4,}$/.test(registerData.name)){
            MakeToast('error','Invalid name format!');
            setMakeLoading(false);
            return;
        }

        if(/^S+@\S.\S+$/.test(registerData.email)){
            MakeToast('error','Invalid email format!');
            setMakeLoading(false);
            return;
        }

        if (registerData.password.length < 8 || registerData.password.length > 15) {
            MakeToast('error','Password should be between 8 and 15 characters.');
            setMakeLoading(false);
            return;
        }

        if(registerData.password!=registerData.confirm_password){
            MakeToast('error','Invalid confirm password!');
            setMakeLoading(false);
            return;
        }

        setMakeLoading(false);
        registerDataHandler();
    }

    // Toggle Form
    const formToggler = () => {
        setToggleForm(!toggleForm);
    }

    // Cloudflare Turnstile - render based on form toggle
    useEffect(() => {
        if (window.turnstile && turnstileRef.current) {
            if (widgetIdRef.current !== null) {
                window.turnstile.remove(widgetIdRef.current);
            }

            widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
                sitekey: import.meta.env.VITE_SITE_KEY,
                callback: (token) => setToken(token),
            });
        }
    }, [toggleForm]);

    return (
        <>
            {toggleForm ? (
                <div className='sm:w-[500px] sm:ml-6 w-full p-2 sm:p-0 flex items-start justify-start flex-col gap-y-2'>
                    <h2 className='text-4xl sm:text-5xl font-medium'>Log in to your account</h2>
                    <p className='ml-0.5 text-base font-medium'>
                        Don't have an account? <span className='text-blue-700 underline cursor-pointer' onClick={formToggler}>Register</span>
                    </p>
                </div>
            ) : (
                <div className='sm:w-[470px] w-full p-2 sm:p-0 flex items-start justify-start flex-col gap-y-2'>
                    <h2 className='text-4xl sm:text-5xl font-medium'>Create an account</h2>
                    <p className='ml-0.5 text-base font-medium'>
                        Already have an account? <span className='text-blue-700 underline cursor-pointer' onClick={formToggler}>Log in</span>
                    </p>
                </div>
            )}

            {toggleForm ? (
                <div className='w-full flex items-center justify-center flex-col gap-y-1.5 mt-3'>
                    <form onSubmit={onLoginFormSubmit} className='w-full p-2 flex items-center justify-center flex-col gap-y-4'>
                        <input className='w-full sm:w-[470px] p-2 rounded-lg text-lg border-textlight border-2' type='text' name='userID' placeholder='Enter your name or email' value={loginData.userID} onChange={handleLoginInputChange} id='username' autoComplete='username' required />
                        <input className='w-full sm:w-[470px] p-2 rounded-lg text-lg border-textlight border-2' type={showLoginPassword ? 'text' : 'password'} name='password' placeholder='Enter your password' value={loginData.password} onChange={handleLoginInputChange}  id='password' autoComplete='current-password' required />
                        <div className='w-full sm:w-[470px] flex items-center justify-between flex-row sm:text-lg'>
                            <p><input type='checkbox' checked={showLoginPassword} onChange={(e) => setShowLoginPassword(e.target.checked)} /> Show password</p>
                            <p className='text-gray-500 cursor-pointer hover:text-gray-400' onClick={onForgotPassClicked}>Forgot password?</p>
                        </div>

                        {/* Shared Turnstile Widget */}
                        <div ref={turnstileRef} className='w-full sm:w-[470px]'></div>

                        <button
                            type="submit"
                            className="relative bg-bglight border-2 border-textlight p-2 w-full sm:w-[470px] text-lg rounded-lg font-medium 
                            cursor-pointer transition-all duration-200 ease-in-out 
                            overflow-hidden shadow-2xl 
                            before:absolute before:left-0 before:h-48 before:w-[470px] 
                            before:origin-top-right before:-translate-x-full before:translate-y-12 
                            before:-rotate-90 before:bg-gray-900 before:transition-all before:duration-300 
                            before:ease hover:text-white hover:before:-rotate-180"
                        >
                            <span className="relative z-10">Login</span>
                        </button>
                    </form>
                </div>
            ) : (
                <div className='w-full flex items-center justify-center flex-col gap-y-1.5 mt-3'>
                    <form onSubmit={onRegisterFormSubmit} className='w-full p-2 flex items-center justify-center flex-col gap-y-4'>
                        <input className='w-full sm:w-[470px] p-2 rounded-lg text-lg border-textlight border-2' type='text' name='name' value={registerData.name} onChange={onRegisterInputChange} placeholder='Enter your name' required autoComplete='username' />
                        <input className='w-full sm:w-[470px] p-2 rounded-lg text-lg border-textlight border-2' type='email' name='email' value={registerData.email} onChange={onRegisterInputChange} placeholder='Enter your email' required autoComplete='email' />
                        <input className='w-full sm:w-[470px] p-2 rounded-lg text-lg border-textlight border-2' type={showRegisterPassword?'text':'password'} name='password' value={registerData.password} placeholder='Enter your password' onChange={onRegisterInputChange} required autoComplete='new-password' />
                        <input className='w-full sm:w-[470px] p-2 rounded-lg text-lg border-textlight border-2' type={showRegisterPassword?'text':'password'}  name='confirm_password' value={registerData.confirm_password} placeholder='Confirm your password' onChange={onRegisterInputChange} required autoComplete='new-password' />
                        <div className='w-full sm:w-[470px] flex items-center justify-between flex-row sm:text-lg'>
                            <p><input type='checkbox' checked={showRegisterPassword} onChange={(e)=>setShowRegisterPassword(e.target.checked)} /> Show password</p>
                        </div>

                        {/* Shared Turnstile Widget */}
                        <div ref={turnstileRef} className='w-full sm:w-[470px]'></div>

                        <button
                            type="submit"
                            className="relative bg-bglight border-2 border-textlight p-2 w-full sm:w-[470px] text-lg rounded-lg font-medium 
                            cursor-pointer transition-all duration-200 ease-in-out 
                            overflow-hidden shadow-2xl 
                            before:absolute before:left-0 before:h-48 before:w-[470px] 
                            before:origin-top-right before:-translate-x-full before:translate-y-12 
                            before:-rotate-90 before:bg-gray-900 before:transition-all before:duration-300 
                            before:ease hover:text-white hover:before:-rotate-180"
                        >
                            <span className="relative z-10">Register</span>
                        </button>
                    </form>
                </div>
            )}

    {FpPopup && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
    <div className="w-[90%] max-w-md bg-white border rounded-lg p-5 shadow-lg relative mt-32">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-x-2 text-xl font-bold text-blue-500">
          <RotateCcw size={25} />
          <h1>Forgot Password</h1>
        </div>
        <XSquareIcon
          className="text-red-500 cursor-pointer"
          size={28}
          onClick={() => setFpPopup(false)}
        />
      </div>
      <p className="font-semibold mb-3 text-left text-lg">
        Enter your <span className="text-blue-500">User ID</span> or <span className="text-blue-500">Email</span> to reset your password.
      </p>

      <input
        type="text"
        value={forgotInput}
        onChange={(e) => setForgotInput(e.target.value)}
        placeholder="User ID or Email"
        className="w-full p-2 border rounded-lg text-lg"
      />

      <button
        onClick={handleForgotPassword}
        className="mt-4 w-full font-bold bg-blue-500 text-white p-2 rounded-lg cursor-pointer hover:bg-blue-600"
      >
        Send Reset Password
      </button>
    </div>
  </div>
)}


            <Loader loading={makeLoading}/>
        </>
    )
}

export default LoginRegister;
