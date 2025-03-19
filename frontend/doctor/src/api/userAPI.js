import authAPI from "./authAPI";

export const updateMe = async (user) => {
  try {
    const response = await authAPI.put("/auth/me/", user, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // Return only the response data
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.data); // Log server error response
      throw error.response.data; // Throw the response data (e.g., { detail: "Error message" })
    } else {
      console.error("Unexpected Error:", error);
      throw new Error("Something went wrong. Please try again."); // Handle unexpected errors
    }
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await authAPI.put("/auth/password/change/", {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return { data: response.data, success: response.status === 200 };
};


export const resetPasswordRequest = async (email, domain) =>{
    const response = await authAPI.post('/auth/password/reset/', {email, domain})
    return { data:response.data, success:response.status === 200}
}

export const resetPasswordConfirm = async (new_password, uid, token) =>{
    const response = await authAPI.post('/auth/password/reset/confirm/', {new_password, uidb64:uid, token})
    return { data:response.data, success:response.status === 200}
}