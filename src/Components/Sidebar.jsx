import { useLocation } from "react-router-dom";
import "../Styles/Sidebar.css";

function Sidebar() {
  const location = useLocation();

  const isHowPage = location.pathname === "/how-it-works";
  const isLoginPage = location.pathname === "/login";
  const isRewardsPage = location.pathname === "/rewards";
  const isDashboardPage = location.pathname === "/dashboard";

  const isRegisterPage =
    location.pathname === "/register" ||
    location.pathname.toLowerCase() === "/create-account";

  return (
    <div className="sidebar-content">
      {/* Promotional Card */}
      <div className="sidebar-card">
        {isLoginPage ? (
          <>
            <img src="/images/LoginLayout1.png" alt="Login Banner 1" />
            <img src="/images/LoginLayout2.png" alt="Login Banner 2" />
          </>
        ) : isRegisterPage ? (
          <>
            <img src="/images/LoginLayout1.png" alt="Register Banner 1" />
            <img src="/images/per.png" alt="Register Banner 2" />
          </>
        ) : isDashboardPage ? (
          <>
            <img src="/images/DashboardBanner1.png" alt="Dashboard Banner 1" />
            <img src="/images/DashboardBanner2.png" alt="Dashboard Banner 2" />
          </>
        ) : isHowPage ? (
          <img src="/images/Howlayout.png" alt="How It Works" />
        ) : isRewardsPage ? (
          <>
            <img src="/images/DISCOUNT.png" alt="Rewards Banner 1" />
            <img src="/images/How.png" alt="Rewards Banner 2" />
          </>
        ) : (
          <>
            <img src="/images/Pickup.png" alt="Pickup Service" />
            <img src="/images/LOGISTICS.png" alt="Logistics Information" />
          </>
        )}
      </div>

      {/* App Download Call to Action */}
      <div className="followus-section">
        <h3 className="followus-title">
          JOIN THE MOVEMENT TO A SUSTAINABLE FUTURE
        </h3>

        <div className="download-buttons">
          <a
            href="https://apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-download-dark"
          >
            <i className="bi bi-apple"></i>
            <div className="btn-text">
              <span className="btn-small-text">Download on the</span>
              <span className="btn-large-text">App Store</span>
            </div>
          </a>

          <a
            href="https://play.google.com/store/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-download-dark"
          >
            <i className="bi bi-google-play"></i>
            <div className="btn-text">
              <span className="btn-small-text">GET IT ON</span>
              <span className="btn-large-text">Google Play</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
