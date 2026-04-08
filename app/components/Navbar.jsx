"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between">
      <div>
        <Link href="/dashboard" className="mr-4">Dashboard</Link>
        <p>Users</p>
      </div>

      <button onClick={logout} className="bg-red-500 px-3 py-1">
        Logout
      </button>
    </div>
  );
}