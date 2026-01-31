import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ProductDetails } from "@/components/product-details";
import { Footer } from "@/components/footer";
import { getProductDetail, getAllProductIds } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductDetail(id);

  if (!product) {
    notFound();
  }

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

export async function generateStaticParams() {
  return getAllProductIds().map((id) => ({ id }));
}
