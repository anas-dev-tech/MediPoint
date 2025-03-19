import { useState, useEffect } from 'react'
import { getDoctors } from '../api/doctorAPI'
import DoctorsCardList from './DoctorsCardList'


const TopDoctors = () => {
    const title = 'Top Doctors to Book'
    const subtitle = 'Simply browser through our extensive list of trusted doctors'
    const maxCards = 10
    const navigateTo = '/doctors/'
    const buttonLabel = "more"
    const [doctors, setDoctors] = useState([])

    useEffect(() => {
        getDoctors()
            .then(data => {
                console.log(data.results)
                setDoctors(data.results); // Assuming the response has a `results` property
            })
            .catch(error => {
                console.error(error);
            });
    }, []); 

    return (
        <DoctorsCardList
            title={title}
            doctors={doctors}
            subtitle={subtitle}
            maxCards={maxCards}
            navigateTo={navigateTo}
            buttonLabel={buttonLabel}
        />
    )
}

export default TopDoctors
