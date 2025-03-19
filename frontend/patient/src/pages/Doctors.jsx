import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import DoctorCard from "../components/DoctorCard";
import { getDoctors, getDoctorsBySpecialty, getSpecialties } from "../api/doctorAPI";
import { BounceLoader } from 'react-spinners'
import Pagination from "../components/Pagination";
import slugify from 'slugify';

const Doctors = () => {
  const { specialty } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([])
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();
  const [prev, setPrev] = useState("")
  const [next, setNext] = useState("")
  const [current, setCurrent] = useState(1)


  useEffect(() => {
    setIsLoadingDoctors(true);
    Promise.all([specialty ? getDoctorsBySpecialty(specialty) : getDoctors(), getSpecialties()])
      .then(([doctorsData, specialtiesData]) => {
        setDoctors(doctorsData.results);
        setNext(doctorsData.next)
        setPrev(doctorsData.previous)
        setCurrent(doctorsData.current)
        setSpecialties(specialtiesData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoadingDoctors(false); // Ensure loading is set to false
      });
  }, [specialty]);



  const handleTraverseDoctors = async (pageNumber) => {
    // Exit early if pageNumber is -1
    if (pageNumber === -1) {
      setIsLoadingDoctors(false); // Ensure loading state is reset
      return;
    }

    try {
      setIsLoadingDoctors(true);

      let next, previous, results, current;

      if (specialty) {
        // Fetch doctors by specialty
        const response = await getDoctorsBySpecialty(specialty, pageNumber);
        ({ next, previous, results, current } = response);
      } else {
        // Fetch all doctors
        const response = await getDoctors(pageNumber);
        ({ next, previous, results, current } = response);
      }

      // Update state with the fetched data
      setDoctors(results);
      setNext(next);
      setPrev(previous);
      setCurrent(current);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      // Optionally, you can set an error state here to display a message to the user
    } finally {
      // Ensure loading state is reset regardless of success or failure
      setIsLoadingDoctors(false);
    }
  }

  return (
    <div>
      <p className="text-gray-600 ">Browser through the doctors specialist.</p>
      <div className="flex flex-col  sm:flex-row items-start gap-5 mt-5">
        {isLoadingDoctors
          ?
          <div className="flex-1 w-full  flex justify-center items-center h-[350px] my-20">
            <BounceLoader color="#50C878" />
          </div>
          :
          <>
            <button className={`py-1 px-3 border rounded text-sm  transition-all  ${showFilter ? 'bg-primary text-white' : ""}`} onClick={() => setShowFilter(prev => !prev)}>Filters </button>
            <div className={`flex flex-col gap-4  text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:filter'}`}>
              {specialties?.map((item, index) => {

                return (<p key={index} onClick={() => specialty === slugify(item.name) ? navigate('/doctors/') : navigate(`/doctors/${slugify(item.name)}`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${specialty === slugify(item.name) ? "bg-indigo-100 text-black" : ""}`}>{item.name}</p>)
              }

              )}
            </div>
            <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">

              {doctors.map((doctor, index) => (
                <DoctorCard key={index} doctor={doctor} />
              ))}
            </div>
          </>
        }
      </div>
      
      {
        next !== prev  &&  // means there is only one page, so there is no need to display a pagination 
        <Pagination
          next={next}
          prev={prev}
          current={current}
          handleTraverseAppointments={handleTraverseDoctors}
        />
      }

    </div>
  )
}

export default Doctors
