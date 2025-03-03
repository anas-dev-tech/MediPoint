import { useNavigate } from "react-router-dom";
import DoctorCard from "./DoctorCard";
import PropTypes from 'prop-types';


const DoctorsCardList = ({ title, subtitle, doctors,maxCards, navigateTo, buttonLabel = "more" }) => {
    const navigate = useNavigate();

    const handleOnClickMore = () => {
        navigate(navigateTo);
        scrollTo(0, 0);
    };

    return (
        <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
            <h1 className="text-3xl font-medium">{title}</h1>
            {subtitle && <p className="sm:w-1/3 text-center text-sm">{subtitle}</p>}
            <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
                {doctors.slice(0, maxCards).map((doctor, index) => (
                    <DoctorCard key={index} doctor={doctor} />
                ))}
            </div>
            <button onClick={handleOnClickMore} className="bg-blue-50 text-gray-600 py-3 px-12 rounded-full mt-10">
                {buttonLabel}
            </button>
        </div>
    );
};

export default DoctorsCardList;



DoctorsCardList.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string, // Not required, but good to define
    doctors: PropTypes.arrayOf(PropTypes.shape({  // Validation for the doctors array
      /* Define the shape of each doctor object */
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Example: ID is required
      name: PropTypes.string.isRequired, // Example: Name is required
      // ... other properties of a doctor object ...
    })).isRequired,
    maxCards: PropTypes.number, // Not required, allows for no limit, but good practice
    navigateTo: PropTypes.func.isRequired, // Ensure it's a function
    buttonLabel: PropTypes.string,  // Not required, has default
  };