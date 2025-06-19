import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Grid,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  CardHeader,
  FormControl,
  FormHelperText,
  Alert,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import { paths } from "../../paths";
import {
  createDailyKm,
  updateDailyKm,
  getDailyKm,
} from "../../Services/DailyKmService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/use-user";

export const schema = z.object({
  odometer: z.any(),
  // pending: z.string().optional(),
  date: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  odometer: 0,
  // pending: "",
  date: "",
};

function AddDailyKm() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useUser();


  React.useEffect(() => {
    if (!id) return;
    getDailyKm(id)
      .then((data) => {
        reset(data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  
  const VehicleName = ({ name }: any) => {
    if(!name) return <>...</>
    return (
      <>
        {!!id ? "Edit the current" : "Add a new"} Fuel Activity for Vehicle{" "}
        <b>{name}</b>
      </>
    );
  };


  const onSubmit = async (data: FormValues) => {
    const payload={odometer:data.odometer}
    const isNew = !id;
    try {
      const response = await (isNew ? createDailyKm(payload) : updateDailyKm(data, id));
      if (response.status == 200 || response.status == 201) {
        toast.success(`Daily Km ${isNew ? "added" : "Edited"} Successfully`);
        isNew ? reset(defaultValues) : null;
        isNew && setTimeout(() => {
          navigate(paths.dashboard.manageDailyKm);
        }, 1000)

      } else {
        toast.error(response.error);
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box my={5} display={'inline-block'}>
        <Link
          to={paths.dashboard.manageDailyKm}
          style={{
            display: "flex",
            flexGrow: 0,
            alignItems: "center",
            textDecoration: "none",
            color: "blue",
          }}
        >
          <ArrowBackIcon fontSize="small" />
          <p style={{ margin: "0px 8px" }}>Previous </p>
        </Link>
      </Box>
      {!user?.vehicle && (
        <Alert severity="warning" sx={{ my: 2 }}>
          Vehicle is not assigned!!.
        </Alert>
      )}
      <Card>
        <CardHeader
          title={`${!!id ? "Edit" : "Add"} Daily Kilometer`}
          subheader={<VehicleName name={user?.vehicle?.registrationNumber} />}

        />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="odometer"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.odometer)} fullWidth>
                      <TextField
                        {...field}
                        variant="outlined"
                        label="Starting Odo"
                        id="Name"
                        InputLabelProps={{ shrink: true }}
                        type="number"
                      />
                      {errors.odometer && (
                        <FormHelperText>{"Some Error Occurred"}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* {id && <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="pending"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.pending)} fullWidth>
                      <TextField {...field} variant="outlined" label="Pending" id="pending"
                        InputLabelProps={{ shrink: true }} type="text" />
                      {errors.pending && (
                        <FormHelperText>{errors.pending.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>} */}
              {id && (
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="date"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.date)} fullWidth>
                        <TextField
                          {...field}
                          variant="outlined"
                          label="Date"
                          id="Name"
                          InputLabelProps={{ shrink: true }}
                          type="date"
                        />
                        {errors.date && (
                          <FormHelperText>{errors.date.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}
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
        </CardContent>
      </Card>
    </>
  );
}

export default AddDailyKm;
