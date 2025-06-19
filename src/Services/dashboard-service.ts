import api from "../axios/interceptor";
import { AxiosResponse } from "axios";

// Get all daily Kms without Pagination
export async function getDashboardCardsData() {
  try {
    const res: AxiosResponse<any> = await api.get(`/overview`);
    if (!res.data) {
      throw new Error("Failed to fetch daily km data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching daily km data:", error);
    return error.response?.data?.message || "Error fetching daily km data";
  }
}

export async function getLatestFuelActivities() {
  try {
    const res = await api.get(
      `/fuel-activities?page=${1}&limit=${5}&sortBy=desc`
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


export async function getOverViewLeakageReportByFuel() {
  try {
    const res = await api.get(`reports/leakage`);
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return error;
  }
}

export async function getOverViewDailyActivity() {
  try {
    const res: AxiosResponse<any> = await api.get(
      `daily-activities/center-wise-kms`
    );
    if (!res.data) {
      throw new Error("Failed to fetch daily km data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching daily km data:", error);
    return error.response?.data?.message || "Error fetching daily km data";
  }
}

export async function getUsersDocsReminder() {
  try {
    const res: AxiosResponse<any> = await api.get(`user-documents/reminders`);
    if (!res.data) {
      throw new Error("Failed to fetch daily km data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching daily km data:", error);
    return error.response?.data?.message || "Error fetching daily km data";
  }
}

export async function getVehicleDocsReminder() {
  try {
    const res: AxiosResponse<any> = await api.get(
      `vehicle-documents/reminders`
    );
    if (!res.data) {
      throw new Error("Failed to fetch daily km data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching daily km data:", error);
    return error.response?.data?.message || "Error fetching daily km data";
  }
}

export async function getOverViewFuelActivityCenter() {
  try {
    const res: AxiosResponse<any> = await api.get(
      `/fuel-activities/center-wise-fuel`
    );
    if (!res.data) {
      throw new Error("Failed to fetch daily km data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching daily km data:", error);
    return error.response?.data?.message || "Error fetching daily km data";
  }
}

export async function getOverViewFuelActivityStation() {
  try {
    const res: AxiosResponse<any> = await api.get(
      `/fuel-activities/fueling-station-wise-fuel`
    );
    if (!res.data) {
      throw new Error("Failed to fetch daily km data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching daily km data:", error);
    return error.response?.data?.message || "Error fetching daily km data";
  }
}

export async function getCenterWiseLeakageSummary () {
  try {
    const res: AxiosResponse<any> = await api.get(
      `/reports/center-wise-leakage`
    );
    if (!res.data) {
      throw new Error("Failed to fetch daily km data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching center wise leakage summary:", error);
    return error.response?.data?.message || "Error fetching center wise leakage summary";
  }
}
