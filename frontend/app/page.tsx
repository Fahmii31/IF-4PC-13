"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("http://localhost:8000/api/test")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA DARI BACKEND:", data);
      })
      .catch((err) => {
        console.error("ERROR:", err);
      });
  }, []);

  return (
    <div>
      <h1>Test Koneksi API</h1>
    </div>
  );
}