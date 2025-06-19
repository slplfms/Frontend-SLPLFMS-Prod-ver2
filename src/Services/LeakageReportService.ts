import api from "../axios/interceptor";


// Get Centers
export async function getLeakageReportByCenter(startDate: string, endDate: string) {
  try {
    const res = await api.get(`reports/leakage-by-center?startDate=${startDate}&endDate=${endDate}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}


export async function getLeakageReportByVehicle(startDate: string, endDate: string) {
  try {
    const res = await api.get(`reports/leakage-by-vehicle?startDate=${startDate}&endDate=${endDate}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

