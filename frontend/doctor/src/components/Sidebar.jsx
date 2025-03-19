import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
    return (
        <div className='fixed top-0 bottom-0 pt-[100px] min-h-screen bg-white z-10 border  border-r-1 border-gray-200  group/sidebar'>
            <ul className='text-[#515151] mt-5'>
                {/* Dashboard NavLink */}
                <NavLink
                    className={({ isActive }) => `
        flex items-center gap-3 py-3.5 px-5 cursor-pointer 
        ${isActive ? 'bg-[#f2f3ff] border-r-4 border-primary' : ''} 
      `}
                    to={`/dashboard`}
                >
                    <img src={assets.home_icon} alt="" />
                    <p className='hidden group-hover/sidebar:block text-center px-4'>Dashboard</p>
                </NavLink>

                {/* Appointments NavLink */}
                <NavLink
                    className={({ isActive }) => `
        flex items-center gap-3 py-3.5 px-5 cursor-pointer 
        ${isActive ? 'bg-[#f2f3ff] border-r-4 border-primary' : ''} 
      `}
                    to={`/appointments`}
                >
                    <img src={assets.appointment_icon} alt="" />
                    <p className='hidden group-hover/sidebar:block text-center px-4 transition-all duration-300'>Appointments</p>
                </NavLink>

                {/* Profile NavLink */}
                <NavLink
                    className={({ isActive }) => `
        flex items-center gap-3 py-3.5 px-5 cursor-pointer 
        ${isActive ? 'bg-[#f2f3ff] border-r-4 border-primary' : ''} 
        transition-all duration-300
      `}
                    to={`/profile`}
                >
                    <img src={assets.people_icon} alt="" />
                    <p className='hidden group-hover/sidebar:block text-center px-4'>Profile</p>
                </NavLink>

                {/* Schedule NavLink */}
                <NavLink
                    className={({ isActive }) => `
        flex items-center gap-3 py-3.5 px-5 cursor-pointer 
        ${isActive ? 'bg-[#f2f3ff] border-r-4 border-primary' : ''} `}
                    to={`/schedule`}
                >
                    <img src={assets.schedules_icon} alt="" />
                    <p className='hidden group-hover/sidebar:block text-center px-4'>Schedule</p>
                </NavLink>
            </ul>
        </div>)


}

export default Sidebar
