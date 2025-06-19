import { useEffect } from "react";
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
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useParams } from "react-router-dom";
import * as z from "zod";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { paths } from "../../paths";
import { toast } from "sonner";
import {
  getFuel,
  createFuel,
  updateFuel,
} from "../../Services/FuelManageService";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/use-user";

export const schema = z.object({
  odometer: z.coerce.number(),
  quantity: z.coerce.number(),
});

type FuelValues = z.infer<typeof schema>;

const defaultValues: FuelValues = {
  odometer: 0,
  quantity: 0,
};

function FuelManagementTable() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FuelValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { user } = useUser();

  useEffect(() => {
    if (id) {
      getFuel(id)
        .then((data) => {
          reset(data);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [id]);

  const isNew = !id;
  const onSubmit = async (data: FuelValues) => {

    const payload = {
      odometer: data.odometer,
      quantity: data.quantity,
    };

    try {
      const response = await (isNew
        ? createFuel(data)
        : updateFuel(payload, id));
      if (response.status == 200 || response.status == 201) {
        toast.success(
          `Fuel Activity ${isNew ? "added" : "Edited"} Successfully`
        );
        isNew ? reset(defaultValues) : null;
        isNew
          ? setTimeout(() => {
              navigate(paths.dashboard.manageFuel);
            }, 1000)
          : null;
      } else {
        toast.error(response.error);
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const VehicleName = ({ name }: any) => {
    if (!name) return <>...</>;
    return (
      <>
        {!!id ? "Edit the current" : "Add a new"} Fuel Activity for Vehicle{" "}
        <b>{name}</b>
      </>
    );
  };

  return (
    <>
      <Box my={5} display={"inline-block"}>
        <Box>
          <Link
            to={paths.dashboard.manageFuel}
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
      {!user?.vehicle && (
        <Alert severity="warning" sx={{ my: 2 }}>
          Vehicle is not assigned!!.
        </Alert>
      )}
      <Card>
        <CardHeader
          title={`${!!id ? "Edit" : "Add"} Fuel Management`}
          subheader={<VehicleName name={user?.vehicle?.registrationNumber} />}
        />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="odometer"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.odometer)} fullWidth>
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        variant="outlined"
                        label="Odometer Reading"
                        id="odometerReading"
                        InputLabelProps={{ shrink: true }}
                      />
                      {errors.odometer && (
                        <FormHelperText>
                          {errors.odometer.message}
                        </FormHelperText>
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
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!user?.vehicle}
                  sx={{
                    borderRadius: "5px",
                  }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default FuelManagementTable;
