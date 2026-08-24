"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setToken, getToken } from "@/lib/auth";
import { sendOtp, verifyOtp, resetPassword, loginUser } from "@/lib/api/auth";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [user_name, setUser_name] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(user_name, password);
      setToken(res.accessToken);
      router.push("/admin/protected/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendOtp({ email });
      setStage("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const otpValue = otp.join("");
      const res = await verifyOtp({ email, otp: otpValue });
      if (res.message === "OTP verified successfully") {
        setToken(res.accessToken);
        setStage("reset");
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (
      !/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        newPassword
      )
    ) {
      setError("Password must include letters, numbers, and special characters");
      setLoading(false);
      return;
    }
    try {
      const token = getToken();
      if (!token) throw new Error("No token available");
      await resetPassword({ email, newPassword }, token);
      router.push("/admin/protected/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    // Only allow the last digit if multiple are entered (e.g. pasting) or a single digit
    const digit = value.slice(-1);

    if (digit === "" || /^\d$/.test(digit)) {
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      if (digit && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#2C271D] relative overflow-hidden">
      {/* Background Image / Pattern Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: "url('/product_bg.png')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#2C271D] via-[#2C271D]/90 to-[#3D3622]/90" />

      {/* Centered Form */}
      <div className="relative z-10 w-full max-w-md p-8 md:p-10 mx-4 bg-white/10 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/10 text-white">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="SimaArts" className="h-12 w-12 object-contain mb-3" />
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            {stage === "login"
              ? "SimaArts Admin"
              : stage === "forgot"
                ? "Forgot Password"
                : stage === "otp"
                  ? "Verify OTP"
                  : "Reset Password"}
          </h2>
        </div>

        {error && (
          <p className="bg-red-500/20 border border-red-500/30 text-red-200 text-xs font-semibold p-3 rounded-xl mb-6 text-center">{error}</p>
        )}

        {stage === "login" && (
          <form onSubmit={handleLoginSubmit}>
            <input
              type="text"
              value={user_name}
              onChange={(e) => setUser_name(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-xl p-3 mb-4 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D5C58A]"
              placeholder="Your Username"
              required
            />
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white text-sm placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-[#D5C58A]"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="text-right mb-6">
              <button
                type="button"
                onClick={() => setStage("forgot")}
                className="text-xs font-bold text-[#D5C58A] cursor-pointer hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D5C58A] hover:bg-[#c4b377] text-[#2C271D] py-3.5 rounded-xl cursor-pointer font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login to Admin"}
            </button>
          </form>
        )}

        {stage === "forgot" && (
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-xl p-3 mb-4 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D5C58A]"
              placeholder="Your Email"
              required
            />
            <div className="text-right mb-6">
              <button
                type="button"
                onClick={() => setStage("login")}
                className="text-xs font-bold text-[#D5C58A] cursor-pointer hover:underline"
              >
                Back to Login
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D5C58A] hover:bg-[#c4b377] text-[#2C271D] py-3.5 rounded-xl cursor-pointer font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {stage === "otp" && (
          <form onSubmit={handleOtpSubmit}>
            <div className="flex justify-between mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center bg-transparent border border-gray-300/30 rounded text-lg text-white"
                  maxLength={1}
                  required
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D5C58A] hover:bg-[#c4b377] text-[#2C271D] py-3.5 rounded-xl cursor-pointer font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {stage === "reset" && (
          <form onSubmit={handleResetSubmit}>
            <div className="relative mb-4">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white text-sm placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-[#D5C58A]"
                placeholder="New Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative mb-6">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white text-sm placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-[#D5C58A]"
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D5C58A] hover:bg-[#c4b377] text-[#2C271D] py-3.5 rounded-xl cursor-pointer font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
