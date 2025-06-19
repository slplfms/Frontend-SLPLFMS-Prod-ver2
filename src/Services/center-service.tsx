import api from "../axios/interceptor";
import { schema } from "../components/center/center-form";
import { z } from "zod";
import { AxiosResponse } from "axios";

type centerData = z.infer<typeof schema>;

// Get Centers with Pagination
export async function getCenters(page: number, limit: number, search: string|undefined=undefined) {
  try {
    const res = await api.get(`/centers`, {
      params: {
        page,
        limit,
        search
      },
    });
    if (!res.data) {
      throw new Error("Failed to fetch centers data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching centers data:", error);
    return error.response?.data?.message || "Error fetching centers data";
  }
}

// Get all Centers without Pagination
export async function getAllCenters() {
  try {
    const res = await api.get(`/centers`, {params:{
      limit:-1
    }});
    if (!res.data) {
      throw new Error("Failed to fetch centers data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching centers data:", error);
    return error.response?.data?.message || "Error fetching centers data";
  }
}

// Get available Centers
export async function getAvailableCenters() {
  try {
    const res = await api.get(`/available-centers`);
    if (!res.data) {
      throw new Error("Failed to fetch available centers data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching available centers data:", error);
    return (
      error.response?.data?.message || "Error fetching available centers data"
    );
  }
}

// Update Center
export async function updateCenter(data: centerData, userId: string) {
  try {
    const res: AxiosResponse<centerData> = await api.patch(
      `/centers/${userId}`,
      data
    );
    if (!res.data) {
      throw new Error("Failed to update center data");
    }
    return { response: res.data, status: res.status };
  } catch (error: any) {
    console.error("Error updating center data:", error);
    return {
      error: error.response?.data?.message || "Error updating center data",
      status: error.response?.status || 500,
    };
  }
}

// Add new Center
export async function createCenter(data: centerData) {
  try {
    const res: AxiosResponse<centerData> = await api.post(`/centers/`, data);
    if (!res.data) {
      throw new Error("Failed to create center data");
    }
    return { response: res.data, status: res.status };
  } catch (error: any) {
    console.error("Error creating center data:", error);
    return {
      error: error.response?.data?.message || "Error creating center data",
      status: error.response?.status || 500,
    };
  }
}

// Delete Center
export async function deleteCenter(userId: string) {
  return api.delete(`/centers/${userId}`);
}

// Get single Center
export async function getCenter(userId: string | undefined) {
  try {
    const res = await api.get(`/centers/${userId}`);
    if (!res.data) {
      throw new Error("Failed to fetch center data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching center data:", error);
    return error.response?.data?.message || "Error fetching center data";
  }
}
