import authAPI from "./authAPI";

export const updateMe = async (user) => {
  
    const response = await authAPI.put("/auth/me/", user, {
      headers:{
        "Content-Type":"multipart/form-data"
      }
    });
    console.log(response)
    console.log("status" , response.status)
    return { data: response.data, success: response.status === 200 };
  
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await authAPI.put("/auth/password/change/", {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return { data: response.data, success: response.status === 200 };
};

export const resetPasswordRequest = async (email, domain) => {
  const response = await authAPI.post("/auth/password/reset/", {
    email,
    domain,
  });
  return { data: response.data, success: response.status === 200 };
};

export const resetPasswordConfirm = async (new_password, uid, token) => {
  const response = await authAPI.post("/auth/password/reset/confirm/", {
    new_password,
    uidb64: uid,
    token,
  });
  return { data: response.data, success: response.status === 200 };
};
