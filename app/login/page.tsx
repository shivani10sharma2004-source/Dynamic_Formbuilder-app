"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); 
    setMessage("Checking details...");

    try {
      const res = await fetch("https://dynamic-formbuilder-app-2.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful! 🎉");
        
        // Login hone ke baad user ka naam aur token save kar rahe hain
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", formData.email);
        
        // Sahi detail hone par hi Dashboard par bhejega
        setTimeout(() => {
          router.push("/dashboard"); 
        }, 1000);
      } else {
        setMessage(data.message || "Invalid email or password.");
      }
    } catch (error) {
      setMessage("Server error. Backend chal raha hai ya check karein!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          Login to FormFlow
        </h1>

        {/* Yahan Link ki jagah form tag add kiya hai */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Your email" 
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Your password" 
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Yahan Link ki jagah proper submit button banaya hai */}
          <button 
            type="submit" 
            className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition shadow-md flex items-center justify-center"
          >
            Login
          </button>
        </form>

        {/* Message dikhane ke liye */}
        {message && (
          <p className={`mt-4 text-center text-xs font-semibold ${message.includes("successful") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <div className="mt-6 text-center text-xs text-slate-500 space-y-2">
          <p>
            No account yet?{' '}
            <Link href="/signup" className="text-indigo-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
          <p>
            <a href="#" className="text-indigo-600 hover:underline">
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}