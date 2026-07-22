import Cookies from "js-cookie";
import { getCsrfCookie } from "./auth";

const BASE_URL = "http://localhost:8000";

export async function logoutUser() {
  await getCsrfCookie();

  const token = Cookies.get("XSRF-TOKEN");

  return fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(token || ""),
    },
  });
}
