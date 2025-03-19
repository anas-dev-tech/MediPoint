import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';
import Logo from './Logo';
import VerifiedBadge from './VerifiedBadge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";


const NavBar = () => {
    const { user, getUser, logout } = useAuth();
    const navigate = useNavigate()
    useEffect(() => {
        getUser();
    }, [])

    const handleLogout = () => {
        logout();
        navigate('/login')
    }

    return (
        <div className='sticky top-0 flex justify-between items-center z-50 px-4 sm:px-10 py-3 border-b border-gray-100 bg-white'>
            <div className='flex items-center gap-2 text-xs '>
                {/* <img className='w-36 sm:w-40 cursor-pointer ' src={assets.admin_logo} alt="" /> */}
                <Logo />
                {
                    user.is_verified && <VerifiedBadge />
                }
            </div>
            {/* <button onClick={handleLogout} className='bg-primary text-white text-sm px-10 py-2 rounded-full '>Logout</button> */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default NavBar
