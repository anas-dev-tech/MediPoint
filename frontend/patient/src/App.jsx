import { Routes, Route, useLocation } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import useAuth from "./hooks/useAuth"
import Home from './pages/Home'
import Login from "./pages/Login"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Appointment from "./pages/Appointment"
import MyAppointments from "./pages/MyAppointments"
import Doctors from "./pages/Doctors"
import FloatingChat from "./components/Chat"
import MyProfile from "./pages/MyProfile"
import ResetPasswordForm from "./pages/ResetPasswordForm"
import ResetPasswordConfirmForm from "./pages/ResetPasswordConfirmForm"

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); // Use React Router's useLocation hook

  const isLoginRoute = location.pathname.startsWith('/login');
  const isChangePasswordRoute = location.pathname.startsWith('/password-change');
  const isResetPasswordRoute = location.pathname.startsWith('/password-reset');

  console.log(isAuthenticated, 'isAuth')

  return (
    <>
      <div className="max-4 sm:mx-[10%]">
        <ToastContainer />
        { !isLoginRoute &&  !isChangePasswordRoute && !isResetPasswordRoute && <NavBar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:specialty" element={<Doctors />} />
          <Route path="/appointment/:docId" element={<Appointment />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/my-profile" element={<MyProfile />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/password-reset" element={<ResetPasswordForm />} />
          <Route path="/password-reset/:uid/:token" element={<ResetPasswordConfirmForm />} />
        </Routes>
        { !isLoginRoute &&  !isChangePasswordRoute && !isResetPasswordRoute &&
          <>
            <FloatingChat />
            <Footer />
          </>
        }
      </div>
    </>
  )
}

export default App;
