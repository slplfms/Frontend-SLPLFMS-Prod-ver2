import api from "../axios/interceptor";
import { z } from "zod";
import { AxiosResponse } from "axios";
import { schema } from "../components/FuelManagement/AddFuelManagement";

type fuelData = z.infer<typeof schema>;

// Get Fuels with Pagination
export async function getFuels(page: number, rowsPerPage: number) {
  try {
    const res = await api.get(
      `/fuel-activities?page=${page}&limit=${rowsPerPage}`
    );
    if (!res.data) {
      throw new Error("Failed to fetch fuel data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching fuel data:", error);
    return error.response?.data?.message || "Error fetching fuel data";
  }
}

// Get all Fuels without Pagination
export async function getAllFuels() {
  try {
    const res = await api.get("/fuel-activities");
    if (!res.data) {
      throw new Error("Failed to fetch fuel data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching fuel data:", error);
    return error.response?.data?.message || "Error fetching fuel data";
  }
}

// Update Fuel
export async function updateFuel(data: fuelData, userId: string) {
  try {
    const res: AxiosResponse<fuelData> = await api.patch(
      `/fuel-activities/${userId}`,
      data
    );
    if (!res.data) {
      throw new Error("Failed to update fuel data");
    }
    return { response: res.data, status: res.status };
  } catch (error: any) {
    console.error("Error updating fuel data:", error);
    return {
      error: error.response?.data?.message || "Error updating fuel data",
      status: error.response?.status || 500,
    };
  }
}

// Add new Fuel
export async function createFuel(data: fuelData) {
  try {
    const res: AxiosResponse<fuelData> = await api.post(
      `/fuel-activities/`,
      data
    );
    if (!res.data) {
      throw new Error("Failed to create fuel data");
    }
    return { response: res.data, status: res.status };
  } catch (error: any) {
    console.error("Error creating fuel data:", error);
    return {
      error: error.response?.data?.message || "Error creating fuel data",
      status: error.response?.status || 500,
    };
  }
}

// Delete Fuel
export async function deleteFuel(userId: string) {
  try {
    const res: AxiosResponse<fuelData> = await api.delete(
      `/fuel-activities/${userId}`
    );
    if (!res.data) {
      throw new Error("Failed to delete fuel data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error deleting fuel data:", error);
    return error.response?.data?.message || "Error deleting fuel data";
  }
}

// Get single Fuel
export async function getFuel(userId: string | undefined) {
  try {
    const res = await api.get(`/fuel-activities/${userId}`);
    if (!res.data) {
      throw new Error("Failed to fetch fuel data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching fuel data:", error);
    return error.response?.data?.message || "Error fetching fuel data";
  }
}

export async function updateStatus(status: number, ids: string[]) {
  return await api.patch(`/fuel-activities/status`, {
    status,
    activities: ids,
  });
}
