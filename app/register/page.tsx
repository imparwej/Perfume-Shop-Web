import { RegisterForm } from "@/components/register-form";

export const metadata = {
  title: "Create Account | MAISON NOIR",
  description: "Create your Maison Noir account and join our exclusive world of luxury fragrances",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-secondary/30 pointer-events-none" />
      
      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center px-6 py-16">
        <RegisterForm />
      </div>
    </main>
  );
}
