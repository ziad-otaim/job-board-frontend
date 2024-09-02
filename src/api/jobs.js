export default function (axios) {
  return {
    getJobs(params) {
      return axios.get("jobs", { params });
    },

    getJobDetails(id) {
      return axios.get(`jobs/${id}`);
    },

    createJob(body) {
      return axios.post("jobs", body);
    },

    editJob(jobId, body) {
      return axios.put(`jobs/${jobId}`, body);
    },

    deleteJob(id) {
      return axios.delete(`jobs/${id}`);
    },
  };
}
