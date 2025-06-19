import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthRequired from "../auth/auth-required";
import { paths } from "../../paths";
import CsvImportComponent from "../ImportCsvFileWrapper/ImportCsvFileWrapper";
import { CSVLink } from "react-csv";
import { ImportExport } from "@mui/icons-material";
import { csvType, fuelManagement } from "../../constants/importCsv";
import { decimalPlaceFormatter } from "src/utils/number";

const header = [
  { label: "Date", key: "date" },
  { label: "Serial No", key: "serialNo" },
  { label: "Center", key: "centerName" },
  { label: "Fuel Station", key: "fuelingStationName" },
  { label: "Price", key: "price" },
  { label: "Total Amount", key: "totalAmount" },
  { label: "Payment Status", key: "isPaid" },
  { label: "Receipt Link", key: "receiptUrl" },
]

export function FuelReceiptHeader({ data, reloadData }: any): React.ReactElement {
  const theme = useTheme();
  const navigate = useNavigate();

  const exportData = data?.map((row: any) => ({
    date: row.date,
    serialNo: row.serialNo,
    centerName: row?.Center?.name || '-',
    fuelingStationName: row?.FuelingStation?.name || '-',
    quantity: row.quantity,
    price: row.price,
    totalAmount: decimalPlaceFormatter(row.price * row.quantity),
    isPaid: row.isPaid ? 'Yes' : 'No',
    receiptUrl: `${
      import.meta.env.VITE_STORAGE_URL ||
      "https://storageslplfmsprod.blob.core.windows.net/"
    }${row.receiptUrl}`,
  }));
  


  const func = () => {
    navigate(paths.dashboard.manageFuelReceipt);
  };
  return (
    <Box my={4}>
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
              margin: "15px 0px",
              "@media (min-width:600px)": {
                fontSize: "2rem",
              },
            }}
          >
            Fuel Management (Center)
          </Typography>
        </Grid>
        <Grid item>
          <AuthRequired permissions={["createFuelReceipt"]} type="button">
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
              Add Fuel Management
            </Button>
          </AuthRequired>
        </Grid>
        <Grid container justifyContent="flex-start" spacing={2} marginTop={2}>
          <CsvImportComponent
            type={csvType.FUEL_MANAGEMENT}
            headers={fuelManagement || []}
            onComplete={reloadData}
          />

          <Grid item>
            <AuthRequired type="button" permissions={["exportCsv"]}>
              <CSVLink
                data={exportData || []}
                headers={header || []}
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
      </Grid>
    </Box>
  );
}
