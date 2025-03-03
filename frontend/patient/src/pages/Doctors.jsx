import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import DoctorCard from "../components/DoctorCard";
import { getDoctors, getSpecialties } from "../api/doctorAPI";



const Doctors = () => {
  const { specialty } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([])

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();


  const applyFilter = () => {
    if (specialty) {
      setFilterDoc(doctors.filter(doc => doc.specialty === specialty))
    } else {
      setFilterDoc(doctors)
    }
  } 
  useEffect(() => {
    getDoctors().then(setDoctors).catch(console.error)
    getSpecialties().then(setSpecialties).catch(console.error)
    applyFilter();
  }, [])
  
  useEffect(() => {
    applyFilter();
  }, [doctors, specialty])
  
  return (
    <div>
      <p className="text-gray-600 ">Browser through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button className={`py-1 px-3 border rounded text-sm  transition-all  ${showFilter?'bg-primary text-white':""}`} onClick={()=> setShowFilter(prev => !prev)}>Filters </button>
        <div className={`flex flex-col gap-4  text-sm text-gray-600 ${showFilter ? 'flex':'hidden sm:filter'}`}>
        {specialties?.map((item, index)=>
          {

            return (<p key={index} onClick={()=> specialty=== item.name ? navigate('/doctors/'): navigate(`/doctors/${item.name}`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${specialty === item.name? "bg-indigo-100 text-black":""}`}>{item.name}</p>)
          }

        )}
        </div>
        <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">

          {filterDoc.map((doctor, index) => (
            <DoctorCard key={index} doctor={doctor} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors
