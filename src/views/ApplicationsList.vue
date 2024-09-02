<script setup>
import { ref, inject, defineProps, reactive } from "vue";
import { formatDate } from "@/utils/helpers";
import { toast } from "vue3-toastify";
import { useUserStore } from "@/store/user";

const props = defineProps({
  jobId: {
    type: Number,
    default: 0,
  },
});

const isEmployer = useUserStore().getUser?.role === "employer";
const api = inject("api");

const applications = ref([]);
const isLoading = reactive({
  fetching: false,
  action: 0,
});

const fetchApplications = async () => {
  isLoading.fetching = true;
  try {
    const params = props.jobId
      ? {
          job_id: props.jobId,
        }
      : {};
    const response = await api.applications.getApplications(params);

    applications.value = response.data;
  } catch (error) {
    console.error("Failed to fetch applications:", error);
  }
  isLoading.fetching = false;
};

const cancelApplication = async (applicationId) => {
  isLoading.action = applicationId;
  try {
    await api.applications.cancelApplication(applicationId);
    await fetchApplications();
    toast.success("Application canceled successfully");
  } catch (error) {
    toast.error("Failed to cancel application. Please try again.");
  }
  isLoading.action = 0;
};

const acceptApplication = async (applicationId) => {
  isLoading.action = applicationId;
  try {
    await api.applications.acceptApplication(applicationId);
    await fetchApplications();
    toast.success("Application accepted successfully");
  } catch (error) {
    toast.error("Failed to accept application. Please try again.");
  }
  isLoading.action = 0;
};

const rejectApplication = async (applicationId) => {
  isLoading.action = applicationId;
  try {
    await api.applications.rejectApplication(applicationId);
    await fetchApplications();
    toast.success("Application rejected successfully");
  } catch (error) {
    toast.error("Failed to reject application. Please try again.");
  }
  isLoading.action = 0;
};

const confirmCancelApplication = (applicationId) => {
  if (confirm("Are you sure you want to cancel this application?")) {
    cancelApplication(applicationId);
  }
};

fetchApplications();
</script>
<template>
  <div class="container mt-4">
    <h2 class="mb-4">Job Applications</h2>
    <div v-if="isLoading.fetching">Loading...</div>
    <div class="row gap-4 justify-content-center px-3" v-else>
      <div v-if="!applications.length">No Records Found!</div>
      <div
        v-for="application in applications"
        :key="application.id"
        class="col-sm-6 col-lg-3 p-3 border rounded"
        :class="{
          'card-loading': isLoading.action === application.id,
        }"
      >
        <h5 class="mb-1">{{ application?.job?.title }}</h5>

        <template v-if="isEmployer">
          <p class="mb-1">
            <strong>Applicant Name:</strong> {{ application?.applicant_name }}
          </p>
          <p class="mb-1">
            <strong>Applicant Email:</strong> {{ application?.applicant_email }}
          </p>
        </template>
        <template v-else>
          <p class="mb-1">
            <strong>Job Title:</strong> {{ application?.job_title }}
          </p>
          <p class="mb-1">
            <strong>Job Location:</strong> {{ application?.job_location }}
          </p>
          <p class="mb-1">
            <strong>Job Salary:</strong> ${{ application?.job_salary }}
          </p>
        </template>

        <p class="mb-1">
          <strong>Resume:</strong>
          <a
            :href="application.resume"
            target="_blank"
            class="text-decoration-none"
          >
            View Resume
          </a>
        </p>
        <div class="mb-2">
          <small class="text-muted">
            Applied on: {{ formatDate(application.created_at) }}
          </small>
        </div>

        <div
          class="py-1 px-4 rounded text-white text-center text-capitalize mx-auto"
          :class="
            application.status === 'accepted' ? 'bg-success' : 'bg-danger'
          "
          v-if="['accepted', 'rejected'].includes(application.status)"
        >
          {{ application.status }}
        </div>

        <template v-else>
          <div class="d-flex flex-wrap gap-2" v-if="isEmployer">
            <button
              class="btn btn-success mt-2"
              @click="acceptApplication(application.id)"
            >
              Accept
            </button>

            <button
              rejected
              class="btn btn-danger mt-2"
              @click="rejectApplication(application.id)"
            >
              Reject
            </button>
          </div>

          <button
            v-else
            class="btn btn-danger mt-2"
            @click="confirmCancelApplication(application.job_id)"
          >
            Cancel Application
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
