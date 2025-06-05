import React, { useState, useEffect } from 'react'
import VerifyImage from '../assets/images/verify-certificate.svg';
import {
  SearchX,
  BadgeCheck,
  Download,
  Info,
  Search
} from 'lucide-react';
import {toast} from 'react-hot-toast';
import Loader from '../Loader.jsx';

function Verify() {
  const [certificateIDFlage,setCertificateIDFlage]=useState(true);
  const [ID,setID]=useState('');
  const [certificateData,setCertificateData]=useState({status:false});
  const [visibilityStatus,setVisibilityStatus]=useState(false);
  const [makeLoading,setMakeLoading]=useState(false);

  useEffect(()=>{

    const MakeLoading=()=>{
      setMakeLoading(true);
      setTimeout(()=>setMakeLoading(false),1000);
    }

    MakeLoading();

  },[certificateIDFlage]);

  const checkCertificate=()=>{
    if(ID.trim()==='')
      toast.error("Please provide certificate ID.");
    else{
      console.log(ID.trim());
    }
  }

  const onEmailIdVerifyClicked=()=>{
    toast("This feature is available soon.",{icon:<Info size={28} className='text-blue-500'/>})
  }
  return (
    <>
  <div className='flex items-start justify-normal flex-col w-full'>
  {certificateIDFlage ? (

    <div className='flex items-center justify-normal gap-x-2 sm:flex-row flex-col-reverse mt-10 p-2'>

      <div className='flex-1/2 mt-10 p-2'>
          <div className='flex items-start justify-normal flex-col gap-y-4'>
            <h3 className='font-bold flex items-center justify-normal gap-x-1'>
            <div className='w-3 h-3 bg-black rounded-full'></div>
            Unlock the power of proof</h3>
            <h1 className='text-5xl sm:text-6xl font-medium text-justify'><b>Ensure</b> authenticity <br></br>in just a few clicks</h1>
            <p className='mt-2'>Use our secure verification tool to confirm that a certificate issued by our institition is valid. Simple enter the <b>Certificate ID</b> or the <b>registered Email ID</b> to fetch 
            the certificate details instantly. This service is available to employers, institutions, and individuals who want to verify credentials with confidence.</p>
          </div>
          <div className='flex items-center justify-normal gap-x-4 mt-8'>
            <button className='bg-black p-3 rounded-lg text-white transition-transform ease-in-out hover:scale-105 hover:cursor-pointer' onClick={()=>setCertificateIDFlage(false)}>Verify Using Certificate ID</button>
            <button className='border-2 text-black border-black p-2.5  rounded-lg transition-transform ease-in-out hover:scale-105 hover:cursor-pointer' onClick={onEmailIdVerifyClicked}>Verify using Email ID</button>
          </div>
        </div>

        <div className='sm:w-xl w-fit'>
          <img src={VerifyImage} className='sm:w-full sm:h-full w-9/12 h-9/12 object-cover '/>
        </div>

    </div>
  ):(
    <div className='flex items-start justify-normal w-full p-2'>
      <div className='items-center justify-center flex w-full flex-col'>
      <div className='flex items-center justify-center flex-col gap-y-2'>
        <h1 className='text-4xl font-bold'>Certificate Verification</h1>
        <p className='text-center text-lg'>Please input the valid certificate identification number.</p>
      </div>
      <div className='w-full flex items-start justify-normal flex-col gap-y-1 bg-white mt-2'>
        <h2 className='font-bold text-lg'>Enter certificate ID</h2>
        <input className='w-full p-2.5 rounded-lg border text-xl' placeholder='TT-001-XXXX-XXXX' value={ID} name='ID' onChange={(e)=>setID(e.target.value)}/>
        <button className='w-full cursor-pointer mt-2 bg-black p-2.5 rounded-lg text-white text-xl font-bold' onClick={checkCertificate}>Check Certificate</button>
      </div>
      <hr className='w-full mt-6'/>

    {certificateData.status?(
      <div className='w-fit border rounded-lg mt-5'>
        <div className='flex items-start justify-normal w-full sm:gap-x-2 sm:flex-row flex-col gap-y-1.5 p-2'>
          <img src={VerifyImage} className='sm:w-96 sm:h-96 object-cover border-r'/>
        <div className='p-2 flex items-start justify-normal flex-col gap-y-3 w-full'>
        <h1 className='self-center text-2xl font-bold p-2'>Certificate Details</h1>

          <div className='flex items-start justify-normal text-xl gap-x-6 w-full'>
            <h2 className='font-bold'>Name : </h2>
            <span className='uppercase'>name</span>
          </div>

          <div className='flex items-start justify-normal text-xl gap-x-6 w-full'>
            <h2 className='font-bold'>Email : </h2>
            <span className=''>name</span>
          </div>

          <div className='flex items-start justify-normal text-xl gap-x-6 w-full'>
            <h2 className='font-bold'>Course Name : </h2>
            <span className='uppercase'>Python ecoidyegv</span>
          </div>

          <div className='flex items-start justify-normal text-xl gap-x-6 w-full'>
            <h2 className='font-bold'>Duration : </h2>
            <span className='uppercase'>12/07/2024-12/04/2025</span>
          </div>

          <div className='flex items-start justify-normal text-xl gap-x-6 w-full'>
            <h2 className='font-bold'>Certification ID : </h2>
            <span className='uppercase'>TT-0000-XXX-XXX</span>
          </div>

          <div className='flex items-start justify-normal text-xl gap-x-6 w-full'>
            <h2 className='font-bold'>Institute Name : </h2>
            <span className='capitalize bg-gradient-to-r from-blue-500 bg-clip-text text-transparent to-red-500 font-bold flex items-center justify-normal gap-x-1'>Training Trains <BadgeCheck className='text-green-500'/></span>
          </div>

          <hr className='w-full'/>
        <button className='self-center flex items-center justify-normal text-xl gap-x-1 bg-gray-200 p-3 cursor-pointer rounded-lg text-gray-800'><Download size={28}/>Download</button>
        </div>
        </div>
      </div>
    ):(

      <div>
      <div className={`text-xl text-red-500 flex items-center justify-center flex-col gap-y-0.5 font-bold mt-40 ${!visibilityStatus || certificateData.status?'hidden':'block'}`}>
       <SearchX size={36}/> No data available for the given ID.
      </div>

      <div className={`text-xl text-gray-600 flex items-center justify-center flex-col gap-y-0.5 font-bold mt-40 ${visibilityStatus?'hidden':'block'}`}>
       <Search size={36}/> Enter the certificate ID &<br/> Click 'Check Certificate'.
      </div>
      </div>


    )}

      </div>
    </div>
  )}

  </div>
  <Loader loading={makeLoading}/>
  </>

  )
}

export default Verify