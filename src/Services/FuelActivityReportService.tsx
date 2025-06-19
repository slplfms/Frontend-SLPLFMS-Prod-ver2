import api from "../axios/interceptor";


// Get Centers
export async function getFuelActivityReport(startDate: string, endDate: string, type: string) {
  try {
    const res = await api.get(`/reports/monthly-fuel-activity?startDate=${startDate}&endDate=${endDate}&type=${type}`);
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return error;
  }
}

