"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import BackHomeButton from "../../components/BackHomeButton";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", country: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  

  const validateForm = () => {
    const { fullName, email, phone } = form;

    // Full Name: Must be at least two words
    if (!/^\w+\s+\w+/.test(fullName)) {
      setMessage("Full name must contain at least two words.");
      return false;
    }

    // Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Invalid email format.");
      return false;
    }

    // Phone Validation: Must contain only digits, between 10-15 characters
    if (phone && !/^\d{10,15}$/.test(phone)) {
      setMessage("Phone number must be 10-15 digits long.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    if (!validateForm()) {
      setMessage("Please fill in all required fields correctly.");
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
      setLoading(false);
  
      if (!res.ok) {
        setMessage(data.error || "Signup failed. Please try again.");
        return;
      }
  
      setMessage("Signup successful! Redirecting to verify OTP...");
      setTimeout(() => router.push("/verify-token"), 2000);
    } catch (error) {
      console.error("Signup Error:", error);
      setMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };
  

  return (
   <div>
    <BackHomeButton/>
     <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600">Create an Account</h2>

        {message && (
          <p className={`text-center mt-4 ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>

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


          <div className="mb-4">
            <label className="block text-gray-600 font-semibold">Country</label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-semibold">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
   </div>
  );
}
