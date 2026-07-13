import api from "@/lib/axios";

export async function getDashboardStats() {
  const { data } = await api.get("/admin/dashboard");
  if (!data.success) throw new Error(data.message || "Failed to fetch stats");
  return data;
}

export async function getAllUsers(params = {}) {
  const { data } = await api.get("/admin/users", { params });
  if (!data.success) throw new Error(data.message || "Failed to fetch users");
  return data;
}

export async function toggleUserStatus(id) {
  const { data } = await api.patch(`/admin/users/${id}/toggle-status`);
  if (!data.success) throw new Error(data.message || "Failed to toggle user status");
  return data;
}

export async function getAllPropertiesAdmin(params = {}) {
  const { data } = await api.get("/admin/properties", { params });
  if (!data.success) throw new Error(data.message || "Failed to fetch properties");
  return data;
}

export async function getAllHotelsAdmin(params = {}) {
  const { data } = await api.get("/hotels", { params });
  if (!data.success) throw new Error(data.message || "Failed to fetch hotels");
  return data;
}

export async function toggleHotelStatus(id) {
  const { data } = await api.patch(`/admin/hotels/${id}/toggle-status`);
  if (!data.success) throw new Error(data.message || "Failed to toggle hotel status");
  return data;
}
