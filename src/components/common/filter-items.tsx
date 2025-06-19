import * as React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Search } from "@mui/icons-material";
import Card from "@mui/material/Card";
import _ from "lodash";

interface IFilterItemsProps {
  name: string;
  onChange: (value: string) => void;
}

export function FilterItem({
  name,
  onChange,
}: IFilterItemsProps): React.ReactElement {
  const [query, setQuery] = React.useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const debouncedSearch = React.useCallback(
    _.debounce((value) => {
      onChange && onChange(value);
    }, 500),
    []
  );

  React.useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <>
      <Card sx={{ p: 2, my: "25px" }}>
        <OutlinedInput
          onChange={handleSearch}
          defaultValue=""
          fullWidth
          placeholder={`Search ${name}`}
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
          sx={{ maxWidth: "500px" }}
        />
      </Card>
    </>
  );
}
