<script setup>
import Loader from "@/components/Loader.vue";
import { ref, inject, reactive } from "vue";

const api = inject("api");
const user = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});
const isLoading = reactive({
    fetching: false,
    submitting: false
});
const message = ref("");
const errors = ref({});

const fetchUserProfile = async () => {
  isLoading.fetching = true;
  try {
    const response = await api.user.getProfile();
    user.value.name = response.data.user.name;
    user.value.email = response.data.user.email;
  } catch (error) {
    console.error("Error fetching profile:", error);
  } finally {
    isLoading.fetching = false;
  }
};

const updateUserProfile = async () => {
  if (user.value.password !== user.value.password_confirmation) {
    errors.value = { confirm_password: "Passwords do not match." };
    return;
  }

  isLoading.submitting = true;
  message.value = "";
  errors.value = {};
  try {
    const response = await api.user.updateProfile(user.value);
    message.value = response.data.message;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      console.error("Error updating profile:", error);
    }
  } finally {
    isLoading.submitting = false;
  }
};

fetchUserProfile();
</script>

<template>
  <div class="container mt-4">
    <h2>User Profile</h2>

    <div v-if="message" class="alert alert-success">{{ message }}</div>

    <Loader v-if="isLoading.fetching" />

    <form @submit.prevent="updateUserProfile" v-else>
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="user.name"
          placeholder="John Doe"
        />
        <div v-if="errors.name" class="text-danger">{{ errors.name[0] }}</div>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="example@email.com"
          v-model="user.email"
        />
        <div v-if="errors.email" class="text-danger">{{ errors.email[0] }}</div>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          placeholder="********"
          v-model="user.password"
        />
        <div v-if="errors.password" class="text-danger">
          {{ errors.password[0] }}
        </div>
      </div>
      <div class="mb-3">
        <label for="password_confirmation" class="form-label"
          >Confirm Password</label
        >
        <input
          type="password"
          class="form-control"
          id="password_confirmation"
          placeholder="********"
          v-model="user.password_confirmation"
        />
        <div v-if="errors.confirm_password" class="text-danger">
          {{ errors.confirm_password }}
        </div>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="isLoading.submitting">
        Update Profile
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Add custom styles here */
</style>
