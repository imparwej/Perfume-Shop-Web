"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth-context";
import { fetchOrderById, cancelOrder } from "@/lib/api/orders";

import {
  ChevronLeft,
  Package,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  Home,
  CreditCard,
  Calendar,
  DollarSign,
  Shield,
  Gift,
  Sparkles,
  Award,
  Gem,
  ExternalLink,
  ChevronRight,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  perfume: {
    name: string;
    imageUrl?: string;
  };
}

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  shippingAddress: string;
  city: string;
  pincode: string;
  items: OrderItem[];
}


// Mock product images for demonstration


export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");

  const orderId = params.id as string;

  useEffect(() => {
    setMounted(true);

    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchOrder();
  }, [isAuthenticated, isLoading, router, orderId]);

  const fetchOrder = async () => {
  try {
    const data = await fetchOrderById(orderId);
    setOrder(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingOrder(false);
  }
};
  const handleCancelOrder = async () => {
    if (!order) return;

    setIsCancelling(true);
    try {
      const response = await cancelOrder(orderId);

      if (response && response.ok) {
        router.push("/orders");
        fetchOrder(); // Refresh order data
        setTimeout(() => {
          setShowCancelConfirm(false);
          setCancelMessage("");
        }, 2000);
      } else {
        throw new Error('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setCancelMessage("Failed to cancel order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Check if order can be cancelled
  const canCancelOrder = order && 
    ['PLACED', 'PENDING', 'PROCESSING'].includes(order.status.toUpperCase()) &&
    order.status.toUpperCase() !== 'CANCELLED';

  // Status configuration
  const statusConfig: any = {
    PLACED: {
      color: "bg-primary/10 text-primary border-primary/30",
      icon: Clock,
      label: "Order Placed",
      description: "Your order has been confirmed"
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
      icon: CheckCircle2,
      label: "Delivered",
      description: "Enjoy your luxury items"
    },
    CANCELLED: {
      color: "bg-destructive/10 text-destructive border-destructive/30",
      icon: XCircle,
      label: "Cancelled",
      description: "Order has been cancelled"
    }
  };

  // Safe function to get status config
  const getStatusConfig = (status: any) => {
    if (!status) return statusConfig.PLACED;
    const statusString = String(status).toUpperCase();
    return statusConfig[statusString] || statusConfig.PLACED;
  };

  if (!mounted || isLoading || loadingOrder || !user) {
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
          LOADING ORDER DETAILS
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
          <div className="relative mb-10">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-card rounded-full flex items-center justify-center border border-primary/30 shadow-2xl">
              <Package className="h-16 w-16 text-primary/40" />
            </div>
          </div>
          <h1 className="font-serif text-4xl text-foreground mb-4">
            Order Not Found
          </h1>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto font-light">
            We couldn't find the order you're looking for.
          </p>
          <Link
            href="/orders"
            className="group inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-medium tracking-wider uppercase text-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-full relative overflow-hidden"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = order.totalAmount;
  const shipping = 0;
  const total = subtotal + shipping;

  const status = getStatusConfig(order.status);
  const StatusIcon = status.icon;

  // Timeline steps
  const timelineSteps = [
    { step: 1, label: "Order Placed", date: order.createdAt, completed: true, icon: Calendar },
    { step: 2, label: "Processing", date: "Preparing items", completed: order.status && (order.status.toString().toUpperCase() !== "PLACED"), icon: Package },
    { step: 3, label: "Shipped", date: "On its way", completed: order.status && (order.status.toString().toUpperCase() === "SHIPPED" || order.status.toString().toUpperCase() === "DELIVERED"), icon: Truck },
    { step: 4, label: "Delivered", date: "At your door", completed: order.status && order.status.toString().toUpperCase() === "DELIVERED", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-2xl">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-destructive rounded-full flex items-center justify-center border-4 border-background">
                <AlertCircle className="h-6 w-6 text-destructive-foreground" />
              </div>
              
              <div className="text-center mb-6">
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-foreground mb-2">
                  Cancel Order #{order.id.toString().padStart(6, '0')}
                </h3>
                <p className="text-muted-foreground">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
              </div>

              {cancelMessage && (
                <div className={`p-4 rounded-xl mb-6 ${cancelMessage.includes("successfully") ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600' : 'bg-destructive/10 border border-destructive/30 text-destructive'}`}>
                  <p className="text-sm font-medium">{cancelMessage}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={isCancelling}
                  className="flex-1 px-6 py-3 border border-border text-foreground font-medium rounded-xl hover:bg-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="flex-1 px-6 py-3 bg-destructive text-destructive-foreground font-medium rounded-xl hover:bg-destructive/90 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      Cancel Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group mb-6"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-wider uppercase">Back to Orders</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-5 w-5 text-primary/60" />
                <p className="text-xs tracking-[0.3em] uppercase text-primary/70 font-medium">
                  Order Details
                </p>
              </div>
              <h1 className="font-serif text-4xl md:text-6xl font-light text-foreground mb-2 tracking-tight">
                Order #{order.id.toString().padStart(6, '0')}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-2">
                <StatusIcon className="h-5 w-5" />
                <span className={`px-4 py-2 text-xs font-medium tracking-wider uppercase rounded-full border ${status.color}`}>
                  {status.label}
                </span>
              </div>
              
              {canCancelOrder && order.status !== "CANCELLED" && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="group relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-destructive/10 to-destructive/5 hover:from-destructive/20 hover:to-destructive/10 border border-destructive/30 rounded-full transition-all duration-300 flex items-center gap-2 text-destructive hover:text-destructive/90 hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-destructive/10 group-hover:bg-destructive/20 transition-colors duration-300" />
                  <XCircle className="h-4 w-4 relative z-10" />
                  <span className="text-sm font-medium tracking-wider uppercase relative z-10">
                    Cancel Order
                  </span>
                </button>
              )}
              
              <Award className="h-6 w-6 text-primary/40 hidden md:block" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Timeline & Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Timeline */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary/60" />
                Order Timeline
              </h2>
              
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/30 to-primary/20" />
                
                <div className="space-y-8">
                  {timelineSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={step.step} className="relative pl-16">
                        <div className={`absolute left-6 top-0 w-5 h-5 rounded-full border-2 ${step.completed ? 'bg-primary border-primary' : 'bg-card border-border'}`}>
                          {step.completed && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-background" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <StepIcon className={`h-5 w-5 ${step.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                              <h3 className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {step.label}
                              </h3>
                            </div>
                            <p className="text-sm text-muted-foreground pl-8">
                              {typeof step.date === 'string' && step.date.startsWith('20') 
                                ? new Date(step.date).toLocaleDateString()
                                : step.date}
                            </p>
                          </div>
                          
                          {step.completed && (
                            <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/30">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-3">
                <Package className="h-6 w-6 text-primary/60" />
                Your Luxury Items
              </h2>

              <div className="space-y-6">
                {order.items.map((item, index) => {
                  const productImage = item.perfume?.imageUrl || "/placeholder.svg";

                  return (
                    <div 
                      key={item.id}
                      className="group flex items-center gap-6 p-4 rounded-xl border border-border hover:border-primary/30 transition-all duration-300"
                    >
                      {/* Product Image */}
                      <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-card" />
                        <img
                          src={productImage}
                          alt={item.perfume.name}
                          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                          x{item.quantity}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-foreground mb-2">
                          {item.perfume.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Premium Fragrance Collection
                        </p>
                        <div className="flex items-center gap-2">
                          <Gem className="h-4 w-4 text-primary/60" />
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            Handcrafted Luxury
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-serif text-2xl text-foreground">
                          ₹{item.price.toLocaleString()}

                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₹{item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Details */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-primary/60" />
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-serif text-lg text-foreground">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-serif text-lg text-emerald-600">
                    FREE
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-serif text-lg text-foreground">
                    Included
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-lg font-medium text-foreground">Total</span>
                  <span className="font-serif text-3xl text-primary">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment & Shipping */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-primary/60" />
                Payment & Details
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Payment Method</span>
                  </div>
                  <p className="text-lg font-serif text-foreground">
                    {order.paymentMethod || "Not specified"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Payment confirmed
                  </p>
                </div>

                <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Shipping</span>
                  </div>
                  <p className="text-foreground">Standard Delivery</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    3-5 business days
                  </p>
                </div>

                <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Home className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Shipping Address</span>
                  </div>
                  <p className="text-foreground">Your Address</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Will be shown here
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-br from-primary/5 via-card/50 to-primary/5 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8">
              <h3 className="font-serif text-xl text-foreground mb-4">Need Help?</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Our luxury concierge team is here to assist you.
              </p>
              
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all duration-300 group">
                  <span className="text-foreground font-medium">Contact Support</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all duration-300 group">
                  <span className="text-foreground font-medium">Download Invoice</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all" />
                </button>
                
                <Link
                  href="/products"
                  className="w-full flex items-center justify-center gap-2 p-4 bg-primary text-primary-foreground font-medium rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <Gift className="h-5 w-5" />
                  Continue Shopping
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <Award className="h-5 w-5 text-primary/50" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>
            <p className="text-muted-foreground font-light italic leading-relaxed">
              "Thank you for choosing luxury. Each fragrance is carefully crafted and packaged with excellence."
            </p>
            <p className="text-sm text-muted-foreground/80 mt-4 uppercase tracking-widest">
              — The House of Elegance
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}