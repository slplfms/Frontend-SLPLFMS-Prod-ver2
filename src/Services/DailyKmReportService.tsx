import api from "../axios/interceptor";


// Get Centers
export async function getDailyKmReport(startDate:string, endDate:string) {
  try {
    const res = await api.get(`/reports/daily-km-activity?startDate=${startDate}&endDate=${endDate}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

