import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import JobList from '@/views/JobList.vue';
import JobDetail from '@/views/JobDetail.vue';
import ApplyJob from '@/views/ApplyJob.vue';
import ApplicationsList from '@/views/ApplicationsList.vue';
import Profile from '@/views/Profile.vue';
import JobForm from '@/views/JobForm.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/jobs', component: JobList },
  { path: '/jobs/:id', component: JobDetail, props: true },
  { path: '/jobs/:id/apply', component: ApplyJob, props: true },
  { path: '/applications', component: ApplicationsList },
  { path: '/profile', component: Profile },
  { path: '/job/create', component: JobForm },
  { path: '/job/edit/:id', component: JobForm },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
