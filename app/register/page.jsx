"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!data.name || !data.email || !data.password) {
      return setMessage("All fields are required");
    }

    if (!data.email.includes("@")) {
      return setMessage("Enter valid email");
    }

    if (data.password.length < 4) {
      return setMessage("Password must be at least 4 characters");
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("http://127.0.0.1:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Register failed");
      }

      // ✅ Success
      setMessage("Registered successfully!");

      // ✅ Reset form (will now reflect in UI)
      setData({
        name: "",
        email: "",
        password: "",
      });

      // ✅ Delay redirect (so user sees result)
      setTimeout(() => {
        router.replace("/login");
      }, 1500);

    } catch (err) {
      setMessage(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="p-6 shadow-lg rounded w-80 bg-white"
      >
        <h2 className="text-xl mb-4 text-center font-semibold">
          Create Account
        </h2>

        {/* ✅ Message UI (better than alert) */}
        {message && (
          <p className="text-sm text-center mb-2 text-red-500">
            {message}
          </p>
        )}

        <input
          name="name"
          className="border p-2 w-full mb-2"
          placeholder="Full Name"
          value={data.name}
          onChange={handleChange}
        />

        <input
          name="email"
          className="border p-2 w-full mb-2"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          className="border p-2 w-full mb-2"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white p-2 w-full mb-2 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}