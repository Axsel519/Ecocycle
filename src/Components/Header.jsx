import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "../Styles/Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // تحديث حالة المستخدم عند الانتقال بين الصفحات
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    closeMenu();
    navigate("/login");
  };

  // تغيير الصورة الشخصية وإرسالها للسيرفر وحفظها في MongoDB
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setIsUpdatingAvatar(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/update-avatar",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id || user._id,
              avatarUrl: base64Image,
            }),
          },
        );

        const result = await response.json();
        if (response.ok) {
          const updatedUser = { ...user, avatarUrl: base64Image };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          alert("Profile photo updated successfully!");
        } else {
          alert(result.message || "Failed to update photo");
        }
      } catch (err) {
        console.error("Avatar update error:", err);
        alert("Failed to connect to server to update photo");
      } finally {
        setIsUpdatingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div
          className="logo-container"
          onClick={() => {
            closeMenu();
            navigate("/");
          }}
          style={{ cursor: "pointer" }}
        >
          <div className="logo-icon">
            <img
              src="/images/Ecocycle.png"
              alt="EcoCycle Logo"
              className="logo-image"
            />
          </div>
          <span className="logo-text">
            Eco<span className="logo-text-bold">Cycle</span>
          </span>
        </div>

        {/* Hamburger Toggle Button */}
        <button
          className="menu-toggle-btn"
          onClick={toggleMenu}
          aria-label="Toggle Navigation"
        >
          <i className="bi bi-text-left"></i>
        </button>

        {/* Navigation Content Wrapper */}
        <div className={`nav-content-wrapper ${isMenuOpen ? "open" : ""}`}>
          <nav className="nav-links">
            <NavLink to="/" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/how-it-works" onClick={closeMenu}>
              How It Works
            </NavLink>
            <NavLink to="/rewards" onClick={closeMenu}>
              Rewards
            </NavLink>

            {/* رابط صفحة الشركات */}
            <NavLink to="/corporate" onClick={closeMenu}>
              Corporate
            </NavLink>

            {/* رابط صفحة التوصيل والمندوب */}
            <NavLink to="/delivery" onClick={closeMenu}>
              Delivery
            </NavLink>

            {/* Dashboard يظهر فقط إذا كان المستخدم Admin */}
            {user && user.role === "admin" && (
              <NavLink to="/dashboard" onClick={closeMenu}>
                Dashboard
              </NavLink>
            )}
          </nav>

          {/* User Auth Section */}
          <div className="auth-section">
            {user ? (
              <div
                className="profile-dropdown-container"
                ref={dropdownRef}
                style={{ position: "relative" }}
              >
                {/* Trigger Button: الصورة والاسم */}
                <div
                  className="profile-trigger"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "24px",
                    transition: "background 0.2s",
                    userSelect: "none",
                  }}
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name || "User"}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #0d5c46",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#0d5c46",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "15px",
                      }}
                    >
                      {user.firstName
                        ? user.firstName.charAt(0).toUpperCase()
                        : user.name
                          ? user.name.charAt(0).toUpperCase()
                          : "U"}
                    </div>
                  )}

                  {/* الاسم الكامل مع المسافة الواضحة */}
                  <span
                    style={{
                      fontWeight: "700",
                      fontSize: "14px",
                      color: "#11281f",
                      letterSpacing: "0.2px",
                    }}
                  >
                    {user.firstName && user.lastName
                      ? `${user.firstName.trim()} ${user.lastName.trim()}`
                      : user.name || "User"}
                  </span>

                  <i
                    className={`bi bi-chevron-${isDropdownOpen ? "up" : "down"}`}
                    style={{ fontSize: "12px", color: "#64748b" }}
                  ></i>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className="profile-menu-dropdown"
                    style={{
                      position: "absolute",
                      top: "48px",
                      right: "0",
                      width: "250px",
                      backgroundColor: "#ffffff",
                      borderRadius: "16px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                      border: "1px solid #e2e8f0",
                      padding: "16px",
                      zIndex: 1000,
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      animation: "fadeIn 0.2s ease-in-out",
                    }}
                  >
                    {/* Header Info */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        borderBottom: "1px solid #f1f5f9",
                        paddingBottom: "12px",
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt="Avatar"
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #0d5c46",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              backgroundColor: "#0d5c46",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                              fontSize: "18px",
                            }}
                          >
                            {user.firstName
                              ? user.firstName.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                        )}
                      </div>

                      <div style={{ overflow: "hidden" }}>
                        <h4
                          style={{
                            margin: "0",
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#11281f",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user.firstName && user.lastName
                            ? `${user.firstName.trim()} ${user.lastName.trim()}`
                            : user.name}
                        </h4>
                        <p
                          style={{
                            margin: "2px 0 0 0",
                            fontSize: "11.5px",
                            color: "#64748b",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user.email}
                        </p>
                        {user.role === "admin" && (
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "4px",
                              backgroundColor: "#e6f4ea",
                              color: "#0d5c46",
                              fontSize: "10px",
                              fontWeight: "bold",
                              padding: "2px 6px",
                              borderRadius: "8px",
                            }}
                          >
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Change Photo Button */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      disabled={isUpdatingAvatar}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                        padding: "8px 12px",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "12.5px",
                        fontWeight: "600",
                        color: "#334155",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <i
                        className="bi bi-camera-fill"
                        style={{ color: "#0d5c46", fontSize: "14px" }}
                      ></i>
                      <span>
                        {isUpdatingAvatar
                          ? "Updating..."
                          : "Change Profile Photo"}
                      </span>
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                        padding: "8px 12px",
                        backgroundColor: "#fff1f2",
                        border: "1px solid #ffe4e6",
                        borderRadius: "10px",
                        fontSize: "12.5px",
                        fontWeight: "700",
                        color: "#e11d48",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <i
                        className="bi bi-box-arrow-right"
                        style={{ fontSize: "14px" }}
                      ></i>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="login-bt" onClick={closeMenu}>
                <i className="bi bi-person-circle"></i> Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
