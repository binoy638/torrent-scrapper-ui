import axios from "axios";

// export const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_URL });
export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});
