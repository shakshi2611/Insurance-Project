import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import StatCard from "../components/common/StatCard";
import "jspdf-autotable";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
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
  const [activeTable, setActiveTable] = useState("allData");
  const [insuranceData, setInsuranceData] = useState([]);
  const [brokerData, setBrokerData] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        // Fetch insurance and broker data concurrently
        const [insuranceResponse, brokerResponse] = await Promise.all([
          axios.get("http://localhost:5001/insuranceFiles"),
          axios.get("http://localhost:5001/brokerFiles"),
        ]);

        // Flatten insurance data
        const flattenedInsuranceData = insuranceResponse.data.flatMap(
          (file) => file.content
        );

        // Flatten broker data and calculate commission and reward amounts
        const flattenedBrokerData = brokerResponse.data.flatMap((file) =>
          file.content.map((item) => {
            const commissionRateAmount = (
              (item.commissionRate / 100) *
              item.odPremium
            ).toFixed(2);
            const rewardAmount = ((item.Reward / 100) * item.odPremium).toFixed(
              2
            );
            return {
              ...item,
              commissionRateAmount,
              rewardAmount,
              totalCommission: (
                parseFloat(commissionRateAmount) + parseFloat(rewardAmount)
              ).toFixed(2), // Total commission calculation
              netCommission: item.NetCommision || "N/A", // Ensure NetCommision is included
            };
          })
        );

        // Set state with the fetched data
        setInsuranceData(flattenedInsuranceData);
        setBrokerData(flattenedBrokerData);
      } catch (err) {
        setError(err.message); // Set error if fetch fails
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData(); // Call fetchData function
  }, []);

  // Prepare data for verification
  const matchData = brokerData.filter((broker) =>
    insuranceData.some(
      (insurance) =>
        insurance.POLICY_NUMBER === broker.PolicyNumber &&
        insurance.INSURED_CUSTOMER_NAME === broker.cName &&
        insurance.ACTUAL_COMMISSION === broker.NetCommision
    )
  );

  const positiveData = brokerData
    .map((broker) => {
      const matchingInsurance = insuranceData.find(
        (insurance) =>
          insurance.POLICY_NUMBER === broker.PolicyNumber &&
          insurance.INSURED_CUSTOMER_NAME === broker.cName &&
          insurance.ACTUAL_COMMISSION < broker.NetCommision
      );

      if (matchingInsurance) {
        const difference = (
          broker.NetCommision - matchingInsurance.ACTUAL_COMMISSION
        ).toFixed(2); // Calculate the difference
        return {
          ...broker,
          difference, // Add the difference to each broker item
        };
      }
      return null; // Return null if no match is found
    })
    .filter((item) => item !== null); // Remove null entries from the list

  const negativeData = brokerData
    .map((broker) => {
      const matchingInsurance = insuranceData.find(
        (insurance) =>
          insurance.POLICY_NUMBER === broker.PolicyNumber &&
          insurance.INSURED_CUSTOMER_NAME === broker.cName &&
          insurance.ACTUAL_COMMISSION > broker.NetCommision
      );

      if (matchingInsurance) {
        const difference = (
          matchingInsurance.ACTUAL_COMMISSION - broker.NetCommision
        ).toFixed(2); // Calculate the difference
        return {
          ...broker,
          difference,
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  const bankNames = [...new Set(brokerData.map((item) => item.p_insurerName))];

  const filteredData = (data) =>
    selectedBank
      ? data.filter((item) => item.p_insurerName === selectedBank)
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
              <TableCell sx={{ color: "#000000" }}>S. Number</TableCell>
              <TableCell sx={{ color: "#000000" }}>Policy Number</TableCell>
              <TableCell sx={{ color: "#000000" }}>Insurer Name</TableCell>
              <TableCell sx={{ color: "#000000" }}>Client Name</TableCell>
              <TableCell sx={{ color: "#000000" }}>Policy Type</TableCell>
              {/* <TableCell sx={{ color: "#000000" }}>odPremium</TableCell>
              <TableCell sx={{ color: "#000000" }}>Commission Rate</TableCell>
              <TableCell sx={{ color: "#000000" }}>Commission</TableCell>
              <TableCell sx={{ color: "#000000" }}>Reward</TableCell>
              <TableCell sx={{ color: "#000000" }}>Other Commission</TableCell>
              <TableCell sx={{ color: "#000000" }}>TerrorismPremium</TableCell>
              <TableCell sx={{ color: "#000000" }}>TerrorismBrokRate</TableCell>
              <TableCell sx={{ color: "#000000" }}>TerrorismbrokAmnt</TableCell> */}
              <TableCell sx={{ color: "#000000" }}>Net Commission</TableCell>
              <TableCell sx={{ color: "#000000" }}>Difference</TableCell>{" "}
              {/* New Difference Column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: "#000000" }}>{index + 1}</TableCell>{" "}
                  {/* Serial Number */}
                  <TableCell sx={{ color: "#000000" }}>
                    {item.PolicyNumber}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {item.p_insurerName}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>{item.cName}</TableCell>
                  <TableCell sx={{ color: "#000000" }}>{item.p_type}</TableCell>
                  {/* <TableCell sx={{ color: "#000000" }}>{item.odPremium}</TableCell>
                  <TableCell sx={{ color: "#000000" }}>{item.commisionRate}</TableCell>
                  <TableCell sx={{ color: "#000000" }}>{item.commision}</TableCell>
                  <TableCell sx={{ color: "#000000" }}>{item.Reward}</TableCell>
                  <TableCell sx={{ color: "#000000" }}>{item.OtherCommision}</TableCell>
                  <TableCell sx={{ color: "#000000" }}>{item.TerrorismPremium}</TableCell>
                  <TableCell sx={{ color: "#000000" }}>{item.TerrorismBrokRate}</TableCell>
                  <TableCell sx={{ color: "#000000" }}>{item.TerrorismbrokAmnt}</TableCell> */}
                  <TableCell sx={{ color: "#000000" }}>
                    {item.NetCommision}
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {item.difference}
                  </TableCell>{" "}
                  {/* Displaying Difference */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={12}
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

  const exportToExcel = (data) => {
    const exportData = data.map((item, index) => ({
      SNo: index + 1, // Serial number
      PolicyNumber: item.PolicyNumber,
      InsurerName: item.p_insurerName,
      ClientName: item.cName,
      PolicyType: item.p_type,
      NetCommission: item.NetCommision,
      Difference: item.difference,
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };
  
  const exportToPDF = (data) => {
    const doc = new jsPDF();
    const tableColumn = [
      "S.No.",
      "Policy Number",
      "Insurer Name",
      "Client Name",
      "Policy Type",
      "Net Commission",
      "Difference",
    ];
    
    const tableRows = data.map((item, index) => [
      index + 1,
      item.PolicyNumber || 'N/A',
      item.p_insurerName || 'N/A',
      item.cName || 'N/A',
      item.p_type || 'N/A',
      item.NetCommision || 'N/A',
      item.difference !== undefined ? item.difference : 0,
    ]);
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'striped',
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
        {/* Dropdown for bank selection and export options */}
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
              {activeTable === "positiveData" && (
                <>
                  <MenuItem onClick={() => exportToExcel(positiveData)}>
                    Export to Excel
                  </MenuItem>
                  <MenuItem onClick={() => exportToPDF(positiveData)}>
                    Export to PDF
                  </MenuItem>
                </>
              )}
              {activeTable === "negativeData" && (
                <>
                  <MenuItem onClick={() => exportToExcel(negativeData)}>
                    Export to Excel
                  </MenuItem>
                  <MenuItem onClick={() => exportToPDF(negativeData)}>
                    Export to PDF
                  </MenuItem>
                </>
              )}
              {activeTable === "matchData" && (
                <>
                  <MenuItem onClick={() => exportToExcel(matchData)}>
                    Export to Excel
                  </MenuItem>
                  <MenuItem onClick={() => exportToPDF(matchData)}>
                    Export to PDF
                  </MenuItem>
                </>
              )}
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

        {/* Render Tables */}
        {activeTable === "allData" &&
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
