"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";

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

export function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();

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

  const handleOpenForm = (product?: any) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="p-10 space-y-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => handleOpenForm()}
          className="px-6 py-3 bg-black text-white rounded-lg flex gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="flex justify-between border p-4 rounded">
            <div>
              <p className="font-semibold">{p.name}</p>
              <p>${p.price}</p>
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

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg space-y-4 w-96"
          >
            <input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border p-2 w-full"
            />

            <input
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="border p-2 w-full"
            />

            <input
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="border p-2 w-full"
            />

            <input
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="border p-2 w-full"
            />

            <input
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="border p-2 w-full"
            />

            <input
              placeholder="Size"
              value={formData.size}
              onChange={(e) =>
                setFormData({ ...formData, size: e.target.value })
              }
              className="border p-2 w-full"
            />

            <input
              placeholder="Category"
              value={formData.categoryName}
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
              className="border p-2 w-full"
            />

            <label className="flex gap-2">
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
                className="flex-1 border p-2"
              >
                Cancel
              </button>

              <button className="flex-1 bg-black text-white p-2">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
