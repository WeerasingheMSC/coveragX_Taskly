const mainScreen = () => {
  return (
    <>
    <div
      className="bg-cover bg-center h-screen"
      style={{ backgroundImage: `url('/page.png')` }}
    >
        <div className="flex gap-x-2.5 align-middle justify-center pt-10">
            <img src="/logo.png" alt="Logo" className='w-20 h-20 mb-4 rounded-full'/>
            <h1 className='text-7xl font-bold'>
            Taskly
         </h1>
        </div>
            
       
    </div>
    </>
    
  )
}

export default mainScreen
