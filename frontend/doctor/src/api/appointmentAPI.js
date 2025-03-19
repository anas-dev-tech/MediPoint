import authAPI from "./authAPI";

export const getAppointments = async (pageNumber=1) => {
  const response = await authAPI.get(`/appointments/?page=${pageNumber}&page_size=5`);
  console.log("Appointments--", response.data)
  return response.data;

};

export const cancelAppointment = async (appointmentId) => {
  const response = await authAPI.post(`/appointments/${appointmentId}/cancel/`);
  return  { data: response.data, success: response.status === 200 };
};


export const completeAppointment  = async(appointmentId) =>{
  const response = await authAPI.post(`/appointments/${appointmentId}/complete/`)
  return {data: response.data, success: response.status === 200}
}