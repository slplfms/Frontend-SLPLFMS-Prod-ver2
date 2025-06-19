import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AuthRequired from "../auth/auth-required";
import { deleteRoute } from "../../Services/routeService";
import { ROWS_PER_PAGE } from "src/constants/rowsPerPage";

interface RouteTableProps {
    query: any;
    page: number;
    setPage: (newPage: number) => void;
    rowsPerPage: number;
    setRowsPerPage: (newRowsPerPage: number) => void;
}

const RouteTable: React.FC<RouteTableProps> = ({ query, page, setPage, rowsPerPage, setRowsPerPage }) => {

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const handleDelete = async (id: string, name: string) => {
        try {
            await deleteRoute(id);
            toast.success(`Route "${name}" Deleted Successfully`);
            query.refetch();
        } catch (error) {
            toast.error("Some error occurred");
            console.error("Error deleting route:", error);
        }
    };


    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell >#</TableCell>
                            <TableCell>Route Name</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {query.data?.routes && query?.data?.routes?.map((row: any, idx: number) => (
                            <TableRow key={row.id}>
                                <TableCell >{idx+1}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>
                                    <div style={{ display: "flex" }}>
                                        <AuthRequired permissions={['updateRoute']} type="button">
                                            <Link to={`/dashboard/update-route/${row.id}`} style={{ textDecoration: "none" }}>
                                                <IconButton color="primary" aria-label="edit">
                                                    <EditIcon />
                                                </IconButton>
                                            </Link>
                                        </AuthRequired>
                                        <AuthRequired permissions={['deleteRoute']} type="button">
                                            <IconButton
                                                color="secondary"
                                                aria-label="delete"
                                                onClick={() => handleDelete(row.id, row.name)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </AuthRequired>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={ROWS_PER_PAGE}
                component="div"
                count={query?.data?.total || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default RouteTable;
