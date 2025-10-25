import React from 'react'
import { Button,TextField } from '@mui/material'
const form = () => {
  return (
    <>
    <div className='opacity-100 min-w-1/2 p-5 mt-5 border-r-4 border-black'>
        <form className='flex flex-col gap-y-4 w-lg ml-10 mt-5 bg-white/70 p-5 rounded-md'>
            <h1 className='text-xl font-bold justify-center align-middle ml-8 mb-10'>Stay organized and track your daily tasks</h1>
            <div className='gap-y-10 flex flex-col max-w-20'>
                <input type="text" placeholder='Task Title' className='border-2 border-gray-300 rounded-md p-2 w-lg'/>
                <textarea rows={4} cols={50} className='border-2 border-gray-300 rounded-md p-2 w-lg mt-4' placeholder="Task Description"></textarea>
            </div>
            <div className='flex gap-x-2.5'>
              
              <Button variant="contained" className='bg-blue-500 hover:bg-blue-700'>Add Task</Button>
            </div>
            
        </form>
      
    </div>
    </>
  )
}

export default form
