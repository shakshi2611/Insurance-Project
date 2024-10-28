import { BarChart2, DollarSign, Menu, LogOut, RefreshCcw } from "lucide-react"; 
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom"; 

const SIDEBAR_ITEMS = [
  {
    name: "Upload",
    icon: BarChart2,
    color: "#6366f1",
    href: "/upload",
  },
  {
    name: "Overview",
    icon: DollarSign,
    color: "#3B82F6",
    href: "/overview",
  },
];

const Sidebar = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation(); 
  const navigate = useNavigate(); 

  const isUploadActive = location.pathname === "/upload"; 
  const isOverviewActive = location.pathname === "/overview"; 

  const handleLogout = () => {
    const confirmation = window.confirm("Are you sure you want to logout?");
    if (confirmation) {
      onLogout();
    }
  };

  const handleRestart = async () => {
    const confirmation = window.confirm("Are you sure you want to restart the process?");
    if (confirmation) {
      try {
        const response = await fetch('/api/clear-db', {
          method: 'DELETE',
        });

        if (response.ok) {
          navigate("/upload"); 
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to clear the database.');
        }
      } catch (error) {
        alert('Error clearing the database: ' + error.message);
      }
    }
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-[#cdd5ee] p-4 flex flex-col border-r border-gray-300">
        <motion.button
          aria-label="Toggle sidebar"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors max-w-fit"
        >
          <Menu size={24} color="#000" />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${
                (item.name === "Upload" && isOverviewActive) ||
                (item.name === "Overview" && isUploadActive)
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-200"
              }`}
              onClick={(e) => {
                if (
                  (item.name === "Upload" && isOverviewActive) ||
                  (item.name === "Overview" && isUploadActive)
                ) {
                  e.preventDefault(); 
                }
              }}
              aria-disabled={
                (item.name === "Upload" && isOverviewActive) ||
                (item.name === "Overview" && isUploadActive)
              }
            >
              <item.icon
                size={20}
                style={{ color: item.color, minWidth: "20px" }}
              />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    className="ml-4 whitespace-nowrap text-gray-800"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </nav>
        
        <button
          className={`flex items-center justify-center ${
            isUploadActive ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
          } text-white font-bold py-2 rounded transition duration-200 sm:w-auto mb-2`}
          onClick={isUploadActive ? undefined : handleRestart} 
          aria-label="Restart Process"
          disabled={isUploadActive} 
        >
          <RefreshCcw size={20} style={{ color: "white", minWidth: "20px" }} />
          {isSidebarOpen && (
            <span className="ml-2">Restart Process</span>
          )}
        </button>

        <button
          className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded transition duration-200 sm:w-auto"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <LogOut size={20} style={{ color: "white", minWidth: "20px" }} />
          {isSidebarOpen && (
            <span className="ml-2">Logout</span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
