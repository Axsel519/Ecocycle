import { useState } from "react";
import Header from "../Components/Header";
import "../Styles/Rewards.css";

const topCategories = [
  {
    id: 1,
    title: "DISCOUNT VOUCHERS",
    description:
      "Redeem EcoPoints for percentage off partner stores (e.g., 20% off apparel).",
    image: "/images/DISCOUNT.png",
  },
  {
    id: 2,
    title: "DONATION OPTION",
    description:
      "Convert points to direct donations for local sustainability projects.",
    image: "/images/DONATION.png",
  },
  {
    id: 3,
    title: "EXPERIENCE REWARDS",
    description: "Unlock exclusive local experiences and eco-workshops.",
    image: "/images/REWARDS.png",
  },
];

const initialRewardsList = [
  {
    id: 1,
    title: "EcoCycle",
    points: 1500,
    category: "Discounts",
    logo: "https://via.placeholder.com/150x80?text=EcoCycle",
  },
  {
    id: 2,
    title: "SHOPOVER",
    points: 2000,
    category: "Discounts",
    logo: "https://via.placeholder.com/150x80?text=SHOPOVER",
  },
  {
    id: 3,
    title: "Eco Candle",
    points: 1500,
    category: "Experiences",
    logo: "https://via.placeholder.com/150x80?text=Candle",
  },
  {
    id: 4,
    title: "Amazon",
    points: 1500,
    category: "Discounts",
    logo: "https://via.placeholder.com/150x80?text=amazon",
  },
  {
    id: 5,
    title: "Organic Product",
    points: 1500,
    category: "Donations",
    logo: "https://via.placeholder.com/150x80?text=Organic",
  },
  {
    id: 6,
    title: "Outdoor Gear",
    points: 1500,
    category: "Experiences",
    logo: "https://via.placeholder.com/150x80?text=Outdoor",
  },
  {
    id: 7,
    title: "BIO",
    points: 1500,
    category: "Discounts",
    logo: "https://via.placeholder.com/150x80?text=BIO",
  },
  {
    id: 8,
    title: "SufiosoHum",
    points: 1500,
    category: "Donations",
    logo: "https://via.placeholder.com/150x80?text=SufiosoHum",
  },
  {
    id: 9,
    title: "Handmade Item",
    points: 1500,
    category: "Experiences",
    logo: "https://via.placeholder.com/150x80?text=Handmade",
  },
  {
    id: 10,
    title: "Brand Logo",
    points: 1500,
    category: "Discounts",
    logo: "https://via.placeholder.com/150x80?text=Brand",
  },
  {
    id: 11,
    title: "Eco Soap",
    points: 1500,
    category: "Discounts",
    logo: "https://via.placeholder.com/150x80?text=Soap",
  },
  {
    id: 12,
    title: "brother",
    points: 1500,
    category: "Discounts",
    logo: "https://via.placeholder.com/150x80?text=brother",
  },
];

const Rewards = () => {
  const [filterType, setFilterType] = useState("Filters");
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRewards = initialRewardsList.filter((reward) => {
    const matchesCategory = category === "All" || reward.category === category;
    const matchesSearch = reward.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="rewards-page-container">
      {/* 1. Header */}
      <Header />

      {/* 2. Main Page Content */}
      <main className="rewards-content-wrapper">
        <h1 className="headerTitle">
          <span className="brandName">EcoCycle</span>{" "}
          <span className="portalText">REWARDS PORTAL</span>
        </h1>

        {/* Hero Cards Section */}
        <div className="heroGrid">
          {topCategories.map((item) => (
            <div className="heroCard" key={item.id}>
              <div className="heroImageContainer">
                <img src={item.image} alt={item.title} className="heroImage" />
              </div>
              <h2 className="cardTitle">{item.title}</h2>
              <p className="cardDescription">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="filterBar">
          <div className="filterLeft">
            <span className="filterLabel">FILTER BY</span>

            <select
              className="selectDropdown"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="Filters">Filters</option>
              <option value="Popular">Popular</option>
              <option value="Newest">Newest</option>
            </select>

            <select
              className="selectDropdown"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Discounts">Discounts</option>
              <option value="Donations">Donations</option>
              <option value="Experiences">Experiences</option>
            </select>
          </div>

          <input
            type="text"
            className="searchInput"
            placeholder="Search rewards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Rewards Grid */}
        <div className="rewardsGrid">
          {filteredRewards.map((reward) => (
            <div className="rewardCard" key={reward.id}>
              <div className="partnerLogoContainer">
                <img
                  src={reward.logo}
                  alt={reward.title}
                  className="partnerLogo"
                />
              </div>
              <div className="pointsText">{reward.points} EcoPoints</div>
              <button className="redeemButton">REDEEM</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Rewards;
