import api from "@/lib/axios";

export async function getMyBookings() {
  const { data } = await api.get("/bookings/me");
  if (!data.success) throw new Error(data.message || "Failed to fetch bookings");
  return data;
}

export async function getHotelBookings(hotelId) {
  const { data } = await api.get(`/bookings/hotel/${hotelId}`);
  if (!data.success) throw new Error(data.message || "Failed to fetch bookings");
  return data;
}

export async function updateBookingStatus(id, status) {
  const { data } = await api.patch(`/bookings/${id}/status`, { status });
  if (!data.success) throw new Error(data.message || "Failed to update booking");
  return data;
}

export async function cancelBooking(id) {
  const { data } = await api.patch(`/bookings/${id}/cancel`);
  if (!data.success) throw new Error(data.message || "Failed to cancel booking");
  return data;
}
