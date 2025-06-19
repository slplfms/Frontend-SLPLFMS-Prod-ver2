import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getFuels } from '../Services/FuelManageService';
import FuelManagementTable from "../components/FuelManagement/FuelManagementTable";
import { FuelHeader } from "../components/FuelManagement/FuelHeader";
import { useSelection } from "../hooks/useSelection";
import { DEFAULT_PAGE_LIMIT } from 'src/constants/rowsPerPage';


export default function ManageFuel() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMIT);

  const [activities, setActivities] = useState<any[]>([]);

  const rowIds = React.useMemo(() => {
    return activities.map((activity: any) => activity.id);
  }, [activities]);

  const query = useQuery(['getFuels', page, rowsPerPage], () => getFuels(page + 1, rowsPerPage), {
    keepPreviousData: true,
  });

  const { selectAll, deselectAll, selectOne, deselectOne, selected } =
  useSelection(rowIds);

  const selectedSome =
  (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < activities.length;
const selectedAll =
  activities.length > 0 && selected?.size === activities.length;

  useEffect(() => {
    if (query?.data?.fuelActivities) {
      setActivities(query.data.fuelActivities);
    }
  }, [query]);

  return (
    <>
      <FuelHeader data={activities}  reloadData={()=> query.refetch()} {...{selected, selectedSome, selectedAll}}/>
      <FuelManagementTable
        query={query}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        selection={{selectAll, deselectAll, selectOne, deselectOne, selected, selectedSome, selectedAll}}
      />
    </>
  );
}
