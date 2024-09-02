<script setup>
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import JobApplicationForm from "./JobApplicationForm.vue";
import { formatDate } from "@/utils/helpers";
import { useUserStore } from "@/store/user";
import ApplicationsList from "./ApplicationsList.vue";
import Loader from "@/components/Loader.vue";

const isEmployer = useUserStore().getUser?.role === "employer";
// Initialize reactive variables
const route = useRoute();
const job = ref({});
const showApplicationForm = ref(false);
const api = inject("api");
const isLoading = ref(false); // Loading state
const hasApplied = ref(false); // Loading state

// Function to fetch job details
const fetchJobDetails = async () => {
  isLoading.value = true; // Start loading
  try {
    const response = await api.jobs.getJobDetails(route.params.id);
    job.value = response.data.job;
    hasApplied.value = response.data.is_applied;
  } catch (error) {
    console.error("Error fetching job details:", error);
  } finally {
    isLoading.value = false; // Stop loading
  }
};

// Function to open application form modal
const openApplicationForm = () => {
  showApplicationForm.value = true;
};

// Fetch job details when the component is mounted
onMounted(fetchJobDetails);
</script>

<template>
  <div class="container mt-4">
    <!-- Loading Spinner -->
    <Loader v-if="isLoading" />

    <!-- Job Details -->
    <div v-else>
      <div class="card-body">
        <h5 class="card-title">{{ job.title }}</h5>
        <p class="card-text">{{ job.description }}</p>
        <ul class="list-unstyled">
          <li class="mb-2"><strong>Location:</strong> {{ job.location }}</li>
          <li class="mb-2"><strong>Work Type:</strong> {{ job.work_type }}</li>
          <li class="mb-2"><strong>Category:</strong> {{ job.category }}</li>
          <li class="mb-2"><strong>Salary:</strong> ${{ job.salary }}</li>
          <li class="mb-2">
            <strong>Deadline:</strong> {{ formatDate(job.deadline) }}
          </li>
        </ul>

        <template v-if="!isEmployer">
          <div class="d-flex gap-4">
            <div v-if="hasApplied" class="p-2 bg-success text-white rounded">
              Applied
            </div>
            <button class="btn btn-primary" @click="openApplicationForm" v-else>
              Apply for Job
            </button>
          </div>

          <!-- Job Application Form Modal -->
          <JobApplicationForm
            v-if="showApplicationForm"
            :job-id="job.id"
            @close="showApplicationForm = false"
          />
        </template>

        <ApplicationsList :jobId="job.id" v-if="isEmployer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>
