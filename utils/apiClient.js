import axios from "axios";
import { logoutUser } from "../components/auth/logoutUser";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// **Intercept API responses**
apiClient.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (!error.response) {
      console.error("Network Error:", error);
      return Promise.reject({ message: "Network error. Please check your internet connection." });
    }

    const { status, data } = error.response;

    if (status === 401) {
      console.warn("Session expired. Logging out...");
      logoutUser();
      return Promise.reject({ message: "Session expired. Redirecting to login..." });
    }

    if (status === 403) {
      console.warn("Access Denied:", data?.message || "You do not have permission to access this resource.");
      return Promise.reject({ message: "Access Denied. You don't have the necessary permissions." });
    }

    if (status >= 500) {
      console.error("Server Error:", data?.message || "An unexpected server error occurred.");
      return Promise.reject({ message: "Server error. Please try again later." });
    }

    return Promise.reject(error.response);
  }
);

export default apiClient;
