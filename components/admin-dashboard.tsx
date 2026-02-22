"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useAdmin, Product } from "@/lib/admin-context";
import { apiFetch } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  notes: string;
  size: string;
  categoryName: string;
  featured: boolean;
}

interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  last30DaysRevenue: number;
  totalProducts: number;
  featuredProducts: number;
}

export function AdminDashboard() {
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();

  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    notes: "",
    size: "",
    categoryName: "",
    featured: false,
  });

  /* ================= FETCH DASHBOARD ================= */

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await apiFetch("/api/admin/dashboard");
        if (!res) return;
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoadingStats(false);
      }
    }

    fetchDashboard();
  }, []);

  /* ================= FORM HANDLERS ================= */

  const handleOpenForm = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        imageUrl: product.imageUrl || "",
        notes: product.notes || "",
        size: product.size || "",
        categoryName: product.categoryName || "",
        featured: product.featured || false,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        notes: "",
        size: "",
        categoryName: "",
        featured: false,
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
    };

    if (editingId) {
      await updateProduct(editingId, payload);
    } else {
      await addProduct(payload);
    }

    setIsFormOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this product?")) {
      await deleteProduct(id);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-10 space-y-12">

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">

        <ClickableCard
          title="Users"
          value={loadingStats ? "..." : dashboardData?.totalUsers ?? "-"}
          onClick={() => router.push("/admin/users")}
        />

        <ClickableCard
          title="Orders"
          value={loadingStats ? "..." : dashboardData?.totalOrders ?? "-"}
          onClick={() => router.push("/admin/orders")}
        />

        <ClickableCard
          title="Total Revenue"
          value={loadingStats ? "..." : `₹${dashboardData?.totalRevenue ?? 0}`}
          onClick={() => router.push("/admin/revenue")}
        />

        <StatCard
          title="30 Days Revenue"
          value={loadingStats ? "..." : `₹${dashboardData?.last30DaysRevenue ?? 0}`}
        />

        <StatCard title="Products" value={products.length} />

        <StatCard
          title="Featured"
          value={products.filter((p) => p.featured).length}
        />
      </div>

      {/* ================= PRODUCT HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button
          onClick={() => handleOpenForm()}
          className="px-6 py-3 bg-foreground text-background rounded-lg flex gap-2 hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* ================= PRODUCT LIST ================= */}
      <div className="space-y-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center bg-card border border-border p-5 rounded-xl hover:shadow-md transition"
          >
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-muted-foreground">₹{p.price}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => handleOpenForm(p)}>
                <Edit2 className="w-4 h-4" />
              </button>

              <button onClick={() => handleDelete(p.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border p-8 rounded-xl shadow-lg space-y-4 w-96"
          >
            <Input value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="Name" />
            <Input value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} placeholder="Description" />
            <Input value={formData.price} onChange={(v) => setFormData({ ...formData, price: v })} placeholder="Price" />
            <Input value={formData.imageUrl} onChange={(v) => setFormData({ ...formData, imageUrl: v })} placeholder="Image URL" />
            <Input value={formData.notes} onChange={(v) => setFormData({ ...formData, notes: v })} placeholder="Notes" />
            <Input value={formData.size} onChange={(v) => setFormData({ ...formData, size: v })} placeholder="Size" />
            <Input value={formData.categoryName} onChange={(v) => setFormData({ ...formData, categoryName: v })} placeholder="Category" />

            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
              />
              Featured
            </label>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 border border-border p-2 rounded-md"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 bg-foreground text-background p-2 rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function ClickableCard({
  title,
  value,
  onClick,
}: {
  title: string;
  value: string | number;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition"
    >
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-border bg-background p-2 w-full rounded-md"
    />
  );
}
