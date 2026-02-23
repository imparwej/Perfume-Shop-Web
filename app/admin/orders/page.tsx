"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  city: string;
  pincode: string;

  // Timeline
  packedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;

  // Tracking
  trackingNumber?: string;
  courierName?: string;

  items?: OrderItem[];
}

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loadingDetailsId, setLoadingDetailsId] = useState<number | null>(null);
  const [revenue, setRevenue] = useState<number>(0);

  const fetchOrders = async () => {
  setLoading(true);
  try {
    // 1️⃣ Fetch paginated orders
    const res = await apiFetch(`/api/admin/orders?page=${page}&size=20`);

    if (!res || !res.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await res.json();
    setOrders(data?.content || []);

    // 2️ Fetch total revenue separately (backend calculated)
    const revenueRes = await apiFetch("/api/admin/revenue");

    if (revenueRes && revenueRes.ok) {
      const revenueData = await revenueRes.json();
      setRevenue(revenueData.totalRevenue);
    }

  } catch (err) {
    console.error("Orders fetch failed", err);
    toast.error("Failed to load orders");
  } finally {
    setLoading(false);
  }
};

  const fetchOrderDetails = async (id: number) => {
    setLoadingDetailsId(id);
    try {
      const res = await apiFetch(`/api/admin/orders/${id}`);
      if (!res || !res.ok) {
  throw new Error("Status update failed");
}
      const data = await res.json();

      setOrders((prev) =>
  prev.map((o) =>
    o.id === id
      ? {
          ...o,
          items: data.items,
          packedAt: data.packedAt,
          shippedAt: data.shippedAt,
          deliveredAt: data.deliveredAt,
          cancelledAt: data.cancelledAt,
          trackingNumber: data.trackingNumber,
          courierName: data.courierName,
        }
      : o
  )
);

      setExpandedId(id);
    } catch (err) {
      console.error("Details fetch failed", err);
    } finally {
      setLoadingDetailsId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await apiFetch(
        `/api/admin/orders/${id}/status?status=${status}`,
        { method: "PATCH" }
      );

     if (!res || !res.ok) {
     throw new Error("Status update failed");
      }
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? { ...order, status } : order
        )
      );
      setExpandedId(null);
      toast.success("Order status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLACED":
        return "bg-amber-50/80 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-800/30";
      case "SHIPPED":
        return "bg-blue-50/80 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800/30";
      case "DELIVERED":
        return "bg-emerald-50/80 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-800/30";
      case "CANCELLED":
        return "bg-rose-50/80 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-800/30";
      default:
        return "";
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch = order.id.toString().includes(search);
      const matchStatus =
        filterStatus === "ALL" || order.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [orders, search, filterStatus]);


  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-700">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-10 lg:px-14 py-8 md:py-10 space-y-10">
        {/* Back button with refined gold line animation */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="group -ml-4 border-0 hover:bg-transparent hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
        >
          <span className="relative text-sm tracking-wide">
            ← Back
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-700/50 dark:bg-amber-300/50 group-hover:w-full transition-all duration-700 ease-out"></span>
          </span>
        </Button>

        {/* Editorial header with serif and gold line */}
        <div className="space-y-3">
          <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight text-foreground">
            Orders
          </h1>
          <div className="w-24 h-px bg-amber-700/30 dark:bg-amber-300/30"></div>
          <p className="text-muted-foreground text-xs uppercase tracking-[0.3em] font-light">
            Administrative dashboard
          </p>
        </div>

        {/* Stats Cards — ultra-minimalist, no borders, only typography */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 md:gap-6">
          {[
            { label: "Total Orders", value: orders.length },
            { label: "Delivered", value: orders.filter(o => o.status === "DELIVERED").length },
            { label: "Pending", value: orders.filter(o => o.status === "PLACED").length },
            { label: "Cancelled", value: orders.filter(o => o.status === "CANCELLED").length },
            { label: "Revenue", value: `₹${revenue.toLocaleString()}` },
          ].map((stat, idx) => (
            <div key={idx} className="group">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-light">
                {stat.label}
              </p>
              <p className={`font-serif text-3xl md:text-4xl font-light mt-1 transition-colors ${idx === 4 ? 'text-amber-700 dark:text-amber-300' : 'group-hover:text-amber-700/70 dark:group-hover:text-amber-300/70'}`}>
                {stat.value}
              </p>
              <div className={`w-8 h-px mt-1 ${idx === 4 ? 'bg-amber-700/30 dark:bg-amber-300/30' : 'bg-muted-foreground/20 group-hover:bg-amber-700/30 dark:group-hover:bg-amber-300/30'} transition-colors duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Search & Filter — borderless, bottom border only */}
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="relative flex-1">
            <Input
              placeholder="Search by Order ID"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              className="pl-0 pr-0 py-2 border-0 border-b border-muted/20 rounded-none bg-transparent text-base focus:ring-0 focus:border-amber-700/50 dark:focus:border-amber-300/50 transition-colors duration-300"
            />
          </div>

          <Select onValueChange={(value) => setFilterStatus(value)}>
            <SelectTrigger className="w-full sm:w-[220px] border-0 border-b border-muted/20 rounded-none bg-transparent py-2 focus:ring-0 focus:border-amber-700/50 dark:focus:border-amber-300/50 transition-colors duration-300">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="PLACED">PLACED</SelectItem>
              <SelectItem value="SHIPPED">SHIPPED</SelectItem>
              <SelectItem value="DELIVERED">DELIVERED</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin w-8 h-8 text-amber-700/30 dark:text-amber-300/30" />
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="border border-muted/10 bg-card hover:border-amber-700/20 dark:hover:border-amber-300/20 shadow-sm hover:shadow-md transition-all duration-500 rounded-none"
              >
                <CardHeader className="p-5 pb-3 flex flex-row items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="font-serif text-2xl font-light tracking-tight">
                      Order #{order.id}
                    </CardTitle>
                    <div className="w-12 h-px bg-amber-700/20 dark:bg-amber-300/20"></div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`px-3 py-1 text-xs font-medium rounded-none border tracking-wide ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </Badge>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-5">
                  {/* Order summary grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-light">Total</p>
                      <p className="font-serif text-base mt-1">₹{order.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-light">Payment</p>
                      <p className="font-serif text-base mt-1">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-light">City</p>
                      <p className="font-serif text-base mt-1">{order.city}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-light">Date</p>
                      <p className="font-serif text-base mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="flex flex-wrap justify-between items-center gap-4 pt-1">
                    <Select
                         disabled={
                         order.status === "CANCELLED" ||
                         order.status === "DELIVERED" }
                      onValueChange={(value) => updateStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-[200px] border-0 border-b border-muted/20 rounded-none bg-transparent py-1 px-0 focus:ring-0 focus:border-amber-700/50 dark:focus:border-amber-300/50 transition-colors duration-300">
                        <SelectValue placeholder={order.status} />
                      </SelectTrigger>
                <SelectContent>
                     {order.status === "PLACED" && (
                     <>
                <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                   </>
                    )}
                    {order.status === "SHIPPED" && (
                    <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                     )}
                </SelectContent>
                </Select>

                    <Button
                      variant="ghost"
                      onClick={() =>
                        expandedId === order.id
                          ? setExpandedId(null)
                          : fetchOrderDetails(order.id)
                      }
                      className="group relative px-0 hover:bg-transparent"
                    >
                      <span className="relative text-sm tracking-wide">
                        {expandedId === order.id ? "Hide Details" : "View Details"}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-700/50 dark:bg-amber-300/50 group-hover:w-full transition-all duration-700 ease-out"></span>
                      </span>
                    </Button>
                  </div>

                 {/* ===== ORDER DETAILS SECTION ===== */}
{expandedId === order.id && (
  <div className="pt-5 border-t border-muted/10 space-y-6">

    {loadingDetailsId === order.id ? (
      <div className="flex justify-center py-5">
        <Loader2 className="animate-spin w-5 h-5 text-amber-700/30 dark:text-amber-300/30" />
      </div>
    ) : (
      <>
        {/* ===== TIMELINE ===== */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Order Timeline
          </p>

          <div className="space-y-1 text-sm font-light">
            <div>
              Placed: {new Date(order.createdAt).toLocaleString()}
            </div>

            {order.shippedAt && (
              <div>
                Shipped: {new Date(order.shippedAt).toLocaleString()}
              </div>
            )}

            {order.deliveredAt && (
              <div className="text-emerald-600 dark:text-emerald-400">
                Delivered: {new Date(order.deliveredAt).toLocaleString()}
              </div>
            )}

            {order.cancelledAt && (
              <div className="text-rose-600 dark:text-rose-400">
                Cancelled: {new Date(order.cancelledAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* ===== TRACKING INFO ===== */}
        {order.trackingNumber && (
          <div className="space-y-2 border-t border-muted/10 pt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Tracking Information
            </p>

            <div className="text-sm font-light">
              <div>Courier: {order.courierName}</div>
              <div>Tracking ID: {order.trackingNumber}</div>
            </div>
          </div>
        )}

        {/* ===== PRODUCT DETAILS ===== */}
        <div className="space-y-4 border-t border-muted/10 pt-4">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="group/item flex gap-5 p-4 -mx-4 hover:bg-amber-50/30 dark:hover:bg-amber-950/10 transition-colors duration-500"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover"
              />
              <div className="space-y-1">
                <p className="font-serif text-base">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm font-light text-amber-700 dark:text-amber-300">
                  ₹{item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
)}
</CardContent>
</Card>
))}
</div>
)}

        {/* Pagination — delicate */}
        <div className="flex justify-center gap-6 pt-6">
          <Button
            variant="ghost"
            disabled={page === 0}
            onClick={() => setPage(prev => prev - 1)}
            className="group relative px-0 hover:bg-transparent disabled:opacity-20"
          >
            <span className="relative text-sm tracking-wide">
              Previous
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-700/50 dark:bg-amber-300/50 group-hover:w-full transition-all duration-700 ease-out"></span>
            </span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => setPage(prev => prev + 1)}
            className="group relative px-0 hover:bg-transparent"
          >
            <span className="relative text-sm tracking-wide">
              Next
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-700/50 dark:bg-amber-300/50 group-hover:w-full transition-all duration-700 ease-out"></span>
            </span>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}