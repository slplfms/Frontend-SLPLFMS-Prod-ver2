import React from "react";
import { CenterHeader } from "../components/center/center-table-header";
import { useQuery } from "react-query";
import { CenterTable } from "../components/center/center-table";
import { getCenters } from "../Services/center-service";
import { FilterItem } from "../components/common/filter-items";
import { DEFAULT_PAGE_LIMIT, ROWS_PER_PAGE } from "src/constants/rowsPerPage";

export default function ManageCenter() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_PAGE_LIMIT);
  const [searchStr, setSearchStr] = React.useState('')

  const query = useQuery(
    ['getCenters', page, rowsPerPage,searchStr],
    () => getCenters(page + 1, rowsPerPage, searchStr),
    {
      keepPreviousData: true,
    }
  );

  return (
    <>
      <CenterHeader data={query?.data?.centers}  reloadData={()=> query.refetch()}/>
      <FilterItem name="center (name)" onChange={setSearchStr}/>
      <CenterTable
        page={page}
        setPage={setPage}
        rowsPerPageOptions={ROWS_PER_PAGE}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        query={query}
      />
    </>
  );
}
