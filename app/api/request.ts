const baseURL = "https://pwk.onrender.com"

export const getRequest = async (token: string) => {
  const response = await fetch(`${baseURL}/api/user/get_users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Unable to fetch user data");

  return response.json();
};



export const postRequest = async (formData:any) => {
      const res = await fetch(`${baseURL}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to login user");
      return data;
    }
   
      
