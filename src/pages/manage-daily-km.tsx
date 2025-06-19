import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getDailyKms } from "../Services/DailyKmService";
import { Header_Daily_Km } from "../components/Manage-Daily_Km/Header_Daily-Km";
import Daily_Km_Table from "../components/Manage-Daily_Km/Daily_Km_Table";
import { useSelection } from "../hooks/useSelection";
import { DEFAULT_PAGE_LIMIT } from "src/constants/rowsPerPage";

export default function ManageDailyKm() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMIT);

  const [activities, setActivities] = useState<any[]>([]);

  const rowIds = React.useMemo(() => {
    return activities.map((activity: any) => activity.id);
  }, [activities]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } =
    useSelection(rowIds);

  const selectedSome =
    (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < activities.length;
  const selectedAll =
    activities.length > 0 && selected?.size === activities.length;

  const query = useQuery(
    ["getDailyKms", page, rowsPerPage],
    () => getDailyKms(page + 1, rowsPerPage, {}),
    {
      keepPreviousData: true,
    }
  );



  useEffect(() => {
    if (query?.data?.dailyActivities) {
      setActivities(query.data.dailyActivities);
    }
  }, [query]);

  return (
    <>
      <Header_Daily_Km
        data={query?.data?.dailyActivities}
        reloadData={() => query.refetch()}
        {...{selected, selectedSome, selectedAll}}
      />
      <Daily_Km_Table
        selection={{selectAll, deselectAll, selectOne, deselectOne, selected, selectedSome, selectedAll}}
        data={activities}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        reloadData={() => query.refetch()}
        total={query?.data?.total || 0}
      />
    </>
  );
}
