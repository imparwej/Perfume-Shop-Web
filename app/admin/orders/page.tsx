"use client";

import { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  city: string;
  pincode: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/orders?page=0&size=20");
      if (!res) return;
      const data = await res.json();
      setOrders(data?.content || []);
    } catch (err) {
      console.error("Orders fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await apiFetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLACED":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "SHIPPED":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto py-10 space-y-8">

        <h1 className="text-3xl font-bold">Admin Orders</h1>

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin w-6 h-6" />
          </div>
        ) : (
          <div className="grid gap-6">
            {orders?.map((order) => (
              <Card key={order.id} className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Order #{order.id}</CardTitle>

                  <Badge
                    variant="outline"
                    className={getStatusColor(order.status)}
                  >
                    {order.status}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-4 text-sm">

                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-semibold">
                        ₹{order.totalAmount}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Payment</p>
                      <p>{order.paymentMethod}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">City</p>
                      <p>{order.city}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                  </div>

                  <div className="flex justify-end">
                    <Select
                      onValueChange={(value) =>
                        updateStatus(order.id, value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="PLACED">PLACED</SelectItem>
                        <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                        <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                        <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
