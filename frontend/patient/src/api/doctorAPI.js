import publicAPI from "./publicAPI";



export const getDoctors = async (pageNumber=1) =>{
    const response  = await publicAPI(`/doctors/?page=${pageNumber}`)
    console.log(response.data)
    return response.data
}

export const getDoctorsBySpecialty = async (specialty,pageNumber=1) =>{
    const response  = await publicAPI(`/doctors/?page=${pageNumber}&specialty=${specialty}`)
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
    return response.data.results
}

export const getWorkingHours = async (doctorId) =>{
    const response  = await publicAPI(`/doctors/${doctorId}/working-hours/`)
    return response.data
}