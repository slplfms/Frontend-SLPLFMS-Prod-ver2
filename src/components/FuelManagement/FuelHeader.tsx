import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ImportExport } from "@mui/icons-material";
import { Button, Stack, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthRequired from "../auth/auth-required";
import { CSVLink } from "react-csv";
import CsvImportComponent from "../ImportCsvFileWrapper/ImportCsvFileWrapper";
import { csvType, fuelActivity } from "../../constants/importCsv";
import { useUser } from "../../hooks/use-user";
import { userRoleType } from "../../constants/role";
import { toast } from "sonner";
import { fuelActivityStatus } from "../../constants/fuelActivity";
import { updateStatus } from "../../Services/FuelManageService";

const header = [
  { label: "Fuel Station", key: "FuelingStation.name" },
  { label: "User", key: "User.name" },
  { label: "Vehicle", key: "Vehicle.make" },
  { label: "Odo Meter", key: "odometer" },
  { label: "Quantity", key: "quantity" },
  { label: "Price", key: "price" },
  { label: "Date", key: "date" },
];

export function FuelHeader({
  data,
  reloadData,
  selected,
  selectedSome,
  selectedAll,
}: any): React.ReactElement {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useUser();

  const approve = async () => {
    try {
      await updateStatus(fuelActivityStatus.approved, Array.from(selected));
      reloadData && reloadData();
      toast.success(`Approved Successfully`);
    } catch (e) {
      console.log(e);
      toast.error("Some error Occurred");
    }
  };

  const reject = async () => {
    try {
      await updateStatus(fuelActivityStatus.rejected, Array.from(selected));
      reloadData && reloadData();
      toast.success(`Rejected Successfully`);
    } catch (e) {
      console.log(e);
      toast.error("Some error Occurred");
    }
  };

  const func = () => {
    navigate("/dashboard/add-fuel");
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
            Fuel Management
          </Typography>
        </Grid>
        <Grid item>
          <AuthRequired permissions={["createFuelActivity"]} type="button">
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
      </Grid>
      <Grid
        container
        justifyContent={"space-between"}
        alignItems={"center"}
        spacing={2}
        marginTop={2}
      >
        <Grid item justifyContent="flex-start" marginTop={2}>
          <Stack direction={"row"} spacing={2}>
            <CsvImportComponent
              type={csvType.FUEL_ACTIVITY}
              headers={fuelActivity}
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
          </Stack>
        </Grid>

        {((user?.role as any)?.type === userRoleType.admin ||
          (user?.role as any)?.type === userRoleType.supervisor) && (
          <Grid item>
            <Stack direction={"row"} gap={2}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={approve}
                disabled={!(selectedSome || selectedAll)}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={reject}
                disabled={!(selectedSome || selectedAll)}
              >
                Decline
              </Button>
            </Stack>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
