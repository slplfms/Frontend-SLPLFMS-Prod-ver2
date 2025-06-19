import api from "../axios/interceptor";
import { AxiosResponse } from "axios";
import { schema } from "../components/manageRoute/add-route";
import { z } from "zod";

type routeData = z.infer<typeof schema>;

// Get all routes with Pagination
export async function getRoutes(page: number, limit: number, search: string) {
  try {
    const res = await api.get(`/routes`, { params: { page, limit, search } });
    if (!res.data) {
      throw new Error("Failed to fetch route data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching route data:", error);
    return error.response?.data?.message || "Error fetching route data";
  }
}

// Get all routes without Pagination
export async function getAvailableRoutes(centerId: string) {
  try {
    const res = await api.get("/available-routes", {
      params: {
        centerId,
      },
    });
    if (!res.data) {
      throw new Error("Failed to fetch route data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching route data:", error);
    return error.response?.data?.message || "Error fetching route data";
  }
}

// Get all routes without Pagination
export async function getAllRoutes() {
  try {
    const res = await api.get("/routes");
    if (!res.data) {
      throw new Error("Failed to fetch route data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching route data:", error);
    return error.response?.data?.message || "Error fetching route data";
  }
}

// Update route
export async function updateRoute(data: routeData, routeId: string) {
  try {
    const res: AxiosResponse<routeData> = await api.patch(
      `/routes/${routeId}`,
      data
    );
    if (!res.data) {
      throw new Error("Failed to update route data");
    }
    return { response: res.data, status: res.status };
  } catch (error: any) {
    console.error("Error updating route data:", error);
    return {
      error: error.response?.data?.message || "Error updating route data",
      status: error.response?.status || 500,
    };
  }
}

// Add new route
export async function createRoute(data: routeData) {
  try {
    const res: AxiosResponse<routeData> = await api.post(`/routes/`, data);
    if (!res.data) {
      throw new Error("Failed to create route data");
    }
    return { response: res.data, status: res.status };
  } catch (error: any) {
    console.error("Error creating route data:", error);
    return {
      error: error.response?.data?.message || "Error creating route data",
      status: error.response?.status || 500,
    };
  }
}

// Delete route
export async function deleteRoute(routeId: string) {
  try {
    const res: AxiosResponse<routeData> = await api.delete(
      `/routes/${routeId}`
    );
    if (!res.data) {
      throw new Error("Failed to delete route data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error deleting route data:", error);
    return error.response?.data?.message || "Error deleting route data";
  }
}

// Get single route
export async function getRoute(routeId: string | undefined) {
  try {
    const res = await api.get(`/routes/${routeId}`);
    if (!res.data) {
      throw new Error("Failed to fetch route data");
    }
    return res.data;
  } catch (error: any) {
    console.error("Error fetching route data:", error);
    return error.response?.data?.message || "Error fetching route data";
  }
}
