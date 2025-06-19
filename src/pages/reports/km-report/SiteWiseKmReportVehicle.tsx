import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { getDailyKmReport } from 'src/Services/DailyKmReportService';

import { format } from 'date-fns';
import { RenderCell } from 'src/utils/RenderCell';
import { getDatesInRange, RangeDateList } from 'src/utils/Time';

interface ISiteWiseKmReportVehicleProps {
  startDate: Date,
  endDate: Date,
  limit: number,
}

function SiteWiseKmReportVehicle({ startDate, endDate, limit }: ISiteWiseKmReportVehicleProps) {
  const [data, setData] = useState<any[]>([]);
  const [header, setHeader] = useState<any[]>([]);

  const getRowClassName = (params: any) => {
    if (['totals', 'dayName'].includes(params.id)) {
      return 'sum-row';
    }

    return ''
  };

  const getColumnsClassName = (params: any) => {
    const { field, id, value } = params
    // highlight summary columns
    if (['center', 'vehicle'].includes(field)) {
      return 'sum-row';
    }

    if (['totals', 'dayName'].includes(id)) {
      return '';
    }

    const _limit = +limit || 0;
    if (!isNaN(_limit) && _limit != 0 && value >= _limit) {
      return 'highlight'
    }
    return '';
  };

  const generateColumnHeaders = useCallback((dateRange: RangeDateList) => {
    const _headers: any[] = [
      { headerName: "Vehicle", field: "vehicle", width: 120 },
      { headerName: "Center", field: "center", width: 120 },
    ];

    dateRange.forEach(({ date }) => {
      _headers.push({
        key: date,
        headerName: date,
        field: date,
        width: 120,
        renderCell: RenderCell,
      })
    });
    return _headers;
  }, [])

  useEffect(() => {
    setHeader([]);
    setData([]);
    getDailyKmReport(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'))
      .then(data => {
        const { dailyActivity } = data;

        const dateRange = getDatesInRange(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));

        const columnsHeaders = generateColumnHeaders(dateRange);

        setHeader(columnsHeaders);

        const vehicleMap = new Map();
        // ( vehicle: 'Day' , mock value to display as heading in vehicle column)
        const dayNames = { id: 'dayName', vehicle: 'Day' } as any;
        const totals: any = { id: 'totals', vehicle: "Totals" }

        // populate day names against each date and default total, i.e 0
        dateRange.forEach(({ date, day }: any) => {
          totals[date]! = 0;
          dayNames[date] = day;
        });

        // put vehicle all dates data into single vehicle object
        dailyActivity.forEach(({ registrationNumber, kms, centerName, date }: any) => {
          if (vehicleMap.has(registrationNumber)) {
            vehicleMap.get(registrationNumber)[date] = kms || 0;
          } else {
            vehicleMap.set(registrationNumber, { id: registrationNumber, vehicle: registrationNumber, center: centerName, [date]: kms ?? 0 })
          }

          // store total against that date
          (totals as any)[date] = ((totals as any)[date] || 0) + kms || 0;
        });

        const _data = Array.from(vehicleMap.values());
        setData([dayNames, totals, ..._data]);
      })
      .catch(error => {
        console.error("Error fetching user:", error);
        alert("Failed!!")
      });

  }, [startDate, endDate]);



  return (
    <DataGrid
      style={{ padding: "0px 15px" }}
      rows={data}
      columns={header}
      slots={{ toolbar: GridToolbar }}
      getCellClassName={getColumnsClassName}
      getRowClassName={getRowClassName}
    />
  )
}

export default SiteWiseKmReportVehicle