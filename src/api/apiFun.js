import auth from "./auth";
import jobs from "./jobs";
import applications from "./applications";
import user from "./user";


export default function ({ appAxios }) {
  return {
    auth: auth(appAxios),
    jobs: jobs(appAxios),
    applications: applications(appAxios),
    user: user(appAxios),
  };
}
