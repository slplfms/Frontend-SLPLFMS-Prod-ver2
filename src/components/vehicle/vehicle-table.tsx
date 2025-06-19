import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { deleteVehicle} from "../../Services/vehicle-service";
import { toast } from "sonner";
import AuthRequired from "../auth/auth-required";
import { ROWS_PER_PAGE } from "src/constants/rowsPerPage";

interface VehicleTableProps {
  page: number;
  setPage: (newPage: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  query: any; 
}

export function VehicleTable({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  query,
}: VehicleTableProps): React.ReactElement {

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleDelete = async (id: string, make: string) => {
    try {
      await deleteVehicle(id);
      toast.success(`Vehicle "${make}" Deleted Successfully`);
      query.refetch();
    } catch (error) {
      toast.error("Some error Occurred");
      console.error("Error deleting Vehicle:", error);
    }
  };

  return (
    <Card>
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: "2500px" }}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Registration No</TableCell>
              <TableCell>Route No</TableCell>
              <TableCell>Center Name</TableCell>
              <TableCell>Engine No</TableCell>
              <TableCell>Chassis No</TableCell>
              <TableCell>Seater</TableCell>
              <TableCell>Vehicle Make</TableCell>
              <TableCell>Vehicle Model</TableCell>
              <TableCell>Date of Purchase</TableCell>
              <TableCell>Tank Capacity</TableCell>
              <TableCell>Expected Average</TableCell>
              <TableCell>Financed By</TableCell>
              <TableCell>EMI Amount</TableCell>
              <TableCell>EMI Date</TableCell>
              <TableCell>Vehicle Status</TableCell>
              <TableCell>Primary Meter</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {query?.data?.vehicles &&
              query?.data?.vehicles?.map((row: any, idx:number) => {

                return (
                  <TableRow hover key={row.id}>
                    <TableCell >
                      {idx+1}
                    </TableCell>
                    <TableCell>{row.registrationNumber}</TableCell>
                    <TableCell>{row.Route?.name}</TableCell>
                    <TableCell>{row.Center?.name}</TableCell>
                    <TableCell>{row.engineNumber}</TableCell>
                    <TableCell>{row.chassisNumber}</TableCell>
                    <TableCell>{row.seater}</TableCell>
                    <TableCell>{row.make}</TableCell>
                    <TableCell>{row.model}</TableCell>
                    <TableCell>
                      {dayjs(row.purchaseDate).format("MMM D, YYYY")}
                    </TableCell>
                    <TableCell>{row.tankCapacity}</TableCell>
                    <TableCell>{row.expectedAvg}</TableCell>
                    <TableCell>{row.financeBy}</TableCell>
                    <TableCell>{row.emiAmount}</TableCell>
                    <TableCell>
                      {!!row.emoDate ? dayjs(row.emiDate).format("MMM D, YYYY") : ''}
                    </TableCell>
                    <TableCell>
                      {row.vehicleStatus == 1 ? "active" : "Inactive"}
                    </TableCell>
                    <TableCell>{row.primaryMeter}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex" }}>
                        {row.id && (
                          <AuthRequired
                            permissions={["updateVehicle"]}
                            type="button"
                          >
                            <Link
                              to={`/dashboard/update-vehicleManage?vehicleId=${row.id}`}
                              style={{ textDecoration: "none" }}
                            >
                              <IconButton color="primary" aria-label="edit">
                                <EditIcon />
                              </IconButton>
                            </Link>
                          </AuthRequired>
                        )}
                        {row.id && (
                          <AuthRequired
                            permissions={["deleteVehicle"]}
                            type="button"
                          >
                            <IconButton
                              color="secondary"
                              aria-label="delete"
                              onClick={() => handleDelete(row.id, row.make)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </AuthRequired>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={query?.data?.total || 0}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE}
      />
    </Card>
  );
}
