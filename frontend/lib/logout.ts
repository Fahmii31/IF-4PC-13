import Cookies from "js-cookie";
import { getCsrfCookie } from "./auth";

const BASE_URL = "http://localhost:8000";

export async function logoutUser() {

  try {

    await getCsrfCookie();

    const token = Cookies.get("XSRF-TOKEN");

    await fetch(`${BASE_URL}/logout`, {

      method: "POST",

      credentials: "include",

      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": decodeURIComponent(token || ""),
      },
    });

  } catch (error) {

    console.error(error);
  }
}