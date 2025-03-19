import { useState } from 'react';
import toast from 'react-hot-toast';
import { resetPasswordRequest } from '../api/userAPI';

const ResetPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); // New state to track submission

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const domainName = window.location.origin;
            const { data, success } = await resetPasswordRequest(email, domainName);
            if (success) {
                toast.success(data.message);
                setIsSubmitted(true); // Mark as submitted
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Something went wrong');
            console.log(error);
        }

        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                {/* Conditionally render form or success message */}
                {!isSubmitted ? (
                    <>
                        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                        <form onSubmit={handleResetPassword}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border p-2 rounded mb-3"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <p className="text-green-600 font-semibold">
                            A password reset link has been sent to your email.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordForm;