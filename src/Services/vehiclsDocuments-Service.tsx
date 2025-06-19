import api from "../axios/interceptor";
import { schema } from "../components/vehicle/vehicle-form";
import { z } from "zod";
import { AxiosResponse } from "axios";

type VehicleData = z.infer<typeof schema>;

// Get Vehicle Docs
export async function getVehiclesDocs(vehicleId: string) {
  try {
    const res = await api.get("/Vehicle-Documents", {
      params: {
        vehicleId,
      },
    });
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return error;
  }
}

// Update Vehicle Doc
export async function updateVehicleDoc(data: any, userId: string) {
  try {
    const res: AxiosResponse<VehicleData> = await api.patch(
      `/Vehicle-Documents/${userId}`,
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

// Add new Vehicle Doc
export async function createVehicleDoc(data: any) {
  try {
    const res: AxiosResponse<VehicleData> = await api.post(
      `/Vehicle-Documents`,
      data
    );
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

// Delete Vehicle Doc
export async function deleteVehicleDoc(data: any) {
  try {
    const res: AxiosResponse<VehicleData> = await api.delete(`/Vehicle-Documents/${data}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

// get Single Vehicle's Doc
export async function getVehicleDoc(docId: string | undefined) {
  try {
    const res = await api.get(`/Vehicle-Documents/${docId}`);
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return error;
  }
}
