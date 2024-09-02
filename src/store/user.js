import { defineStore } from "pinia";
export const useUserStore = defineStore("userStore", {
  state: () => {
    return {
      user:
        localStorage.getItem("user") && localStorage.getItem("user") !== "null"
          ? JSON.parse(localStorage.getItem("user") || "")
          : {}, // Setting Correct User based on current user status
      token: localStorage.getItem("token"),
      loggedOut: true,
    };
  },
  actions: {
    setUser(user) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
      this.loggedOut = false;
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", JSON.stringify(token));
    },
    logout() {
      this.setUser(null);
      this.setToken(null);
      this.loggedOut = true;
    },
  },
  getters: {
    getUser() {
      return this.user;
    },
    getToken() {
      return this.token;
    },
    getIsAuthenticated() {
      return !this.loggedOut;
    },
  },
});
