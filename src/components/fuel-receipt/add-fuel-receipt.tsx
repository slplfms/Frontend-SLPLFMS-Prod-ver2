import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  FormControl,
  FormHelperText,
  Button,
  Box,
  CardHeader,
  Divider,
  TextField,
  Autocomplete,
  Typography,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as z from "zod";
import { toast } from "sonner";
import {
  createReceipt,
  getReceipt,
  updateReceipt,
} from "../../Services/fuel-receipt";
import { useQuery } from "react-query";
import { getAllFuelStations } from "../../Services/fuelStationService";
import { useUser } from "../../hooks/use-user";
import { paths } from "../../paths";
import dayjs from "dayjs";
import { getAllCenters } from "../../Services/center-service";
import { userRoleType } from "../../constants/role";

export const schema = z.object({
  fuelingStation: z
    .string()
    .min(1, { message: "Please select Fuel Station" })
    .optional(),
  receiptFile: z.instanceof(File).optional(),
  quantity: z.coerce.number(),
  price: z.coerce.number(),
  serialNo: z.string(),
  date: z.string(),
  centerId: z.string(),
});

type FuelValues = z.infer<typeof schema>;

const defaultValues: FuelValues = {
  fuelingStation: "",
  quantity: 0,
  price: 0,
  serialNo: "",
  date: dayjs().format("YYYY-MM-DD"),
  centerId: "",
};

function ManageFuelReceipt() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const navigate = useNavigate();
  const { user } = useUser();

  const isAdmin = (user?.role as any)?.type === userRoleType.admin;

  const [receiptUrl, setReceiptUrl] = useState("");
  const { data: centersData } = useQuery("getAvailableCenters", getAllCenters, {
    enabled: isAdmin,
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<FuelValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (id) {
      getReceipt(id)
        .then(({ data }: any) => {
          const { FuelingStation, receiptUrl: rUrl } = data || {};
          setReceiptUrl(rUrl);
          reset({ ...data, fuelingStation: FuelingStation?.name });
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [id]);

  const isNew = !id;
  const onSubmit = async (data: FuelValues) => {
    const formData: any = new FormData();
    formData.append("quantity", data.quantity);
    formData.append("fuelingStation", data.fuelingStation);
    formData.append("serialNo", data.serialNo);
    formData.append("price", data.price);
    formData.append("date", data.date);
    if (isAdmin && isNew) {
      formData.append("centerId", data.centerId);
    }
    if (data.receiptFile) {
      formData.append("receiptFile", data.receiptFile);
    }

    if (isNew && !data.receiptFile) {
      toast.warning("Please Select a Receipt File");
      return;
    }

    try {
      const response = await (isNew
        ? createReceipt(formData)
        : updateReceipt(formData, id));
      toast.success(`Fuel Receipt ${isNew ? "added" : "Edited"} Successfully`);

      if (isNew) {
        navigate(paths.dashboard.fuelReceipt);
      } else {
        setReceiptUrl(response.data.receiptUrl);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    }
  };

  const fuelStationQuery = useQuery({
    queryKey: ["getFuelStations"],
    queryFn: getAllFuelStations,
  });

  return (
    <>
      <Box my={5} display={"inline-block"}>
        <Box>
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
            <p style={{ margin: "0px 8px" }}>Previous </p>
          </Link>
        </Box>
      </Box>
      <Card>
        <CardHeader
          title={`${!!id ? "Edit" : "Add"} Fuel Receipt`}
          subheader={"Manage Fuel receipts and vehicles!"}
        />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <Grid container spacing={2}>
              {(isAdmin && isNew) && (
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="centerId"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.centerId)} fullWidth>
                        <InputLabel>Center</InputLabel>
                        <Select {...field} label="Center">
                          <MenuItem value=""></MenuItem>
                          {centersData?.centers?.length &&
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
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="fuelingStation"
                  render={({ field }: any) => (
                    <FormControl
                      error={Boolean(errors.fuelingStation)}
                      fullWidth
                    >
                      <Autocomplete
                        {...field}
                        freeSolo
                        options={fuelStationQuery.data?.fuelingStations || []}
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
                            label="Fuel Station"
                            onChange={field.onChange}
                          />
                        )}
                      />
                      {errors.fuelingStation && (
                        <FormHelperText>
                          {errors.fuelingStation.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="price"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.price)} fullWidth>
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        id="price"
                        label="Fuel Price"
                        type="number"
                        InputLabelProps={{ shrink: true }}
                      />
                      {errors.price && (
                        <FormHelperText>{errors.price.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="quantity"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.quantity)} fullWidth>
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        id="quantity"
                        label="Quantity"
                        type="number"
                        InputLabelProps={{ shrink: true }}
                      />
                      {errors.quantity && (
                        <FormHelperText>
                          {errors.quantity.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="serialNo"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.serialNo)} fullWidth>
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        id="serialNo"
                        label="Receipt no."
                        type="text"
                        InputLabelProps={{ shrink: true }}
                      />
                      {errors.serialNo && (
                        <FormHelperText>
                          {errors.serialNo.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="receiptFile"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.receiptFile)} fullWidth>
                      <input
                        type="file"
                        id="receipt-file"
                        style={{ display: "none" }} // Hide the default file input
                        onChange={(e) => field.onChange(e?.target?.files?.[0])} // Handle file change
                      />
                      <Box
                        display={"flex"}
                        gap={2}
                        alignItems={"center"}
                        mt={2}
                      >
                        <label htmlFor="receipt-file">
                          <Button variant="contained" component="span">
                            Choose a File
                          </Button>
                        </label>
                        {field.value && (
                          <Typography variant="body2" color="textSecondary">
                            {field.value.name}
                          </Typography>
                        )}
                      </Box>
                      {errors.receiptFile && (
                        <FormHelperText>
                          {errors.receiptFile.message}
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
                  disabled={!isValid}
                  sx={{
                    borderRadius: "5px",
                  }}
                >
                  {isNew ? "Add" : "Update"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {!!receiptUrl && (
        <Card style={{ marginTop: "2rem" }}>
          <CardContent>
            <a
              href={`${
                import.meta.env.VITE_STORAGE_URL ||
                "https://storageslplfmsprod.blob.core.windows.net/"
              }${receiptUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={`${
                  import.meta.env.VITE_STORAGE_URL ||
                  "https://storageslplfmsprod.blob.core.windows.net/"
                }${receiptUrl}`}
                alt="receipt"
                style={{
                  width: "100%",
                  // maxWidth: "90vw",
                  objectFit: "contain",
                  aspectRatio: 1,
                }}
              />
            </a>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default ManageFuelReceipt;
