<script setup>
import { ref, onMounted, computed, inject } from "vue";
import { toast } from "vue3-toastify";

const jobs = ref([]);
const loading = ref(false);
const error = ref(null);
const api = inject("api");

// Fetch jobs from API
const fetchJobs = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.admin.getJobs();
    jobs.value = response.data;
  } catch (err) {
    error.value = "Failed to load jobs.";
  } finally {
    loading.value = false;
  }
};

// Delete a job
const deleteJob = async (jobId) => {
  if (confirm("Are you sure you want to delete this job?")) {
    try {
      await api.admin.deleteJob(jobId);
      fetchJobs(); // Refresh the list after deletion
      toast.success("Job Deleted Successfully!");
    } catch (err) {
      error.value = "Failed to delete job.";
    }
  }
};

// Approve a job
const approveJob = async (jobId) => {
  try {
    await api.admin.approveJob(jobId);
    fetchJobs();
    toast.success("Job Approved Successfully!");
  } catch (err) {
    error.value = "Failed to approve job.";
  }
};

// Filter jobs based on search query
const filteredJobs = computed(() => {
  return jobs.value;
});

onMounted(fetchJobs);
</script>
<template>
  <div class="container mt-4">
    <h2>Job Postings</h2>
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <button class="btn btn-primary" @click="fetchJobs">Refresh</button>
        </div>
        <div v-if="loading" class="alert alert-info">Loading...</div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!filteredJobs.length">
              No Records found!
            </tr>
            <tr v-for="(job, index) in filteredJobs" :key="job.id">
              <td>{{ index + 1 }}</td>
              <td>{{ job.title }}</td>
              <td>{{ job.description }}</td>
              <td>{{ job.location }}</td>
              <td>{{ job.status }}</td>
              <td>
                <div class="d-flex flex-wrap gap-2">
                  <button
                    class="btn btn-success btn-sm me-2"
                    @click="approveJob(job.id)"
                  >
                    Approve
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="deleteJob(job.id)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
