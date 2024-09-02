export default function (axios) {
  return {
    login(body) {
      return axios.post("login", body);
    },

    register(body) {
      return axios.post("register", body);
    },

    logout() {
      return axios.post("logout");
    },
  };
}
