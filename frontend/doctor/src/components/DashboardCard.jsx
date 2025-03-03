import PropTypes from 'prop-types';

const DashboardCard = ({ icon, value, label }) => {
    return (
        <div className="flex items-center gap-2 bg-white p-4 w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-300">
            <img className="w-14" src={icon} alt={`${label} icon`} />
            <div>
                <p className="text-xl font-semibold text-gray-600">{value}</p>
                <p className="text-gray-400">{label}</p>
            </div>
        </div>
    );
};

DashboardCard.propTypes = {
    icon: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
};

export default DashboardCard;