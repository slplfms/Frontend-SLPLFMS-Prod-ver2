import api from "../axios/interceptor";
import { AxiosResponse } from "axios";

// Get all roles with Pagination
export async function getRoles(page: number, rowsPerPage: number) {
  try {
    const res = await api.get(`/roles?page=${page}&limit=${rowsPerPage}`);
    if (!res.data) {
      throw new Error("Failed to fetch role data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching role data:", error);
    return error.response?.data?.message || "Error fetching role data";
  }
}

// Get all roles without Pagination
export async function getAllRoles() {
  try {
    const res = await api.get(`/roles`);
    if (!res.data) {
      throw new Error("Failed to fetch role data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching role data:", error);
    return error.response?.data?.message || "Error fetching role data";
  }
}

// Update role
export async function updateRole(data: any, roleId: string) {
  try {
    const res: AxiosResponse<any> = await api.patch(`/roles/${roleId}`, data);
    if (!res.data) {
      throw new Error("Failed to update role data");
    }
    return { response: res.data, status: res.status };
  } catch (error: any) {
    console.error("Error updating role data:", error);
    return {
      error: error.response?.data?.message || "Error updating role data",
      status: error.response?.status || 500,
    };
  }
}

// Add new role
export async function createRole(data: any) {
  try {
    const res: AxiosResponse<any> = await api.post(`/roles/`, data);
    if (!res.data) {
      throw new Error("Failed to create role data");
    }
    return { response: res.data, status: res.status };
  } catch (error: any) {
    console.error("Error creating role data:", error);
    return {
      error: error.response?.data?.message || "Error creating role data",
      status: error.response?.status || 500,
    };
  }
}

// Delete role
export async function deleteRole(roleId: string) {
  return await api.delete(`/roles/${roleId}`);
}

// Get single role
export async function getRole(roleId: string | undefined) {
  try {
    const res = await api.get(`/roles/${roleId}`);
    if (!res.data) {
      throw new Error("Failed to fetch role data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching role data:", error);
    return error.response?.data?.message || "Error fetching role data";
  }
}
