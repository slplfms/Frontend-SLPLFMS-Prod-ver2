import React, { useState } from "react";
import { useQuery } from "react-query";
import { getVehicles } from "../Services/vehicle-service";
import { VehicleHeader } from "../components/vehicle/vehicle-table-header";
import { FilterItem } from "../components/common/filter-items";
import { VehicleTable } from "../components/vehicle/vehicle-table";
import { DEFAULT_PAGE_LIMIT } from "src/constants/rowsPerPage";

export default function ManageVehicle() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_PAGE_LIMIT);
  const [searchStr, setSearchStr] = useState("");

  const query = useQuery(
    ["getVehicles", page, rowsPerPage, searchStr],
    () => getVehicles(page + 1, rowsPerPage, searchStr),
    {
      keepPreviousData: true,
    }
  );

  return (
    <>
      <VehicleHeader data={query?.data?.vehicles}  reloadData={()=> query.refetch()}/>
      <FilterItem name="vehicle (Registration number, center name, seater)" onChange={setSearchStr} />

      <VehicleTable
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        query={query}
      />
    </>
  );
}
