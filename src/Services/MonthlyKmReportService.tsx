import api from "../axios/interceptor";


// Get Centers
export async function getMonthlyKmReport(startDate: string, endDate: string) {
  try {
    const res = await api.get(`/reports/monthly-km-activity?startDate=${startDate}&endDate=${endDate}`);
    if (!res.data) {
      throw new Error("Failed to fetch user data");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return error;
  }
}

