import { LoginForm } from "@/components/login-form";

export const metadata = {
  title: "Sign In | MAISON NOIR",
  description: "Sign in to your Maison Noir account",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-secondary/30 pointer-events-none" />
      
      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center px-6 py-16">
        <LoginForm />
      </div>
    </main>
  );
}
