import api from "../axios/interceptor";

type UserData = any;

// Get Users with Pagination
export async function getUsers(
  page: number = 1,
  limit: number = 10,
  search: string = ""
) {
  try {
    const res = await api.get(`/users`, { params: { page, limit, search } });

    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    return error.response?.data?.message || "Error fetching user data";
  }
}

// Get all users without Pagination
export async function getAllUsers() {
  try {
    const res = await api.get(`/users`);
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    return error.response?.data?.message || "Error fetching user data";
  }
}

// Update User
export async function updateUser(data: UserData, userId: string) {
  return await api.patch(`/users/${userId}`, data);
}

// Add new User
export async function createUser(data: UserData) {
  return await api.post(`/users/`, data);
}

// Delete User
export async function deleteUser(userId: string) {
  try {
    await api.delete(`/users/${userId} `);
  } catch (error: any) {
    console.error("Error deleting user data:", error);
    return error.response?.data?.message || "Error deleting user data";
  }
}

// Get Single User
export async function getUser(userId: string | undefined) {
  try {
    const res = await api.get(`/users/${userId} `);
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    return error.response?.data?.message || "Error fetching user data";
  }
}

// Get Single User
export async function getUserDocuments(userId: string | undefined) {
  try {
    const res = await api.get(`/user-documents`, { params: { userId } });
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    return error.response?.data?.message || "Error fetching user data";
  }
}
