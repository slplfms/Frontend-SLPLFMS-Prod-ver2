import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Tab,
  Tabs,
  Autocomplete,
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { Link as Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  getVehicle,
  createVehicle,
  updateVehicle,
} from "../../Services/vehicle-service";
import { getAllCenters } from "../../Services/center-service";
import { getAvailableRoutes } from "../../Services/routeService";
import { paths } from "../../paths";
import VehicleDocuments from "./vehicleDocuments";
import { toast } from "sonner";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

export const schema = z.object({
  centerId: z.string().min(1, { message: "Please select center" }),
  registrationNumber: z
    .string()
    .min(1, { message: "Please enter registration number" }),
  dateOfPurchase: z
    .string()
    .min(1, { message: "Please enter date of purchase" }),
  vehicleStatus: z.number().min(1, { message: "Please select vehicle status" }),
  make: z.string().min(1, { message: "Please select vehicle make" }),
  model: z.string().min(1, { message: "Please select vehicle model" }),
  primaryMeter: z.any(),
  tankCapacity: z.any(),
  expectedAvg: z.any(),
  seater: z.any(),
  engineNumber: z.string().min(1, { message: "Please enter engine number" }).optional().or(z.literal('')).nullable(),
  chassisNumber: z.string().min(1, { message: "Please enter chassis number" }).optional().or(z.literal('')).nullable(),
  financeBy: z.string().min(1, { message: "Please enter financed by" }).optional().or(z.literal('')).nullable(),
  emiAmount: z.string().min(1, { message: "Please enter emi amount" }).optional().or(z.literal('')).nullable(),
  emiDate: z.string().optional().or(z.literal('')).nullable(),
  // lastdateOfEmi: z.string().min(1, { message: "Please enter last date of emi" }),
  route: z.string().min(1, { message: "Please enter route" }),
});
type Values = z.infer<typeof schema>;

const defaultValues: Values = {
  centerId: "",
  registrationNumber: "",
  dateOfPurchase: "",
  vehicleStatus: 1,
  make: "",
  model: "",
  primaryMeter: 0,
  tankCapacity: 0,
  expectedAvg: 0,
  seater: 0,
  engineNumber: "",
  chassisNumber: "",
  financeBy: "",
  emiAmount: "0",
  emiDate: "",
  route: "",
};

