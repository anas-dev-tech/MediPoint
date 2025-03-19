import { toast } from 'react-toastify';
import publicAPI from '../api/publicAPI';
import {jwtDecode} from "jwt-decode";

// Refresh the access token
export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) throw new Error("No refresh token available");

    const response = await publicAPI.post(`/auth/token/refresh/`, { refresh });
    
    if (response.data?.access) {
      localStorage.setItem("accessToken", response.data.access);
      return response.data.access;
    } else {
      toast.error("Please Login first")
      window.location.href = "/login";
    }
  } catch (error) {
    logout();
    throw error;
  }
};

export const isAuthenticatedOrRefreshToken = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshTokens = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshTokens) return false;

  try {
    const decodedToken = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000; // Convert to seconds

    // Check if the access token is expired
    if (decodedToken.exp > currentTime) {
      return true; // Token is still valid
    } else {
      // Access token is expired, attempt to refresh it
      const newAccessToken = await refreshToken();

      if (newAccessToken) {
        // Save the new access token to localStorage
        localStorage.setItem("accessToken", newAccessToken);
        return true; // Token refreshed successfully
      } else {
        // Failed to refresh the token
        return false;
      }  
    }  
  } catch (error) {
    console.error("Error in isAuthenticated:", error);
    return false;
  }  
};  


export const register = async(full_name, email, password, password2) =>{
    try{
      const response = await publicAPI.post("/auth/register/", {full_name, email, password, password2})
      return {data:response.data, success:response.status === 201}
    }catch(error){
      console.log(error)
      if (error.response) {
        // Handle validation errors or other backend errors
        return { data: error.response.data, success: false };
      } else {
        // Handle network errors or other issues
        return { data: { detail: "Network error. Please try again." }, success: false };
      }
    }
}

export const login = async (email, password) => {
  try {
    const response = await publicAPI.post("/auth/token/", { email, password });
    if (response.status !== 200){
      return {data:response.data, success:false}
    }
    const { access, refresh } = response.data;
    const role = getUserRoleFromToken(access)
    
    if(role !== "P"){
      return {success:false, data:{detail:"Only patient can register here"}}
    }
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    return { success: true, data:response.data };
  } catch (error) {
    return { success: false, data: error.response?.data || "Login failed" };
  }
};
// Log the user out
export const logout = () => {
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessToken");
  // window.location.href = "/login";
};

export const getUserRoleFromToken = (accessToken) => {
  try {
    const decoded = jwtDecode(accessToken);
    // Extract the 'role' claim
    const role = decoded.role;

    // Return the role if it exists
    return role || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

