import authAPI from "./authAPI";

export const updateMe = async (user) => {
  try {
    // Make the API call
    console.log(user);
    const response = await authAPI.put("/auth/me/", user);

    // Check if the response status is in the 200-299 range (successful)
    if (response.status >= 200 && response.status < 300) {
      // If successful, return the data
      return response.data;
    } else {
      // Handle non-successful responses (e.g., 4xx or 5xx errors)
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    // Handle any errors (network issues, server errors, etc.)
    console.error("Error updating user:", error.message || error);
    throw error; // Re-throw the error if you want the calling component to handle it
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