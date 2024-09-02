export default function (axios) {
  return {
    getApplications(params) {
      return axios.get(`applications`, { params });
    },

    applyForJob(jobId, body) {
      return axios.post(`jobs/${jobId}/apply`, body);
    },

    acceptApplication(applicationId) {
      return axios.post(`applications/${applicationId}/accept`);
    },

    rejectApplication(applicationId) {
      return axios.post(`applications/${applicationId}/reject`);
    },

    cancelApplication(id) {
      return axios.delete(`jobs/${id}/application`);
    },
  };
}
