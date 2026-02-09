"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ProductDetails } from "@/components/product-details";
import { Footer } from "@/components/footer";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/perfumes/${params.id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [params.id]);

  if (!product) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-4">
        <ProductDetails product={product} />
      </main>
      <Footer />
    </div>
  );
}
