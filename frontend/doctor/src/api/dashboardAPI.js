import authAPI from "./authAPI";

export const getDashboardData = async () => {
  const response = await authAPI.get("/doctors/dashboard/");
  console.log(response.data);
  return { data: response.data, status: response.status };
};
