import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { updateMe } from "../api/userAPI";
import { changePassword } from "../api/userAPI";
import { useNavigate } from 'react-router-dom'
import { assets } from "../assets/assets";


const MyProfile = () => {
    const { user, getUser, isAuthenticated } = useAuth();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    // const [phone, setPhone] = useState("");
    const [image, setImage] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const navigate = useNavigate();

    console.log(isAuthenticated)

    if (!isAuthenticated) {
        navigate('/login')
    }

    useEffect(() => {
        if (!Object.keys(user || {}).length) {
            getUser();
        }
    }); // Ensure fresh user data when authentication changes


    useEffect(() => {
        if (Object.keys(user || {}).length) {
            setFullName(user?.user?.full_name || "");
            setGender(user?.user?.gender || "");
            setDob(user?.user?.dob?.split("T")[0] || ""); // Ensure proper date format
            // setPhone(user?.user?.phone || "");
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };
    const handleChangePassword = async () => {
        try {
            // Replace with actual API call to change password
            const { data, success } = await changePassword(oldPassword, newPassword);
            if (success) {
                toast.success(data.detail);
                setShowPasswordModal(false);
            } else {
                toast.error(data.detail);
            }
        } catch (error) {
            toast.error('Failed to update password');
            console.log(error)
        }
    };
    const updateUserProfileData = async () => {
        try {
            if (!user?.user) {
                toast.error("User data is not available.");
                return;
            }

            const updatedFields = { user }; // Dictionary-like object to track changes

            // Ensure only changed and non-empty values are added
            if (fullName?.trim() && fullName !== user.user.full_name) {
                updatedFields.user.full_name = fullName;
            }
            if (gender && gender !== user.user.gender) {
                updatedFields.user.gender = gender;
            }
            if (dob && dob !== user.user.dob?.split("T")[0]) {
                updatedFields.user.dob = dob;
            }
            if (image) {
                updatedFields.user.image = image;
            }

            // If no changes detected, don't proceed
            if (Object.keys(updatedFields).length === 0) {
                toast.info("No changes detected.");
                return;
            }

            console.log(updatedFields)

            // Call API to update user details
            await updateMe(updatedFields);
            toast.success("Profile updated successfully!");
            await getUser();
            setIsEdit(false);
        } catch (err) {
            toast.error(err.message || "Failed to update user");
        }
    };


    if (!Object.keys(user || {}).length) {
        return <div>Loading...</div>;
    }

    const profileImage = image ? URL.createObjectURL(image) : user?.user?.image || assets.profile_placeholder;

    return (
        <div className="max-w-lg flex flex-col gap-2 text-sm">
            {isEdit ? (
                <label htmlFor="image">
                    <div className="inline-block relative cursor-pointer">
                        <img className="w-36 rounded opacity-75" src={profileImage} alt="Profile" />
                    </div>
                    <input type="file" id="image" hidden onChange={handleImageChange} />
                </label>
            ) : (
                <img className="w-36 rounded" src={profileImage} alt="Profile" />
            )}

            {isEdit ? (
                <input
                    className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            ) : (
                <p className="font-medium text-3xl text-neutral-800 mt-4">{user?.user?.full_name}</p>
            )}

            <hr className="bg-zinc-400 h-[1px] border-none" />

            <div>
                <p className="text-neutral-500 underline mt-3">Contact Info</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                    <p className="font-medium">Email:</p>
                    <p className="text-blue-500">{user?.user?.email}</p>

                    {/* <p className="font-medium">Phone:</p>
                    {isEdit ? (
                        <input
                            type="text"
                            className="bg-gray-100 max-w-52"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    ) : (
                        <p className="text-blue-400">{user?.user?.phone}</p>
                    )} */}

                    <p className="font-medium">Birthday:</p>
                    {isEdit ? (
                        <input
                            className="max-w-28 bg-gray-100"
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                    ) : (
                        <p className="text-gray-400">{user?.user?.dob}</p>
                    )}
                </div>
            </div>

            <div>
                <p className="text-neutral-500 underline mt-3">Basic Information</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                    <p className="font-medium">Gender:</p>
                    {isEdit ? (
                        <select
                            className="max-w-20 bg-gray-100"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    ) : (
                        <p className="text-gray-400">{user?.user?.gender}</p>
                    )}
                </div>
            </div>

            <div className="mt-10">
                {isEdit ? (
                    <button
                        className="border border-primary px-8 py-2 rounded-full hover:text-white hover:bg-primary transition-all duration-200"
                        onClick={updateUserProfileData}
                    >
                        Save Information
                    </button>
                ) : (
                    <button
                        className="border border-primary px-8 py-2 rounded-full hover:text-white hover:bg-primary transition-all duration-200"
                        onClick={() => setIsEdit(true)}
                    >
                        Edit
                    </button>
                )}
                <div className='mt-5'>
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className='text-primary underline'>
                        Change Password
                    </button>
                </div>
            </div>

            {showPasswordModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
                    <div className='bg-white p-6 rounded-lg w-96'>
                        <h2 className='text-xl font-bold mb-4'>Change Password</h2>
                        <input
                            type='password'
                            placeholder='Old Password'
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className='w-full border p-2 rounded mb-3'
                        />
                        <input
                            type='password'
                            placeholder='New Password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className='w-full border p-2 rounded mb-3'
                        />
                        <div className='flex justify-end gap-2'>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className='px-4 py-2 bg-gray-300 rounded'>
                                Cancel
                            </button>
                            <button
                                onClick={handleChangePassword}
                                className='px-4 py-2 bg-primary text-white rounded'>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default MyProfile;
