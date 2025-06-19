import React from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  IconButton,
  Paper,
  TableContainer,
  Checkbox,
  Badge,
} from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "sonner";
import AuthRequired from "../auth/auth-required";
import { deleteFuel } from "../../Services/FuelManageService";
import { ROWS_PER_PAGE } from "src/constants/rowsPerPage";

interface FuelManagementTableProps {
  query: any;
  page: number;
  setPage: (newPage: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (newRowsPerPage: number) => void;
  selection: any;
}

const status: Record<string, any> = {
  0: { title: "Pending", style: "warning" },
  1: { title: "Accepted", style: "success" },
  2: { title: "Declined", style: "error" },
};

const FuelManagementTable: React.FC<FuelManagementTableProps> = ({
  query,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  selection,
}) => {
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const {
    selectAll,
    deselectAll,
    selectOne,
    deselectOne,
    selected,
    selectedSome,
    selectedAll,
  } = selection;

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when changing rows per page
  };

  const handleDelete = async (id: string, date: string) => {
    try {
      await deleteFuel(id);
      toast.success(`Fuel entry for "${date}" deleted successfully`);
      query.refetch();
    } catch (error) {
      toast.error("Some error occurred");
      console.error("Error deleting fuel entry:", error);
    }
  };

  return (
    <Card>
      <Box sx={{ overflowX: "auto" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        selectAll();
                      } else {
                        deselectAll();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Fuel Station</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Odo Meter</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Receipt</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {query?.data?.fuelActivities &&
                query?.data?.fuelActivities?.map((row: any) => {
                  const isSelected = !!selected?.has(row.id);
                  return (
                    <TableRow key={row.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected || false}
                          onChange={(event) => {
                            if (event.target.checked) {
                              selectOne(row.id);
                            } else {
                              deselectOne(row.id);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.FuelingStation?.name}</TableCell>
                      <TableCell>{row.User?.name}</TableCell>
                      <TableCell>{row.Vehicle?.registrationNumber}</TableCell>
                      <TableCell>{row.odometer}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>{row.price}</TableCell>
                      <TableCell>
                        <Box display={"flex"} alignItems={"center"} gap={2}>
                          <Badge
                            badgeContent={""}
                            color={status[row.isPending].style}
                            sx={{
                              "& .MuiBadge-badge": {
                                height: "12px",
                                width: "7px",
                                minWidth: "11px",
                              },
                            }}
                          ></Badge>
                          <p>{status[row.isPending].title}</p>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`${
                            import.meta.env.VITE_STORAGE_URL ||
                            "https://storageslplfmsprod.blob.core.windows.net/"
                          }${row?.FuelReceipt.receiptUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Receipt
                        </a>
                      </TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        <div style={{ display: "flex" }}>
                          <AuthRequired
                            permissions={["updateFuelActivity"]}
                            type="button"
                          >
                            <Link
                              to={`/dashboard/edit-fuel/${row.id}`}
                              style={{ textDecoration: "none" }}
                            >
                              <IconButton color="primary" aria-label="edit">
                                <EditIcon />
                              </IconButton>
                            </Link>
                          </AuthRequired>
                          {row.id && (
                            <AuthRequired
                              permissions={["deleteFuelActivity"]}
                              type="button"
                            >
                              <IconButton
                                color="secondary"
                                aria-label="delete"
                                onClick={() => handleDelete(row.id, row.date)}
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
        </TableContainer>
      </Box>
      <TablePagination
        component="div"
        count={query?.data?.total || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE}
      />
    </Card>
  );
};

export default FuelManagementTable;
