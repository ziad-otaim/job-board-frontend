<script setup>
import { formatDate } from "@/utils/helpers";
import { ref, onMounted, inject, watch, reactive } from "vue";
import { useUserStore } from "@/store/user";
import { toast } from "vue3-toastify";
import Loader from "@/components/Loader.vue";

const api = inject("api");

const jobs = ref([]);
const isLoading = reactive({
  fetching: false,
  deleting: false,
});
const location = ref("");
const category = ref("");
const search = ref("");
const user = useUserStore().getUser;
const isEmployer = user?.role === "employer";

const fetchJobs = async () => {
  isLoading.fetching = true;
  try {
    const response = await api.jobs.getJobs({
      employer_id: isEmployer ? user?.id : "",
      location: location.value,
      category: category.value,
      search: search.value,
      status: !isEmployer ? "approved" : "",
    });
    jobs.value = response.data;
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
  } finally {
    isLoading.fetching = false;
  }
};

const deleteJob = async (id) => {
  if (confirm("Are you sure you want to delete this job?")) {
    isLoading.deleting = true;

    try {
      await api.jobs.deleteJob(id);

      toast.success("Job Deleted Successfully!");

      fetchJobs();
    } catch (error) {
      console.log(error);
    }

    isLoading.deleting = false;
  }
};

onMounted(() => {
  fetchJobs();
});

// Watchers to fetch jobs when search filters change
watch([location, category, search], fetchJobs);
</script>

<template>
  <div class="container mt-4 pb-5">
    <div class="d-flex justify-content-between gap-4">
      <h2 class="mb-4">Job Listings</h2>
      <RouterLink to="/job/create" v-if="isEmployer">
        <button class="btn btn-primary">Create Job</button>
      </RouterLink>
    </div>
    <!-- Search Filters -->
    <div class="mb-4">
      <div class="row gap-2 gap-md-0">
        <div class="col-md-4">
          <input
            type="text"
            v-model="search"
            class="form-control"
            placeholder="Wildcard Search"
          />
        </div>
        <div class="col-md-4">
          <input
            type="text"
            v-model="location"
            class="form-control"
            placeholder="Search by Location"
          />
        </div>
        <div class="col-md-4">
          <input
            type="text"
            v-model="category"
            class="form-control"
            placeholder="Search by Category"
          />
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <Loader v-if="isLoading.fetching" />

    <!-- Jobs List -->
    <div v-else class="row gap-4 justify-content-center px-3 w-100">
      <div v-if="!jobs.length">No Records Found!</div>
      <div
        v-for="job in jobs"
        :key="job.id"
        class="col-sm-6 col-lg-3 border rounded p-4 w-100"
        :class="{
          'card-loading': isLoading.deleting,
        }"
      >
        <div class="d-flex gap-2 align-items-center">
          <h5 class="mb-1">
            {{ job.title }}
          </h5>
          <div
            class="px-2 py-1 rounded text-capitalize text-sm h6"
            :class="
              job.status === 'pending' ? 'bg-warning' : 'bg-success text-white'
            "
          >
            {{ job.status }}
          </div>
        </div>
        <p class="mb-1"><strong>Location:</strong> {{ job.location }}</p>
        <p class="mb-1"><strong>Category:</strong> {{ job.category }}</p>
        <p class="mb-1"><strong>Description:</strong> {{ job.description }}</p>
        <p class="mb-1">
          <strong>Deadline:</strong> {{ job.deadline || "N/A" }}
        </p>
        <div class="mb-1">
          <small class="text-muted"
            >Posted on: {{ formatDate(job.created_at) }}</small
          >
        </div>
        <div class="d-flex gap-2">
          <RouterLink :to="`/jobs/${job.id}`">
            <button class="btn btn-primary btn-sm">View Details</button>
          </RouterLink>

          <template v-if="isEmployer">
            <RouterLink :to="`/job/edit/${job.id}`">
              <button class="btn btn-primary btn-sm">Edit</button>
            </RouterLink>
            <button class="btn btn-danger btn-sm" @click="deleteJob(job.id)">
              Delete
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
