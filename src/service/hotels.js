import api from "@/lib/axios";

export async function getMyHotels(params = {}) {
  const { data } = await api.get("/hotels/me/listings", { params });
  if (!data.success) throw new Error(data.message || "Failed to fetch your hotels");
  return data;
}

export async function getHotels(params = {}) {
  const { data } = await api.get("/hotels", { params });
  if (!data.success) throw new Error(data.message || "Failed to fetch hotels");
  return data;
}

export async function createHotel(body) {
  const { data } = await api.post("/hotels", body);
  if (!data.success) throw new Error(data.message || "Failed to create hotel");
  return data;
}

export async function updateHotel(id, body) {
  const { data } = await api.put(`/hotels/${id}`, body);
  if (!data.success) throw new Error(data.message || "Failed to update hotel");
  return data;
}

export async function deleteHotel(id) {
  const { data } = await api.delete(`/hotels/${id}`);
  if (!data.success) throw new Error(data.message || "Failed to delete hotel");
  return data;
}

export async function addRoom(hotelId, body) {
  const { data } = await api.post(`/hotels/${hotelId}/rooms`, body);
  if (!data.success) throw new Error(data.message || "Failed to add room");
  return data;
}

export async function updateRoom(roomId, body) {
  const { data } = await api.put(`/hotels/rooms/${roomId}`, body);
  if (!data.success) throw new Error(data.message || "Failed to update room");
  return data;
}
export async function getRooms(hotelId, params = {}) {
  const { data } = await api.get(`/hotels/rooms/${hotelId}`, { params });
  if (!data.success) throw new Error(data.message || "Failed to fetch rooms");
  return data;
}

export async function deleteRoom(roomId) {
  const { data } = await api.delete(`/hotels/rooms/${roomId}`);
  if (!data.success) throw new Error(data.message || "Failed to delete room");
  return data;
}
