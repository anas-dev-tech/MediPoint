import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { resetPasswordConfirm } from "../api/userAPI";


const ResetPasswordConfirmForm = () => {
  const { uid, token } = useParams(); // Extract uid and token from URL
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const {data, success} = await resetPasswordConfirm(newPassword, uid, token)

      if (success) {
        setSuccess(true);
        toast.success("Password reset successfully! You can now log in.");
        setTimeout(() => navigate("/login"), 3000); // Redirect to login page
      } else {
        toast.error(data.detail || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error)
    }
    
    setLoading(false);
  };

  return (
    <div className="flex-1 flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {success ? (
          <p className="text-green-600 text-center">
            Password reset successful! Redirecting to login...
          </p>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border p-2 rounded mb-3"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border p-2 rounded mb-3"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordConfirmForm;
