import Login from "./pages/Login";
import { ToastContainer } from 'react-toastify';
import useAuth from "./hooks/useAuth";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import Appointments from "./pages/Appointments";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ResetPasswordForm from "./pages/ResetPasswordForm";
import ResetPasswordConfirmForm from "./pages/ResetPasswordConfirmForm";


const App = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Check if the current route is the ResetPasswordForm
  const isResetPasswordRoute = location.pathname.startsWith("/password-reset");

  return isAuthenticated ? (
    <div className="bg-[#F8F9FD]">
      {/* Conditionally render NavBar */}
      {!isResetPasswordRoute && <NavBar />}

      <div className="flex items-start">
        {/* Conditionally render Sidebar */}
        {!isResetPasswordRoute && <Sidebar />}

        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/appointments' element={<Appointments />} />
          <Route path='/profile' element={<Profile />} />

        </Routes>
        <ToastContainer />
      </div>
    </div>
  ) : (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/password-reset" element={<ResetPasswordForm />} />
        <Route path="/password-reset/:uid/:token" element={<ResetPasswordConfirmForm />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;