import { motion } from "framer-motion";
import { Button } from "@mui/material";

const StatCard = ({ name, icon: Icon, value, color, onViewClick }) => {
  return (
    <motion.div
      className="bg-gray-400 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 flex flex-col justify-between"
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
    >
      <div className="px-4 py-5 sm:p-6 flex flex-col items-start">
        <span className="flex items-center text-sm font-medium text-gray-50 mb-2">
          <Icon size={20} className="mr-2" style={{ color }} />
          {name}
        </span>
       
      </div>
      <Button
        variant="contained"
        color="default"
        style={{ backgroundColor: "#1f2937", color: color }}
        onClick={onViewClick}
        className="w-full sm:w-auto"
      >
        View
      </Button>
    </motion.div>
  );
};
export default StatCard;
