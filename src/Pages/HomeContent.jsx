import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/HomeContent.css";

const STEPS_DATA = [
  {
    id: "step-1",
    title: "SCAN WASTE",
    desc: "Snap a photo of your recyclables using the mobile app.",
    icon: "/images/Scan.png",
    isIconComponent: false,
  },
  {
    id: "step-2",
    title: "AI CLASSIFICATION",
    desc: "Our AI model accurately identifies plastic, glass, paper, and metal in real-time.",
    icon: "/images/Ai.png",
    isIconComponent: false,
  },
  {
    id: "step-3",
    title: "EARN REWARDS",
    desc: "Get points automatically credited to your digital wallet for each successful scan.",
    icon: "bi bi-gift",
    isIconComponent: true,
  },
  {
    id: "step-4",
    title: "REDEEM COUPONS",
    desc: "Exchange points for discounts or vouchers from our partner organizations.",
    icon: "/images/COUPONS.png",
    isIconComponent: false,
  },
];

function Home() {
  const navigate = useNavigate();

  const handleStartRecycling = () => {
    navigate("/scan");
  };

  const handleLogIn = () => {
    navigate("/login");
  };

  return (
    <div className="home-page-wrapper">
      {/* Hero Section Container */}
      <div className="home-container">
        <Header />

        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              AI-DRIVEN RECYCLING <br />
              GET <span className="highlight-text">REWARDED</span>
            </h1>

            <p className="hero-description">
              EcoCycle uses AI to classify your household waste, awarding you
              points for discounts and offering convenient at-home pickups.
              Transform waste, earn value, save the planet.
            </p>

            <div className="hero-buttons">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleStartRecycling}
              >
                START RECYCLING NOW
              </button>

              <button
                type="button"
                className="btn btn-outline-success"
                onClick={handleLogIn}
              >
                JOIN OUR WORLD
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Info / Steps Section */}
      <section className="info-section">
        <div className="info-header">
          <h2 className="info-title">Just four steps</h2>
          <p className="info-subtitle">
            EcoCycle uses AI to classify your household waste, awarding you
            points for discounts and offering convenient at-home pickups.
          </p>
        </div>

        <div className="steps-container">
          {STEPS_DATA.map((step) => (
            <div className="step-card" key={step.id}>
              <div className="step-icon">
                {step.isIconComponent ? (
                  <i className={step.icon} aria-hidden="true"></i>
                ) : (
                  <img src={step.icon} alt={step.title} loading="lazy" />
                )}
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
