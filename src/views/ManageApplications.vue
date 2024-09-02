<template>
    <div class="container mt-4">
      <h2>Manage Applications</h2>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Job</th>
            <th>Applicant</th>
            <th>Resume</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="application in applications" :key="application.id">
            <td>{{ application.id }}</td>
            <td>{{ application.job.title }}</td>
            <td>{{ application.user.name }}</td>
            <td><a :href="application.resume" target="_blank">View Resume</a></td>
            <td>{{ application.status }}</td>
            <td>
              <button class="btn btn-success btn-sm" @click="updateStatus(application.id, 'accepted')">Accept</button>
              <button class="btn btn-danger btn-sm" @click="updateStatus(application.id, 'rejected')">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const applications = ref([]);
  
  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/applications');
      applications.value = response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };
  
  const updateStatus = async (applicationId, status) => {
    try {
      await axios.patch(`/api/applications/${applicationId}`, { status });
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };
  
  onMounted(fetchApplications);
  </script>
  
  <style scoped>
  /* Add any custom styles here */
  </style>
  