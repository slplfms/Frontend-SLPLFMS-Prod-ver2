import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import type { SxProps } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { commaDecimalFormatter } from "../../utils/number";
import dayjs from "dayjs";

export interface DashboardStatsProps {
  data?: any[];
  sx?: SxProps;
  title: string;
  headers: { key: string; title: string, isUrl?: boolean }[];
}

function getNestedProperty(obj: any, key: string) {
  if (!obj || !key || !key.split) return null;

  const isCurrency = key.startsWith("$");
  const isNumeric = key.startsWith("#");
  const isDate = key.startsWith("@");

  key = key.replace(/^\$|^#|^@/, ''); // Remove leading $, #, or @

  const value = key.split(".").reduce((acc, part) => acc?.[part], obj);

  if (isCurrency) {
    return isNaN(+value) ? 0 : commaDecimalFormatter(value);
  } else if (isNumeric) {
    return isNaN(+value) ? value : Number(value).toFixed(2);
  } else if (isDate) {
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : dayjs(date).format('MMM D, YYYY h:mm A')
  } else {
    return value;
  }
}


export function DashboardStatsTable({
  data = [],
  headers = [],
  title,
  sx,
}: DashboardStatsProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title={title} />
      <Divider />
      <Box sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              {headers.map((h) => (
                <TableCell key={h.title}>{h.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          {data.length > 0 && (
            <TableBody>
              {Array.isArray(data) && data.length > 0
                ? data?.map((row, index) => {
                  return (
                    <TableRow hover key={`${title}-${index}`}>
                      <TableCell>{index + 1}</TableCell>
                      {headers.map((h) => {
                        return (
                          <TableCell key={`${title}-${h.key}-${index}`}>
                            {
                              h?.isUrl ? <>
                                <a
                                  href={`${import.meta.env.VITE_STORAGE_URL ||
                                    "https://storageslplfmsprod.blob.core.windows.net/"
                                    }${getNestedProperty(row, h.key)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Receipt
                                </a></> :
                                getNestedProperty(row, h.key)
                            }
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
                : null}
            </TableBody>
          )}
        </Table>
      </Box>
    </Card>
  );
}
