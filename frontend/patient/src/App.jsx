import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { BounceLoader } from "react-spinners"; 
import useAuth from "./hooks/useAuth";
import { Toaster } from 'react-hot-toast';
// Lazy-load components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import("./pages/Login"));
const NavBar = lazy(() => import("./components/NavBar"));
const Footer = lazy(() => import("./components/Footer"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Appointment = lazy(() => import("./pages/Appointment"));
const MyAppointments = lazy(() => import("./pages/MyAppointments"));
const Doctors = lazy(() => import("./pages/Doctors"));
const FloatingChat = lazy(() => import("./components/Chat"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const ResetPasswordForm = lazy(() => import("./pages/ResetPasswordForm"));
const ResetPasswordConfirmForm = lazy(() => import("./pages/ResetPasswordConfirmForm"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));



function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loader-container">
          <BounceLoader color="#50C878" size={60} />
        </div>
      ) : (
        <Suspense fallback={<div className="loader-container"><BounceLoader color="#50C878" size={60} /></div>}>
          <div className="max-4 sm:mx-[10%] px-3">
            <Toaster />
            {!['/login', '/password-change', '/password-reset'].includes(location.pathname) && <NavBar />}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:specialty" element={<Doctors />} />
              <Route path="/appointment/:docId" element={<Appointment />} />
              <Route path="/my-appointments" element={<MyAppointments />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/password-reset" element={<ResetPasswordForm />} />
              <Route path="/password-reset/:uid/:token" element={<ResetPasswordConfirmForm />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            {!['/login', '/password-change', '/password-reset'].includes(location.pathname) && (
              <>
                <FloatingChat />
                <Footer />
              </>
            )}
          </div>
        </Suspense>
      )}
    </>
  );
}

export default App;
