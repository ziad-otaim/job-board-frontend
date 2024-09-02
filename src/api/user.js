export default function (axios) {
  return {
    getProfile() {
      return axios.get("user/profile");
    },

    updateProfile(body) {
      return axios.put("user/profile", body);
    },
  };
}
