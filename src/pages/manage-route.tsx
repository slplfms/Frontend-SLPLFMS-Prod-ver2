import { useState } from 'react';
import { useQuery } from 'react-query';
import { getRoutes } from '../Services/routeService'; 
import { RouteHeader } from "../components/manageRoute/RouteHeader";
import RouteTable from "../components/manageRoute/RouteTable";
import { FilterItem } from "../components/common/filter-items";
import { DEFAULT_PAGE_LIMIT } from 'src/constants/rowsPerPage';

function ManageRoute() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMIT);
  const [searchStr, setSearchStr] = useState('')

  const query = useQuery(
    ["getRoutes", page, rowsPerPage, searchStr],
    () => getRoutes(page + 1, rowsPerPage, searchStr), 
    {
      keepPreviousData: true,
    }
  );

  return (
    <div>
      <RouteHeader data={query?.data?.routes}  reloadData={()=> query.refetch()}/>
      <FilterItem name="route (name)" onChange={setSearchStr}/>
      <RouteTable 
        query={query} 
        page={page ||0} 
        setPage={setPage} 
        rowsPerPage={rowsPerPage || 0} 
        setRowsPerPage={setRowsPerPage} 
      />
    </div>
  );
}

export default ManageRoute;
