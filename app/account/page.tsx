"use client";

import ProtectedRoute from "@/components/protected-route";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth-context";
import React, { useEffect, useState, ReactElement } from "react";
import {
  changePassword,
  fetchAddresses,
  saveAddress,
  deleteAddress,
  updateAddress,
  updateProfile,
  fetchProfile,
} from "@/lib/api";
import { 
  User, Lock, MapPin, Edit2, Trash2, Save, 
  Mail, Phone, Eye, EyeOff, CheckCircle2,
  Sparkles, ChevronRight, Shield, ShieldCheck,
  Building, Globe, Navigation,
  Plus, X, Hash, UserCircle, KeyRound,
  LocateFixed, CircleAlert, CreditCard,
  Package, Award, Home, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AccountPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "address">("profile");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 text-foreground relative overflow-hidden transition-colors duration-700">
        {/* Premium ambient lighting - follows cursor */}
        <div 
          className="fixed inset-0 pointer-events-none z-0 opacity-60"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(217, 119, 6, 0.12),
            rgba(245, 158, 11, 0.06) 40%,
            transparent 70%)`,
          }}
        />
        
        {/* Floating gradient orbs */}
        <div className="fixed top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-400/8 to-orange-400/5 dark:from-amber-400/15 dark:to-orange-400/8 rounded-full blur-[150px] pointer-events-none animate-pulse" />
        <div className="fixed bottom-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-orange-400/8 to-amber-400/5 dark:from-orange-400/12 dark:to-amber-400/6 rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="fixed top-1/3 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-yellow-400/5 to-amber-400/3 dark:from-yellow-400/10 dark:to-amber-400/5 rounded-full blur-[130px] pointer-events-none" />

        <Navbar />

        <main className="relative z-10">
          {/* Hero Header */}
          <div className="relative border-b border-amber-900/5 dark:border-white/5">
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 dark:from-white/[0.03] to-transparent backdrop-blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.02] dark:from-amber-400/[0.04] via-transparent to-transparent" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-4xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-amber-600/70 dark:from-amber-400/70 via-amber-500/40 dark:via-amber-400/40 to-transparent" />
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400/90 tracking-[0.25em] uppercase">
                    Account Settings
                  </span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extralight tracking-tight mb-6 leading-[0.95]">
                  <span className="block text-neutral-900 dark:text-white/95">Your</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 dark:from-amber-400 dark:via-amber-300 dark:to-orange-300">
                    Account
                  </span>
                </h1>
                
                <p className="text-lg text-neutral-600 dark:text-neutral-400 font-light max-w-xl leading-relaxed">
                  Manage your personal information, security preferences, and saved delivery locations
                </p>
              </motion.div>
            </div>
          </div>

          {/* Glass Navigation Tabs */}
          <div className="sticky top-0 z-40 border-b border-amber-900/5 dark:border-white/5">
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-2xl transition-colors duration-500" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="flex gap-1">
                <LuxuryTab 
                  icon={<UserCircle className="h-[18px] w-[18px]" />}
                  label="Profile"
                  active={activeTab === "profile"} 
                  onClick={() => setActiveTab("profile")} 
                />
                <LuxuryTab 
                  icon={<ShieldCheck className="h-[18px] w-[18px]" />}
                  label="Security"
                  active={activeTab === "password"} 
                  onClick={() => setActiveTab("password")} 
                />
                <LuxuryTab 
                  icon={<MapPin className="h-[18px] w-[18px]" />}
                  label="Addresses"
                  active={activeTab === "address"} 
                  onClick={() => setActiveTab("address")} 
                />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="max-w-5xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {activeTab === "profile" && <EditProfile />}
                  {activeTab === "password" && <ChangePassword />}
                  {activeTab === "address" && <SavedAddresses />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}

function LuxuryTab({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative px-6 sm:px-8 py-4 flex items-center gap-2.5 text-sm font-medium transition-all duration-500",
        active
          ? "text-amber-900 dark:text-amber-50"
          : "text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
      )}
    >
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-b from-amber-500/10 dark:from-white/10 to-amber-500/5 dark:to-white/5 rounded-t-xl"
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
      
      <div className={cn(
        "transition-all duration-500 relative z-10",
        active ? "text-amber-700 dark:text-amber-400" : "text-neutral-500 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
      )}>
        {icon}
      </div>
      <span className="relative z-10 tracking-wide hidden sm:inline">{label}</span>
      
      {active && (
        <motion.div 
          layoutId="activeTabLine"
          className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-amber-600 dark:via-amber-500 to-transparent"
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-amber-500/50 dark:bg-amber-400/50 blur-sm" />
        </motion.div>
      )}
    </button>
  );
}

function EditProfile() {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await fetchProfile();

      setProfile({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await updateProfile({
        name: profile.name,
        phone: profile.phone,
      });

      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);

    } catch {
      alert("Update failed");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="relative">
          <div className="h-14 w-14 border-2 border-amber-200/50 dark:border-amber-500/20 border-t-amber-600 dark:border-t-amber-500 rounded-full animate-spin" />
          <div className="absolute inset-0 h-14 w-14 border border-amber-200/20 dark:border-amber-500/10 rounded-full" />
        </div>
        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-500 font-light tracking-wide">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Success Banner */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl border border-emerald-200/60 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50/90 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-600/5 backdrop-blur-xl shadow-lg shadow-emerald-500/5 dark:shadow-emerald-500/10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-200/30 dark:from-emerald-500/20 via-transparent to-transparent" />
            <div className="relative flex items-center gap-4 px-6 py-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200/70 dark:from-emerald-500/30 dark:to-emerald-600/20 flex items-center justify-center ring-1 ring-emerald-300/60 dark:ring-emerald-500/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-emerald-900 dark:text-emerald-100 text-sm">Profile updated successfully</p>
                <p className="text-xs text-emerald-800 dark:text-emerald-300/80 mt-0.5">Your changes have been saved securely</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glass Card Container */}
      <div className="relative rounded-2xl border border-amber-900/8 dark:border-white/8 bg-gradient-to-b from-white/70 to-white/30 dark:from-white/[0.06] dark:to-transparent backdrop-blur-2xl shadow-xl shadow-amber-500/5 dark:shadow-black/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] dark:from-amber-500/8 via-transparent to-orange-500/[0.02] dark:to-orange-500/5" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-6 sm:p-8 border-b border-amber-900/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200/60 dark:from-amber-500/20 dark:to-amber-600/10 ring-1 ring-amber-300/40 dark:ring-amber-500/30">
              <User className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-light tracking-tight text-neutral-900 dark:text-white">Profile Information</h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">Manage your personal details and contact information</p>
            </div>
          </div>

          {!editing && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setEditing(true)}
              className="group relative px-4 py-2.5 border border-amber-900/10 dark:border-white/10 hover:border-amber-600/30 dark:hover:border-amber-500/30 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white overflow-hidden backdrop-blur-xl shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 dark:via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-2">
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </span>
            </motion.button>
          )}
        </div>

        {/* Form */}
        <div className="relative p-6 sm:p-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <LuxuryInput
              icon={<User className="h-4 w-4" />}
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!editing}
              placeholder="Enter your full name"
            />

            <LuxuryInput
              icon={<Phone className="h-4 w-4" />}
              label="Phone Number"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!editing}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <Mail className="h-4 w-4 text-amber-700 dark:text-amber-400/70" />
              Email Address
              <span className="ml-auto text-[10px] text-neutral-500 dark:text-neutral-500 font-normal px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
                Read only
              </span>
            </label>
            <input
              value={profile.email}
              disabled
              className="w-full h-12 px-4 rounded-xl border border-neutral-200 dark:border-white/8 bg-neutral-50 dark:bg-white/[0.03] text-neutral-500 dark:text-neutral-500 cursor-not-allowed text-sm backdrop-blur-xl"
            />
          </div>
        </div>

        {/* Actions */}
        <AnimatePresence>
          {editing && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex justify-end gap-3 p-6 sm:p-8 border-t border-amber-900/5 dark:border-white/5 bg-white/40 dark:bg-white/[0.02] overflow-hidden"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setEditing(false)}
                className="px-6 py-2.5 border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white backdrop-blur-xl"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className="group relative px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-600 dark:to-amber-500 hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-500 dark:hover:to-amber-400 text-white rounded-xl shadow-lg shadow-amber-500/25 dark:shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/35 dark:hover:shadow-amber-500/40 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  {saving ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Save Changes
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChangePassword() {
  const { user } = useAuth();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  if (user?.provider !== "LOCAL") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200/40 dark:from-amber-500/10 dark:to-amber-600/5 flex items-center justify-center mb-6 ring-1 ring-amber-300/40 dark:ring-white/10 shadow-xl shadow-amber-500/10 dark:shadow-amber-500/15 backdrop-blur-2xl">
          <ShieldCheck className="h-12 w-12 text-amber-700 dark:text-amber-400" />
        </div>
        <h3 className="text-xl font-light text-neutral-900 dark:text-white mb-2 tracking-wide">Google Account Protected</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed font-light">
          You are signed in with Google. Password management is handled securely through your Google account.
        </p>
      </div>
    );
  }

  const handleUpdate = async () => {
    if (!current || !newPass || !confirm) {
      alert("Fill all fields");
      return;
    }

    if (newPass !== confirm) {
      alert("Passwords do not match");
      return;
    }

    setUpdating(true);

    try {
      await changePassword(current, newPass);

      setSuccess(true);

      setCurrent("");
      setNewPass("");
      setConfirm("");

      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      alert("Wrong current password");
    }

    setUpdating(false);
  };

  return (
    <div className="space-y-8">
      {/* Success Banner */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl border border-emerald-200/60 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50/90 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-600/5 backdrop-blur-xl shadow-lg shadow-emerald-500/5 dark:shadow-emerald-500/10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-200/30 dark:from-emerald-500/20 via-transparent to-transparent" />
            <div className="relative flex items-center gap-4 px-6 py-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200/70 dark:from-emerald-500/30 dark:to-emerald-600/20 flex items-center justify-center ring-1 ring-emerald-300/60 dark:ring-emerald-500/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-emerald-900 dark:text-emerald-100 text-sm">Password updated successfully</p>
                <p className="text-xs text-emerald-800 dark:text-emerald-300/80 mt-0.5">Your account security has been enhanced</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glass Card Container */}
      <div className="relative rounded-2xl border border-amber-900/8 dark:border-white/8 bg-gradient-to-b from-white/70 to-white/30 dark:from-white/[0.06] dark:to-transparent backdrop-blur-2xl shadow-xl shadow-amber-500/5 dark:shadow-black/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] dark:from-amber-500/8 via-transparent to-orange-500/[0.02] dark:to-orange-500/5" />
        
        {/* Header */}
        <div className="relative p-6 sm:p-8 border-b border-amber-900/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200/60 dark:from-amber-500/20 dark:to-amber-600/10 ring-1 ring-amber-300/40 dark:ring-amber-500/30">
              <KeyRound className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-light tracking-tight text-neutral-900 dark:text-white">Security Settings</h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">Update your password to keep your account secure</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="relative p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl space-y-6">
            <LuxuryPasswordInput
              icon={<Lock className="h-4 w-4" />}
              label="Current Password"
              showPassword={showCurrent}
              onToggleShow={() => setShowCurrent(!showCurrent)}
              placeholder="Enter your current password"
              focused={focusedField === "current"}
              onFocus={() => setFocusedField("current")}
              onBlur={() => setFocusedField(null)}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-900/10 dark:via-white/10 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-neutral-900 px-4 py-1.5 text-[10px] text-neutral-500 dark:text-neutral-500 font-medium tracking-wider uppercase rounded-full border border-neutral-200 dark:border-white/8">
                  New Password
                </span>
              </div>
            </div>

            <LuxuryPasswordInput
              icon={<Lock className="h-4 w-4" />}
              label="New Password"
              showPassword={showNew}
              onToggleShow={() => setShowNew(!showNew)}
              placeholder="Create a strong password"
              focused={focusedField === "new"}
              onFocus={() => setFocusedField("new")}
              onBlur={() => setFocusedField(null)}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />

            <LuxuryPasswordInput
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Confirm New Password"
              showPassword={showConfirm}
              onToggleShow={() => setShowConfirm(!showConfirm)}
              placeholder="Re-enter your new password"
              focused={focusedField === "confirm"}
              onFocus={() => setFocusedField("confirm")}
              onBlur={() => setFocusedField(null)}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {/* Security Tips */}
          <div className="max-w-2xl rounded-xl border border-amber-200/50 dark:border-amber-500/15 bg-gradient-to-br from-amber-50/80 to-amber-100/40 dark:from-amber-500/8 dark:to-amber-600/5 p-5 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-xs text-neutral-900 dark:text-white tracking-wide">Password Security Best Practices</h4>
                <ul className="text-xs text-neutral-700 dark:text-neutral-400 space-y-1.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <div className="h-1 w-1 rounded-full bg-amber-600 dark:bg-amber-400/60 mt-1.5 flex-shrink-0" />
                    <span>Use at least 8 characters with a mix of letters, numbers, and symbols</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1 w-1 rounded-full bg-amber-600 dark:bg-amber-400/60 mt-1.5 flex-shrink-0" />
                    <span>Avoid using personal information or common words</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1 w-1 rounded-full bg-amber-600 dark:bg-amber-400/60 mt-1.5 flex-shrink-0" />
                    <span>Use a unique password for each account</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative flex justify-end p-6 sm:p-8 border-t border-amber-900/5 dark:border-white/5 bg-white/40 dark:bg-white/[0.02]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpdate}
            disabled={updating}
            className="group relative px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-600 dark:to-amber-500 hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-500 dark:hover:to-amber-400 text-white rounded-xl shadow-lg shadow-amber-500/25 dark:shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/35 dark:hover:shadow-amber-500/40 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center gap-2">
              {updating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Update Password
                </>
              )}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function SavedAddresses() {
  const [addresses, setAddresses] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [form, setForm] = useState({
    type: "HOME",
    name: "",
    phone: "",
    altPhone: "",
    landmark: "",
    city: "",
    postalCode: "",
    line: "",
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAddresses();
      setAddresses(data);
    } finally {
      setLoading(false);
    }
  };

  const saveNew = async () => {
    if (!form.name || !form.phone || !form.city || !form.postalCode || !form.line) {
      alert("Please fill all required fields");
      return;
    }

    await saveAddress(form);
    setForm({
      type: "HOME",
      name: "",
      phone: "",
      altPhone: "",
      landmark: "",
      city: "",
      postalCode: "",
      line: "",
    });
    setShowForm(false);
    load();
  };

  const saveEdit = async (a: any) => {
    await updateAddress(a.id, a);
    setEditingId(null);
    load();
  };

  const remove = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(id);
      load();
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat= ${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        setForm({
          ...form,
          line: data.display_name || "",
          city: data.address.city || data.address.town || "",
          postalCode: data.address.postcode || "",
        });
      });
    } else {
      alert("Geolocation is not supported");
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "HOME": return <Home className="h-4 w-4" />;
      case "WORK": return <Briefcase className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case "HOME": return "text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30";
      case "WORK": return "text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20 border-purple-200 dark:border-purple-500/30";
      default: return "text-neutral-700 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-500/20 border-neutral-200 dark:border-neutral-500/30";
    }
  };

  return (
    <div className="space-y-8">
      {/* Glass Card Container */}
      <div className="relative rounded-2xl border border-amber-900/8 dark:border-white/8 bg-gradient-to-b from-white/70 to-white/30 dark:from-white/[0.06] dark:to-transparent backdrop-blur-2xl shadow-xl shadow-amber-500/5 dark:shadow-black/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] dark:from-amber-500/8 via-transparent to-orange-500/[0.02] dark:to-orange-500/5" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-6 sm:p-8 border-b border-amber-900/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200/60 dark:from-amber-500/20 dark:to-amber-600/10 ring-1 ring-amber-300/40 dark:ring-amber-500/30">
              <MapPin className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-light tracking-tight text-neutral-900 dark:text-white">Saved Addresses</h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">Manage your delivery and billing locations</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(!showForm)}
            className={cn(
              "group relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden backdrop-blur-xl shadow-sm",
              showForm 
                ? "bg-white/60 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20"
                : "bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-600 dark:to-amber-500 hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-500 dark:hover:to-amber-400 text-white shadow-lg shadow-amber-500/25 dark:shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/35 dark:hover:shadow-amber-500/40"
            )}
          >
            {!showForm && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            )}
            <span className="relative flex items-center gap-2">
              {showForm ? (
                <>
                  <X className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Cancel</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Add Address</span>
                </>
              )}
            </span>
          </motion.button>
        </div>

        {/* Address List */}
        {!showForm && (
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <LocateFixed className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              <h3 className="font-medium text-sm text-neutral-900 dark:text-white tracking-wide">Your Addresses</h3>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-medium border border-amber-200 dark:border-amber-500/30">
                {addresses.length}
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative">
                  <div className="h-14 w-14 border-2 border-amber-200/50 dark:border-amber-500/20 border-t-amber-600 dark:border-t-amber-500 rounded-full animate-spin" />
                </div>
                <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-500 font-light tracking-wide">Loading your addresses...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-amber-900/10 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-white/[0.02]">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200/40 dark:from-amber-500/10 dark:to-amber-600/5 flex items-center justify-center mx-auto mb-4 ring-1 ring-amber-300/40 dark:ring-white/10">
                  <MapPin className="h-8 w-8 text-amber-700 dark:text-amber-400/60" />
                </div>
                <h3 className="font-medium text-sm text-neutral-900 dark:text-white mb-1 tracking-wide">No addresses saved</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xs mx-auto font-light">
                  Add your first delivery address to streamline your checkout experience
                </p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-4">
                {addresses.map((a, index) => {
                  const editing = editingId === a.id;
                  return (
                    <motion.div 
                      key={a.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={cn(
                        "group relative border rounded-xl p-5 transition-all duration-500 backdrop-blur-xl overflow-hidden",
                        editing 
                          ? "border-amber-600/40 dark:border-amber-500/40 bg-gradient-to-br from-amber-50 to-amber-100/40 dark:from-amber-500/10 dark:to-amber-600/5 shadow-lg shadow-amber-500/10 dark:shadow-amber-500/15" 
                          : "border-amber-900/8 dark:border-white/8 bg-white/40 dark:bg-white/[0.02] hover:border-amber-600/30 dark:hover:border-amber-500/30 hover:bg-white/60 dark:hover:bg-white/5"
                      )}
                    >
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-br from-amber-500/5 dark:from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        editing && "opacity-100"
                      )} />
                      
                      {/* Header */}
                      <div className="relative flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg border backdrop-blur-xl transition-all duration-300",
                            getTypeColor(a.type)
                          )}>
                            {getTypeIcon(a.type)}
                          </div>
                          <div>
                            <div className="font-medium text-neutral-900 dark:text-white text-sm tracking-wide">
                              {a.type === "HOME" && "Home"}
                              {a.type === "WORK" && "Office"}
                              {a.type === "OTHER" && "Other"}
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400 font-light mt-0.5">{a.name}</div>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          {editing ? (
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => saveEdit(a)}
                              className="p-2 bg-emerald-100 dark:bg-emerald-500/20 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 rounded-lg transition-all duration-300 ring-1 ring-emerald-300/60 dark:ring-emerald-500/30"
                            >
                              <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                            </motion.button>
                          ) : (
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setEditingId(a.id)}
                              className="p-2 bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30 rounded-lg transition-all duration-300 ring-1 ring-amber-300/60 dark:ring-amber-500/30"
                            >
                              <Edit2 className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                            </motion.button>
                          )}
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => remove(a.id)}
                            className="p-2 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 rounded-lg transition-all duration-300 ring-1 ring-red-300/60 dark:ring-red-500/30"
                          >
                            <Trash2 className="h-4 w-4 text-red-700 dark:text-red-400" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Content */}
                      {editing ? (
                        <div className="relative space-y-3">
                          {["name","phone","altPhone","landmark","city","postalCode","line"].map(field => (
                            <input
                              key={field}
                              value={a[field] || ""}
                              onChange={e =>
                                setAddresses(prev =>
                                  prev.map(x =>
                                    x.id === a.id ? { ...x, [field]: e.target.value } : x
                                  )
                                )
                              }
                              className="w-full h-10 bg-white/60 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg px-3 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-500 focus:border-amber-600/50 dark:focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 dark:focus:ring-amber-500/10 focus:outline-none transition-all duration-300 backdrop-blur-xl"
                              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="relative space-y-2">
                          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{a.line}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                            <span className="text-neutral-600 dark:text-neutral-400 font-light">{a.city}, {a.postalCode}</span>
                            <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-white/20" />
                            <span className="text-neutral-600 dark:text-neutral-400 font-light">{a.phone}</span>
                          </div>
                          {a.landmark && (
                            <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 pt-3 mt-3 border-t border-amber-900/5 dark:border-white/5">
                              <MapPin className="h-3 w-3 text-amber-700 dark:text-amber-400/60" />
                              <span className="font-light">Near {a.landmark}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Add Address Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden border-t border-amber-900/5 dark:border-white/5 bg-white/40 dark:bg-white/[0.02]"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white tracking-wide">Add New Address</h3>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={getLocation}
                    className="group flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30 text-amber-700 dark:text-amber-400 text-sm font-medium rounded-lg transition-all duration-300 ring-1 ring-amber-300/60 dark:ring-amber-500/30"
                  >
                    <Navigation className="h-4 w-4 group-hover:rotate-45 transition-transform duration-300" />
                    <span className="hidden sm:inline">Use My Location</span>
                  </motion.button>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Address Type */}
                  <div className="lg:col-span-2 space-y-3">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 tracking-wide">Address Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "HOME", label: "Home", icon: <Home className="h-5 w-5" /> },
                        { value: "WORK", label: "Office", icon: <Briefcase className="h-5 w-5" /> },
                        { value: "OTHER", label: "Other", icon: <MapPin className="h-5 w-5" /> },
                      ].map((type) => (
                        <motion.button
                          key={type.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setForm({ ...form, type: type.value })}
                          className={cn(
                            "p-5 rounded-xl border-2 transition-all duration-300 text-sm font-medium backdrop-blur-xl",
                            form.type === type.value
                              ? "border-amber-600/50 dark:border-amber-500/50 bg-gradient-to-br from-amber-100 to-amber-200/40 dark:from-amber-500/20 dark:to-amber-600/10 text-amber-700 dark:text-amber-400 shadow-lg shadow-amber-500/10 dark:shadow-amber-500/15 ring-1 ring-amber-300/60 dark:ring-amber-500/30"
                              : "border-neutral-200 dark:border-white/8 hover:border-amber-600/30 dark:hover:border-amber-500/30 hover:bg-white/60 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400"
                          )}
                        >
                          <div className="flex flex-col items-center gap-2">
                            {type.icon}
                            <span className="tracking-wide text-xs">{type.label}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <LuxuryFormInput
                    label="Full Name *"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    icon={<User className="h-4 w-4" />}
                    focused={focusedField === "name"}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <LuxuryFormInput
                    label="Phone Number *"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    icon={<Phone className="h-4 w-4" />}
                    focused={focusedField === "phone"}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <LuxuryFormInput
                    label="Alternate Phone"
                    value={form.altPhone}
                    onChange={e => setForm({ ...form, altPhone: e.target.value })}
                    placeholder="Optional"
                    icon={<Phone className="h-4 w-4" />}
                    focused={focusedField === "altPhone"}
                    onFocus={() => setFocusedField("altPhone")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <LuxuryFormInput
                    label="Landmark"
                    value={form.landmark}
                    onChange={e => setForm({ ...form, landmark: e.target.value })}
                    placeholder="Near shopping mall"
                    icon={<MapPin className="h-4 w-4" />}
                    focused={focusedField === "landmark"}
                    onFocus={() => setFocusedField("landmark")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <LuxuryFormInput
                    label="City *"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    placeholder="New York"
                    icon={<Building className="h-4 w-4" />}
                    focused={focusedField === "city"}
                    onFocus={() => setFocusedField("city")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <LuxuryFormInput
                    label="Postal Code *"
                    value={form.postalCode}
                    onChange={e => setForm({ ...form, postalCode: e.target.value })}
                    placeholder="10001"
                    icon={<Hash className="h-4 w-4" />}
                    focused={focusedField === "postalCode"}
                    onFocus={() => setFocusedField("postalCode")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <div className="lg:col-span-2 space-y-2.5">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2 tracking-wide">
                      <MapPin className="h-4 w-4 text-amber-700 dark:text-amber-400/70" />
                      Full Address *
                    </label>
                    <textarea
                      placeholder="Building number, street name, apartment/unit number..."
                      value={form.line}
                      onChange={e => setForm({ ...form, line: e.target.value })}
                      className="w-full h-28 bg-white/60 dark:bg-white/5 border border-neutral-200 dark:border-white/8 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-500 rounded-xl p-4 text-sm focus:border-amber-600/50 dark:focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-500/10 focus:outline-none resize-none transition-all duration-300 backdrop-blur-xl"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-amber-900/5 dark:border-white/5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white text-sm font-medium rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300 backdrop-blur-xl"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveNew}
                    className="group relative px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-600 dark:to-amber-500 hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-500 dark:hover:to-amber-400 text-white rounded-xl shadow-lg shadow-amber-500/25 dark:shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/35 dark:hover:shadow-amber-500/40 transition-all duration-300 text-sm font-medium overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Address
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface LuxuryInputProps {
  icon?: React.ReactElement<{ className?: string }>;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}

function LuxuryInput({
  icon,
  label,
  value,
  onChange,
  disabled,
  placeholder,
}: LuxuryInputProps) {
  return (
    <div className="space-y-2.5">
      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {icon && React.cloneElement(icon, { className: "h-4 w-4 text-amber-700 dark:text-amber-400/70" })}
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          "w-full h-12 px-4 rounded-xl border bg-white/60 dark:bg-white/5 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-500 text-sm backdrop-blur-xl transition-all duration-300",
          disabled 
            ? "border-neutral-200 dark:border-white/5 opacity-50 cursor-not-allowed" 
            : "border-neutral-200 dark:border-white/8 focus:border-amber-600/50 dark:focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-500/10 focus:outline-none"
        )}
      />
    </div>
  );
}

interface LuxuryPasswordInputProps {
  icon?: React.ReactElement<{ className?: string }>;
  label: string;
  showPassword: boolean;
  onToggleShow: () => void;
  placeholder?: string;
  focused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function LuxuryPasswordInput({
  icon,
  label,
  showPassword,
  onToggleShow,
  placeholder,
  focused,
  onFocus,
  onBlur,
  value,
  onChange,
}: LuxuryPasswordInputProps) {
  return (
    <div className="space-y-2.5">
      <label className={cn(
        "text-sm font-medium transition-colors duration-300 tracking-wide",
        focused ? "text-amber-700 dark:text-amber-400" : "text-neutral-700 dark:text-neutral-300"
      )}>
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            {React.cloneElement(icon, {
              className: cn(
                "h-4 w-4 transition-colors duration-300",
                focused 
                  ? "text-amber-700 dark:text-amber-400" 
                  : "text-neutral-500 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
              )
            })}
          </div>
        )}
        
        <input 
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          className={cn(
            "w-full h-12 bg-white/60 dark:bg-white/5",
            "border border-neutral-200 dark:border-white/8 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-500",
            "focus:border-amber-600/50 dark:focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-500/10 focus:outline-none transition-all duration-300 rounded-xl text-sm backdrop-blur-xl",
            icon ? "pl-11 pr-11" : "pr-11 pl-4"
          )}
        />
        
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-all duration-300 p-1"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

interface LuxuryFormInputProps {
  icon?: React.ReactElement<{ className?: string }>;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  focused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

function LuxuryFormInput({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  focused,
  onFocus,
  onBlur,
}: LuxuryFormInputProps) {
  return (
    <div className="space-y-2.5">
      <label className={cn(
        "text-sm font-medium transition-colors duration-300 tracking-wide",
        focused ? "text-amber-700 dark:text-amber-400" : "text-neutral-700 dark:text-neutral-300"
      )}>
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            {React.cloneElement(icon, {
              className: cn(
                "h-4 w-4 transition-colors duration-300",
                focused 
                  ? "text-amber-700 dark:text-amber-400" 
                  : "text-neutral-500 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
              )
            })}
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 bg-white/60 dark:bg-white/5",
            "border border-neutral-200 dark:border-white/8 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-500",
            "focus:border-amber-600/50 dark:focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-500/10 focus:outline-none transition-all duration-300 rounded-xl text-sm backdrop-blur-xl",
            icon ? "pl-11 pr-4" : "px-4"
          )}
        />
      </div>
    </div>
  );
}