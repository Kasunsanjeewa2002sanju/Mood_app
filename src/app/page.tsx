"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getStoredPin } from "@/lib/api-client";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const pin = getStoredPin();
      if (!pin) {
        setChecking(false);
        return;
      }

      try {
        const response = await fetch("/api/mood/latest", {
          headers: { "x-app-pin": pin },
          credentials: "include",
        });
        if (response.ok) {
          router.replace("/dashboard");
          return;
        }
      } catch {
        // fall through to login
      }
      setChecking(false);
    }
    checkSession();
  }, [router]);

  if (checking) return <LoadingSpinner />;

  return (
    <LoginScreen onSuccess={() => router.push("/dashboard")} />
  );
}
