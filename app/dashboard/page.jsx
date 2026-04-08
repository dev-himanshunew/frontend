"use client";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
const [editId, setEditId] = useState(null);
const [editData, setEditData] = useState({ name: "", email: "" });


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

  const deleteUser = async (id) => {
  if (!confirm("Delete this user?")) return;

  try {
    await api(`/users/delete/${id}`, {
      method: "DELETE",
    });

    // remove from UI
    setUsers(users.filter((u) => u.id !== id));
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};

const updateUser = async (id, updatedData) => {
  try {
    await api(`/users/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });

    fetchUsers(); // refresh list
  } catch (err) {
    console.error(err);
    alert("Update failed");
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

      {users.map((u) => (
  <div key={u.id} className="border p-3 mb-2 rounded">
    
    {editId === u.id ? (
      <>
        <input
          className="border p-1 w-full mb-1"
          value={editData.name}
          onChange={(e) =>
            setEditData({ ...editData, name: e.target.value })
          }
        />
        <input
          className="border p-1 w-full mb-1"
          value={editData.email}
          onChange={(e) =>
            setEditData({ ...editData, email: e.target.value })
          }
        />

        <button
          onClick={() => {
            updateUser(u.id, editData);
            setEditId(null);
          }}
          className="bg-green-500 text-white px-2 py-1 mr-2"
        >
          Save
        </button>

        <button
          onClick={() => setEditId(null)}
          className="bg-gray-400 text-white px-2 py-1"
        >
          Cancel
        </button>
      </>
    ) : (
      <>
        <p className="font-medium">{u.name}</p>
        <p className="text-gray-600">{u.email}</p>

        <div className="mt-2">
          <button
            onClick={() => {
              setEditId(u.id);
              setEditData({ name: u.name, email: u.email });
            }}
            className="bg-blue-500 text-white px-2 py-1 mr-2"
          >
            Edit
          </button>

          <button
            onClick={() => deleteUser(u.id)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Delete
          </button>
        </div>
      </>
    )}
  </div>
))}
    </div>
  );
}