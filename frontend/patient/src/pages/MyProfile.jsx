import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { updateMe, changePassword } from "../api/userAPI";
import { useNavigate } from 'react-router-dom';
import { assets } from "../assets/assets";

const MyProfile = () => {
    const { user, getUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const userData = user?.user || {};

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [fullName, setFullName] = useState(userData.full_name || "");
    const [gender, setGender] = useState(userData.gender || "");
    const [dob, setDob] = useState(userData.dob?.split("T")[0] || "");
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

        try {
            if (!userData) return toast.error("User data is not available.");

            const formData = new FormData();
            if (fullName.trim() && fullName !== userData.full_name) formData.append("user[full_name]", fullName);
            if (gender !== userData.gender) formData.append("user[gender]", gender);
            if (dob !== userData.dob?.split("T")[0]) formData.append("user[dob]", dob);
            if (image) formData.append("user[image]", image);

            const { data, success } = await updateMe(formData);
            if (success) {
                await getUser();
                setIsEdit(false);
                toast.success(data.message);
            }
        } catch (err) {
            toast.error(err.message || "Failed to update user");
        }
    };

    if (!Object.keys(userData).length) return <div>Loading...</div>;

    return (
        <div className="max-w-lg flex flex-col gap-2 text-sm p-4">
            {isEdit ? (
                <form onSubmit={updateUserProfileData} encType="multipart/form-data">
                    <label htmlFor="image">
                        <div className="inline-block relative cursor-pointer">
                            <img className="w-36 rounded opacity-75" src={profileImage} alt="Profile" />
                        </div>
                        <input type="file" id="image" hidden onChange={handleImageChange} />
                    </label>
                    <br />
                    <input className="bg-gray-50 text-3xl font-medium max-w-60 mt-4" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <hr className="bg-zinc-400 h-[1px] border-none" />
                    <p className="text-neutral-500 underline mt-3">Contact Info</p>
                    <p className="text-lg font-medium">
                        Email: <span className="ps-3 text-blue-500">{userData.email}</span>
                    </p>

                    <div className="mt-1">
                        <label className="text-lg font-medium">Birthday:
                            <input className="ms-3 max-w-30 bg-gray-100" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                        </label>
                    </div>

                    <p className="text-neutral-500 underline mt-3">Basic Information</p>
                    <label className="text-lg font-medium">Gender:
                        <select className="ms-3 max-w-20 bg-gray-100" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </label>


                    <br />

                    <button type="button" 
                        onClick={()=>setIsEdit(false)}
                        className="mt-5 me-5 bg-red-500  px-8 py-2 rounded-full text-white hover:scale-105 transition-all duration-400"
                    >Cancel</button>

                    <button type="submit" className="mt-5  px-8 py-2 rounded-full text-white bg-primary hover:scale-105  transition-all duration-400">Save Information</button>
                </form>
            ) : (
                <>
                    <img className="w-36 rounded" src={profileImage} alt="Profile" />

                    <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.full_name}</p>
                    <hr className="bg-zinc-400 h-[1px] border-none" />
                    <p className="text-neutral-500 underline mt-3">Contact Info</p>
                    <p className="text-lg font-medium">Email:
                        <span className="ps-3 text-blue-500">{userData.email}</span>
                    </p>
                    <p className="font-medium">Birthday:</p>
                    <p className="text-gray-400">{userData.dob}</p>
                    <p className="text-neutral-500 underline mt-3">Basic Information</p>
                    <p className="font-medium">Gender:</p>
                    <p className="text-gray-400">{userData.gender}</p>
                    <button className="bg-primary text-white border border-primary px-8 py-2 rounded-full hover:scale-105 transition-all duration-500" onClick={() => setIsEdit(true)}>Edit</button>
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
