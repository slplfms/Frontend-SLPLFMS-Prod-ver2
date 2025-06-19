import api from "../axios/interceptor";
import { z } from "zod";
import { schema } from "../components/fuel-receipt/add-fuel-receipt";

type fuelData = z.infer<typeof schema>;

// Get Fuels with Pagination
export async function getReceipts(page: number, rowsPerPage: number) {
  return await api.get(`/fuel-receipts`, {
    params: {
      limit: rowsPerPage,
      page,
    },
  });
}

// Get all Fuels without Pagination
export async function getAllFuels() {
  return await api.get("/fuel-receipts");
}

// Update Fuel
export async function updateReceipt(data: fuelData, id: string) {
  return await api.patch(`/fuel-receipts/${id}`, data);
}

export async function updateReceiptPaidStatus(id: string, data: any) {
  return await api.patch(`/fuel-receipts/change-paid-status/${id}`, data);
}

// Add new Fuel
export async function createReceipt(data: fuelData) {
  return await api.post(`/fuel-receipts/`, data);
}

// Delete Fuel
export async function deleteReceipt(id: string) {
  return await api.delete(`/fuel-receipts/${id}`);
}

// Get single Fuel
export async function getReceipt(id: string | undefined) {
  return await api.get(`/fuel-receipts/${id}`);
}
export async function getReceiptAndActivities(id: string | undefined) {
  return await api.get(`/fuel-receipts/vehicles/${id}`);
}

export async function saveReceiptActivity(id: string, data: any) {
  return await api.patch(`/fuel-receipts/vehicles/${id}`, data);
}
