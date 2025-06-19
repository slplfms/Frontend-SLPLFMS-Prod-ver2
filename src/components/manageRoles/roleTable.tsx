import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { Card, Box } from '@mui/material';
import { useQuery } from 'react-query';
import { getRoles, deleteRole } from '../../Services/roleService';
import { toast } from 'sonner';
import AuthRequired from '../auth/auth-required';
import { DEFAULT_PAGE_LIMIT, ROWS_PER_PAGE } from 'src/constants/rowsPerPage';

interface Role {
    id: number;
    name: string;
    description: string;
}

const RoleTable: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMIT);

    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const query = useQuery(
        ['roles', page, rowsPerPage],
        () => getRoles(page + 1, rowsPerPage),
        {
            keepPreviousData: true,
        }
    );

    const handleDelete = async (id: any, name: string) => {
        try {
            await deleteRole(id);
            toast.success(`Role "${name}" Deleted Successfully`);
            query.refetch();
        } catch (error) {
            toast.error('Failed to delete role!');
        }
    };

    return (
        <Card>
            <Box sx={{ overflowX: 'auto' }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Role Name</TableCell>
                                <TableCell>Role Description</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {query.data?.roles && query.data?.roles?.map((role: Role, idx: number) => (
                                <TableRow key={role.id}>
                                    <TableCell >{idx+1}</TableCell>
                                    <TableCell>{role.name}</TableCell>
                                    <TableCell>{role.description}</TableCell>
                                    <TableCell>
                                        <div style={{ display: 'flex' }}>
                                            <AuthRequired permissions={['updateRole']} type='button'>
                                                <Link to={`/dashboard/update-role/${role.id}`} style={{ textDecoration: 'none' }}>
                                                    <IconButton color="primary" aria-label="edit">
                                                        <EditIcon />
                                                    </IconButton>
                                                </Link>
                                            </AuthRequired>
                                            <AuthRequired permissions={['deleteRole']} type='button'>
                                                <IconButton
                                                    color="secondary"
                                                    aria-label="delete"
                                                    onClick={() => handleDelete(role.id, role.name)}
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
                    count={query.data?.total || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </Card>
    );
};

export default RoleTable;