export default function VehicleForm() {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("vehicleId");
  const navigate = useNavigate();
  const [centerId, setCenterId] = useState("");

  const {
    control,
    watch,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const CenterQuery = useQuery("getAvailableCenters", getAllCenters);
  const RouteQuery = useQuery(
    ["getAvailableRoutes", centerId],
    () => getAvailableRoutes(centerId),
    { enabled: !!centerId }
  );

  useEffect(() => {
    setCenterId(getValues("centerId"));
    // TODO: update after version change
    RouteQuery.remove()
  }, [watch("centerId")]);

  React.useEffect(() => {
    if (!id) return;
    // Fetch User details using id
    getVehicle(id)
      .then((response) => {
        const {Route, ...vehicleData} = response;

        if(Route){
          Object.assign(vehicleData, {route: Route.name})
        }
        reset(vehicleData);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  const onSubmit = async (data: Values) => {
    const isNew = !id;
    try {
      const response = await (isNew
        ? createVehicle(data)
        : updateVehicle(data, id));
      if (isNew) {
        navigate({
          pathname: paths.dashboard.addVehicle,
          search: `?vehicleId=${response.data.id}`,
        });
      }
      toast.success(`Vehicle ${isNew ? "added" : "Edited"} Successfully`);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box my={5}>
        <Typography style={{ textDecoration: "none" }}>
          <Link
            to={paths.dashboard.manageVehicle}
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
      <Card>
        <CardHeader
          title={`${!!id ? "Edit" : "Add"} Vehicle`}
          subheader={`${!!id ? "Edit the current" : "Add a new"} Vehicle`}
        />
        <Divider />
        <CardContent>
          <Box
            sx={{ borderBottom: 1, borderColor: "divider", margin: "10px 0px" }}
          >
            <Tabs
              value={currentTab}
              onChange={(_, newValue) => setCurrentTab(newValue)}
              variant="fullWidth"
            >
              <Tab label="Vehicle Details" style={{ flexGrow: 1 }} />
              <Tab label="Document" disabled={!id} style={{ flexGrow: 1 }} />
            </Tabs>
          </Box>
          {currentTab === 0 && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} mt={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="centerId"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.centerId)} fullWidth>
                        <InputLabel>Center</InputLabel>
                        <Select {...field} label="Center">
                          <MenuItem value=""></MenuItem>
                          {CenterQuery.data?.centers &&
                            CenterQuery?.data?.centers?.map((row: any) => (
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
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormControl
                        error={Boolean(errors.registrationNumber)}
                        fullWidth
                      >
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          label="Registration Number"
                          type="text"
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.registrationNumber && (
                          <FormHelperText>
                            {errors.registrationNumber.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="vehicleStatus"
                    render={({ field }) => (
                      <FormControl
                        error={Boolean(errors.vehicleStatus)}
                        fullWidth
                      >
                        <InputLabel>Vehicle Status</InputLabel>
                        <Select {...field} label="Vehicle Status">
                          <MenuItem value={1}>Active</MenuItem>
                          <MenuItem value={2}>In-active</MenuItem>
                        </Select>
                        {errors.vehicleStatus && (
                          <FormHelperText>
                            {errors.vehicleStatus.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="make"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.make)} fullWidth>
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          label="Vehcile Make"
                          type="text"
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.make && (
                          <FormHelperText>{errors.make.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="model"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.model)} fullWidth>
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          label="Vehicle Model"
                          type="text"
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.model && (
                          <FormHelperText>
                            {errors.model.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="primaryMeter"
                    render={({ field }) => (
                      <FormControl
                        error={Boolean(errors.primaryMeter)}
                        fullWidth
                      >
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          label="Primary Meter"
                          type="number"
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.primaryMeter && (
                          <FormHelperText>{"Error Occurred"}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="tankCapacity"
                    render={({ field }) => (
                      <FormControl
                        error={Boolean(errors.tankCapacity)}
                        fullWidth
                      >
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          label="Tank Capacity"
                          type="number"
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.tankCapacity && (
                          <FormHelperText>{"Error Occurred"}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="expectedAvg"
                    render={({ field }) => (
                      <FormControl
                        error={Boolean(errors.expectedAvg)}
                        fullWidth
                      >
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          label="Expected Average"
                          type="number"
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.expectedAvg && (
                          <FormHelperText>{"Error Occurred"}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="dateOfPurchase"
                    render={({ field }) => (
                      <FormControl
                        error={Boolean(errors.dateOfPurchase)}
                        fullWidth
                      >
                        <TextField
                          {...field}
                          label="Date of Purchase"
                          type="date"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                        />
                        {errors.dateOfPurchase && (
                          <FormHelperText>
                            {errors.dateOfPurchase.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="seater"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.seater)} fullWidth>
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          label="Seater"
                          type="number"
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.seater && (
                          <FormHelperText>{"Error Occurred"}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="engineNumber"
                    render={({ field }) => (
                      <FormControl
                        error={Boolean(errors.engineNumber)}
                        fullWidth
                      >
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          label="Engine No"
                          type="text"
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.engineNumber && (
                          <FormHelperText>
                            {errors.engineNumber.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="chassisNumber"
                    render={({ field }) => (
                      <FormControl
                        error={Boolean(errors.chassisNumber)}
                        fullWidth
                      >
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          label="chassis Number"
                          type="text"
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.chassisNumber && (
                          <FormHelperText>
                            {errors.chassisNumber.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="financeBy"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.financeBy)} fullWidth>
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          label="Financed By"
                          type="text"
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.financeBy && (
                          <FormHelperText>
                            {errors.financeBy.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="emiAmount"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.emiAmount)} fullWidth>
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          label="Emi Amount"
                          type="text"
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.emiAmount && (
                          <FormHelperText>
                            {errors.emiAmount.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="emiDate"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.emiDate)} fullWidth>
                        <TextField
                          {...field}
                          label="Emi Date"
                          type="date"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                        />
                        {errors.emiDate && (
                          <FormHelperText>
                            {errors.emiDate.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="route"
                    render={({ field }: any) => (
                      <FormControl error={Boolean(errors.route)} fullWidth>
                        <Autocomplete
                          {...field}
                          freeSolo
                          options={RouteQuery?.data?.availableRoutes || []}
                          getOptionLabel={(option: any) => {
                            if (typeof option === "string") return option;
                            return option.name;
                          }}
                          onChange={(_, option: any) =>
                            field.onChange(
                              typeof option === "string"
                                ? option
                                : option?.name || ""
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Route"
                              onChange={field.onChange}
                            />
                          )}
                        />
                        {errors.route && (
                          <FormHelperText>
                            {errors.route.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: "5px",
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
          {currentTab === 1 && <VehicleDocuments />}
        </CardContent>
      </Card>
    </>
  );
}
