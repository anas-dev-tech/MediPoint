import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { getSpecialties } from "../api/doctorAPI";

const SpecialtyMenu = () => {
    const [specialties, setSpecialties] = useState([])
    

    useEffect(() => {
        getSpecialties().then(setSpecialties).catch(console.error);
    }, []);


    
    return (
        <div id="specialty" className="flex flex-col items-center gap-4 py-16 text-gray-800">
            <h1 className="text-3xl font-medium">Find by speciality</h1>
            <p className="sm:w-1/3 text-center text-sm">Simply browser through our extensive list of trusted doctors, schedule your appointment</p>
            <div className="flex items-center sm:justify-center gap-4 pt-5 w-full overflow-scroll" >
                {
                    specialties.map((item, index)=>(
                        <Link onClick={()=>scrollTo(0,0)} to={`/doctors/${item.slug}`} key={index} className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500">
                            <img className="w-16 h-16 sm:w-24 sm:h-24 mb-2" src={item.icon} alt="" />
                            <p>{item.name}</p>
                        </Link>
                    ))
                }
            </div>
        </div>
        
    )
}

export default SpecialtyMenu
