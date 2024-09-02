<template>
  <div class="modal" tabindex="-1" role="dialog" style="display: block">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header justify-between">
          <h5 class="modal-title">Apply for Job</h5>
          <button type="button" class="close ms-auto" @click="$emit('close')">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="applyForJob">
            <div class="mb-3">
              <label for="resume" class="form-label"
                >Resume (PDF, DOC, DOCX)</label
              >
              <input
                type="file"
                class="form-control"
                id="resume"
                ref="resumeInput"
                @change="handleFileChange"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              {{ isLoading ? "Submitting..." : "Submit Application" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import { inject, ref } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";

const jobId = useRoute().params.id;
const api = inject("api");
const resumeFile = ref(null);
const isLoading = ref(false);

const handleFileChange = (event) => {
  resumeFile.value = event.target.files[0];
};

const applyForJob = async () => {
  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append("resume", resumeFile.value);

    await api.applications.applyForJob(jobId, formData);

    toast.success("Application submitted successfully!");

    isLoading.value = false;
    const timer = setTimeout(() => {
      router.push("/jobs");
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  } catch (error) {
    console.error("Error submitting application:", error);
    toast.error("Failed to submit application. Please try again.");
  }
  isLoading.value = false;
};
</script>

<style scoped>
.modal {
  display: block; /* Show modal */
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
}
</style>
