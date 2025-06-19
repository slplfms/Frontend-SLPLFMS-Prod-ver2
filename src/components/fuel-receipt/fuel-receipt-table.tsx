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
  Switch,
} from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "sonner";
import AuthRequired from "../auth/auth-required";
import { deleteReceipt, updateReceiptPaidStatus } from "../../Services/fuel-receipt";
import { paths } from "../../paths";
import { ROWS_PER_PAGE } from "../../constants/rowsPerPage";
import { decimalPlaceFormatter } from "../../utils/number";

function FuelReceiptTable({ query, page, setPage, setRowsPerPage, rowsPerPage }: any) {

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when changing rows per page
  };

  const handleDelete = async (id: string, date: string) => {
    try {
      await deleteReceipt(id);
      toast.success(`Fuel entry for "${date}" deleted successfully`);
      query.refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Some error occurred");
    }
  };

  const handleChangePaidStatus = async (fuelId: string, newStatus: boolean) => {
    try {
      const { data } = await updateReceiptPaidStatus(fuelId, { newStatus });
      if (data.success && newStatus) {
        toast.success(`Status updated to paid`);
      }
      else {
        toast.info(`Status updated to un-paid`);
      }

      query.refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Some error occurred");
    }
  };

  return (
    <Card>
      <Box sx={{ overflowX: "auto" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Receipt No.</TableCell>
                <TableCell>Center</TableCell>
                <TableCell>Fuel Station</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Total amount</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Receipt</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {query?.data?.data?.fuelReceipts &&
                query?.data?.data?.fuelReceipts?.map((row: any) => {
                  return (
                    <TableRow key={row.id} hover sx={{
                      backgroundColor: row.isPaid ? '#d1f7c4' : 'inherit', // light green for paid
                    }}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.serialNo}</TableCell>
                      <TableCell>{row?.Center?.name}</TableCell>
                      <TableCell>{row.FuelingStation?.name}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>{row.price}</TableCell>
                      <TableCell>{decimalPlaceFormatter(row.price * row.quantity)}</TableCell>
                      <TableCell>
                        <div>
                          <Switch
                            checked={row.isPaid}
                            onChange={(event) => handleChangePaidStatus(row.id, event.target.checked)}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`${import.meta.env.VITE_STORAGE_URL ||
                            "https://storageslplfmsprod.blob.core.windows.net/"
                            }${row.receiptUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Receipt
                        </a>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: "flex" }}>
                          <AuthRequired
                            permissions={["updateFuelActivity"]}
                            type="button"
                          >
                            <Link
                              to={`${paths.dashboard.manageVehicleFuel}/${row.id}`}
                              style={{ textDecoration: "none" }}
                            >
                              <IconButton color="primary" aria-label="edit">
                                <PlaylistAddOutlinedIcon />
                              </IconButton>
                            </Link>
                          </AuthRequired>
                          <AuthRequired
                            permissions={["updateFuelActivity"]}
                            type="button"
                          >
                            <Link
                              to={`${paths.dashboard.manageFuelReceipt}?id=${row.id}`}
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
        count={query?.data?.data?.total || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE}
      />
    </Card>
  );
}

export default FuelReceiptTable;
