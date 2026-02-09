const API = "http://localhost:8080/api";

function authHeaders() {
  const token = localStorage.getItem("maison_noir_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/* ================= ORDERS ================= */

export async function fetchOrder(id: string) {
  const res = await fetch(`${API}/orders/${id}`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}

export async function cancelOrder(id: string) {
  const res = await fetch(`${API}/orders/${id}/cancel`, {
    method: "PATCH",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Cancel failed");
  return res.json();
}

/* ================= ADDRESSES ================= */

export async function fetchAddresses() {
  const res = await fetch(`${API}/address`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to load addresses");
  return res.json();
}

export async function saveAddress(data: {
  line: string;
  city: string;
  postalCode: string;
}) {
  const res = await fetch(`${API}/address`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Save failed");
  return res.json();
}

export async function deleteAddress(id: number) {
  const res = await fetch(`${API}/address/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Delete failed");
}

export async function updateAddress(id: number, data: any) {
  const res = await fetch(`${API}/address/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Update failed");
  return res.json();
}

/* ================= PROFILE ================= */

export async function fetchProfile() {
  const res = await fetch(`${API}/user/profile`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Profile load failed");
  return res.json();
}

export async function updateProfile(data: {
  name: string;
  phone: string;
}) {
  const res = await fetch(`${API}/user/profile`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Profile update failed");
  return res.json();
}

/* ================= PASSWORD ================= */

export async function changePassword(
  current: string,
  newPassword: string
) {
  const res = await fetch(`${API}/user/password`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({
      currentPassword: current,
      newPassword: newPassword,
    }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  return res.text();
}
