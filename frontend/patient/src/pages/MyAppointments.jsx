import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import useAuth from "../hooks/useAuth"
import { getAppointments, payAppointment } from "../api/appointmentAPI"
import { cancelAppointment } from "../api/appointmentAPI"
import { BeatLoader } from 'react-spinners'

const MyAppointments = () => {
  const { isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [clickedAppointmentId, setClickedAppointmentId] = useState(0)

  useEffect(() => {
    console.log(isAuthenticated)
    if (isAuthenticated) {
      getAppointments().then(setAppointments).catch(console.error)
    }
    console.log(appointments)
  }, [isAuthenticated])

  useEffect(()=>{
    setClickedAppointmentId(0)
  }, [])

  const appointmentPayment = async (appointmentId) => {
    setClickedAppointmentId(appointmentId);
    try {
      setIsLoading(true)
      const { data, status } = await payAppointment(appointmentId)

      if (status === 200) {
        window.location.href = data.checkout_url; // Redirect to Stripe
        setIsLoading(false)
        setClickedAppointmentId(0)
      } else {
        toast.error("Payment failed!");
        setIsLoading(false)
        setClickedAppointmentId(0)
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Something went wrong.");
      setIsLoading(false)
      setClickedAppointmentId(0)
    }
    setClickedAppointmentId(0);
  };


  const cancelPatientAppointment = async (appointmentId) => {
    try {
      const { data, status } = await cancelAppointment(appointmentId)
      if (status === 200) {
        toast.success(data.detail)
        getAppointments().then(setAppointments).catch(console.error)
      } else {
        console.log(data.detail)
        toast.error(data.detail)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const extractDateAndTime = (isoString) => {
    const date = new Date(isoString);

    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM

    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? hours : 12; // Handle midnight (0 becomes 12)

    const formattedDate = ` ${day}, ${month}`; // Correct date format
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;

    return { date: formattedDate, time: formattedTime };
  };


  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-gray-200 border-b" key={index}>
            <div>
              <img className="w-32 bg-indigo-50" src={item.doctor.user.image} alt="" />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{item.doctor.user.full_name}</p>
              <p className="">{item.doctor.specialty}</p>
              <p className="text-zinc-700 font-medium mt-1">Address</p>
              {/* <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p> */}
              <p className="text-xs mt-1"><span className="text-sm text-neutral-700 font-medium">Date & Time:</span>{extractDateAndTime(item.datetime).date} | {extractDateAndTime(item.datetime).time}</p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">

              {
                item.status === 'C'// mean is cancelled 
                  ? <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500 ">Appointment Cancelled</button>
                  : <>
                    {
                      item.status === 'PA' // it means paid
                        ? <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">Paid</button>
                        :
                        <>
                          <button
                            onClick={() => appointmentPayment(item.id)} // Replace 50 with actual amount
                            disabled={isLoading} // Disable the button while loading
                            className={`${isLoading && clickedAppointmentId === item.id && 'bg-primary'} text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300`}>
                            {isLoading && clickedAppointmentId === item.id ? (
                              <BeatLoader size={10} color="#ffffff" /> // Show spinner while loading
                            ) : (
                              'Pay Online'
                            )}                          </button>

                          <button
                            onClick={() => cancelPatientAppointment(item.id)} className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300"
                          >
                            Cancel Appointment
                          </button>
                        </>
                    }

                  </>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
