import { useState } from "react";
import { useQuery } from "react-query";
import { FuelReceiptHeader } from "../components/fuel-receipt/fuel-receipt-header";
import FuelReceiptTable from "../components/fuel-receipt/fuel-receipt-table";
import { getReceipts } from "../Services/fuel-receipt";
import { DEFAULT_PAGE_LIMIT } from "src/constants/rowsPerPage";

function FuelReceipt() {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMIT);

  const query = useQuery(
    ["getReceipts", page, rowsPerPage],
    () => getReceipts(page + 1, rowsPerPage),
    {
      keepPreviousData: true,
    }
  );

  return (
    <>
      <FuelReceiptHeader data={query?.data?.data?.fuelReceipts} reloadData={()=>query.refetch()}/>
      <FuelReceiptTable page={page} setPage={setPage} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} query={query}/>
    </>
  );
}

export default FuelReceipt;
