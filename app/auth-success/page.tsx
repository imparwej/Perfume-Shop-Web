"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("maison_noir_token", token);
    }

    router.replace("/");
  }, [router]);

  return <p style={{ padding: 40 }}>Logging you in...</p>;
}
