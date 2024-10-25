import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
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
import * as XLSX from "xlsx";

const OverviewPage = () => {
  const [activeTable, setActiveTable] = useState(null);
  const [insuranceData, setInsuranceData] = useState([]);
  const [brokerData, setBrokerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBank, setSelectedBank] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [insuranceResponse, brokerResponse] = await Promise.all([
          axios.get("http://localhost:5001/insuranceFiles"),
          axios.get("http://localhost:5001/brokerFiles"),
        ]);

        const flattenedInsuranceData = insuranceResponse.data.flatMap(
          (file) => file.content
        );
        const flattenedBrokerData = brokerResponse.data.flatMap(
          (file) => file.content
        );

        // Log the fetched data to verify the structure
        console.log("Flattened Insurance Data:", flattenedInsuranceData);

        // Process the data to add commission calculations
        const processedInsuranceData = flattenedInsuranceData.map((item) => {
          let commission = 0;

          // Log the entire item to see what properties are available
          console.log("Current Item:", item);

          // Access properties according to the actual data structure
          const terrorismPremium =
            parseFloat(item.TERRORISM_PREMIUM_AMOUNT) || 0; // Correct property name
          const odPremium = parseFloat(item.MOTOR_OD_PREMIUM_AMOUNT) || 0; // Correct property name
          const commissionRate = parseFloat(item.COMMISSION_RATE_USED) || 0; // Correct property name
          const P_type = item.POL_PRI_VVERTICAL_DESC; // Assuming this is equivalent to p_type

          // Log the values to check if they are being read correctly
          console.log(
            `Terrorism Premium: ${terrorismPremium}, OD Premium: ${odPremium}, Commission Rate: ${commissionRate}, P_type: ${P_type}`
          );

          if (P_type && P_type.toLowerCase().includes("fire")) {
            // Adjusted check for 'fire' in p_type
            const terrorismPremiumCommission = terrorismPremium * 0.05; // 5% of terrorism premium
            const odPremiumCommission = odPremium * (commissionRate / 100); // Commission on OD premium
            commission = terrorismPremiumCommission + odPremiumCommission; // Total commission
          } else {
            commission = odPremium * (commissionRate / 100); // Calculate commission on OD premium only
          }

          // Log the calculated commission
          console.log(`Item: ${JSON.stringify(item)}`);
          console.log(`Calculated Commission: ${commission.toFixed(2)}`);

          return {
            ...item,
            commission: commission.toFixed(2), // Ensure it's a fixed decimal
          };
        });

        setInsuranceData(processedInsuranceData);
        setBrokerData(flattenedBrokerData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Comparing insurance data with broker data
  const matchData = insuranceData.filter((insurance) =>
    brokerData.some((broker) => broker.policyNumber === insurance.policyNumber)
  );

  const positiveData = insuranceData.filter((insurance) => {
    const broker = brokerData.find(
      (broker) => broker.policyNumber === insurance.policyNumber
    );
    return broker && insurance.percentage < broker.percentage;
  });

  const negativeData = insuranceData.filter((insurance) => {
    const broker = brokerData.find(
      (broker) => broker.policyNumber === insurance.policyNumber
    );
    return broker && insurance.percentage > broker.percentage;
  });

  const bankNames = [
    ...new Set(insuranceData.map((item) => item["INTERMEDIARY_NAME"])),
  ];

  // Filter data based on the selected bank
  const filteredData = (data) =>
    selectedBank
      ? data.filter((item) => item["INTERMEDIARY_NAME"] === selectedBank)
      : data;

  // Function to render table with filtered data
  const renderTable = (data, title, showDifference = false) => {
    if (data.length === 0) {
      return <Typography>No Data Available</Typography>;
    }

    console.log("Data for table:", data);
    // Extract column names from the first item in the data
    const columnNames = [...new Set(data.flatMap(Object.keys))];

    return (
      <div style={{ marginTop: "30px" }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "ffffff",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {columnNames.map((columnName, index) => (
                  <TableCell key={index} sx={{ color: "#6366F1" }}>
                    {columnName}
                  </TableCell>
                ))}
                {showDifference && (
                  <TableCell sx={{ color: "#6366f1" }}>Difference</TableCell>
                )}
                <TableCell sx={{ color: "#6366f1" }}>Percentage</TableCell>
                <TableCell sx={{ color: "#6366f1" }}>
                  Insurance Commission
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {columnNames.map((columnName) => (
                    <TableCell key={columnName} sx={{ color: "#000000" }}>
                      {item[columnName] !== undefined
                        ? item[columnName]
                        : "N/A"}
                    </TableCell>
                  ))}
                  {showDifference && (
                    <TableCell sx={{ color: "#000000" }}>
                      {item.Difference !== undefined ? item.Difference : "N/A"}
                    </TableCell>
                  )}
                  <TableCell sx={{ color: "#000000" }}>
                    {" "}
                    {item.Percentage !== undefined
                      ? item.Percentage + "%"
                      : "N/A"}
                    %
                  </TableCell>
                  <TableCell sx={{ color: "#000000" }}>
                    {item.commission !== undefined ? item.commission : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

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
      <main className="max-w-7xl mx-auto py-6 px-1 lg:px-6">
        <FormControl
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            width: "100%",
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

          {/* Select Dropdown */}
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
            value={filteredData(insuranceData).length}
            color="#6366F1"
            onViewClick={() => setActiveTable("allData")}
          />
          <StatCard
            name={<span style={{ color: "#000000" }}>Match Data</span>}
            icon={Users}
            value={filteredData(matchData).length}
            color="#34D399"
            onViewClick={() => setActiveTable("matchData")}
          />
          <StatCard
            name={<span style={{ color: "#000000" }}>+ Count Data</span>}
            icon={BarChart2}
            value={filteredData(positiveData).length}
            color="#FBBF24"
            onViewClick={() => setActiveTable("positiveData")}
          />
          <StatCard
            name={<span style={{ color: "#000000" }}>- Count Data</span>}
            icon={ShoppingBag}
            value={filteredData(negativeData).length}
            color="#EF4444"
            onViewClick={() => setActiveTable("negativeData")}
          />
        </motion.div>

        {/* Render Tables */}
        {activeTable === "allData" &&
          renderTable(filteredData(insuranceData), "All Data")}

        {activeTable === null && (
          <>
            {renderTable(filteredData(matchData), "Match Data")}
            {renderTable(filteredData(positiveData), "Positive Data", true)}
            {renderTable(filteredData(negativeData), "Negative Data", true)}
          </>
        )}
      </main>
    </div>
  );
};

export default OverviewPage;
