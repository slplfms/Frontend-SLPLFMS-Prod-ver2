import { useState } from "react";
import { useQuery } from "react-query";
import { FuelStationHeader } from "../components/FuelStation/fuelStationHeader";
import FuelStationTable from "../components/FuelStation/fuelStation_table";
import { getFuelStations } from "../Services/fuelStationService";
import { FilterItem } from "../components/common/filter-items";
import { DEFAULT_PAGE_LIMIT } from "src/constants/rowsPerPage";

function FuelStation() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMIT);
  const [searchStr, setSearchStr] = useState('')

  const query = useQuery(
    ["getFuelStations", page, rowsPerPage, searchStr],
    () => getFuelStations(page + 1, rowsPerPage, searchStr), 
    {
      keepPreviousData: true,
    }
  );

  return (
    <>
      <FuelStationHeader data={query?.data?.fuelingStations} reloadData={()=> query.refetch()}/>
      <FilterItem name="fuel station (name)" onChange={setSearchStr}/>
      <FuelStationTable
        query={query}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
    </>
  );
}

export default FuelStation;
