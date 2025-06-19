import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ImportExport } from "@mui/icons-material";
import { Button, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import AuthRequired from "../auth/auth-required";
import { CSVLink } from "react-csv";
import CsvImportComponent from "../ImportCsvFileWrapper/ImportCsvFileWrapper";
import { csvType, vehicle } from "../../constants/importCsv";

const header = [
  { label: "Route Name", key: "Route.name" },
  { label: "Center Name", key: "Center.name" },
  { label: "Registeraion No", key: "registrationNumber" },
  { label: "Engine No", key: "engineNumber" },
  { label: "Chassis No", key: "chassisNumber" },
  { label: "Seater", key: "seater" },
  { label: "Make", key: "make" },
  { label: "Model", key: "model" },
  { label: "Date Of Purchase", key: "dateOfPurchase" },
  { label: "Tank Capacity", key: "tankCapacity" },
  { label: "Expected Average", key: "expectedAvg" },
  { label: "Financed By", key: "financeBy" },
  { label: "Emi Amount", key: "emiAmount" },
  { label: "Emi Date", key: "emiDate" },
  { label: "Vehicle Status", key: "vehicleStatus" },
  { label: "Primary Meter", key: "primaryMeter" },
];

export function VehicleHeader({ data, reloadData }: any): React.ReactElement {
  const theme = useTheme();
  const navigate = useNavigate();

  const func = () => {
    navigate("/dashboard/add-vehicleManage");
  };
  return (
    <Box>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        alignContent="center"
      >
        <Grid item xs={12} md={6}>
          <Typography
            variant="h1"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "600",
              fontSize: "1.6rem",
              margin: "20px 0px",
              "@media (min-width:600px)": {
                fontSize: "2rem",
              },
            }}
          >
            Vehicle Management
          </Typography>
        </Grid>
        <Grid item>
          <AuthRequired permissions={["createVehicle"]} type="button">
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={func}
              sx={{
                borderRadius: "7px",
                fontSize: "0.8rem",
                padding: "7px 11px",
                display: "flex",
                justifyContent: "center",
                "@media (min-width:600px)": {
                  fontSize: "1rem",
                },
                "&:hover": {
                  backgroundColor: "#635BFF",
                  borderColor: "#bdbdbd",
                  color: "#fff",
                },
              }}
            >
              Add Vehicle
            </Button>
          </AuthRequired>
        </Grid>
      </Grid>
      <Grid container justifyContent="flex-start" spacing={2} marginTop={2}>
        <CsvImportComponent
          type={csvType.VEHICLE}
          headers={vehicle}
          onComplete={reloadData}
        />
        <Grid item>
          <AuthRequired type="button" permissions={["exportCsv"]}>
            <CSVLink
              data={data || []}
              headers={header}
              style={{ color: "#000", textDecoration: "none" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <ImportExport />
                <Typography variant="subtitle1">Export</Typography>
              </div>
            </CSVLink>
          </AuthRequired>
        </Grid>
      </Grid>
    </Box>
  );
}
