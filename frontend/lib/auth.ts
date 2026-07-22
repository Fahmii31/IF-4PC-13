import Cookies from "js-cookie";

const BASE_URL = "http://localhost:8000";

export async function getCsrfCookie() {
  await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
}

export async function loginUser(data: { username: string; password: string; remember: boolean }) {
  await getCsrfCookie();

  const token = Cookies.get("XSRF-TOKEN");

  return fetch(`${BASE_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(token || ""),
    },
    body: JSON.stringify(data),
  });
}

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  phone: string;
}) {
  await getCsrfCookie();

  const token = Cookies.get("XSRF-TOKEN");

  return fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(token || ""),
    },
    body: JSON.stringify(data),
  });
}

// GET USER LOGIN
export async function getAuthUser() {
  try {
    const res = await fetch(`${BASE_URL}/api/me`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
