<script setup>
import { useUserStore } from "@/store/user";
import { inject, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("employer@test.com");
const password = ref("123456789");
const isLoading = ref(false);
const errorMessage = ref("");
const api = inject("api");
const userStore = useUserStore();

const submitLogin = async () => {
  isLoading.value = true;
  try {
    const response = await api.auth.login({
      email: email.value,
      password: password.value,
    });

    const { token, user } = response.data;
    userStore.setToken(token);
    userStore.setUser(user);
    router.push("/jobs"); // Redirect to jobs listing after login
  } catch (error) {
    errorMessage.value = "Invalid email or password. Please try again.";
    console.error("Error logging in:", error);
  }
  isLoading.value = false;
};
</script>
<template>
  <div class="container">
    <div class="login-form">
      <h2>Login</h2>
      <form @submit.prevent="submitLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="email"
            placeholder="example@email.com"
            required
          />
        </div>
        <div class="form-group mt-3">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            class="form-control"
            v-model="password"
            placeholder="********"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary mt-4">
          {{ isLoading ? "Loading..." : "Login" }}
        </button>
        <div v-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>
      </form>
      <div class="mt-4">
        If you aren't a member. Go to
        <RouterLink to="register">Sign Up</RouterLink> page to create an
        account.
      </div>
    </div>
  </div>
</template>
<style>
.login-form {
  max-width: 500px;
  margin-inline: auto;
  margin-top: 16rem;
}
</style>
