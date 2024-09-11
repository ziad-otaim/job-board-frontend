<script setup>
import CustomSelect from "@/components/CustomSelect.vue";
import { inject, ref } from "vue";
import { useRouter } from "vue-router";

const roles = [
  { value: "candidate", label: "Candidate" },
  { value: "employer", label: "Employer" },
];
const router = useRouter();
const name = ref("name");
const email = ref("1@test.com");
const role = ref("employer");
const password = ref("123456789");
const passwordConfirmation = ref("123456789");
const errorMessage = ref("");
const successMessage = ref("");
const api = inject("api");
const isLoading = ref(false);

const submitRegister = async () => {
  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = "Passwords do not match.";
    return;
  }

  isLoading.value = true;
  try {
    await api.auth.register({
      name: name.value,
      email: email.value,
      role: role.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });

    errorMessage.value = "";
    successMessage.value = "Registration successful! Please log in.";
    const timer = setTimeout(() => {
      router.push("/login");
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      "Registration failed. Please try again.";
    console.error("Error registering:", error);
  }
  isLoading.value = false;
};
</script>
<template>
  <div class="container">
    <div class="register-form">
      <h2>Register</h2>
      <form @submit.prevent="submitRegister">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            class="form-control"
            v-model="name"
            required
            placeholder="Name"
          />
        </div>
        <div class="form-group mt-3">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="email"
            required
            placeholder="example@email.com"
          />
        </div>
        <div class="form-group mt-3">
          <CustomSelect
            v-model="role"
            :options="roles"
            label="Role"
            placeholder="Select Role"
          />
        </div>
        <div class="form-group mt-3">
          <label for="password"
            >Password
            <sub>(must be 8 characters)</sub>
          </label>
          <input
            type="password"
            id="password"
            class="form-control"
            v-model="password"
            required
            placeholder="*******"
          />
        </div>
        <div class="form-group mt-3">
          <label for="password_confirmation"
            >Confirm Password
            <sub>(must be 8 characters)</sub>
          </label>
          <input
            type="password"
            id="password_confirmation"
            class="form-control"
            v-model="passwordConfirmation"
            required
            placeholder="*******"
          />
        </div>
        <button type="submit" class="btn btn-primary mt-4">
          {{ isLoading ? "Loading..." : "Register" }}
        </button>
        <div v-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success mt-3">
          {{ successMessage }}
        </div>
      </form>
    </div>
  </div>
</template>
<style>
.register-form {
  max-width: 500px;
  margin-inline: auto;
  margin-top: 10rem;
}
</style>
