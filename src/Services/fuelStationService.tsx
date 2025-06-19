import api from "../axios/interceptor";
import { AxiosResponse } from "axios";
import { schema } from "../components/FuelStation/addFuelStation";
import { z } from "zod";

type fuelStationData = z.infer<typeof schema>;

// Get Fuel Stations with Pagination
export async function getFuelStations(
  page: number,
  limit: number,
  search: string
) {
  try {
    const res = await api.get(`/fueling-stations`, {
      params: { page, limit, search },
    });
    if (!res.data) {
      throw new Error("Failed to fetch fuel station data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching fuel station data:", error);
    return error.response?.data?.message || "Error fetching fuel station data";
  }
}

// Get all Fuel Stations without Pagination
export async function getAllFuelStations() {
  try {
    const res = await api.get("/fueling-stations");
    if (!res.data) {
      throw new Error("Failed to fetch fuel station data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching fuel station data:", error);
    return error.response?.data?.message || "Error fetching fuel station data";
  }
}

// Update Fuel Station
export async function updateFuelStation(data: fuelStationData, userId: string) {
  try {
    const res: AxiosResponse<fuelStationData> = await api.patch(
      `/fueling-stations/${userId}`,
      data
    );
    if (!res.data) {
      throw new Error("Failed to update fuel station data");
    }
    return { response: res.data, status: res.status };
  } catch (error: any) {
    console.error("Error updating fuel station data:", error);
    return {
      error:
        error.response?.data?.message || "Error updating fuel station data",
      status: error.response?.status || 500,
    };
  }
}

// Add new Fuel Station
export async function createFuelStation(data: fuelStationData) {
  try {
    const res: AxiosResponse<fuelStationData> = await api.post(
      `/fueling-stations/`,
      data
    );
    if (!res.data) {
      throw new Error("Failed to create fuel station data");
    }
    return { response: res.data, status: res.status };
  } catch (error: any) {
    console.error("Error creating fuel station data:", error);
    return {
      error:
        error.response?.data?.message || "Error creating fuel station data",
      status: error.response?.status || 500,
    };
  }
}

// Delete Fuel Station
export async function deleteFuelStation(roleId: string) {
  try {
    const res: AxiosResponse<fuelStationData> = await api.delete(
      `/fueling-stations/${roleId}`
    );
    if (!res.data) {
      throw new Error("Failed to delete fuel station data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error deleting fuel station data:", error);
    return error.response?.data?.message || "Error deleting fuel station data";
  }
}

// Get single Fuel Station
export async function getFuelStation(roleId: string | undefined) {
  try {
    const res = await api.get(`/fueling-stations/${roleId}`);
    if (!res.data) {
      throw new Error("Failed to fetch fuel station data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching fuel station data:", error);
    return error.response?.data?.message || "Error fetching fuel station data";
  }
}
