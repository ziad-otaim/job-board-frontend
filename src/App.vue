<script setup>
import { computed } from "vue";
import NavBar from "./components/NavBar.vue";
import { useUserStore } from "./store/user";
import "vue3-toastify/dist/index.css";
import "./assets/main.css";

const userStore = useUserStore();

const isAuthenticated = computed(() => userStore.getIsAuthenticated);

document.title = "Job Board";
</script>

<template>
  <div id="app">
    <NavBar v-if="isAuthenticated" />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
/* Add your styles here */
header {
  background: #f8f9fa;
  padding: 1rem;
}

nav ul {
  display: flex;
  list-style: none;
  padding: 0;
}

nav li {
  margin-right: 1rem;
}

button {
  background-color: red;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
