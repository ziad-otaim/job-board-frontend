export default function (axios) {
  return {
    getAdminDashboard() {
      return axios.get("/admin/dashboard");
    },

    getUsers() {
      return axios.get("/admin/users");
    },

    updateUser(userId, body) {
      return axios.put(`/admin/users/${userId}`, body);
    },

    getJobs() {
      return axios.get("/admin/jobs");
    },

    approveJob(jobId) {
      return axios.post(`admin/jobs/${jobId}/approve`);
    },

    deleteJob(jobId) {
      return axios.delete(`/admin/jobs/${jobId}`);
    },

    deleteUser(userId) {
      return axios.delete(`/admin/users/${userId}`);
    },
  };
}
