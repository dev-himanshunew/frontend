"use client";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login"); // better than push
        return;
      }

      await fetchUsers();
    };

    init();
  }, [setUsers]);

  const fetchUsers = async () => {
    try {
      const res = await api("/users");

      // ✅ Better validation
      if (!res || res.success === false) {
        const message = res?.message || "Unauthorized";

        if (
          message.includes("token") ||
          message.includes("Unauthorized")
        ) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }
      }

      setUsers(res.data || res || []);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((u) => (
          <div key={u.id} className="border p-3 mb-2 rounded">
            <p className="font-medium">{u.name}</p>
            <p className="text-gray-600">{u.email}</p>
          </div>
        ))
      )}
    </div>
  );
}