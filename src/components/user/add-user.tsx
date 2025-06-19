import React, { useMemo, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getAllRoles } from "../../Services/roleService";
import { getAllCenters } from "../../Services/center-service";
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
} from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UserDocuments from "./userDocuments";
import {
  createUser,
  updateUser,
  getUser,
  getAllUsers,
} from "../../Services/UserService";
import { toast } from "sonner";
import { paths } from "../../paths";
import { useQuery } from "react-query";
import { getAllVehiclesByCenter } from "../../Services/vehicle-service";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userRoleType } from "../../constants/role";

export default function AddUser({ editMode }: { editMode: boolean }) {
  const [currentTab, setCurrentTab] = React.useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("userId");
  const [centerId, setCenterId] = useState("");
  const [vehiclesByCenter, setVehiclesByCenter] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const schema = z.object({
    name: z.string().min(1, { message: "Please enter your name" }),
    employeeId: z.string().min(1, { message: "Please enter your employee ID" }),
    phoneNumber: z
      .string()
      .min(1, { message: "Please enter your phone number" }),
    joiningDate: z
      .string()
      .min(1, { message: "Please enter your joining date" }),
    password: editMode
      ? z.union([
          z
            .string()
            .min(6, { message: "Password must be at least 6 characters long" })
            .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/, {
              message:
                "Password must contain at least one letter and one number",
            }),
          z.literal(""),
          z.null(),
        ])
      : z
          .string()
          .min(6, { message: "Password must be at least 6 characters long" })
          .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/, {
            message: "Password must contain at least one letter and one number",
          }),
    esicNumber: z.string().min(1, { message: "Please enter your ESIC number" }),
    pfNumber: z.string().min(1, { message: "Please enter your PF number" }),
    roleId: z.string().min(1, { message: "Please select a role" }),
    comments: z.union([z.string().optional(), z.any()]),
    centerId: z.union([z.null(), z.string().optional()]),
    reportingManagerId: z.union([z.null(), z.string().optional()]),
    vehicleId: z.union([z.null(), z.string().optional()]),
  });
  type Values = z.infer<typeof schema>;

  const defaultValues: Values = {
    name: "",
    employeeId: "",
    phoneNumber: "",
    joiningDate: "",
    password: "",
    esicNumber: "",
    pfNumber: "",
    comments: "",
    roleId: "",
    centerId: "",
    reportingManagerId: "",
    vehicleId: "",
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    getValues,
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues });

  React.useEffect(() => {
    if (!id) return;
    // Fetch User details using id
    getUser(id)
      .then((data) => {
        reset(data);
        setUser(data);
        setCenterId(data?.centerId);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  React.useEffect(() => {
    if (!centerId) return;
    getAllVehiclesByCenter(centerId)
      .then((data) => {
        setVehiclesByCenter([
          ...data,
          ...(user?.Vehicle ? [user?.Vehicle] : []),
        ]);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [centerId, id]);

  const isNew = !id;
  const onSubmit = async (data: Values) => {
    // check driver fields
    if (!isAdmin) {
      const requiredList = [
        "centerId",
        // "vehicleId",
        "reportingManagerId",
      ];

      for (let field of requiredList) {
        if (!(data as any)[field]) {
          toast.warning("Fields are missing")!;
          return;
        }
      }
    }

    const unwantedEmptyFields = [
      "centerId",
      "password",
      "comments",
      "vehicleId",
      "reportingManagerId",
    ];

    // remove unwanted fields like password if null in case of patch
    unwantedEmptyFields.forEach((key) => {
      if (
        data &&
        Object.prototype.hasOwnProperty.call(data, key) &&
        !(data as any)[key]
      ) {
        delete (data as any)[key];
      }
    });

    try {
      const response = await (isNew ? createUser(data) : updateUser(data, id));
      if (isNew) {
        navigate({
          pathname: paths.dashboard.adduser,
          search: `?userId=${response.data.id}`,
        });
      }
      toast.success(`User ${isNew ? "added" : "updated"} successfully`);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const roleQuery = useQuery({ queryKey: ["getRoles"], queryFn: getAllRoles });
  const centerQuery = useQuery({
    queryKey: ["getCenter"],
    queryFn: getAllCenters,
  });
  const query = useQuery({ queryKey: ["getUsers"], queryFn: getAllUsers });

  const { isAdmin, isSupervisor } = useMemo(() => {
    const roleId = getValues("roleId");
    const role = roleQuery.data?.roles?.find(
      (_role: any) => _role.id == roleId
    );

    return {
      isAdmin: !!role && role.type == userRoleType.admin,
      isSupervisor: !!role && role.type == userRoleType.supervisor,
    };
  }, [watch("roleId"), roleQuery.data]);

  return (
    <>
      <Box my={5}>
        <Box style={{ textDecoration: "none" }}>
          <Link
            to={paths.dashboard.users}
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
          title={`${!!id ? "Edit" : "Add"} User`}
          subheader={`${!!id ? "Edit the current" : "Add a new"} User`}
        />
        <Divider />
        <CardContent>
          <Box
            sx={{ borderBottom: 1, borderColor: "divider", margin: "10px 0px" }}
          >
            <Tabs
              value={currentTab}
              onChange={(_e, newValue) => setCurrentTab(newValue)}
              variant="fullWidth"
            >
              <Tab label="User Details" style={{ flexGrow: 1 }} />
              <Tab label="Document" disabled={!id} style={{ flexGrow: 1 }} />
            </Tabs>
          </Box>
          {currentTab === 0 && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} padding={"20px 0px"}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.name)} fullWidth>
                        <TextField
                          {...field}
                          variant="outlined"
                          label="Name"
                          id="Name"
                          InputLabelProps={{ shrink: true }}
                          type="text"
                        />
                        {errors.name && (
                          <FormHelperText>{errors.name.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.employeeId)} fullWidth>
                        <TextField
                          fullWidth
                          variant="outlined"
                          {...field}
                          label="Employee Id"
                          type="text"
                          id="Employee Id"
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.employeeId && (
                          <FormHelperText>
                            {errors.employeeId.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormControl
                        error={Boolean(errors.phoneNumber)}
                        fullWidth
                      >
                        <TextField
                          fullWidth
                          variant="outlined"
                          {...field}
                          label="Phone"
                          type="text"
                          id="Phone"
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.phoneNumber && (
                          <FormHelperText>
                            {errors.phoneNumber.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="joiningDate"
                    render={({ field }) => (
                      <FormControl
                        error={Boolean(errors.joiningDate)}
                        fullWidth
                      >
                        <TextField
                          {...field}
                          value={field.value?.slice(0, 10)}
                          label="Joining Date"
                          type="date"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                        />
                        {errors.joiningDate && (
                          <FormHelperText>
                            {errors.joiningDate.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.password)} fullWidth>
                        <TextField
                          {...field}
                          label="Password"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                        />
                        {errors.password && (
                          <FormHelperText>
                            {errors.password.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="esicNumber"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.esicNumber)} fullWidth>
                        <TextField
                          {...field}
                          label="ESIC Number"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                        />
                        {errors.esicNumber && (
                          <FormHelperText>
                            {errors.esicNumber.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="pfNumber"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.pfNumber)} fullWidth>
                        <TextField
                          {...field}
                          label="PF Number"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                        />
                        {errors.pfNumber && (
                          <FormHelperText>
                            {errors.pfNumber.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="comments"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.comments)} fullWidth>
                        <TextField
                          {...field}
                          variant="outlined"
                          label="Comments"
                          id="Name"
                          InputLabelProps={{ shrink: true }}
                          type="text"
                        />
                        {errors.comments && (
                          <FormHelperText>
                            <>
                              {errors?.comments?.message &&
                                errors.comments.message}
                            </>
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="roleId"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.roleId)} fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select {...field} label="Role" value={field.value}>
                          {roleQuery.data?.roles &&
                            roleQuery.data?.roles?.map((row: any) => (
                              <MenuItem key={row.id} value={row.id}>
                                {row.name}
                              </MenuItem>
                            ))}
                        </Select>
                        {errors.roleId && (
                          <FormHelperText>
                            {errors.roleId.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                {!isAdmin && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        control={control}
                        name="centerId"
                        render={({ field }) => (
                          <FormControl
                            error={Boolean(errors.centerId)}
                            fullWidth
                          >
                            <InputLabel>Center</InputLabel>
                            <Select
                              {...field}
                              label="Center"
                              onChange={(e: any) => {
                                field.onChange(e);
                                setCenterId(e.target.value);
                              }}
                            >
                              {centerQuery?.data?.centers &&
                                centerQuery.data?.centers?.map((row: any) => (
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
                        name="reportingManagerId"
                        render={({ field }) => (
                          <FormControl
                            error={Boolean(errors.reportingManagerId)}
                            fullWidth
                          >
                            <InputLabel>Reporting Manager</InputLabel>
                            <Select {...field} label="Reporting Manager">
                              {query?.data?.users &&
                                query.data?.users?.map((user: any) => (
                                  <MenuItem key={user.id} value={user.id}>
                                    {user.name}
                                  </MenuItem>
                                ))}
                            </Select>
                            {errors.reportingManagerId && (
                              <FormHelperText>
                                {errors.reportingManagerId.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    {!isSupervisor && (
                      <Grid item xs={12} sm={6}>
                        <Controller
                          control={control}
                          name="vehicleId"
                          render={({ field }) => (
                            <FormControl
                              error={Boolean(errors.vehicleId)}
                              fullWidth
                            >
                              <InputLabel>Vehicle</InputLabel>
                              <Select {...field} label="Vehicle">
                                <MenuItem value={"-1"}>Not Assigned</MenuItem>
                                {vehiclesByCenter?.length > 0 ? (
                                  vehiclesByCenter?.map((row: any) => (
                                    <MenuItem key={row.id} value={row.id}>
                                      {row.registrationNumber}
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem disabled>
                                    {!centerId
                                      ? "Please select a Vehicle"
                                      : "No vehicle found"}
                                  </MenuItem>
                                )}
                              </Select>
                              {errors.vehicleId && (
                                <FormHelperText>
                                  {errors.vehicleId.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          )}
                        />
                      </Grid>
                    )}
                  </>
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
          )}
          {currentTab === 1 && <UserDocuments />}
        </CardContent>
      </Card>
    </>
  );
}
