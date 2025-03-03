import { assets } from "../assets/assets";

const VerifiedBadge = () => {
  return (
    <div className="group relative inline-block">
      {/* Verified Icon */}
      <p className="text-blue-500 cursor-pointer">
        <img src={assets.verified_icon} alt="Verified" />
      </p>

      {/* Tooltip */}
      <div
        className="absolute bottom-full left-1/3 transform -translate-x-1/2 
                   bg-gray-800 text-white text-xs rounded px-2 py-1 
                   opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                   transition-opacity duration-500 w-[210px]"
      >
        You have been verified by our team
      </div>
    </div>
  );
};

export default VerifiedBadge;