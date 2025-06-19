import * as React from "react";
import {
  Avatar,
  Box,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { deleteUser } from "../../Services/UserService";
import { toast } from "sonner";
import AuthRequired from "../auth/auth-required";
import { ROWS_PER_PAGE } from "src/constants/rowsPerPage";

interface UserTableProps {
  query: any;
  page: number;
  setPage: (newPage: number) => void;
  rowsPerPageOptions?: number[];
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
}

export function UsersTable({
  query,
  page,
  setPage,
  rowsPerPageOptions = ROWS_PER_PAGE,
  rowsPerPage,
  setRowsPerPage,
}: UserTableProps): React.ReactElement {

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

  const handleDelete = async (userId: string, name: string) => {
    try {
      await deleteUser(userId);
      toast.success(`User "${name}" Deleted Successfully`);
      query.refetch();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <Card>
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: "1800px" }}>
            <TableHead>
              <TableRow>
                <TableCell >
                  #No.
                </TableCell>
                <TableCell>Avatar</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Joining Date</TableCell>
                <TableCell>PF Number</TableCell>
                <TableCell>ESIC Number</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Center Name</TableCell>
                <TableCell>Reporting Manager</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {query?.data?.users && query?.data?.users?.map((row: any, idx: number) => {

                return (
                  <TableRow hover key={row.id}>
                    <TableCell>
                      {idx+1}
                    </TableCell>
                    <TableCell>
                      <Avatar src={row.avatar} />
                    </TableCell>
                    <TableCell>{row.employeeId}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.phoneNumber}</TableCell>
                    <TableCell>{dayjs(row.joiningDate).format("MMM D, YYYY")}</TableCell>
                    <TableCell>{row.pfNumber}</TableCell>
                    <TableCell>{row.esicNumber}</TableCell>
                    <TableCell>{row.Role?.name}</TableCell>
                    <TableCell>{row.Center?.name}</TableCell>
                    <TableCell>{row.reportingManager?.name}</TableCell>
                    <TableCell>{row.Vehicle?.registrationNumber}</TableCell>
                    <TableCell>{row.comments}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex" }}>
                        {row.id && (
                          <AuthRequired permissions={['updateUser']} type="button">
                            <Link
                              to={`/dashboard/edit-user?userId=${row.id}`}
                              style={{ textDecoration: "none" }}
                            >
                              <IconButton color="primary" aria-label="edit">
                                <EditIcon />
                              </IconButton>
                            </Link>
                          </AuthRequired>
                        )}
                        {row.id && (
                          <AuthRequired permissions={['deleteUser']} type="button">
                            <IconButton
                              color="secondary"
                              aria-label="delete"
                              onClick={() => handleDelete(row.id, row.name)}
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
          page={page ||0}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </Card>
    </>
  );
}
