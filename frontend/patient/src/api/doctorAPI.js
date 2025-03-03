import authAPI from "./authAPI";
import publicAPI from "./publicAPI";



export const getDoctors = async () =>{
    const response  = await publicAPI('/doctors')
    console.log(response.data)
    return response.data
}

export const getDoctorsBySpecialty = async (specialty) =>{
    const response  = await publicAPI(`/doctors/?specialty=${specialty}`)
    return response.data
}


export const getDoctor = async (doctorId) =>{
    const response  = await publicAPI(`/doctors/${doctorId}/`)
    console.log(response.data)
    return response.data
}


export const getSpecialties = async ()=>{
    const response = await publicAPI('/specialties/')
    console.log(response.data)
    return response.data
}

export const getWorkingHours = async (doctorId) =>{
    const response  = await publicAPI(`/doctors/${doctorId}/working-hours/`)
    return response.data
}