import React, { useState } from "react";
import { Eye, EyeOff, RotateCw, AlertCircle, CheckCircle2, X } from "lucide-react";
import hauloopLogo from "../assets/hauloop-logo.png";
import loginTruckImg from "../assets/login-hero-truck.jpg";
import { recordUserLogin } from "../lib/userDatabase.js";

const CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCaptchaCode() {
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += CAPTCHA_CHARS.charAt(Math.floor(Math.random() * CAPTCHA_CHARS.length));
  }
  return code;
}

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("N9T23");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modals for Forgot Password and Sign Up
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupForm, setSignupForm] = useState({
    name: "",
    company: "",
    email: "",
    fleetSize: "10-50 vehicles"
  });

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptchaCode());
    setCaptchaInput("");
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = (email || "").trim();
    const cleanPass = (password || "").trim();
    const cleanCaptcha = (captchaInput || "").trim();

    if (!cleanEmail) {
      setError("Please enter your Email ID.");
      return;
    }
    if (!cleanPass) {
      setError("Please enter your Password.");
      return;
    }
    if (!cleanCaptcha) {
      setError("Please enter the Captcha code shown.");
      return;
    }
    if (cleanCaptcha.toUpperCase() !== captchaCode.toUpperCase()) {
      setError("Invalid Captcha code. Please try again.");
      refreshCaptcha();
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Verification successful. Loading fleet dashboard...");

      const isYuvaraj =
        cleanEmail.toLowerCase().includes("yuvaraj") ||
        cleanEmail === "yuvaraj@example.com" ||
        cleanEmail === "yuvaraj@hauloop.com";
      const isDefaultAdmin = cleanEmail.toLowerCase().includes("admin");

      const userObj = {
        username: isYuvaraj ? "yuvaraj" : (isDefaultAdmin ? "admin" : cleanEmail.split("@")[0]),
        email: cleanEmail.includes("@") ? cleanEmail : `${cleanEmail}@hauloop.com`,
        fullName: isYuvaraj ? "Yuvaraj Perumal" : (isDefaultAdmin ? "System Administrator" : "Fleet Manager"),
        role: "Fleet Administrator",
        operatorId: isYuvaraj ? "ADM-3604" : "ADM-1001",
        phone: "+91 98765 43210",
        loginTime: new Date().toLocaleTimeString()
      };

      recordUserLogin(userObj.email);

      setTimeout(() => {
        onLoginSuccess(userObj, true);
      }, 450);
    }, 550);
  };

  // 1-Click Quick Demo Login for instant showcase
  const handleQuickDemo = () => {
    setEmail("yuvaraj@hauloop.com");
    setPassword("hauloop2026");
    setCaptchaInput(captchaCode);
    setError(null);

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const demoUser = {
        username: "yuvaraj",
        email: "yuvaraj@hauloop.com",
        fullName: "Yuvaraj Perumal",
        role: "Fleet Administrator",
        operatorId: "ADM-3604",
        phone: "+91 98765 43210",
        loginTime: new Date().toLocaleTimeString()
      };
      recordUserLogin(demoUser.email);
      onLoginSuccess(demoUser, true);
    }, 400);
  };

  // Colors for stylized captcha characters
  const charColors = ["#002b49", "#d32f2f", "#1e3a5f", "#c62828", "#0f2b48"];

  return (
    <div className="login-split-page-root">
      <div className="login-split-grid">
        {/* LEFT PANEL: Brand, Tagline, Highway Truck Hero & Telematics Badge */}
        <div className="login-truck-visual-panel">
          <div className="login-visual-top">
            <img
              src={hauloopLogo}
              alt="HAULOOP VEHICLE CARE"
              className="login-brand-logo-img"
            />
          </div>

          <div className="login-visual-center">
            <h1 className="login-hero-truck-heading">
              Smarter Diagnostics<br />for a Healthier Fleet
            </h1>
            <p className="login-hero-truck-tagline">
              Monitor. Diagnose. Keep Moving.
            </p>

            {/* Truck Card with Telematics live badge */}
            <div className="login-truck-image-card">
              <img
                src={loginTruckImg}
                alt="Hauloop Commercial Fleet Diagnostic Truck"
                className="login-truck-photo"
              />
              <div className="login-truck-telematics-badge">
                <span className="live-pulse-dot" />
                <span>SAE J1939 Telematics Online</span>
              </div>
            </div>
          </div>

          <div className="login-visual-bottom">
            <span>© 2026 HAULOOP VEHICLE CARE </span>
          </div>
        </div>

        {/* RIGHT PANEL: Image 3 Reference Form */}
        <div className="login-form-side-panel">
          <div className="login-form-inner-wrapper">
            {/* Heading & Subtitle exactly matching 3rd reference image */}
            <h2 className="auth-heading">Welcome back</h2>
            <p className="auth-subtitle">
              Sign in to manage your logistics, fleet, warehouse, and financial operations in one place.
            </p>

            {/* Error / Success Feedback */}
            {error && (
              <div className="auth-alert-box alert-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="auth-alert-box alert-success">
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Main Authentication Form */}
            <form onSubmit={handleLogin} className="auth-form" noValidate>
              {/* Email ID Field */}
              <div className="auth-form-group">
                <label htmlFor="authEmail" className="auth-label">
                  Email ID
                </label>
                <input
                  id="authEmail"
                  type="email"
                  className="auth-input"
                  placeholder="Enter Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="auth-form-group">
                <label htmlFor="authPassword" className="auth-label">
                  Password
                </label>
                <div className="auth-password-input-wrap">
                  <input
                    id="authPassword"
                    type={showPassword ? "text" : "password"}
                    className="auth-input password-input"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Captcha Field */}
              <div className="auth-form-group">
                <label htmlFor="authCaptcha" className="auth-label">
                  Captcha
                </label>
                <div className="auth-captcha-row">
                  {/* Captcha stylized box matching 3rd image with strikethrough and refresh button */}
                  <div
                    className="auth-captcha-box"
                    onClick={refreshCaptcha}
                    title="Click to refresh captcha"
                  >
                    <svg
                      className="auth-captcha-svg"
                      viewBox="0 0 130 46"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <pattern id="captcha-grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                        </pattern>
                      </defs>
                      <rect width="130" height="46" fill="#f8fafc" />
                      <rect width="130" height="46" fill="url(#captcha-grid-pattern)" opacity="0.6" />

                      {/* Random noise curve */}
                      <path
                        d="M 5 24 Q 35 8, 65 24 T 125 20"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="1.2"
                      />

                      {/* Captcha Characters */}
                      {captchaCode.split("").map((ch, idx) => {
                        const xPos = 14 + idx * 19;
                        const yPos = 30 + (idx % 2 === 0 ? -2 : 2);
                        const rotate = idx % 2 === 0 ? -6 : 8;
                        const color = charColors[idx % charColors.length];
                        return (
                          <text
                            key={idx}
                            x={xPos}
                            y={yPos}
                            fill={color}
                            fontSize="20"
                            fontWeight="700"
                            fontFamily="system-ui, -apple-system, sans-serif"
                            transform={`rotate(${rotate}, ${xPos}, ${yPos})`}
                            letterSpacing="1"
                          >
                            {ch}
                          </text>
                        );
                      })}

                      {/* Diagonal red/grey strikethrough lines */}
                      <line
                        x1="12"
                        y1="36"
                        x2="114"
                        y2="10"
                        stroke="#dc2626"
                        strokeWidth="1.4"
                        strokeOpacity="0.75"
                      />
                      <line
                        x1="8"
                        y1="18"
                        x2="118"
                        y2="28"
                        stroke="#94a3b8"
                        strokeWidth="0.8"
                        strokeOpacity="0.6"
                      />
                    </svg>

                    {/* Reload / Refresh icon button */}
                    <button
                      type="button"
                      className="auth-captcha-reload-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        refreshCaptcha();
                      }}
                      title="Generate new Captcha"
                      aria-label="Refresh Captcha"
                    >
                      <RotateCw size={15} />
                    </button>
                  </div>

                  {/* Captcha Input */}
                  <input
                    id="authCaptcha"
                    type="text"
                    className="auth-input auth-captcha-input"
                    placeholder="Enter Captcha"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              {/* Forgot Password Link on the right */}
              <div className="auth-forgot-row">
                <button
                  type="button"
                  className="auth-forgot-link"
                  onClick={() => {
                    setForgotModalOpen(true);
                    setForgotSuccess(false);
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Dark Navy Blue Login Button matching 3rd reference image */}
              <button
                type="submit"
                className="auth-login-btn"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Login"}
              </button>
            </form>

            {/* Footer: Don't have an account? Sign Up */}
            <div className="auth-bottom-row">
              <span>Don't have an account? </span>
              <button
                type="button"
                className="auth-signup-link"
                onClick={() => {
                  setSignupModalOpen(true);
                  setSignupSuccess(false);
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Convenient 1-Click Demo Login Chip */}
            <div className="auth-quick-demo-box">
              <button
                type="button"
                className="auth-quick-demo-chip"
                onClick={handleQuickDemo}
                title="Auto-fill credentials and sign in as Yuvaraj Perumal"
              >
                ⚡ 1-Click Demo: Yuvaraj Perumal (Fleet Admin)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="auth-modal-overlay" onClick={() => setForgotModalOpen(false)}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h3 className="auth-modal-title">Reset Password</h3>
              <button
                className="auth-modal-close-btn"
                onClick={() => setForgotModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            {forgotSuccess ? (
              <div className="auth-modal-body">
                <div className="auth-alert-box alert-success" style={{ margin: "16px 0" }}>
                  <CheckCircle2 size={16} />
                  <span>Password reset instructions have been sent to <strong>{forgotEmail || "your email"}</strong>.</span>
                </div>
                <button
                  type="button"
                  className="auth-login-btn"
                  onClick={() => setForgotModalOpen(false)}
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <div className="auth-modal-body">
                <p className="auth-modal-desc">
                  Enter your registered Email ID and we will send you a secure link to reset your account credentials.
                </p>
                <div className="auth-form-group" style={{ marginBottom: "16px" }}>
                  <label className="auth-label">Registered Email ID</label>
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="e.g. yuvaraj@hauloop.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="auth-login-btn"
                  onClick={() => {
                    if (forgotEmail.trim()) {
                      setForgotSuccess(true);
                    }
                  }}
                >
                  Send Reset Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {signupModalOpen && (
        <div className="auth-modal-overlay" onClick={() => setSignupModalOpen(false)}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h3 className="auth-modal-title">Create Hauloop Fleet Account</h3>
              <button
                className="auth-modal-close-btn"
                onClick={() => setSignupModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            {signupSuccess ? (
              <div className="auth-modal-body">
                <div className="auth-alert-box alert-success" style={{ margin: "16px 0" }}>
                  <CheckCircle2 size={16} />
                  <span>Account registration submitted! Our fleet deployment team will activate your telematics dashboard.</span>
                </div>
                <button
                  type="button"
                  className="auth-login-btn"
                  onClick={() => setSignupModalOpen(false)}
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <div className="auth-modal-body">
                <p className="auth-modal-desc">
                  Join leading logistics fleets using Hauloop for real-time CAN diagnostics and proactive fleet care.
                </p>
                <div className="auth-form-group" style={{ marginBottom: "12px" }}>
                  <label className="auth-label">Full Name</label>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Enter your name"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  />
                </div>
                <div className="auth-form-group" style={{ marginBottom: "12px" }}>
                  <label className="auth-label">Company / Fleet Name</label>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Enter transport company name"
                    value={signupForm.company}
                    onChange={(e) => setSignupForm({ ...signupForm, company: e.target.value })}
                  />
                </div>
                <div className="auth-form-group" style={{ marginBottom: "12px" }}>
                  <label className="auth-label">Work Email</label>
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="name@company.com"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  />
                </div>
                <div className="auth-form-group" style={{ marginBottom: "18px" }}>
                  <label className="auth-label">Fleet Size</label>
                  <select
                    className="auth-input"
                    value={signupForm.fleetSize}
                    onChange={(e) => setSignupForm({ ...signupForm, fleetSize: e.target.value })}
                  >
                    <option value="1-10 vehicles">1 - 10 Commercial Vehicles</option>
                    <option value="10-50 vehicles">10 - 50 Commercial Vehicles</option>
                    <option value="50-200 vehicles">50 - 200 Commercial Vehicles</option>
                    <option value="200+ vehicles">200+ Heavy Logistics Fleet</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="auth-login-btn"
                  onClick={() => setSignupSuccess(true)}
                >
                  Request Fleet Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
