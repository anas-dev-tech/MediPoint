import toast from 'react-hot-toast';
import { useState } from "react";
import PropTypes from 'prop-types';
import { changePassword } from "../api/userAPI";

const ChangePasswordModal = ({ show, onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleChangePassword = async () => {
        try {
            const { data, success } = await changePassword(oldPassword, newPassword);
            if (success) {
                toast.success(data.detail);
                onClose();
            } else {
                toast.error(data.detail);
            }
        } catch (error) {
            toast.error('Failed to update password');
            console.log(error);
        }
    };

    if (!show) return null;

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 z-100 inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
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
                    <button onClick={onClose} className='px-4 py-2 bg-gray-300 rounded'>
                        Cancel
                    </button>
                    <button onClick={handleChangePassword} className='px-4 py-2 bg-primary text-white rounded'>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

ChangePasswordModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ChangePasswordModal;