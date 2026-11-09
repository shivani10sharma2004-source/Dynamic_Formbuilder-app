"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [step, setStep] = useState(1); // Step 1 = Signup Form, Step 2 = OTP Form
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  // NAYA: Jab bhi koi is page par aaye (ya back karke aaye), toh hamesha Step 1 dikhe
  useEffect(() => {
    setStep(1);
    setOtp('');
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Details bhejna aur OTP mangwana
  const handleSignupSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("Sending OTP to your email...");

    try {
      const res = await fetch("https://dynamic-formbuilder-app-2.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setStep(2); // OTP wale form par shift karein
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      setMessage("Server error.");
    }
  };

  // Step 2: OTP Verify karna
  const handleOtpSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("Verifying OTP...");

    try {
      const res = await fetch("https://dynamic-formbuilder-app-2.onrender.com/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Verification successful! 🎉 Redirecting to Login...");
        
        setTimeout(() => {
          router.replace("/login");
          
          // NAYA: Login page par jane ke baad background mein state reset kar do
          setTimeout(() => {
            setStep(1); 
            setFormData({ name: '', email: '', password: '' });
            setOtp('');
            setMessage('');
          }, 500); // 500ms delay taaki user ko achanak se page change hote hue na dikhe
          
        }, 2000);
      } else {
        setMessage(data.message || "Invalid OTP.");
      }
    } catch (error) {
      setMessage("Server error.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Branding */}
        <div className="bg-indigo-50/70 p-8 md:p-10 flex flex-col justify-between border-r border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-1.5 rounded-md">FF</div>
              <span className="font-bold text-slate-800 text-sm">FormFlow</span>
            </div>
          </div>
          <div className="py-2">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight leading-tight">Create Your <br /> Forms Easily</h2>
            <p className="text-slate-600 text-xs leading-relaxed mb-6">Collect responses, share forms <br /> and get insights.</p>
          </div>
          <div className="text-[11px] text-slate-400 mt-4">© 2026 FormFlow</div>
        </div>

        {/* Right Form Area */}
        <div className="p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-slate-900">{step === 1 ? "Sign Up" : "Verify Email"}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 1 ? "Create your account to get started" : `Enter the OTP sent to ${formData.email}`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email Address" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600" />
              </div>
              <button type="submit" className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs shadow-md mt-4">
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Enter 6-digit OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="123456" maxLength={6} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm tracking-widest text-center focus:outline-none focus:border-indigo-600" />
              </div>
              <button type="submit" className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs shadow-md mt-4">
                Verify & Create Account
              </button>
            </form>
          )}

          {message && (
            <p className={`mt-3 text-center text-xs font-semibold ${message.includes("successful") || message.includes("OTP sent") ? "text-green-600" : "text-red-500"}`}>
              {message}
            </p>
          )}

          {step === 1 && (
            <div className="mt-5 text-center text-xs text-slate-500">
              Already have an account? <Link href="/login" className="text-indigo-600 font-medium hover:underline">Login</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}