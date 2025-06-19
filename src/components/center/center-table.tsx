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
import { Link } from "react-router-dom";
import { deleteCenter } from "../../Services/center-service";
import { toast } from "sonner";
import AuthRequired from "../auth/auth-required";



interface CenterTableProps {
  page: number;
  setPage: (newPage: number) => void;
  rowsPerPageOptions: number[];
  query: any;
  rowsPerPage: any;
  setRowsPerPage: (rows: any) => void;
}

export function CenterTable({
  page,
  setPage,
  rowsPerPageOptions,
  query,
  rowsPerPage,
  setRowsPerPage,
}: CenterTableProps) {

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

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteCenter(id);
      toast.success(`Center "${name}" Deleted Successfully`);
      query.refetch();
    } catch (error) {
      toast.error("Some error Occurred");
      console.error("Error deleting center:", error);
    }
  };

  return (
    <>
      <Card>
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: "900px" }}>
            <TableHead>
              <TableRow>
                <TableCell>
                #No.
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Trust Name</TableCell>
                <TableCell>Daily Average Km</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {query.data?.centers &&
                query.data?.centers?.map((row: any, idx:number) => {
                  return (
                    <TableRow hover key={row.id} >
                      <TableCell >
                        {idx+1}
                      </TableCell>
                      <TableCell>{row?.name}</TableCell>
                      <TableCell>{row?.address}</TableCell>
                      <TableCell>{row?.trustName}</TableCell>
                      <TableCell>{row?.dailyAvgKm}</TableCell>
                      <TableCell>
                        <div style={{ display: "flex" }}>
                          {row.id && (
                            <AuthRequired
                              permissions={["updateCenter"]}
                              type="button"
                            >
                              <Link
                                to={`/dashboard/update-center/${row.id}`}
                                style={{ textDecoration: "none" }}
                              >
                                <IconButton
                                  color="primary"
                                  aria-label="edit"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Link>
                            </AuthRequired>
                          )}
                          {row.id && (
                            <AuthRequired
                              permissions={["deleteCenter"]}
                              type="button"
                            >
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
          page={page || 0}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </Card>
    </>
  );
}
