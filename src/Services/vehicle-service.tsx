import api from "../axios/interceptor";
import { schema } from "../components/vehicle/vehicle-form";
import { z } from "zod";
import { AxiosResponse } from "axios";

type VehicleData = z.infer<typeof schema>;

// Get Vehicles with Pagination
export async function getVehicles(
  page: number,
  limit: number,
  search: string | undefined = undefined,
  centerId: string | undefined = undefined
) {
  try {
    const res = await api.get(`/vehicles`, {
      params: {
        page,
        limit,
        search,
        centerId,
      },
    });
    if (!res.data) {
      throw new Error("Failed to fetch vehicle data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching vehicle data:", error);
    return error.response?.data?.message || "Error fetching vehicle data";
  }
}

// Get all Vehicles without Pagination
export async function getAllVehicles() {
  try {
    const res = await api.get(`/vehicles`);
    if (!res.data) {
      throw new Error("Failed to fetch vehicle data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching vehicle data:", error);
    return error.response?.data?.message || "Error fetching vehicle data";
  }
}

// Get all Vehicles by CenterId
export async function getAllVehiclesByCenter(centerId: string) {
  try {
    const res = await api.get(
      `/vehicles/available-vehicle?centerId=${centerId}`
    );
    if (!res.data) {
      throw new Error("Failed to fetch vehicle data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching vehicle data:", error);
    return error.response?.data?.message || "Error fetching vehicle data";
  }
}

// Update Vehicle
export async function updateVehicle(data: VehicleData, userId: string) {
  return await api.patch(`/vehicles/${userId}`, data);
}

// Add new Vehicle
export async function createVehicle(data: VehicleData) {
  return await api.post(`/vehicles`, data);
}

// Delete Vehicle
export async function deleteVehicle(userId: string) {
  try {
    const res: AxiosResponse<VehicleData> = await api.delete(
      `/vehicles/${userId}`
    );
    if (!res.data) {
      throw new Error("Failed to delete vehicle data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error deleting vehicle data:", error);
    return error.response?.data?.message || "Error deleting vehicle data";
  }
}

// Get Single Vehicle
export async function getVehicle(userId: string | undefined) {
  try {
    const res = await api.get(`/vehicles/${userId}`);
    if (!res.data) {
      throw new Error("Failed to fetch vehicle data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching vehicle data:", error);
    return error.response?.data?.message || "Error fetching vehicle data";
  }
}
