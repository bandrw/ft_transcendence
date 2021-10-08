import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://nest-connector:3000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
});

export default {
  login(login) {
    return apiClient.post("/users/login", { login: login });
  },
  onlineUsers() {
    return apiClient.get("/users/getOnline");
  },
};
