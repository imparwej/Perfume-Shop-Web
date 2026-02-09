import { apiFetch } from "../apiClient";

export const fetchMyOrders = async () => {
  const res = await apiFetch("/api/orders/my");
  return res?.json();
};

export const fetchOrderById = async (id: string) => {
  const res = await apiFetch(`/api/orders/${id}`);
  return res?.json();
};

export const cancelOrder = async (id: string) => {
  return apiFetch(`/api/orders/${id}/cancel`, {
    method: "PATCH",
  });
};

export const exportOrders = async () => {
  const res = await apiFetch("/api/orders/export");
  return res?.blob();
};
