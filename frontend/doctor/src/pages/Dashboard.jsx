import { useEffect, useState } from 'react'
import { getDashboardData } from '../api/dashboardAPI'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { extractDateAndTime } from '../utils/datetimeFormat'
import DashboardCard from '../components/DashboardCard'
import { cancelAppointment } from '../api/appointmentAPI'



const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({})

  const getDashData = async () => {
    const { data, status } = await getDashboardData();
    if (status === 200) {
      setDashboardData(data)
      console.log(data)
    } else {
      console.log(data)
      toast.error(data)
    }
  }

  useEffect(() => {
    const refresh = async () => {
      await getDashData();
    }
    refresh();
  }, [])

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const { data, success } = await cancelAppointment(appointmentId)
      if (success) {
        toast.success(data.message)
        await getDashData();
      } else {
        toast.error(data)
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="m-5">

      <div className="flex flex-wrap gap-3">


        <DashboardCard
          icon={assets.earning_icon}
          value={`$${dashboardData.total_earnings || 0}`}
          label="Earnings"
        />
        <DashboardCard
          icon={assets.patients_icon}
          value={dashboardData.total_patients}
          label="Patients"
        />
        <DashboardCard
          icon={assets.appointments_icon}
          value={dashboardData.total_appointments}
          label="Appointments"
        />

      </div>

      <div className="bg-white">
        <div className="flex items-center gap-2.5 py-4 px-4 mt-10 rounded-t">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        <div className="pt-4 border border-t-0 border-gray-100">
          {
            dashboardData.latest_appointments?.map((item, index) => {
              return (
                <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100 " key={index}>
                  <img className="rounded-full w-10" src={item.patient.user.image} alt="" />
                  <div className="flex-1 text-sm">
                    <p className="text-gray-800">{item.patient.user.full_name}</p>
                    <p className="text-gray-600 ">{extractDateAndTime(item.datetime).date}, {extractDateAndTime(item.datetime).time}</p>
                  </div>
                  {
                    item.status === 'C'     // means Complete
                      ? <p className='text-red-400 text-xs font-medium' >Canceled</p>
                      : item.status === 'D' //means Done
                        ? <p className='text-green-500 text-xs font-medium'>Completed</p> :
                        <div className='flex'>
                          <img onClick={() => handleCancelAppointment(item.id)} className='w-10 cursor-pointer  ' src={assets.cancel_icon} alt="" />
                          <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer  ' src={assets.tick_icon} alt="" />
                        </div>
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard
