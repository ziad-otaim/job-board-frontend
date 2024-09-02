<template>
  <div>
    <h1>Apply for {{ job.title }}</h1>
    <form @submit.prevent="apply">
      <textarea v-model="resume" placeholder="Resume"></textarea>
      <textarea v-model="cover_letter" placeholder="Cover Letter"></textarea>
      <button type="submit">Submit Application</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
const job = ref({});
const resume = ref("");
const cover_letter = ref("");

const fetchJob = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/jobs/${route.params.id}`
    );
    job.value = response.data;
  } catch (error) {
    console.error("Failed to fetch job:", error);
  }
};

const apply = async () => {
  try {
    await axios.post(
      `http://localhost:8000/api/jobs/${route.params.id}/apply`,
      {
        resume: resume.value,
        cover_letter: cover_letter.value,
      }
    );
    // Handle successful application
    console.log("Application submitted successfully");
  } catch (error) {
    // Handle application error
    console.error("Application error:", error);
  }
};

onMounted(fetchJob);
</script>
