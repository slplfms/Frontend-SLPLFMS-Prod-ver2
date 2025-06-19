import api from "../axios/interceptor";
import { AxiosResponse } from "axios";
import { schema } from "../components/FuelStation/addFuelStation";
import { z } from "zod";

type fuelStationData = z.infer<typeof schema>;
// Get Vehicle
export async function getFuelPrices(page: number, rowsPerPage: number) {
  try {
    const res = await api.get(`/fuel-prices?page=${page}&limit=${rowsPerPage}`);
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return false;
  }
}

// Get all Fuel Prices without pagination
export async function getAllFuelPrices() {
  try {
    const res = await api.get("/fuel-prices");
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return false;
  }
}

// Update Vehicle
export async function updateFuelPrice(data: fuelStationData, userId: string) {
  try {
    const res: AxiosResponse<fuelStationData> = await api.patch(
      `/fuel-prices/${userId}`,
      data
    );
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return false;
  }
}

// Add new Vehicle
export async function createFuelPrice(data: fuelStationData) {
  try {
    const res: AxiosResponse<fuelStationData> = await api.post(`/fuel-prices/`, data);
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return false;
  }
}

// Delete Vehicle
export async function deleteFuelPrice(roleId: string) {
  try {
    const res: AxiosResponse<fuelStationData> = await api.delete(`/fuel-prices/${roleId}`);
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return false;
  }
}

// get Single Vehicle
export async function getFuelPrice(roleId: string | undefined) {
  try {
    const res = await api.get(`/fuel-prices/${roleId}`);
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return false;
  }
}
