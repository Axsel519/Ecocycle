import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Components & Layout
import Layout from "./Components/Layout"; // أو MainLayout حسب اسم الملف لديك

// Pages
import Home from "./Pages/HomeContent";
import How from "./Pages/How";
import Rewards from "./Pages/Rewards";
import Pickup from "./Pages/Pickup";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import CreateAccount from "./Pages/Create-Account";
import Scan from "./Pages/Scan";
import CorporateDashboard from "./Pages/CorporateDashboard";
import DeliveryDashboard from "./Pages/DeliveryDashboard";

// مكون التمرير لأعلى عند تغيير الصفحة
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="how-it-works" element={<How />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="pickup" element={<Pickup />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<CreateAccount />} />
          <Route path="scan" element={<Scan />} />
          <Route path="/corporate" element={<CorporateDashboard />} />
          <Route path="/delivery" element={<DeliveryDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
