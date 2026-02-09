"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Lock } from "lucide-react";

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // 🔥 real admin check (backend role)
    if (user?.role === "ADMIN") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    setLoading(false);
  }, [isAuthenticated, user, router]);

  // ===== LOADING SCREEN =====
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-border border-t-foreground rounded-full animate-spin"></div>
      </div>
    );
  }

  // ===== ACCESS DENIED =====
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-red-500" />
            </div>

            <h1 className="text-3xl mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-8">
              You do not have permission to access the admin panel.
            </p>

            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-foreground text-background rounded-lg"
            >
              Return Home
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // ===== ADMIN DASHBOARD =====
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminDashboard />
      <Footer />
    </div>
  );
}
