"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const API = "http://localhost:8080";
const TOKEN_KEY = "maison_noir_token";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  notes: string;
  size: string;
  categoryName: string;
  featured: boolean;
};

interface AdminContextType {
  products: Product[];
  refreshProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  const getHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const refreshProducts = async () => {
    const res = await fetch(`${API}/api/perfumes`);
    const data = await res.json();
    setProducts(data.content || []);
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = async (product: Omit<Product, "id">) => {
    await fetch(`${API}/api/admin/perfumes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    await refreshProducts();
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    await fetch(`${API}/api/admin/perfumes/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    await refreshProducts();
  };

  const deleteProduct = async (id: number) => {
    await fetch(`${API}/api/admin/perfumes/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    await refreshProducts();
  };

  return (
    <AdminContext.Provider
      value={{ products, refreshProducts, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside AdminProvider");
  return context;
}
