import { useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import UploadPage from "./pages/UploadPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
 
function App() {
  const location = useLocation(); 
  const [isComparisonViewed, setIsComparisonViewed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated"); 
  };

  const showSidebar = isAuthenticated && !['/login', '/signup'].includes(location.pathname);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-400 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {showSidebar && <Sidebar onLogout={handleLogout}/>}

      <ToastContainer />
      <Routes>
        {/* <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/overview" />
            ) : (
              <Navigate to="/login" />
            )
          }
        /> */}

        {/* Redirect root path to login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupPage />} />

        {isAuthenticated && (
          <>
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </>
        )}

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/upload" : "/login"} />}
        />
      </Routes>
    </div>
  );
}

export default App;