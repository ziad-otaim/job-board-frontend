<script setup>
import CustomSelect from "@/components/CustomSelect.vue";
import Loader from "@/components/Loader.vue";
import router from "@/router";
import { inject, reactive } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";

const workTypes = [
  {
    label: "Full Time",
    value: "Full Time",
  },
  {
    label: "Part Time",
    value: "Part Time",
  },
];

const idToEdit = useRoute()?.params?.id;
const api = inject("api");
const isLoading = reactive({
  fetchingToEdit: false,
  submitting: false,
});

const form = reactive({
  title: "test",
  description: "test",
  location: "test",
  work_type: "Part Time",
  category: "test",
  salary: "500",
  deadline: "2024-09-19",
});

const onSubmit = async () => {
  isLoading.submitting = true;
  try {
    if (idToEdit) {
      await api.jobs.editJob(idToEdit, form);
    } else {
      await api.jobs.createJob(form);
    }

    const action = idToEdit ? "Updated" : "Created";
    toast.success(`Job ${action} Successfully!`);

    const timer = setTimeout(() => {
      router.push("/jobs");
    }, 700);

    return () => {
      clearTimeout(timer);
    };
  } catch (error) {
    console.error("Failed to create job listing:", error);
  }
  isLoading.submitting = false;
};

const getJobDetails = async () => {
  isLoading.fetchingToEdit = true;
  try {
    const res = await api.jobs.getJobDetails(idToEdit);
    const job = res?.data?.job;

    if (job) {
      Object.keys(form).forEach((key) => {
        form[key] = job[key];
      });
    }
  } catch (error) {
    console.error("Failed to create job listing:", error);
  }
  isLoading.fetchingToEdit = false;
};

if (idToEdit) {
  getJobDetails();
}
</script>

<template>
  <div class="container mt-4">
    <h2>{{ idToEdit ? "Edit" : "Create" }} Job</h2>
    <Loader v-if="isLoading.fetchingToEdit" />
    <form @submit.prevent="onSubmit" v-else>
      <!-- Job Listing Fields -->
      <div class="mb-3">
        <label for="title" class="form-label"> Title</label>
        <input
          type="text"
          class="form-control"
          id="title"
          v-model="form.title"
          placeholder="Title"
          required
        />
      </div>
      <div class="mb-3">
        <label for="location" class="form-label"> Location</label>
        <input
          type="text"
          class="form-control"
          id="location"
          v-model="form.location"
          placeholder="Location"
          required
        />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label"> Description</label>
        <textarea
          rows="2"
          type="text"
          class="form-control"
          id="description"
          v-model="form.description"
          placeholder="Description"
          required
        ></textarea>
      </div>
      <div class="mb-3">
        <CustomSelect
          v-model="form.work_type"
          :options="workTypes"
          label="Work Type"
          placeholder="Select Work Type"
        />
      </div>
      <div class="mb-3">
        <label for="category" class="form-label"> Category</label>
        <input
          type="text"
          class="form-control"
          id="category"
          v-model="form.category"
          placeholder="Category"
          required
        />
      </div>
      <div class="mb-3">
        <label for="salary" class="form-label"> Salary</label>
        <input
          type="number"
          class="form-control"
          id="salary"
          v-model="form.salary"
          placeholder="Salary"
          required
        />
      </div>
      <div class="mb-3">
        <label for="deadline" class="form-label"> Deadline</label>
        <input
          type="date"
          class="form-control"
          id="deadline"
          v-model="form.deadline"
          placeholder="Deadline"
        />
      </div>
      <!-- Add more input fields for description, location, work_type, category, salary, deadline -->
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="isLoading.submitting"
      >
        {{ idToEdit ? "Edit" : "Create" }}
        Job
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>
