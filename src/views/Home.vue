<script setup>
import { useUserStore } from "@/store/user";
import { computed, inject, ref } from "vue";

const isAdmin = computed(() => useUserStore().getUser?.role === "admin");
const api = inject("api");
const data = ref(null);

const getAdminDashboard = async () => {
  try {
    const res = await api.admin.getAdminDashboard();
    data.value = res?.data;
  } catch (error) {
    console.log(error);
  }
};

if (isAdmin.value) {
  getAdminDashboard();
}
</script>
<template>
  <div v-if="isAdmin">
    <div class="container mt-4">
      <div class="row">
        <!-- Total Users Card -->
        <div class="col-md-4">
          <div class="card text-white bg-primary mb-3">
            <div class="card-header">Total Users</div>
            <div class="card-body">
              <h5 class="card-title text-center h1">
                {{ data?.totalUsers }}
              </h5>
              <p class="card-text">Total number of registered users.</p>
            </div>
          </div>
        </div>
        <!-- Total Jobs Card -->
        <div class="col-md-4">
          <div class="card text-white bg-success mb-3">
            <div class="card-header">Total Jobs</div>
            <div class="card-body">
              <h5 class="card-title text-center h1">
                {{ data?.totalJobs }}
              </h5>
              <p class="card-text">Total number of available jobs.</p>
            </div>
          </div>
        </div>
        <!-- Pending Jobs Card -->
        <div class="col-md-4">
          <div class="card text-white bg-warning mb-3">
            <div class="card-header">Pending Jobs</div>
            <div class="card-body">
              <h5 class="card-title text-center h1">
                {{ data?.pendingJobs }}
              </h5>
              <p class="card-text">Number of jobs pending approval.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container" v-else>
    <h1>Welcome to the Job Board</h1>
    <router-link to="/jobs">View Jobs</router-link>
  </div>
</template>
