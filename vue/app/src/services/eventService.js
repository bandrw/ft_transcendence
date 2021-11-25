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
  async users() {
    return await apiClient.get("/users/getAll");
  },
  async login(login) {
    return await apiClient.post("/users/login", { login: login });
  },
  async login2(login, pass) {
    return await apiClient.post("/auth/login", {
      username: login,
      password: pass,
    });
  },
  async onlineUsers() {
    return await apiClient.get("/users/getOnline");
  },
  async checkExist(login) {
    return await apiClient.get("/users/checkExist?login=" + login);
  },
  async createUser(data) {
    return await apiClient.post("/users/create", data);
  },
  async setStatus(login, status = "green") {
    return await apiClient.get(
      `/ladder/gameStatus?login=${login}&status=${status}`
    );
  },
  async systemStatus(login) {
    return await apiClient.get(`ladder/systemStatus?login=${login}`);
  },
  async updateAvatar(login) {
    return await apiClient.get(`/users/avatar?login=${login}`);
  },
  async logout(user) {
    return await apiClient.post("/users/logout", { user: user });
  },
};
