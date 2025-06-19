import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import '../../../utils/highlight.css'
import { useTheme } from "@mui/material";
import { endOfMonth, startOfMonth } from 'date-fns';
import DateRangeComponent from 'src/utils/DateRange';
import SiteWiseKmReportVehicle from './SiteWiseKmReportVehicle';
import SiteWiseKmReportCenter from './SiteWiseKmReportCenter';



function SiteWiseKmReport() {
    const theme = useTheme();

    const [vehicleReportLimit, setVehicleReportLimit] = useState<number>(() => {
      const savedData = localStorage.getItem('daily-limit');
      return savedData ? JSON.parse(savedData) : 0;
    });
  
    useEffect(() => {
      localStorage.setItem('daily-limit', JSON.stringify(vehicleReportLimit));
    }, [vehicleReportLimit]);
  
    const [type, setType] = useState(false)
  
    const [selectionRange, setSelectionRange] = useState(() => {
      const currentDate = new Date();
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);
  
      return {
        startDate,
        endDate,
        key: 'selection',
      }
    });
  
  
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className='headings-toggle'>
          <Typography
            variant="h1"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "600",
              fontSize: "1.6rem",
              margin: "20px 0px",
              "@media (min-width:600px)": {
                fontSize: "2rem",
              },
            }}
          >
            {type ? "Daily Km Report" : "SiteWise Km Report"}
          </Typography>
          <div className='align-toggles'>
            <div className="toggle-switch">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={type}
                  onChange={() => {
                    setType(!type);
                  }}
                />
                <span className="slider"></span>
                <span
                  className="labels"
                  data-on="Center"
                  data-off="Vehicle"
                ></span>
              </label>
            </div>
          </div>
        </div>
        <div style={{ margin: "10px 0px" }}>
          <DateRangeComponent selectionRange={selectionRange} setSelectionRange={setSelectionRange} limit={vehicleReportLimit} setLimit={setVehicleReportLimit} includeLimit={type} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          {type ? (
            <SiteWiseKmReportVehicle limit={vehicleReportLimit} startDate={selectionRange.startDate} endDate={selectionRange.endDate} />
          ) : (
            <SiteWiseKmReportCenter startDate={selectionRange.startDate} endDate={selectionRange.endDate} />
          )}
        </div>
      </div>
    );
}

export default SiteWiseKmReport