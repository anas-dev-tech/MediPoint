// import React from 'react'
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { getDoctor } from "../api/doctorAPI";
import RelatedDoctors from "../components/RelatedDoctors";
import { makeAppointment } from "../api/appointmentAPI";
import useAuth from "../hooks/useAuth";

const Appointment = () => {
  const { docId } = useParams();
  const [doctor, setDoctor] = useState(null)
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState(0)
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    getDoctor(docId).then(setDoctor).catch(console.error)
  }, [docId])

  if (!doctor) {
    return <div>Loading...</div>;
  }

  // Function to group by date (MM-DD) and day
  const groupByDateAndDay = (data) => {
    const grouped = {};

    data.forEach((entry) => {
      const dateObj = new Date(entry.start_time);
      const date = `${String(dateObj.getUTCMonth() + 1).padStart(2, "0")}-${String(
        dateObj.getUTCDate()
      ).padStart(2, "0")}`; // Format as MM-DD
      const day = dateObj.toLocaleDateString("en-US", { weekday: "short" }); // Extract day name

      if (!grouped[date]) {
        grouped[date] = {
          date: date, // Include the date in the object
          day: day.toUpperCase(),
          entries: [],
        };
      }

      // Format start_time and end_time to 12-hour AM/PM format
      const formattedStartTime = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const formattedEndTime = new Date(entry.end_time).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      // Add formatted times to the entry
      grouped[date].entries.push({
        ...entry,
        formattedStartTime,
        formattedEndTime,
      });
    });

    // Convert the grouped object into an array
    return Object.values(grouped);
  };


  const changeDateSlot = (index) => {
    setSlotIndex(index)
    setSlotTime(null)
  }


  const bookAppointment = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return toast.error('you should login first')
    }
    if (!slotTime) {
      return toast.error('You should select time slot, First')
    }
    try {
      const { data, status } = await makeAppointment(slotTime)
      if (status === 201) {
        toast.success("Appointment booked successfully")
        navigate('/my-appointments')
      } else {
        toast.error(data.detail)
        console.log(data)
        return
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  console.log("user", user)
  return doctor && (
    <div>
      {/* Doctor Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div >
          <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={doctor.user?.image || assets.profile_placeholder} alt="Doctor" />
        </div>
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0  ">
          {/* Doc info:  */}
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {doctor.user.full_name}
            {doctor.is_verified &&
              <div className="group relative inline-block">
                <p className="text-blue-500 cursor-pointer">
                  <img src={assets.verified_icon} alt="" />
                </p>

                <div
                  className="absolute bottom-full left-1/3 transform -translate-x-1/2 
                           bg-gray-800 text-white text-xs rounded px-2 py-1 
                           opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                           transition-opacity duration-500 w-[150px]"
                >
                  It has been verified by our team
                </div>
              </div>
            }
          </p>

          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>{doctor.education} - {doctor.specialty}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full"> {doctor.experience}</button>
          </div>
          <div >
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3 ">
              About<img src={assets.info_icon} alt="" />
            </p>

            <p className="text-sm text-gray-500 max-w-[700px] mt-1 ">{doctor.about}</p>
          </div>
          <p className="text-gray-500 font-medium mt-4">
            Appointment Fee: <span className="text-gray-600">${doctor.fees}</span></p>
        </div>
      </div>

      {/* Booking slots */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700 ">
        <p>Booking Slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {
            doctor.working_hours.length !== 0 && groupByDateAndDay(doctor.working_hours).map((item, index) => (
              <div onClick={() => changeDateSlot(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                <p > {item.date}</p>
                <p > {item.day}</p>
                <p>{ }</p>
              </div>
            ))
          }
        </div>


        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4 ">
          {doctor.working_hours.length
            ? (groupByDateAndDay(doctor.working_hours)[slotIndex].entries.map((item, index) => (
              <p onClick={() => setSlotTime(item.id)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.id === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray'}`} key={index}>
                {`${item.formattedStartTime.toLowerCase()} - ${item.formattedEndTime.toLowerCase()}`}

              </p>
            )))
            : (<p>Unfortunately, This doctor has not set any schedules</p>)
          }
        </div>
        {
          doctor.working_hours.length > 0 &&
          <button onClick={bookAppointment} className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 ">Book an Appointment</button>
        }

      </div>
      {/* Listing Related Doctors  */}
      <RelatedDoctors docId={docId} specialty={doctor.specialty} />

    </div>
  )
}

export default Appointment