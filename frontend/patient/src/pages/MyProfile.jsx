import { useEffect, useState, useMemo } from "react";
import toast from 'react-hot-toast';
import useAuth from "../hooks/useAuth";
import { updateMe, changePassword } from "../api/userAPI";
import { useNavigate } from 'react-router-dom';
import { assets } from "../assets/assets";
import { BeatLoader } from 'react-spinners'


const MyProfile = () => {
    const { user, getUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const userData = user?.user || {};
    const [isLoading, setIsLoading] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [fullName, setFullName] = useState(userData.full_name || "");
    const [gender, setGender] = useState(userData.gender || "");
    const [dob, setDob] = useState(userData?.dob);
    const [image, setImage] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (!Object.keys(userData).length) getUser();
    }, [userData, getUser]);

    useEffect(() => {
        setFullName(userData.full_name || "");
        setGender(userData.gender || "");
        setDob(userData.dob?.split("T")[0] || "");
    }, [userData]);

    const profileImage = useMemo(
        () => (image ? URL.createObjectURL(image) : userData.image || assets.profile_placeholder),
        [image, userData.image]
    );

    const handleImageChange = (e) => {
        const file = e.target?.files?.[0];
        if (file) setImage(file);
    };


    const handleChangePassword = async () => {
        try {
            const { data, success } = await changePassword(oldPassword, newPassword);
            success ? toast.success(data.detail) : toast.error(data.detail);
            if (success) setShowPasswordModal(false);
        } catch (error) {
            toast.error('Failed to update password');
        }
    };

    const updateUserProfileData = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            if (!userData) return toast.error("User data is not available.");

            const formData = new FormData();
            console.log("user dob", userData?.dob)
            if (fullName.trim() && fullName !== userData.full_name) formData.append("user[full_name]", fullName);
            if (gender !== userData.gender) formData.append("user[gender]", gender);
            if (dob) formData.append("user[dob]", dob);
            console.log('date ', dob, typeof dob, !dob, dob !== null)
            if (image) formData.append("user[image]", image);
            console.log("image-> ", image)
            console.log("formD", formData)
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
            const { data, success } = await updateMe(formData);
            if (success) {
                await getUser();
                setIsEdit(false);
                toast.success(data.message);
            }
        } catch (err) {
            toast.error(err.message || "Failed to update user");
        } finally {
            setIsLoading(false)
        }

    };

    if (!Object.keys(userData).length) return <div>Loading...</div>;

    return (
        <div className="max-w-lg flex flex-col gap-2 text-sm p-4">
            {isEdit ? (
                <form onSubmit={updateUserProfileData} encType="multipart/form-data">
                    <div className="w-full mx-auto flex flex-col justify-center items-center">
                        <label className="block" htmlFor="image">
                            {/* Container for the image and the + sign */}
                            <div className="inline-block relative cursor-pointer">
                                {/* Image */}
                                <img
                                    className="w-36 h-36 rounded-full opacity-75"
                                    src={profileImage}
                                    alt="Profile"
                                />
                                {/* + sign centered on the image */}
                                <div className="absolute inset-0 flex justify-center items-end">
                                    <div className="text-4xl z-20 bg-primary text-white rounded-full w-12 h-12 flex justify-center items-center">
                                        +
                                    </div>
                                </div>
                            </div>
                            {/* File input */}
                            <input
                                type="file"
                                id="image"
                                hidden
                                onChange={handleImageChange}
                            />
                        </label>
                        {/* Name input */}
                        <input
                            className="text-3xl bg-white  font-medium max-w-60 my-1 text-center border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>

                    <hr className="bg-zinc-200  my-4 h-[1px] border-none" />

                    <p className="text-neutral-500 mt-3">Contact Info</p>
                    <p className="ms-4 mt-2 text-lg font-medium">
                        Email: <span className="ps-3 text-gray-500">{userData.email}</span>
                    </p>


                    <p className="text-neutral-500 mt-5">Basic Information</p>



                    <div className="mt-2 ms-4 flex justify-between items-center w-60">
                        <label htmlFor="birthday" className=" text-lg font-medium">Birthday
                        </label>
                        <input id="birthday" className="w-40 ms-3 max-w-30 bg-gray-100 bg-white  font-medium max-w-60 my-1 text-center border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                    </div>
                    <div className="ms-4 flex justify-between items-center w-60">
                        <label htmlFor="gender" className="text-lg font-medium">Gender
                        </label>
                        <select id="gender" className="w-40 ms-3 max-w-20 bg-gray-100 bg-white  font-medium max-w-60 my-1 text-center border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>


                    <br />

                    <button type="button"
                        onClick={() => setIsEdit(false)}
                        className="mt-5 me-5 bg-red-500  px-8 py-2 rounded-full text-white hover:scale-105 transition-all duration-400"
                    >Cancel</button>

                    <button type="submit" className="mt-5  px-8 py-2 rounded-full text-white bg-primary hover:scale-105  transition-all duration-400">
                        {isLoading
                            ? <BeatLoader color="white" size={12} />
                            : <span>
                                Save Information
                            </span>

                        }

                    </button>
                </form>
            ) : (
                // Edit section
                <>
                    <div className="w-full flex flex-col justify-center items-center">
                        <img className="w-36 h-36 rounded-full" src={profileImage} alt="Profile" />

                        <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.full_name}</p>
                    </div>

                    <hr className="bg-zinc-400 h-[1px] border-none" />

                    <p className="text-neutral-500 mt-3">Contact Info</p>
                    <p className="ms-3 text-lg font-medium">Email:
                        <span className="ps-3 text-gray-500">{userData.email}</span>
                    </p>
                    <p className="text-neutral-500 mt-3">Basic Information</p>
                    <p className="ms-3 text-lg font-medium">Birthday:
                        <span className="ms-2 text-gray-500">{userData.dob || "Unset"}</span>
                    </p>
                    <p className="ms-3 text-lg font-medium">Gender:
                        <span className="ms-2 text-gray-500">{userData.gender}</span>
                    </p>
                    <button className="mt-4 bg-primary text-white border border-primary px-8 py-2 rounded-full hover:scale-105 transition-all duration-500" onClick={() => setIsEdit(true)}>Edit</button>
                    <button onClick={() => setShowPasswordModal(true)} className='text-primary underline mt-5'>Change Password</button>
                </>
            )}
            {showPasswordModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
                    <div className='bg-white p-6 rounded-lg w-96'>
                        <h2 className='text-xl font-bold mb-4'>Change Password</h2>
                        <input type='password' placeholder='Old Password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className='w-full border p-2 rounded mb-3' />
                        <input type='password' placeholder='New Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='w-full border p-2 rounded mb-3' />
                        <button onClick={() => setShowPasswordModal(false)} className='px-4 py-2 bg-gray-300 rounded'>Cancel</button>
                        <button onClick={handleChangePassword} className='px-4 py-2 bg-primary text-white rounded'>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProfile;
