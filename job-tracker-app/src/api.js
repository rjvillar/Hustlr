const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://job-tracker-server-eef0.onrender.com'
    : 'http://localhost:5000'
  );

console.log('🌍 API Base URL:', API_BASE_URL);

async function handleResponse(response) {
  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    data = { message: 'Invalid server response' };
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
}

export async function registerUser(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse(response);
}

export async function getJobs(token) {
  const response = await fetch(`${API_BASE_URL}/api/jobs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    credentials: 'include',
  });

  return handleResponse(response);
}

export async function createJob(jobData, token) {
  const response = await fetch(`${API_BASE_URL}/api/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(jobData),
  });

  return handleResponse(response);
}

export async function updateJob(jobId, jobData, token) {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(jobData),
  });

  return handleResponse(response);
}

export async function deleteJob(jobId, token) {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    credentials: 'include',
  });

  return handleResponse(response);
}

export async function getStats(token) {
  const response = await fetch(`${API_BASE_URL}/api/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    credentials: 'include',
  });

  return handleResponse(response);
}