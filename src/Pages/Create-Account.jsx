import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/Create-Account.css";

function CreateAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [profileImageBase64, setProfileImageBase64] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImagePreview(URL.createObjectURL(file));

      // تحويل الصورة إلى Base64 لإرسالها وتخزينها كـ avatarUrl
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    if (formData.nationalId.trim().length !== 14) {
      setErrorMessage("National ID number must be exactly 14 digits.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        nationalId: formData.nationalId.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
        avatarUrl: profileImageBase64 || "",
      };

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        // حفظ بيانات المستخدم للدخول مباشرة
        if (result.token) {
          localStorage.setItem("authToken", result.token);
        }
        if (result.user) {
          const userWithAvatar = {
            ...result.user,
            avatarUrl: profileImageBase64 || result.user.avatarUrl || "",
          };
          localStorage.setItem("user", JSON.stringify(userWithAvatar));
        }

        alert("Account created successfully!");
        navigate("/");
      } else {
        setErrorMessage(
          Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message || "Failed to create account.",
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(
        "تعذر الاتصال بالسيرفر، تأكد من تشغيل السيرفر على البورت 5000.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Header />

      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 className="form-title">CREATE YOUR ACCOUNT</h2>

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

          {/* Profile Picture Section */}
          <div className="avatar-section">
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
            <label htmlFor="profile-upload" className="avatar-upload-label">
              <div className="avatar-circle-large">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile Preview"
                    className="avatar-img"
                  />
                ) : (
                  <i className="bi bi-person-fill avatar-icon"></i>
                )}
                <div className="add-badge">
                  <i className="bi bi-camera-fill"></i>
                </div>
              </div>
              <span className="upload-text">Upload Photo</span>
            </label>
          </div>

          {/* Name Row */}
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="firstName">FIRST NAME</label>
              <div className="input-wrapper">
                <i className="bi bi-person input-icon"></i>
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="lastName">LAST NAME</label>
              <div className="input-wrapper">
                <i className="bi bi-person input-icon"></i>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* National ID */}
          <div className="input-group">
            <label htmlFor="nationalId">NATIONAL ID NUMBER</label>
            <div className="input-wrapper">
              <i className="bi bi-card-heading input-icon"></i>
              <input
                type="text"
                id="nationalId"
                placeholder="Your 14-digit ID Number"
                maxLength="14"
                value={formData.nationalId}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="input-group">
            <label htmlFor="address">ADDRESS</label>
            <div className="input-wrapper">
              <i className="bi bi-house input-icon"></i>
              <input
                type="text"
                id="address"
                placeholder="Street Address, City, State"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="input-group">
            <label htmlFor="phone">PHONE NUMBER</label>
            <div className="input-wrapper">
              <i className="bi bi-telephone input-icon"></i>
              <input
                type="tel"
                id="phone"
                placeholder="+20 100 000 0000"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="email">EMAIL ADDRESS</label>
            <div className="input-wrapper">
              <i className="bi bi-envelope input-icon"></i>
              <input
                type="email"
                id="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password">PASSWORD</label>
            <div className="input-wrapper">
              <i className="bi bi-lock input-icon"></i>
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
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
            <div className="input-wrapper">
              <i className="bi bi-lock-fill input-icon"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i
                  className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              margin: "8px 0 0 0",
              color: "#64748b",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#0d5c46",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;
