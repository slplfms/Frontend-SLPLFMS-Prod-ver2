import { useState } from "react";
import {
  CardHeader,
  Divider,
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Button,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { paths } from "../../paths";
import { getRole, createRole, updateRole } from "../../Services/roleService";
import { permissionConfig, defaultConfig } from "./permissionConfig";
import React from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { roleTypes } from "../../constants/role";

export default function AddRole() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState(defaultConfig);
  const [type, setType] = useState<string>("");
  const navigate = useNavigate();

  const maxPermissions = React.useMemo(() => {
    const tempList = permissionConfig.map((obj) => {
      return obj.modules.length;
    });
    return Math.max(...tempList);
  }, []);

  React.useEffect(() => {
    if (!id) return;
    // Fetch User details using id
    getRole(id)
      .then((roleData) => {
        setName(roleData.name);
        setDescription(roleData.description);
        setPermissions(roleData.permissions);
        setType(roleData.type)
      })
      .catch((error) => {
        console.error("Error fetching role:", error);
      });
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!name || !description || !type) {
      toast.error("Please Fill the Form below");
    } else {
      const payload = {
        name,
        description,
        permissions,
        type
      };
      const isNew = !id;
      try {
        const response = await (isNew
          ? createRole({ name, description, permissions })
          : updateRole(payload, id));
        if (response.status == 200 || response.status == 201) {
          toast.success(`Role ${isNew ? "added" : "Edited"} Successfully`);
          isNew ? setName("") : null;
          isNew ? setDescription("") : null;
          isNew
            ? setTimeout(() => {
              navigate(paths.dashboard.manageRoles);
            }, 1000)
            : null;
        } else {
          toast.error(response.error);
        }
      } catch (error: any) {
        toast.error(error?.message || "Something went wrong");
      }
    }
  };

  const handlePermissionChange = (event: any, key: string) => {
    setPermissions((prev: any) => {
      const newpermissions = { ...prev };
      newpermissions[key as string] = event.target.checked;
      return newpermissions;
    });
  };
  return (
    <>
      <Box my={5} display={'inline-block'}>
        <Link
          to={paths.dashboard.manageRoles}
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
      <Card>
        <CardHeader
          title={`${!!id ? "Edit" : "Add"} Role`}
          subheader={`${!!id ? "Edit the current" : "Add a new"} role`}
        />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  value={name}
                  fullWidth
                  variant="outlined"
                  id="fillingStation"
                  label="Name"
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  value={description}
                  fullWidth
                  variant="outlined"
                  id="fillingStation"
                  label="Description"
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role Type</InputLabel>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    fullWidth
                    label="Role Type"
                  >
                    {roleTypes.map((row: any) => (
                      <MenuItem key={row.value} value={row.value}>
                        {row.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TableContainer style={{ margin: "20px 0px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Permissions</TableCell>
                    {new Array(maxPermissions).fill(null).map((_obj, index) => (
                      <TableCell key={index}></TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissionConfig.map((permissionGroup, index) => (
                    <TableRow key={index}>
                      <TableCell>{permissionGroup.label}</TableCell>
                      {permissionGroup.modules.map((permissionComponent) => (
                        <TableCell key={permissionComponent.name}>
                          {/* <Checkbox
                            checked={!!(permissions as any)[permissionComponent.name]}
                            onChange={(event) => {
                              handlePermissionChange(event, permissionComponent.name)
                            }}
                          /> */}
                          <FormControlLabel
                            value="bottom"
                            control={
                              <Checkbox
                                checked={
                                  !!(permissions as any)[
                                  permissionComponent.name
                                  ]
                                }
                                onChange={(event) => {
                                  handlePermissionChange(
                                    event,
                                    permissionComponent.name
                                  );
                                }}
                              />
                            }
                            label={permissionComponent.label}
                            labelPlacement="bottom"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
          </form>
        </CardContent>
      </Card>
    </>
  );
}
