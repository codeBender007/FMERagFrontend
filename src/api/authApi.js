import { apiClient } from "./client";

export const authApi = {
  /**
   * Logs in a user with username and password.
   * @param {Object} credentials - { username, password }
   * @returns {Promise<{ access_token: string, token_type: string, user_id: number, full_name: string, role: string }>}
   */
  async login(credentials) {
    return apiClient("/auth/login", {
      method: "POST",
      body: credentials,
      requiresAuth: false,
    });
  },
};

export default authApi;
