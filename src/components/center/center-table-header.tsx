import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ImportExport } from "@mui/icons-material";
import { Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import AuthRequired from "../auth/auth-required";
import { CSVLink } from "react-csv";
import CsvImportComponent from "../ImportCsvFileWrapper/ImportCsvFileWrapper";
import { centerFields, csvType } from "../../constants/importCsv";


const header = [
  { label: 'Name', key: 'name' },
  { label: 'Trust Name', key: 'trustName' },
  { label: 'Daily Average Kilometers', key: 'dailyAvgKm' },
  { label: 'Address', key: 'address' },
];

export function CenterHeader({ data, reloadData }: any): React.ReactElement {
  const theme = useTheme();
  const navigate = useNavigate();

  const func = () => {
    navigate("/dashboard/add-center");
  };

  return (
    <>
      <Box>
        <Grid container alignItems="center" justifyContent="space-between" alignContent='center'>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h1"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: '600',
                fontSize: '1.6rem',
                margin: "20px 0px",
                '@media (min-width:600px)': {
                  fontSize: '2rem',
                },
              }}
            >
              Center Management
            </Typography>
          </Grid>
          <Grid item>
            <AuthRequired permissions={['createCenter']} type="button">
              <Button variant="outlined" startIcon={<AddIcon />} onClick={func} sx={{
                borderRadius: "7px",
                fontSize: '0.8rem',
                padding: "7px 11px",
                display: "flex",
                justifyContent: "center",
                '@media (min-width:600px)': {
                  fontSize: '1rem',
                },
                '&:hover': {
                  backgroundColor: "#635BFF",
                  borderColor: '#bdbdbd',
                  color: "#fff"
                },
              }}>
                Add Center
              </Button>
            </AuthRequired>
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-start" spacing={2} marginTop={2}>
          <Grid item>
            <CsvImportComponent type={csvType.CENTER} headers={centerFields} onComplete={reloadData}/>
          </Grid>
          <Grid item>
          <AuthRequired type='button' permissions={['exportCsv']}>
            <CSVLink data={data || []} headers={header} style={{ color: "#000", textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ImportExport />
                <Typography variant="subtitle1">Export</Typography>
              </div>
            </CSVLink>
            </AuthRequired>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
