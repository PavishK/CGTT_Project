import React from 'react';
import {
  ArrowLeft
} from 'lucide-react';

function SelectedTask({data,close}) {

  return (
    <div className='w-full'>
      <div className='w-full p-2 mt-3'>
        <div className='border rounded-lg w-full h-fit flex items-start justify-normal flex-col'>
        <div className='leading-6 p-2 flex items-start justify-normal flex-col'>
        <div className='flex items-center justify-normal gap-x-0.5 pb-2 hover:underline cursor-pointer' onClick={close}>
          <ArrowLeft/>
          <h2>Back to tasks</h2>
        </div>
          <h1 className='text-2xl font-semibold capitalize'>{data.title}</h1>
          <p>{new Date(data.created_at).toDateString()}</p>
        </div>
        <hr className='w-full'/>
        <div className='flex items-start justify-normal flex-col w-full'>
          <p className='text-lg p-2 mt-1'>{data.description}</p>
          <div className='w-full flex items-start justify-between flex-col sm:flex-row gap-y-3 p-2'>
           <form className="max-w-sm">
              <label htmlFor="file-input" className="sr-only">Choose file</label>
              <input type="file" name="file-input" id="file-input" className="p-1 cursor-pointer block w-full border shadow-sm rounded-lg text-lg focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none 
                file:me-4
                file:py-3 file:px-4"/>
            </form>
            <button className='w-full sm:w-sm p-4 font-semibold rounded-lg text-lg border'>Submit</button>
          </div>
        </div>  
        </div>
      </div>
    </div>
  )
}

export default SelectedTask