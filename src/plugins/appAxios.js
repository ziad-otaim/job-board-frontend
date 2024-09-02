import apiFun from "../api/apiFun";
import axios from "axios";
import router from "../router";
import { watch } from "vue";
import { useUserStore } from "@/store/user";

const apiUrl = "http://localhost:8000/api";

export default function (app) {
  const appAxios = axios.create({
    baseURL: apiUrl,
    headers: {
      Accept: "application/json",
    },
  });

  const userStore = useUserStore();
  // Get the token from the user store
  const token = localStorage.getItem("token");

  // Add the token to the axios headers
  appAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  watch(
    () => userStore.getToken,
    (newToken) => {
      appAxios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    }
  );

  appAxios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        userStore.logout();
        router.push("/login");
      }
      return Promise.reject(error);
    }
  );

  const instances = {
    appAxios: appAxios,
  };
  app.provide("api", { ...apiFun(instances) });
}
