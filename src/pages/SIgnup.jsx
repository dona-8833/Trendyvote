import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { register, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.email, form.password, form.name);
      navigate("/voter");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signInWithGoogle();
      navigate("/voter");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#4B2E2E] to-[#6B0F1A] flex items-center justify-center p-4 sm:p-6">
<div className="w-full max-w-md bg-[#262626] rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 border border-white/10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
          Sign Up to Vote
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-md animate-pulse">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-3 border border-white/20 rounded-md bg-black text-white placeholder-gray-500 focus:ring-2 focus:ring-[#B91C1C] transition-all"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-white/20 rounded-md bg-black text-white placeholder-gray-500 focus:ring-2 focus:ring-[#B91C1C] transition-all"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password <span className="text-red-400">*</span>
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-white/20 rounded-md bg-black text-white placeholder-gray-500 focus:ring-2 focus:ring-[#B91C1C] transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6B0F1A] to-[#B91C1C] text-white py-3 px-4 rounded-md hover:brightness-125 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
          >
            Register
          </button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <hr className="w-full border-t border-white/10" />
          <span className="absolute bg-[#1a1a1a] px-3 text-gray-400 text-sm z-10">OR</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border border-white/20 bg-black text-white py-2.5 px-4 rounded-md hover:bg-[#4B2E2E] transition-all duration-300 text-sm font-medium shadow-sm"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google icon"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#B91C1C] font-medium underline hover:text-red-400 transition-all"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
