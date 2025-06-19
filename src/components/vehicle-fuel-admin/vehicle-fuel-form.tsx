import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
} from "@mui/material";

import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getReceiptAndActivities } from "../../Services/fuel-receipt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { paths } from "../../paths";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AdminFuelItem from "./admin-fuel-item";

interface IVehicle {
  vehicleId: string;
  quantity: number;
  registrationNumber: string;
  tankCapacity: number;
  odometer: number;
  message: string | null;
}

function VehicleFuelForm() {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const [receipt, setReceipt] = useState<any>(null);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [_, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getReceiptAndActivities(id)
      .then(({ data }) => {
        setReceipt(data.receipt);

        const { vehicles: vehicleList = [] } = data;

        const temp = vehicleList.map((v: any) => {
          const {
            activity,
            id,
            registrationNumber,
            tankCapacity,
            expectedAvg,
          } = v;
          
          const {
            quantity=0,
            odometer = 0,
            id: activityId = null,
            odometerStart = 0,
          } = activity || {};

          return {
            vehicleId: id,
            registrationNumber,
            tankCapacity,
            expectedAvg,
            odometer,
            odometerStart,
            activityId,
            quantity
          };
        });

        console.log("setting: ", temp);
        setVehicles(temp);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const onUpdate = (data: any) => {
    if (!data) return;
    const {
      id: activityId,
      odometer,
      odometerStart,
      quantity,
      vehicleId,
    } = data;

    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) =>
        vehicle.vehicleId === vehicleId
          ? { ...vehicle, activityId, odometer, odometerStart, quantity }
          : vehicle
      )
    );
  };

  return (
    <>
      <Box>
        <Box my={5}>
          <Typography style={{ textDecoration: "none" }}>
            <Link
              to={paths.dashboard.fuelReceipt}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "blue",
              }}
            >
              <ArrowBackIcon fontSize="small" />
              <span style={{ margin: "0px 8px" }}>Previous </span>
            </Link>
          </Typography>
        </Box>
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
              Fuel Management (Supervisor)
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={`Vehicle fuel list`}
              subheader={
                !!receipt
                  ? `${receipt?.Center?.name} (Date: ${receipt.date} , Serial# ${receipt.serialNo}). `
                  : ""
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: "250px" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Registration No</TableCell>
                      <TableCell>Expected Avg.</TableCell>
                      <TableCell>Odometer</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Net Km</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!!vehicles?.length &&
                      vehicles?.map((row: any, idx: number) => (
                        <AdminFuelItem
                          key={row.vehicleId}
                          idx={idx}
                          receiptId={id!}
                          vehicleId={row.vehicleId}
                          activityId={row.activityId}
                          registrationNumber={row.registrationNumber}
                          expectedAvg={row.expectedAvg}
                          odometer={row.odometer}
                          odometerStart={row.odometerStart}
                          tankCapacity={row.tankCapacity}
                          quantity={row.quantity}
                          onUpdate={onUpdate}
                        />
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default VehicleFuelForm;
