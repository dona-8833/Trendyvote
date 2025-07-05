import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login, userData, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/voter");
      }
    }
  }, [userData, navigate]);

  return (
<div className="min-h-screen bg-gradient-to-br from-black via-[#4B2E2E] to-[#6B0F1A] flex items-center justify-center p-4 sm:p-6">
<div className="w-full max-w-md bg-[#262626] rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 border border-white/10">
    <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
      Login to Vote
    </h2>

    {error && (
      <p className="text-red-400 text-sm sm:text-base text-center bg-red-500/10 p-3 rounded-md animate-pulse">
        {error}
      </p>
    )}

    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-white/20 rounded-md bg-black text-white placeholder-gray-500 focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all duration-300"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          Password <span className="text-red-400">*</span>
        </label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-white/20 rounded-md bg-black text-white placeholder-gray-500 focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all duration-300"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#6B0F1A] to-[#B91C1C] text-white py-2.5 sm:py-3 px-4 rounded-md hover:brightness-125 focus:ring-2 focus:ring-[#B91C1C] transition-all duration-300 transform hover:scale-105"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>

    <div className="relative flex items-center justify-center my-4">
      <hr className="w-full border-t border-white/10" />
      <span className="absolute bg-[#1a1a1a] px-2 text-gray-400 text-sm">or</span>
    </div>

    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 bg-black border border-white/20 text-white py-2.5 sm:py-3 px-4 rounded-md hover:bg-[#4B2E2E] transition-all duration-300"
      disabled={loading}
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google icon"
        className="w-5 h-5"
      />
      <span className="text-sm sm:text-base font-medium">
        Continue with Google
      </span>
    </button>

    <p className="text-sm sm:text-base text-gray-400 text-center">
      Don't have an account?{" "}
      <Link
        to="/signup"
        className="text-[#B91C1C] font-medium underline hover:text-red-400"
      >
        Signup
      </Link>
    </p>
  </div>
</div>

  );
}
