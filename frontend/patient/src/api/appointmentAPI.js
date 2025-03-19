import authAPI from "./authAPI";

export const makeAppointment = async (working_hours) => {
  const response = authAPI.post("/appointments/", { working_hours });
  return response;
};

export const getAppointments = async (pageNumber=1) => {
  const response = await authAPI.get(`/appointments/?page=${pageNumber}&page_size=3`);
  console.log('page', response.data)
  return response.data;
};

export const cancelAppointment = async (appointmentId) => {
  const response = await authAPI.post(`/appointments/${appointmentId}/cancel/`);
  return { data: response.data, status: response.status };
};


export const payAppointment = async(appointmentId) =>{
    const response = await authAPI.post(`/appointments/${appointmentId}/pay/`);
    return {data:response.data, status:response.status}
}