import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: false,
  timeout: 1000,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
});

export default {
  async login(login) {
    return await apiClient.post("/users/login", { login: login });
  },
  async onlineUsers() {
    return await apiClient.get("/users/getOnline");
  },
};
