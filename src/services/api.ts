import axios from 'axios';

// Fetch the API URL from environment variables
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

export const getStations = (location: string) => api.get(`/bike-stations/${location}/stations`);
export const getStationStatus = (location: string, id: string) => api.get(`/bike-stations/${location}/station-status/${id}`);
export const getSystemInformation = (location: string) => api.get(`/bike-stations/${location}/system-info`);
