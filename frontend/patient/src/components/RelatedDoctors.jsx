import { useEffect, useState } from 'react';
import DoctorsCardList from './DoctorsCardList';
import { getDoctorsBySpecialty } from '../api/doctorAPI';

const RelatedDoctors = ({ specialty, docId }) => {
    const [doctors, setDoctors] = useState([]);
    const [relDocs, setRelDocs] = useState([]);

    useEffect(() => {
        // Fetch doctors only if `specialty` is provided
        if (specialty) {
            getDoctorsBySpecialty(specialty)
                .then((fetchedDoctors) => {
                    setDoctors(fetchedDoctors.result);

                    // Filter doctors after fetching
                    const filteredDoctors = fetchedDoctors.filter((doc) => doc.user.id !== docId);
                    setRelDocs(filteredDoctors);
                })
                .catch(console.error);
        }
    }, [specialty, docId]); // Include `specialty` and `docId` as dependencies

    return relDocs.length > 0 &&  (
        <DoctorsCardList
            title="Related Doctors"
            doctors={relDocs}
            subtitle=""
            maxCards={3}
            navigateTo="/doctors/"
            buttonLabel="more"
        />
    );
};

export default RelatedDoctors;