import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // تصحيح الرابط الكامل لسيرفر NestJS
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // حفظ التوكن وبيانات المستخدم في التخزين المحلي
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        navigate("/");
      } else {
        setErrorMessage(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Invalid email or password.",
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        "تعذر الاتصال بالسيرفر، تأكد من تشغيل السيرفر على البورت 5000.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Header />

      <main className="login-content">
        <div className="login-card-wrapper">
          {/* Left Side - Image */}
          <div className="login-image-side">
            <img src="/images/per.png" alt="Login Illustration" />
          </div>

          {/* Right Side - Form */}
          <div className="login-form-side">
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-header">
                <h2>Welcome Back</h2>
                <p className="subtitle">
                  Please enter your details to sign in.
                </p>
              </div>

              {errorMessage && (
                <div
                  className="error-alert"
                  style={{
                    color: "#e11d48",
                    fontSize: "13px",
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: "15px",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>

                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />

                  <button
                    type="button"
                    className="toggle-password"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <i
                      className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}
                    ></i>
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </button>

              <p className="signup-text">
                Don't have an account?{" "}
                <Link to="/register" className="signup-link">
                  Create Account
                </Link>
              </p>

              <div className="divider">
                <span>or continue with</span>
              </div>

              <div className="social-login">
                <a
                  href="https://accounts.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  aria-label="Login with Google"
                >
                  <i className="bi bi-google"></i>
                </a>

                <a
                  href="https://login.live.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  aria-label="Login with Microsoft"
                >
                  <i className="bi bi-microsoft"></i>
                </a>

                <a
                  href="https://appleid.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  aria-label="Login with Apple"
                >
                  <i className="bi bi-apple"></i>
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
