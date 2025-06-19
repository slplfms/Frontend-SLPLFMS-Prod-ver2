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
import { toast } from "sonner";
import { paths } from '../../paths'
import { createFuelStation, getFuelStation, updateFuelStation } from "../../Services/fuelStationService";
import { useNavigate } from "react-router-dom";

export const schema = z.object({
    name: z.string().min(1, { message: "Please enter fuel Station name" }),
    price: z.any()
});
type Values = z.infer<typeof schema>;
const defaultValues: Values = {
    name: '',
    price: 0,
}

export default function AddFuelStation() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Values>({
        resolver: zodResolver(schema),
    });

    React.useEffect(() => {
        if (!id)
            return
        getFuelStation(id)
            .then(data => {
                reset(data);
            })
            .catch(error => {
                console.error("Error fetching user:", error);
            });

    }, []);

    const onSubmit = async (data: Values) => {
        const isNew = !id
        try {
          const response = await (isNew ? createFuelStation(data) : updateFuelStation(data, id));
          if (response.status == 200 || response.status == 201) {
            toast.success(`Fuel Station ${isNew ? "added" : "Edited"} Successfully`)
            isNew ? reset(defaultValues) : null;
            isNew ? setTimeout(() => {
              navigate(paths.dashboard.fuelStation);
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
                            to={paths.dashboard.fuelStation}
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
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title={`${!!id ? "Edit" : "Add"} Fuel Station`} subheader={`${!!id ? "Edit the current" : "Add a new"} Fuel Station`} />
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
                                                    type="text"
                                                    InputLabelProps={{ shrink: true }}
                                                    label="Fuel Station Name"
                                                    error={Boolean(errors.name)}
                                                    helperText={
                                                        errors.name &&
                                                        errors.name.message
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            control={control}
                                            name="price"
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    variant="outlined"
                                                    type="number"
                                                    InputLabelProps={{ shrink: true }}
                                                    label="Fuel Price"
                                                    error={Boolean(errors.price)}
                                                    // helperText={
                                                    //     errors.price &&
                                                    //     {"Some Error Occurred"}
                                                    // }
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
