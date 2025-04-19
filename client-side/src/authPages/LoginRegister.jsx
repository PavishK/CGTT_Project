import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../Loader';
import { storeUserData } from '../service/StorageService';

function LoginRegister() {
    const [loginData, setLoginData] = useState({ userID: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirm_password: '' });
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

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

    // Register 
    const onRegisterInputChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    }

    const registerDataHandler=async()=>{
        const userRegisterData={...registerData,...{turnstileToken:token}}
        setMakeLoading(true);
        try {
            const res=await axios.post(api+'/api/user/register',userRegisterData,{withCredentials:true});
            console.log(res);
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
            return;
        }

        if(!/^[a-zA-Z][a-zA-Z0-9_]{4,}$/.test(registerData.name)){
            MakeToast('error','Invalid name format!');
        }

        if(/^S+@\S.\S+$/.test(registerData.email)){
            MakeToast('error','Invalid email format!');
        }

        if (registerData.password.length < 8 || registerData.password.length > 15) {
            MakeToast('error','Password should be between 8 and 15 characters.');
        }

        if(registerData.password!=registerData.confirm_password){
            MakeToast('error','Invalid confirm password!');
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
                <div className='sm:w-input-text sm:ml-6 w-full p-2 sm:p-0 flex items-start justify-start flex-col gap-y-2'>
                    <h2 className='text-4xl sm:text-5xl font-medium'>Log in to your account</h2>
                    <p className='ml-0.5 text-base font-medium'>
                        Don't have an account? <span className='text-blue-700 underline cursor-pointer' onClick={formToggler}>Register</span>
                    </p>
                </div>
            ) : (
                <div className='sm:w-input w-full p-2 sm:p-0 flex items-start justify-start flex-col gap-y-2'>
                    <h2 className='text-4xl sm:text-5xl font-medium'>Create an account</h2>
                    <p className='ml-0.5 text-base font-medium'>
                        Already have an account? <span className='text-blue-700 underline cursor-pointer' onClick={formToggler}>Log in</span>
                    </p>
                </div>
            )}

            {toggleForm ? (
                <div className='w-full flex items-center justify-center flex-col gap-y-1.5 mt-3'>
                    <form onSubmit={onLoginFormSubmit} className='w-full p-2 flex items-center justify-center flex-col gap-y-4'>
                        <input className='w-full sm:w-input p-2 rounded-lg text-lg border-textlight border-2' type='text' name='userID' placeholder='Enter your name or email' value={loginData.userID} onChange={handleLoginInputChange} autoComplete='username' required />
                        <input className='w-full sm:w-input p-2 rounded-lg text-lg border-textlight border-2' type={showLoginPassword ? 'text' : 'password'} name='password' placeholder='Enter your password' value={loginData.password} onChange={handleLoginInputChange} autoComplete='current-password' required />
                        <div className='w-full sm:w-input flex items-center justify-between flex-row sm:text-lg'>
                            <p><input type='checkbox' checked={showLoginPassword} onChange={(e) => setShowLoginPassword(e.target.checked)} /> Show password</p>
                            <p className='text-gray-500 cursor-pointer hover:text-gray-400'>Forgot password?</p>
                        </div>

                        {/* Shared Turnstile Widget */}
                        <div ref={turnstileRef} className='w-full sm:w-input'></div>

                        <button
                            type="submit"
                            className="relative bg-bglight border-2 border-textlight p-2 w-full sm:w-input text-lg rounded-lg font-medium 
                            cursor-pointer transition-all duration-200 ease-in-out 
                            overflow-hidden shadow-2xl 
                            before:absolute before:left-0 before:h-48 before:w-input 
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
                        <input className='w-full sm:w-input p-2 rounded-lg text-lg border-textlight border-2' type='text' name='name' value={registerData.name} onChange={onRegisterInputChange} placeholder='Enter your name' required autoComplete='username' />
                        <input className='w-full sm:w-input p-2 rounded-lg text-lg border-textlight border-2' type='email' name='email' value={registerData.email} onChange={onRegisterInputChange} placeholder='Enter your email' required autoComplete='email' />
                        <input className='w-full sm:w-input p-2 rounded-lg text-lg border-textlight border-2' type={showRegisterPassword?'text':'password'} name='password' value={registerData.password} placeholder='Enter your password' onChange={onRegisterInputChange} required autoComplete='new-password' />
                        <input className='w-full sm:w-input p-2 rounded-lg text-lg border-textlight border-2' type={showRegisterPassword?'text':'password'}  name='confirm_password' value={registerData.confirm_password} placeholder='Confirm your password' onChange={onRegisterInputChange} required autoComplete='new-password' />
                        <div className='w-full sm:w-input flex items-center justify-between flex-row sm:text-lg'>
                            <p><input type='checkbox' checked={showRegisterPassword} onChange={(e)=>setShowRegisterPassword(e.target.checked)} /> Show password</p>
                        </div>

                        {/* Shared Turnstile Widget */}
                        <div ref={turnstileRef} className='w-full sm:w-input'></div>

                        <button
                            type="submit"
                            className="relative bg-bglight border-2 border-textlight p-2 w-full sm:w-input text-lg rounded-lg font-medium 
                            cursor-pointer transition-all duration-200 ease-in-out 
                            overflow-hidden shadow-2xl 
                            before:absolute before:left-0 before:h-48 before:w-input 
                            before:origin-top-right before:-translate-x-full before:translate-y-12 
                            before:-rotate-90 before:bg-gray-900 before:transition-all before:duration-300 
                            before:ease hover:text-white hover:before:-rotate-180"
                        >
                            <span className="relative z-10">Register</span>
                        </button>
                    </form>
                </div>
            )}

            <Loader loading={makeLoading}/>
        </>
    )
}

export default LoginRegister;
