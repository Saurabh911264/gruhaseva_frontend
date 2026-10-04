import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const fetchBookings = async () => {
  const response = await axios.get(`${API_BASE}/bookings`);
  return response.data;
};

export const fetchWorkers = async () => {
  const response = await axios.get(`${API_BASE}/workers`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await axios.post(`${API_BASE}/bookings`, bookingData);
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await axios.patch(`${API_BASE}/bookings/${id}/status`, { status });
  return response.data;
};

export const createWorker = async (workerData) => {
  const response = await axios.post(`${API_BASE}/workers`, workerData);
  return response.data;
};