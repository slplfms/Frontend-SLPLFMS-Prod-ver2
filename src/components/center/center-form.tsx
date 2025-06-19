import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useParams } from "react-router-dom";
import { paths } from "../../paths";
import { getCenter, createCenter, updateCenter } from "../../Services/center-service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


export const schema = z.object({
  name: z.string().min(1, { message: "Please enter center name" }),
  address: z.string().min(1, { message: "Please enter center address" }),
  trustName: z.string().min(1, { message: "Please enter trust name" }),
  dailyAvgKm: z.any(),
});
type Values = z.infer<typeof schema>;

const defaultValues: Values = {
  name: '',
  address: '',
  trustName: '',
  dailyAvgKm: 0,
};

export default function CenterForm() {
  const { id } = useParams();
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  React.useEffect(() => {
    if (!id) return;
    // Fetch Center details using id
    getCenter(id)
      .then(data => {
        reset(data);
      })
      .catch(error => {
        console.error("Error fetching center:", error);
      });
  }, [id, reset]);

  const onSubmit = async (data: Values) => {
    const isNew = !id
    try {
      const response = await (isNew ? createCenter(data) : updateCenter(data, id));
      if (response.status == 200 || response.status == 201) {
        toast.success(`Center ${isNew ? "added" : "Edited"} Successfully`)
        isNew ? reset(defaultValues) : null;
        isNew ? setTimeout(() => {
          navigate(paths.dashboard.manageCenter);
        }, 1000) : null
      }
      else {
        toast.error(response.error)
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography style={{ textDecoration: "none" }}>
            <Link
              to={paths.dashboard.manageCenter}
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
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={`${!!id ? "Edit" : "Add"} Center`} subheader={`${!!id ? "Edit the current" : "Add a new"} center`} />
            <Divider />
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          label="Center Name"
                          type="text"
                          error={Boolean(errors.name)}
                          InputLabelProps={{ shrink: true }}
                          helperText={errors.name && errors.name.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      control={control}
                      name="address"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          label="Center Address"
                          type="text"
                          error={Boolean(errors.address)}
                          helperText={errors.address && errors.address.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      control={control}
                      name="trustName"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="text"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          label="Trust Name"
                          error={Boolean(errors.trustName)}
                          helperText={errors.trustName && errors.trustName.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      control={control}
                      name="dailyAvgKm"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          variant="outlined"
                          label="Daily Average Kiloliters"
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.dailyAvgKm)}
                        //helperText={errors.dailyAvgKm && errors.dailyAvgKm.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ borderRadius: "5px" }}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
