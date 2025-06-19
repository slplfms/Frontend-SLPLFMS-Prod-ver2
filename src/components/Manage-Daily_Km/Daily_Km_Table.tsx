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
  Checkbox,
  Badge,
} from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { toast } from "sonner";
import AuthRequired from "../auth/auth-required";
import { deleteDailyKm } from "../../Services/DailyKmService";
import { ROWS_PER_PAGE } from "src/constants/rowsPerPage";

interface DailyKmTableProps {
  data: any[];
  page: number;
  setPage: (newPage: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (newRowsPerPage: number) => void;
  selection: any;
  reloadData: () => void;
  total: number;
}

const status: Record<string, any> = {
  0: { title: 'Pending', style: 'warning' },
  1: { title: 'Accepted', style: 'success' },
  2: { title: 'Declined', style: 'error' },
}

const Daily_Km_Table: React.FC<DailyKmTableProps> = ({
  data,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  selection,
  reloadData,
  total
}) => {
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const { selectAll, deselectAll, selectOne, deselectOne, selected, selectedSome, selectedAll } = selection;

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when changing rows per page
  };

  const handleDelete = async (id: string, date: string) => {
    try {
      await deleteDailyKm(id);
      toast.success(`Daily KM Record for "${date}" Deleted Successfully`);
      reloadData && reloadData();
    } catch (error) {
      toast.error("Some error Occurred");
      console.error("Error deleting daily KM record:", error);
    }
  };

  return (
    <Card>
      <Box sx={{ overflowX: "auto" }}>
        <Table>
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
              <TableCell>Vehicle</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Center</TableCell>
              <TableCell>Last Odometer</TableCell>
              <TableCell>Odometer</TableCell>
              <TableCell>Net Km</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: any) => {
              const isSelected = !!selected?.has(row.id);
              return (
                <TableRow hover key={row.id} selected={isSelected}>
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
                  <TableCell>{row.Vehicle?.registrationNumber}</TableCell>
                  <TableCell>{row.User?.name}</TableCell>
                  <TableCell>{row.Center?.name}</TableCell>
                  <TableCell>{row.odometerStart}</TableCell>
                  <TableCell>{row.odometer}</TableCell>
                  <TableCell>{row.odometer - row.odometerStart}</TableCell>
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
                  <TableCell>{dayjs(row.date).format("MMM D, YYYY")}</TableCell>
                  <TableCell>
                    <div style={{ display: "flex" }}>
                      <AuthRequired
                        permissions={["updateDailyActivity"]}
                        type="button"
                      >
                        <Link
                          to={`/dashboard/update-dailyKm/${row.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <IconButton color="primary" aria-label="edit">
                            <EditIcon />
                          </IconButton>
                        </Link>
                      </AuthRequired>
                      {row.id && (
                        <AuthRequired
                          permissions={["deleteDailyActivity"]}
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
      </Box>
      <TablePagination
        component="div"
        count={total || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE}
      />
    </Card>
  );
};

export default Daily_Km_Table;
