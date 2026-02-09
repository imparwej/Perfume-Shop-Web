"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth-context";
import { fetchMyOrders } from "@/lib/api/orders";
import { 
  ChevronRight, 
  Package, 
  Calendar, 
  DollarSign, 
  CheckCircle,
  Clock,
  Truck,
  Award,
  Sparkles,
  ExternalLink,
  Gem,
  Gift,
  XCircle
} from "lucide-react";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  perfume: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}


// Mock product images for demonstration
const getProductImage = (order: Order) => {
  if (!order.items || order.items.length === 0) {
    return "/placeholder.svg";
  }

  const firstItem = order.items[0];

  return firstItem?.perfume?.imageUrl || "/placeholder.svg";
};


export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    setMounted(true);

    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
  fetchMyOrders()
    .then((data) => {
      setOrders(data?.content || []);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLoadingOrders(false);
    });
}
  }, [isAuthenticated, isLoading, router]);

  if (!mounted || isLoading || loadingOrders || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="relative">
          <div className="h-20 w-20 border-[3px] border-transparent border-t-primary/20 rounded-full animate-spin" />
          <div className="absolute inset-0 h-20 w-20 border-[3px] border-transparent border-l-primary/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Gem className="h-8 w-8 text-primary/40 animate-pulse" />
          </div>
        </div>
        <p className="mt-8 font-serif text-primary/60 dark:text-primary/40 tracking-wider text-sm uppercase">
          CURATING YOUR LUXURY COLLECTION
        </p>
      </div>
    );
  }

  const statusConfig: any = {
    PLACED: {
      color: "bg-primary/10 text-primary border-primary/30",
      icon: Clock,
      label: "Order Placed",
      description: "Your order has been received"
    },
    PENDING: {
      color: "bg-primary/10 text-primary border-primary/30",
      icon: Clock,
      label: "Processing",
      description: "Preparing your luxury items"
    },
    PROCESSING: {
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
      icon: Package,
      label: "Processing",
      description: "Items being prepared with care"
    },
    SHIPPED: {
      color: "bg-purple-500/10 text-purple-600 border-purple-200",
      icon: Truck,
      label: "Shipped",
      description: "Your package is on its way"
    },
    DELIVERED: {
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      icon: CheckCircle,
      label: "Delivered",
      description: "Enjoy your luxury items"
    },
    CANCELLED: {
  color: "bg-destructive/10 text-destructive border-destructive/30",
  icon: XCircle,
  label: "Cancelled",
  description: "Order has been cancelled"
},

  };

  const getStatusConfig = (status: any) => {
    if (!status) return statusConfig.PLACED;
    const statusString = String(status).toUpperCase();
    return statusConfig[statusString] || statusConfig.PLACED;
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Premium Header Section */}
        <div className="relative mb-16 md:mb-20">
          <div className="absolute -top-4 left-0">
            <Sparkles className="h-8 w-8 text-primary/20" />
          </div>
          
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <p className="text-xs tracking-[0.3em] uppercase text-primary/70 dark:text-primary/50 mb-1 font-medium">
                Your Personal Collection
              </p>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-light text-foreground mb-6 tracking-tight">
              Order History
            </h1>
            
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto mb-8" />
            
            <p className="text-muted-foreground max-w-2xl mx-auto font-light text-lg leading-relaxed">
              Each order represents a chapter in your fragrance journey. Discover your curated collection of luxury scents.
            </p>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group">
              <div className="text-3xl font-serif text-foreground mb-2 group-hover:text-primary transition-colors">
                {orders.length}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Total Orders</div>
              <div className="mt-2 h-0.5 w-8 bg-primary/30 mx-auto rounded-full group-hover:w-16 transition-all duration-300" />
            </div>
            
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group">
              <div className="text-3xl font-serif text-foreground mb-2 group-hover:text-primary transition-colors">
                {orders.reduce((acc, order) => acc + order.items.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Luxury Items</div>
              <div className="mt-2 h-0.5 w-8 bg-primary/30 mx-auto rounded-full group-hover:w-16 transition-all duration-300" />
            </div>
            
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group">
              <div className="text-3xl font-serif text-foreground mb-2 group-hover:text-primary transition-colors">
                ₹{orders.reduce((acc, order) => acc + order.totalAmount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Total Value</div>
              <div className="mt-2 h-0.5 w-8 bg-primary/30 mx-auto rounded-full group-hover:w-16 transition-all duration-300" />
            </div>
          </div>
        </div>

        {/* Orders List - Row Format with Images on LEFT */}
        {orders.length === 0 ? (
          <div className="py-32 text-center">
            <div className="relative mb-10">
              <div className="w-40 h-40 mx-auto bg-gradient-to-br from-primary/10 to-card rounded-full flex items-center justify-center border border-primary/30 shadow-2xl">
                <div className="relative">
                  <Gift className="h-20 w-20 text-primary/40" />
                  <Gem className="absolute -top-2 -right-2 h-8 w-8 text-primary/50 animate-pulse" />
                </div>
              </div>
            </div>
            <h2 className="font-serif text-3xl text-foreground mb-4 tracking-tight">
              Your Luxury Collection Awaits
            </h2>
            <p className="text-muted-foreground mb-10 max-w-md mx-auto font-light leading-relaxed">
              Begin your journey with our exclusive collection of rare and exquisite fragrances. Your first masterpiece is waiting.
            </p>
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 px-12 py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 rounded-full relative overflow-hidden"
            >
              <span className="relative z-10">Discover Masterpieces</span>
              <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header for Order List */}
            <div className="hidden md:grid grid-cols-12 gap-6 px-6 py-4 border-b border-border mb-2">
              <div className="col-span-3 text-left">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Product Preview</span>
              </div>
              <div className="col-span-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Order Details</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Date & Time</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Amount</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Status</span>
              </div>
            </div>

            {/* Order Rows */}
            {orders.map((order) => {
              const status = getStatusConfig(order.status?.toUpperCase());
              const StatusIcon = status.icon;
             const productImage = getProductImage(order);

              
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="group block"
                >
                  <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-2xl hover:scale-[1.005] transition-all duration-500 overflow-hidden relative">
                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                      {/* Product Image Preview - LEFT Section */}
                      <div className="md:col-span-3">
                        <div className="relative h-48 md:h-40 rounded-xl overflow-hidden group/image border border-border">
                          {/* Product Image */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-card" />
                          <img
                            src={productImage}
                            alt="Luxury Fragrance"
                            className="w-full h-full object-cover object-center group-hover/image:scale-110 transition-transform duration-700"
                          />
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
                          
                          {/* View Button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full transform -translate-y-4 opacity-0 group-hover/image:opacity-100 group-hover/image:translate-y-0 transition-all duration-500 border border-border">
                              <span className="text-xs font-medium text-foreground flex items-center gap-2">
                                View Details
                                <ExternalLink className="h-3 w-3" />
                              </span>
                            </div>
                          </div>
                          
                          {/* Order Tag */}
                          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                            ORDER #{order.id.toString().slice(-4)}
                          </div>
                        </div>
                      </div>

                      {/* Order Details - Middle Section */}
                      <div className="md:col-span-3">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Order #{order.id.toString().padStart(6, '0')}
                            </p>
                            <h3 className="font-serif text-xl text-foreground mb-2">
                              Luxury Fragrance Collection
                            </h3>
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {order.items.slice(0, 3).map((_, index) => (
                                  <div
                                    key={index}
                                    className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-background shadow-sm"
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {order.items.length} premium item{order.items.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Date & Time - Middle Section */}
                      <div className="md:col-span-2">
                        <div className="text-center md:text-left">
                          <div className="flex md:flex-col items-center md:items-start gap-2">
                            <Calendar className="h-4 w-4 text-primary/60" />
                            <div>
                              <p className="text-sm text-foreground font-medium">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Amount - Middle Section */}
                      <div className="md:col-span-2">
                        <div className="text-center md:text-left">
                          <div className="flex md:flex-col items-center md:items-start gap-2">
                            <DollarSign className="h-4 w-4 text-primary/60" />
                            <div>
                              <p className="font-serif text-2xl text-foreground">
                                ₹{order.totalAmount.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Including taxes & shipping
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status - Right Section */}
                      <div className="md:col-span-2">
                        <div className="text-center md:text-left">
                          <div className="inline-flex flex-col items-center md:items-start gap-2">
                            <div className="flex items-center gap-2">
                              <StatusIcon className="h-4 w-4" />
                              <span className={`px-3 py-1.5 text-xs font-medium tracking-wider uppercase rounded-full border ${status.color}`}>
                                {status.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground max-w-[120px]">
                              {status.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRight className="h-6 w-6 text-primary group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Premium Footer Note */}
        {orders.length > 0 && (
          <div className="mt-20 pt-12 border-t border-border">
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <Award className="h-6 w-6 text-primary/50" />
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              </div>
              <p className="text-muted-foreground font-light italic leading-relaxed text-lg">
                "Each bottle is meticulously crafted and handled with the care it deserves. 
                Your satisfaction is the essence of our luxury."
              </p>
              <p className="text-sm text-muted-foreground/80 mt-6 uppercase tracking-widest">
                — The House of Elegance
              </p>
              
              {/* Download/Print Button */}
              <div className="mt-10">
                <button
  onClick={() => window.open("http://localhost:8080/api/orders/export", "_blank")}
  className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300 group"
>
  <span className="text-sm font-medium tracking-wider">
    DOWNLOAD ORDER SUMMARY
  </span>
  <ExternalLink className="h-4 w-4 group-hover:rotate-45 transition-transform" />
</button>

              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}