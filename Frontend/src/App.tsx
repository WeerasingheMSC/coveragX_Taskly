import './App.css'
import { Button,TextField, } from '@mui/material';
function App() {
 
  return (
    <>
      <div className='flex h-screen m-5 gap-x-1.5'>
         <img src="/logo.png" alt="Logo" className='w-16 h-16 mb-4 rounded-full'/>
         <h1 className='text-5xl font-bold'>
         Taskly
      </h1>
      </div>
      <Button variant="contained">Contained</Button>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" className='w-lg'/>
      <textarea rows={4} cols={50} className='border-2 border-gray-300 rounded-md p-2 w-lg' placeholder="Enter your text here"></textarea>
    </>
  )
}

export default App
