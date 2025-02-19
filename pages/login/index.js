"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || "Login failed");
    } else {
      setMessage("Login successful! Redirecting...");
      setTimeout(() => router.push("/manage-notes"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600">Login to Your Account</h2>

        {message && (
          <p className={`text-center mt-4 ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="mb-4 relative">
  <label className="block text-gray-600 font-semibold">Password</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={form.password}
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 pr-10"
    />
    <button
      type="button"
      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
</div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-500">
  Don't have an account?{" "}
  <a href="/signup" className="text-blue-600 font-semibold hover:underline">
    Sign Up
  </a>
</p>
<p className="text-center mt-2">
  <a href="/reset-password" className="text-blue-600 font-semibold hover:underline">
    Forgot Password?
  </a>
</p>



      </div>
    </div>
  );
}
