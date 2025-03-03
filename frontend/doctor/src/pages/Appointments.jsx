import { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import useAuth from '../hooks/useAuth'
import { getAppointments, cancelAppointment } from '../api/appointmentAPI'
import { extractDateAndTime } from '../utils/datetimeFormat'
import {toast} from 'react-toastify';
import { completeAppointment } from '../api/appointmentAPI'

const Appointments = () => {
  const { isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    console.log(isAuthenticated)
    if (isAuthenticated) {
      getAppointments().then(setAppointments).catch(console.error)
    }
    console.log(appointments)
  }, [isAuthenticated])


  const handleCancelAppointment = async(appointmentId) =>{
    try{
      const {data,success} =  await cancelAppointment(appointmentId)
      if(success){
          toast.success(data.detail)
          getAppointments().then(setAppointments).catch(console.error)
      }else{
        toast.error(data)
      }
    }catch(error){
      console.log(error)
    }
  }

  const handleCompleteAppointment = async(appointmentId) =>{
    const {data, success} = await completeAppointment(appointmentId)
    if(success){
      toast.success(data.message)
      getAppointments().then(setAppointments).catch(console.error)
    }else{
      toast.error(data.message)
    }
  }

  const calculateAge = (dob) => {
    const today = new Date()
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear()

    return age
  }
  
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white  rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll '>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {
          appointments.map((item, index) => (
            <div key={index} className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b border-gray-100 hover:bg-gray-50'>
              <p className='max-sm:hidden  '>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item.patient.user?.image} alt="" /><p>{item.patient.user?.full_name}</p>
              </div>
              <div>
                <p className='text-xs inline border border-primary px-2 rounded-full'>
                  {item.status === 'P' ? 'Online' : "Cash"}
                </p>
              </div>
              <p className='max-sm:hidden'>
                {calculateAge(item.patient?.user?.dob)}
              </p>
              <p>{extractDateAndTime(item.datetime).date}, {extractDateAndTime(item.datetime).time}</p>
              <p>${item.fees}</p>
              {
                item.status === 'C' // means cancelled
                  ? <p className='text-red-400 text-xs font-medium' >Canceled</p>
                  : item.status === 'D' // it means DONE
                    ? <p className='text-green-500 text-xs font-medium'>Completed</p> :
                    <div className='flex'>
                      <img onClick={() => handleCancelAppointment(item.id)} className='w-10 cursor-pointer  ' src={assets.cancel_icon} alt="" />
                      <img onClick={() => handleCompleteAppointment(item.id)} className='w-10 cursor-pointer  ' src={assets.tick_icon} alt="" />
                    </div>
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Appointments
