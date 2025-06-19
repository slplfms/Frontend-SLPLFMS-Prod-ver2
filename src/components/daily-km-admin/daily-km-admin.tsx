import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from "@mui/material";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { paths } from "../../paths";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useQuery } from "react-query";
import { getAllCenters, getCenter } from "../../Services/center-service";
import { useUser } from "../../hooks/use-user";
import { userRoleType } from "../../constants/role";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { getVehoclesAndDailyKms } from "../../Services/DailyKmService";
import AdminDailyKmItem from "./admin-daily-km-item";

interface IActivity {
  vehicleId: string;
  registrationNumber: string;
  odometer: number;
  message: string | null;
}

export const schema = z.object({
  date: z.string(),
  centerId: z.string(),
});

type FilterValue = z.infer<typeof schema>;

function DailyKmAdmin() {
  const theme = useTheme();
  const [vehicles, setVehicles] = useState<IActivity[]>([]);

  const [center, setCenter] = useState<any>(null);

  const { user } = useUser();

  const isAdmin = (user?.role as any)?.type === userRoleType.admin;

  const defaultValues: FilterValue = {
    date: dayjs().format("YYYY-MM-DD"),
    centerId: isAdmin ? "" : (user?.centerId as string) || "",
  };

  const { data: centersData } = useQuery("getAvailableCenters", getAllCenters, {
    enabled: isAdmin,
  });

  const {
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FilterValue>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    const watchedFields = watch();
    const { date, centerId } = watchedFields;
    if (!date || !centerId) return;

    if (!isAdmin) {
      getCenter(centerId)
        .then((data) => {
          setCenter(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setVehicles([])
    getVehoclesAndDailyKms(date, centerId)
      .then(({ vehicles }) => {
        const temp = vehicles.map((v: any) => {
          const { activity, id, registrationNumber } = v;

          const {
            quantity = 0,
            odometer = 0,
            id: activityId = null,
            odometerStart = 0,
          } = activity || {};

          return {
            vehicleId: id,
            registrationNumber,
            odometer,
            odometerStart,
            activityId,
            quantity,
          };
        });

        setVehicles(temp);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [watch("centerId"), watch("date")]);

  useEffect(() => {
    const { centerId } = getValues();

    if (!centerId) return;

    setCenter(centersData?.centers?.find((c: any) => c.id === centerId));
  }, [watch("centerId"), centersData]);

  const onUpdate = (data: any) => {
    if (!data) return;
    const { id: activityId, odometer, odometerStart, vehicleId } = data;

    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) =>
        vehicle.vehicleId === vehicleId
          ? { ...vehicle, activityId, odometer, odometerStart }
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
              to={paths.home}
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
              Daily Km management (Supervisor)
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={`Vehicle fuel list`}
              subheader={`${center?.name || ""} (${watch("date")})`}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {isAdmin && (
                  <Grid item xs={12} sm={6}>
                    <Controller
                      control={control}
                      name="centerId"
                      render={({ field }) => (
                        <FormControl error={Boolean(errors.centerId)} fullWidth>
                          <InputLabel>Center</InputLabel>
                          <Select {...field} label="Center">
                            <MenuItem value=""></MenuItem>
                            {!!centersData?.centers?.length &&
                              centersData?.centers?.map((row: any) => (
                                <MenuItem key={row.id} value={row.id}>
                                  {row.name}
                                </MenuItem>
                              ))}
                          </Select>
                          {errors.centerId && (
                            <FormHelperText>
                              {errors.centerId.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="date"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.date)} fullWidth>
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          id="date"
                          label="Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.date && (
                          <FormHelperText>{errors.date.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: "250px" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Registration No</TableCell>
                      <TableCell>Odometer</TableCell>
                      <TableCell>Net Km</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!!vehicles?.length &&
                      vehicles?.map((row: any, idx: number) => (
                        <AdminDailyKmItem
                          key={row.vehicleId}
                          idx={idx}
                          vehicleId={row.vehicleId}
                          registrationNumber={row.registrationNumber}
                          odometer={row.odometer}
                          odometerStart={row.odometerStart}
                          activityId={row.activityId}
                          onUpdate={onUpdate}
                          date={watch("date")}
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

export default DailyKmAdmin;
