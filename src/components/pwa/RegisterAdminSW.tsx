"use client";

import { useEffect } from "react";

export default function RegisterAdminSW() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    let mounted = true;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw-admin.js");
        if (!mounted) return;
        // console.log("Admin SW registered:", reg);
      } catch (err) {
        // registration failed (common in dev or unsupported environments)
        // console.warn("Admin SW registration failed", err);
      }
    };

    register();

    return () => {
      mounted = false;
    };
  }, []);

  return null;
}
