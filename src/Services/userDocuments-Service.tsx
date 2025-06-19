import api from "../axios/interceptor";
import { AxiosResponse } from "axios";


// Get user Docs
export async function getUserDocs() {
  return await api.get("/user-documents");
}


// Update user Doc
export async function updateUserDoc(data: any, userId: string) {
  try {
    const res: AxiosResponse<any> = await api.patch(
      `/user-documents/${userId}`,
      data
    );
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return error;
  }
}

// Add new user Doc
export async function createUserDoc(data: any) {
  try {
    const res: AxiosResponse<any> = await api.post(`/user-documents`, data);
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

// Delete user Doc
export async function deleteUserDoc(data: any) {
  try {
    const res: AxiosResponse<any> = await api.delete(`/user-documents/${data}`);
    return res;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}



// get Single user Doc
export async function getUserDoc(userId: string | undefined) {
  try {
    const res = await api.get(`/user-documents/${userId}`);
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return error;
  }
}
