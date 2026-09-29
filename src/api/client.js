const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

/**
 * Custom API Client helper for standardizing fetch calls,
 * headers, authorization tokens, error handling, and timeout safeguards.
 */
export async function apiClient(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    requiresAuth = true,
    timeoutMs = 90000, // 90 second timeout for AI/RAG engine processing
    ...rest
  } = options;

  // Build full URL
  const base = API_BASE_URL.replace(/\/+$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${base}${path}`;

  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  // Setup abort controller for timeout safeguard
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  const config = {
    method,
    headers: requestHeaders,
    signal: controller.signal,
    ...rest,
  };

  if (body !== undefined) {
    config.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    // Parse JSON or text response
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { detail: text };
      }
    }

    if (!response.ok) {
      const errorMessage =
        (data && (data.detail || data.message || data.error)) ||
        `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(
        `Request to ${url} timed out after ${timeoutMs / 1000} seconds. Please check if the backend service is reachable.`,
        { cause: err }
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export default apiClient;
