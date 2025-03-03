import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';
import Logo from './Logo';
import VerifiedBadge from './VerifiedBadge';
const NavBar = () => {
    const {user, getUser, logout} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        getUser();
    },[])

    const handleLogout = () =>{
        logout();
        navigate('/login');
    }

    return (
        <div className='sticky top-0 flex justify-between items-center px-4 sm:px-10 py-3 border-b border-gray-100 bg-white'>
            <div className='flex items-center gap-2 text-xs '>
                {/* <img className='w-36 sm:w-40 cursor-pointer ' src={assets.admin_logo} alt="" /> */}
                <Logo />
                {
                    user.is_verified && <VerifiedBadge />
                }
            </div>
            <button onClick={handleLogout} className='bg-primary text-white text-sm px-10 py-2 rounded-full '>Logout</button>
        </div>
    )
}

export default NavBar
