import Header from "../components/Header";
import SpecialtyMenu from "../components/SpecialtyMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import DoctorNotification from '../components/DoctorNotification'

const Home = () => {
    const { getUser, isAuthenticated, loading } = useAuth();

    useEffect(() => {
        getUser();
    }, [isAuthenticated]);



    if (loading) {
        return <div>Loading...</div>; // Show a loading spinner or placeholder
    }else{
        console.log(isAuthenticated, 'is')
    }

    
    return (
        <div className="tex">
            <Header />
            <SpecialtyMenu />
            <DoctorNotification />
            <TopDoctors />
            <Banner />
        </div>
    );
};

export default Home;