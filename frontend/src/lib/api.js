import axios from 'axios';

// VITE_API_URL is read from frontend/.env in development, and from an
// environment variable set on Render once deployed. Falling back to
// localhost keeps local development working with no extra setup.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL });

export default api;
