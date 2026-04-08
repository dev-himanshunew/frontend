"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    // ✅ validation
    if (!data.email || !data.password) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.token) {
        localStorage.setItem("token", result.token);

          // ✅ Clear ALL fields
  setData({
    email: "",
    password: "",
  });

        // ✅ redirect
        router.push("/dashboard");
      } else {
        alert(result.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="p-6 shadow-lg rounded w-80 bg-white">
        <h2 className="text-xl mb-4 text-center font-semibold">Login</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          type="password"
          placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-500 text-white p-2 w-full mb-2 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* ✅ Register Link */}
        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-500 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}