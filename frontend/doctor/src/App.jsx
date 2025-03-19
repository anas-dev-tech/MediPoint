import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import useAuth from "./hooks/useAuth";
import  { Toaster } from 'react-hot-toast';
import { getUserRoleFromToken } from "./services/authService";

// Lazy-load components
const Login = lazy(() => import("./pages/Login"));
const NavBar = lazy(() => import("./components/NavBar"));
const Sidebar = lazy(() => import("./components/Sidebar"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const ResetPasswordForm = lazy(() => import("./pages/ResetPasswordForm"));
const ResetPasswordConfirmForm = lazy(() => import("./pages/ResetPasswordConfirmForm"));
const Schedule = lazy(() => import("./pages/Schedule"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const App = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle role and authentication
  useEffect(() => {
    const role = getUserRoleFromToken();
    if (!role || role !== 'D') {
        logout()
        navigate('/login')
      }
    }, [isAuthenticated, location.pathname, logout, navigate]);

  return (
    <>
      {isLoading ? (
        <div className="loader-container flex justify-center items-center h-screen">
          <BounceLoader color="#50C878" size={60} />
        </div>
      ) : (
        <Suspense fallback={<div className="loader-container flex justify-center items-center"><BounceLoader color="#50C878" size={60} /></div>}>
          {isAuthenticated ? (
            <div className="bg-[#F8F9FD] min-h-screen">
              {!location.pathname.startsWith("/password-reset") && <NavBar />}
              {!location.pathname.startsWith("/password-reset") && <Sidebar />}
              <div className="ms-20 flex items-center">
                <Routes>
                  <Route path='/' element={<Dashboard />} />
                  <Route path='/dashboard' element={<Dashboard />} />
                  <Route path='/appointments' element={<Appointments />} />
                  <Route path='/profile' element={<Profile />} />
                  <Route path='/schedule' element={<Schedule />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Toaster />
              </div>
            </div>
          ) : (
            <>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/password-reset" element={<ResetPasswordForm />} />
                <Route path="/password-reset/:uid/:token" element={<ResetPasswordConfirmForm />} />
                <Route path="*" element={<NotFoundPage />} />

              </Routes>
              <Toaster />
            </>
          )}
        </Suspense>
      )}
    </>
  );
};

export default App;