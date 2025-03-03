import authAPI from "./authAPI";

export const getAppointments = async () => {
  const response = await authAPI.get("/appointments/");
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