import { UserHeader } from "../components/user/userHeader";
import { UsersTable } from "../components/user/userTable";
import { useState } from "react";
import { useQuery } from "react-query";
import { getUsers } from "../Services/UserService";
import { FilterItem } from "../components/common/filter-items";
import { DEFAULT_PAGE_LIMIT, ROWS_PER_PAGE } from "src/constants/rowsPerPage";

export default function Users() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMIT);
  const [searchStr, setSearchStr] = useState('')

  const query = useQuery(
    ['getUsers', page, rowsPerPage, searchStr],
    () => getUsers(page + 1, rowsPerPage, searchStr),
    {
      keepPreviousData: true,
    }
  );

  return (
    <>
      <UserHeader data={query?.data?.users}  reloadData={()=> query.refetch()}/>
      <FilterItem name='user (name, employee id , center name , vehicle)' onChange={setSearchStr} />
      <UsersTable
        query={query}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE}
      />
    </>
  );
}
