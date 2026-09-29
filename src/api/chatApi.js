import { apiClient } from "./client";

export const chatApi = {
  /**
   * Send a chat question to the LMS RAG backend agent.
   * @param {Object} payload - { session_id: string, message: string }
   * @returns {Promise<{ session_id: string, answer: string, sql_executed?: string }>}
   */
  async sendMessage(payload) {
    return apiClient("/chat/send", {
      method: "POST",
      body: payload,
    });
  },

  /**
   * Fetch all previous chat sessions.
   * @returns {Promise<{ sessions: Array<{ session_id: string, title: string, created_at: string }> }>}
   */
  async getSessions() {
    return apiClient("/chat/sessions", {
      method: "GET",
    });
  },

  /**
   * Fetch message history for a given session ID.
   * @param {string} sessionId
   * @returns {Promise<{ session_id: string, messages: Array<{ id: number, sender: string, message_text: string, sql_executed?: string, created_at: string }> }>}
   */
  async getHistory(sessionId) {
    return apiClient(`/chat/history/${encodeURIComponent(sessionId)}`, {
      method: "GET",
    });
  },

  /**
   * Delete a chat session.
   * @param {string} sessionId
   * @returns {Promise<{ success: boolean }>}
   */
  async deleteSession(sessionId) {
    return apiClient(`/chat/session/${encodeURIComponent(sessionId)}`, {
      method: "DELETE",
    });
  },
};

export default chatApi;
