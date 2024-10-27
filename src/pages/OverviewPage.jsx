import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import StatCard from "../components/common/StatCard";
import "jspdf-autotable";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Menu,
} from "@mui/material";

const OverviewPage = () => {
  const [activeTable, setActiveTable] = useState(null);
  const [insuranceData, setInsuranceData] = useState([]);
  const [brokerData, setBrokerData] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState(null);

  // const calculateodPremiumPercentage = (data) => {
  //   return data.map((entry) => {
  //     const odPremiumpercentage =
  //       entry.odPremium && entry.commissionRate
  //         ? (entry.odPremium * entry.commissionRate) / 100
  //         : 0;
  //     return { ...entry, odPremiumPercentage: odPremiumpercentage.toFixed(2) }; // Make sure 'Percentage' is uppercase to match the table
  //   });
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const insuranceResponse = await axios.get(
          "http://localhost:5001/insuranceFiles"
        );
        const brokerResponse = await axios.get(
          "http://localhost:5001/brokerFiles"
        );

        const flattenedInsuranceData = insuranceResponse.data.flatMap(
          (file) => file.content
        );
        const flattenedBrokerData = brokerResponse.data.flatMap((file) =>
          file.content.map((item) => ({
            ...item,
            commissionRateAmount: ((item.commissionRate / 100) * item.odPremium).toFixed(2),
            rewardAmount: ((item.Reward / 100) * item.odPremium).toFixed(2),
            
          }))
        );
        
        
        console.log(insuranceData);
        console.log(brokerData);
        // // Separate data into "fire" and "non-fire" categories and calculate values
        setInsuranceData(flattenedInsuranceData);
        setBrokerData(flattenedBrokerData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const matchData = brokerData.filter((insurance) => {
    const broker = brokerData.find(
      (broker) => broker.policyNumber === insurance.policyNumber
    );
    return broker && insurance.commission === broker.commission;
  });

  const positiveData = brokerData.filter((insurance) => {
    const broker = brokerData.find(
      (broker) => broker.policyNumber === insurance.policyNumber
    );
    return broker && insurance.commission < broker.commission;
  });

  const negativeData = brokerData.filter((insurance) => {
    const broker = brokerData.find(
      (broker) => broker.policyNumber === insurance.policyNumber
    );
    return broker && insurance.commission > broker.commission;
  });

  const bankNames = [
    ...new Set(brokerData.map((item) => item["p_insurerName"])),
  ];

  // Filter data based on the selected bank
  const filteredData = (data) =>
    selectedBank
      ? data.filter((item) => item["p_insurerName"] === selectedBank)
      : data;

  const renderTable = (data, title) => (
    <div style={{ marginTop: "30px" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "white",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#000000" }}>PolicyNumber</TableCell>
              <TableCell sx={{ color: "#000000" }}>p_insurerName</TableCell>
              <TableCell sx={{ color: "#000000" }}>cName</TableCell>
              <TableCell sx={{ color: "#000000" }}>p_type</TableCell>
              <TableCell sx={{ color: "#000000" }}>commissionRate</TableCell>
              <TableCell sx={{ color: "#000000" }}>commission </TableCell>
              <TableCell sx={{ color: "#000000" }}>Other commission</TableCell>
              <TableCell sx={{ color: "#000000" }}>commissionRate Amount </TableCell>
              <TableCell sx={{ color: "#000000" }}>Reward Amount </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: "#000000" }}>
                    {item["PolicyNumber"]}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {item["p_insurerName"]}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {item["cName"]}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {item["p_type"]}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {item["commissionRate"]}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {item["commission"]}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {item["OtherCommission"]}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {item.commissionRateAmount}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                  {item.rewardAmount}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  style={{ color: "#9ca3af", textAlign: "center" }}
                >
                  No Data Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  // Export functions
  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  // Updated PDF export function
  const exportToPDF = (data) => {
    const doc = new jsPDF();
    const tableColumn = [
      "Bank Name",
      "Name",
      "Policy Number",
      "Vehicle Number",
      "Amount",
      "Percentage",
    ];
    const tableRows = data.map((item) => [
      item["Bank Name"],
      item["Name"],
      item["Policy Number"],
      item["Vehicle Number"],
      `${item.Amount}`,
      item["Percentage"],
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save("data.pdf");
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <div
      className="flex-1 overflow-auto relative z-10"
      style={{ backgroundColor: "#94a5db" }}
    >
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Select Dropdown */}
        <FormControl
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div className="container flex justify-end items-center mb-4 sm:mb-0 w-full sm:w-auto">
            <IconButton
              aria-label="more options"
              aria-controls="export-menu"
              aria-haspopup="true"
              onClick={(event) => setAnchorEl(event.currentTarget)}
            >
              <FileDownloadIcon style={{ color: "black" }} />
            </IconButton>

            <Menu
              id="export-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem
                onClick={() => exportToExcel(filteredData(insuranceData))}
              >
                Export to Excel
              </MenuItem>
              <MenuItem
                onClick={() => exportToPDF(filteredData(insuranceData))}
              >
                Export to PDF
              </MenuItem>
            </Menu>
          </div>

          <FormControl sx={{ minWidth: 200 }} className="w-full sm:w-auto">
            <InputLabel
              id="bank-select-label"
              className="text-white-500 text-sm font-medium"
            >
              Filter by Bank
            </InputLabel>
            <Select
              labelId="bank-select-label"
              value={selectedBank}
              label="Filter by Bank"
              onChange={(e) => setSelectedBank(e.target.value)}
              className="bg-[#cdd5ee] text-black border border-gray-500 rounded-lg mb-4 text-sm focus:border-white-500 focus:outline-none transition-all duration-300 w-full sm:w-auto"
              MenuProps={{
                PaperProps: {
                  className: "bg-[#cdd5ee] text-white shadow-lg rounded-lg",
                },
              }}
              sx={{ lineHeight: "1.2", borderRadius: "8px" }}
            >
              <MenuItem value="">
                <span className="#cdd5ee">All Banks</span>
              </MenuItem>
              {bankNames.map((bank, index) => (
                <MenuItem key={index} value={bank}>
                  <span className="text-black-400">{bank}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormControl>

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name={<span style={{ color: "#000000" }}>All Data</span>}
            icon={Zap}
            value={filteredData(brokerData).length}
            color="#6366F1"
            onViewClick={() => setActiveTable("allData")}
          />
          <StatCard
            name={<span style={{ color: "#000000" }}>Match Data</span>}
            icon={Users}
            value={filteredData(matchData).length}
            color="#8B5CF6"
            onViewClick={() => setActiveTable("matchData")}
          />
          <StatCard
            name={<span style={{ color: "#000000" }}>+ Count Data</span>}
            icon={ShoppingBag}
            value={filteredData(positiveData).length}
            color="#EC4899"
            onViewClick={() => setActiveTable("positiveData")}
          />
          <StatCard
            name={<span style={{ color: "#000000" }}>- Count Data</span>}
            icon={BarChart2}
            value={filteredData(negativeData).length}
            color="#10B981"
            onViewClick={() => setActiveTable("negativeData")}
          />
        </motion.div>

        {filteredData(brokerData).length > 0 &&
          activeTable === "allData" &&
          renderTable(filteredData(brokerData), "All Data")}
        {activeTable === "matchData" &&
          renderTable(filteredData(matchData), "Match Data")}
        {activeTable === "positiveData" &&
          renderTable(filteredData(positiveData), "+ Count Data")}
        {activeTable === "negativeData" &&
          renderTable(filteredData(negativeData), "- Count Data")}
      </main>
    </div>
  );
};

export default OverviewPage;
