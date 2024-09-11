<script setup>
import { ref, onMounted, computed, inject } from "vue";
import Modal from "../components/Modal.vue";
import { toast } from "vue3-toastify";

const users = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref("");
const api = inject("api");
const editUser = ref({
  id: null,
  name: "",
  email: "",
  role: "",
});
const isModalVisible = ref(false);

// Fetch users from API
const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.admin.getUsers();
    users.value = response.data;
  } catch (err) {
    error.value = "Failed to load users.";
  } finally {
    loading.value = false;
  }
};

// Delete a user
const deleteUser = async (userId) => {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      await api.admin.deleteUser(userId);
      toast.success("User Deleted Successfully!");
      fetchUsers(); // Refresh the list after deletion
    } catch (err) {
      error.value = "Failed to delete user.";
    }
  }
};

// Open the edit modal and populate data
const openEditModal = (user) => {
  editUser.value = { ...user };
  isModalVisible.value = true;
};

// Update user details
const updateUser = async () => {
  try {
    await api.admin.updateUser(editUser.value.id, editUser.value);
    fetchUsers();
    isModalVisible.value = false;
    toast.success("User Updated Successfully!");
  } catch (err) {
    error.value = "Failed to update user.";
  }
};

// Filter users based on search query
const filteredUsers = computed(() => {
  return users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(fetchUsers);
</script>
<template>
  <div class="container mt-4">
    <h2>Admin Users</h2>
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <button class="btn btn-primary" @click="fetchUsers">Refresh</button>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control w-25"
            placeholder="Search users..."
          />
        </div>
        <div v-if="loading" class="alert alert-info">Loading...</div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="user.id">
              <td>{{ index + 1 }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <div class="d-flex flex-wrap gap-2">
                  <button
                    class="btn btn-warning btn-sm"
                    @click="openEditModal(user)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="deleteUser(user.id)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit User Modal -->
    <Modal
      v-model:visible="isModalVisible"
      title="Edit User"
      @confirm="updateUser"
    >
      <form>
        <div class="mb-3">
          <label for="userName" class="form-label">Name</label>
          <input
            type="text"
            class="form-control"
            id="userName"
            v-model="editUser.name"
            required
          />
        </div>
        <div class="mb-3">
          <label for="userEmail" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="userEmail"
            v-model="editUser.email"
            required
          />
        </div>
        <div class="mb-3">
          <label for="userRole" class="form-label">Role</label>
          <select
            class="form-select"
            id="userRole"
            v-model="editUser.role"
            required
          >
            <option value="candidate">Candidate</option>
            <option value="employer">Employer</option>
          </select>
        </div>
      </form>
    </Modal>
  </div>
</template>
