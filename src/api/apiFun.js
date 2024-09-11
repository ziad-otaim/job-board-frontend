import auth from "./auth";
import jobs from "./jobs";
import applications from "./applications";
import user from "./user";
import admin from "./admin";

export default function ({ appAxios }) {
  return {
    admin: admin(appAxios),
    auth: auth(appAxios),
    jobs: jobs(appAxios),
    applications: applications(appAxios),
    user: user(appAxios),
  };
}
