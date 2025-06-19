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
import { createRoute, getRoute, updateRoute } from "../../Services/routeService";
import { useNavigate } from "react-router-dom";

export const schema = z.object({
    name: z.string().min(1, { message: "Please enter Route name" }),
});
type Values = z.infer<typeof schema>;
const defaultValues: Values = {
    name: '',
}
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
    });



    React.useEffect(() => {
        if (!id)
            return
        getRoute(id)
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
            const response = await (isNew ? createRoute(data) : updateRoute(data, id));
            if (response.status == 200 || response.status == 201) {
                toast.success(`Route ${isNew ? "added" : "Edited"} Successfully`)
                isNew ? reset(defaultValues) : null;
                isNew ? setTimeout(() => {
                    navigate(paths.dashboard.manageRoute);
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
                            to={paths.dashboard.manageRoute}
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
                        <CardHeader title={`${!!id ? "Edit" : "Add"} Route`} subheader={`${!!id ? "Edit the current" : "Add a new"} route`} />
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
                                                    label="Route Name"
                                                    error={Boolean(errors.name)}
                                                    helperText={
                                                        errors.name &&
                                                        errors.name.message
                                                    }
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
