import Logo from './Logo'
import { useNavigate } from 'react-router-dom'


const Footer = () => {
    const navigate = useNavigate();

    return (
        <div className='md:mx-10'>
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                {/* Left Section */}
                <div>
                    {/* <img className='mb-5 w-40  ' src={assets.logo} alt="" /> */}
                    <Logo />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio repudiandae et minus reprehenderit quam, sint dicta numquam non repellendus assumenda ab delectus pariatur provident voluptatem possimus tempora natus, commodi quod?</p>
                </div>

                {/* Center Section */}
                <div>

                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text=gray-600  '>
                        <li onClick={()=>navigate('/')}>Home</li>
                        <li onClick={()=>navigate('/contact')}>Contact Us</li>
                        <li onClick={()=>navigate('/about')}>About us</li>
                        <li>
                            Privacy Policy</li></ul>
                </div>

                {/* Right Section */}
                <div>
                    <p className='text-xl font-medium mb-5'>Get In-Touch</p>
                    <ul className='flex flex-col gap-2 text=gray-600  '>
                        <li>+1-234-425-232</li>
                        <li>anas@gmail.com</li>
                    </ul>
                </div>
            </div>
            {/* Copyright Text */}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'></p>
            </div>
        </div>
    )
}

export default Footer
