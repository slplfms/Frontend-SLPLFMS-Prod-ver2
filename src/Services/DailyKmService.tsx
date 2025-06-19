import api from "../axios/interceptor";
import { schema } from "../components/Manage-Daily_Km/AddDailyKm";
import { z } from "zod";
import { AxiosResponse } from "axios";

type dailyKmData = z.infer<typeof schema>;

// Get All daily Kms with Pagination
export async function getDailyKms(
  page: number,
  rowsPerPage: number,
  params: any
) {
  try {
    const res = await api.get(`/daily-activities`, {
      params: {
        page,
        limit: rowsPerPage,
        ...params,
      },
    });
    if (!res.data) {
      throw new Error("Failed to fetch daily km data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching daily km data:", error);
    return error.response?.data?.message || "Error fetching daily km data";
  }
}

// Get all daily Kms without Pagination
export async function getAllDailyKms() {
  try {
    const res = await api.get("/daily-activities");
    if (!res.data) {
      throw new Error("Failed to fetch daily km data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching daily km data:", error);
    return error.response?.data?.message || "Error fetching daily km data";
  }
}

// Update daily Km
export async function updateDailyKm(data: dailyKmData, userId: string) {
  try {
    const res: AxiosResponse<dailyKmData> = await api.patch(
      `/daily-activities/${userId}`,
      data
    );
    if (!res.data) {
      throw new Error("Failed to update daily km data");
    }
    return { response: res.data, status: res.status };
  } catch (error: any) {
    console.error("Error updating daily km data:", error);
    return {
      error: error.response?.data?.message || "Error updating daily km data",
      status: error.response?.status || 500,
    };
  }
}

// Add new daily Km
export async function createDailyKm(data: dailyKmData) {
  try {
    const res: AxiosResponse<dailyKmData> = await api.post(
      `/daily-activities/`,
      data
    );
    if (!res.data) {
      throw new Error("Failed to create daily km data");
    }
    return { response: res.data, status: res.status };
  } catch (error: any) {
    console.error("Error creating daily km data:", error);
    return {
      error: error.response?.data?.message || "Error creating daily km data",
      status: error.response?.status || 500,
    };
  }
}

// Delete daily Km
export async function deleteDailyKm(id: string) {
  try {
    const res: AxiosResponse<dailyKmData> = await api.delete(
      `/daily-activities/${id}`
    );
    if (!res.data) {
      throw new Error("Failed to delete daily km data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error deleting daily km data:", error);
    return error.response?.data?.message || "Error deleting daily km data";
  }
}

export async function updateStatus(status: number, ids: (string | number)[]): Promise<any> {
  // Ensure all IDs are strings and filter out any invalid values
  const stringIds = ids
    .map(id => String(id))
    .filter(id => id && id !== 'undefined' && id !== 'null');
  
  if (stringIds.length === 0) {
    throw new Error('No valid IDs provided for status update');
  }
  
  return await api.patch(`/daily-activities/status`, {
    status,
    activities: stringIds,
  });
}

// Get single daily Km
export async function getDailyKm(id: string | undefined) {
  try {
    const res = await api.get(`/daily-activities/${id}`);
    if (!res.data) {
      throw new Error("Failed to fetch daily km data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching daily km data:", error);
    return error.response?.data?.message || "Error fetching daily km data";
  }
}
export async function updateActivityList(data: any) {
  const res = await api.patch(`/daily-activities/activity-list`, data);
  return res;
}

export async function getVehoclesAndDailyKms(date: string, centerId: string) {
  try {
    const res = await api.get(`/daily-activities/activity-list`, {
      params: {
        date,
        centerId,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Error fetching daily km data:", error);
    throw error.response?.data?.message || "Error fetching daily km data";
  }
}
