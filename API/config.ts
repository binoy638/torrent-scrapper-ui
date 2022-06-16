import axios from "axios";

// export const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_URL });
export const API = axios.create({
  baseURL: "https://n19l07htrd.execute-api.ap-southeast-1.amazonaws.com/dev/",
});
