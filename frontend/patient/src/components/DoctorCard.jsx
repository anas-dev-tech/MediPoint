// import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/appointment/${doctor.user.id}/`);
        scrollTo(0, 0);
    }
    return (
        <div 
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            onClick={handleClick}
        >
            <img className="bg-blue-50" src={doctor.user.image || assets.profile_placeholder} alt={doctor.name} />
            <div className="p-4">
                <div className="flex items-center gap-2 text-center text-sm text-green-500">
                    <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                    <p>Available</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{doctor.user.full_name}</p>
                <p className="text-gray-600 text-sm">{doctor.specialty}</p>
            </div>
        </div>
    );
};

export default DoctorCard;
