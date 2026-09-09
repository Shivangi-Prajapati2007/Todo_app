const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  console.log("API URL:", API_URL);
  console.log("Request URL:", `${API_URL}${path}`);

  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  console.log("Status:", response.status);

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}