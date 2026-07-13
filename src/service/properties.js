import api from "@/lib/axios";

export async function getProperties(params = {}) {
  const { data } = await api.get("/properties", { params });
  if (!data.success) throw new Error(data.message || "Failed to fetch properties");
  return data;
}

export async function createProperty(body) {
  const { data } = await api.post("/properties", body);
  if (!data.success) throw new Error(data.message || "Failed to create property");
  return data;
}

export async function updateProperty(id, body) {
  const { data } = await api.put(`/properties/${id}`, body);
  if (!data.success) throw new Error(data.message || "Failed to update property");
  return data;
}

export async function deleteProperty(id) {
  const { data } = await api.delete(`/properties/${id}`);
  if (!data.success) throw new Error(data.message || "Failed to delete property");
  return data;
}

export async function moderateProperty(id, status) {
  const { data } = await api.patch(`/admin/properties/${id}/status`, { status });
  if (!data.success) throw new Error(data.message || "Failed to moderate property");
  return data;
}
