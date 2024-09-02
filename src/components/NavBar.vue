<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import { computed, inject } from "vue";

const userStore = useUserStore();
const router = useRouter();
const api = inject("api");
const isEmployer = computed(() => userStore.getUser?.role === "employer");

const logout = async () => {
  try {
    await api.auth.logout();

    userStore.logout();
    router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
</script>

<template>
  <header>
    <nav>
      <ul class="d-flex align-items-center flex-wrap mb-0">
        <li><router-link to="/">Home</router-link></li>
        <li>
          <router-link to="/jobs"
            >{{ isEmployer ? "My" : "" }} Jobs</router-link
          >
        </li>
        <li v-if="!isEmployer">
          <router-link to="/applications">My Applications</router-link>
        </li>
        <li><router-link to="/profile">My Profile</router-link></li>
        <li class="ms-auto">
          <button @click="logout">Logout</button>
        </li>
      </ul>
    </nav>
  </header>
</template>
