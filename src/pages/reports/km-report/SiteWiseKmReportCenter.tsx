import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns';

import { useLimits } from '@/hooks/use-sitewise-limit';
import { RenderCell } from '../../../utils/RenderCell';
import { getMonthlyKmReport } from 'src/Services/MonthlyKmReportService';
import { getDatesInRange, RangeDateList } from 'src/utils/Time';

interface ISiteWiseKmReportCenterProps {
    startDate: Date,
    endDate: Date
}

function SiteWiseKmReportCenter({ startDate, endDate }: ISiteWiseKmReportCenterProps) {
    const [data, setData] = useState<any[]>([]);
    const [header, setHeader] = useState<any[]>([]);

    const [limits, setLimits] = useLimits()

    // generate headers for given date range
    const generateReportHeaders = useCallback((dateRange: RangeDateList) => {
        const headers: any[] = [
            { headerName: "Center", field: "center", key: 'center', width: 120, editable: true },
            { headerName: "Limit", field: "limit", width: 120, editable: true },
            { headerName: "Total Kms", field: "totalKms", key: 'totalKms', width: 120, editable: true },
            { headerName: "No. of Buses", field: "noOfBuses", key: 'noOfBuses', width: 120, editable: true },
            { headerName: "Km / Bus", field: "avgKms", key: 'avgKms', width: 120, editable: true },
        ]

        dateRange.forEach(({ date }: any) => {
            headers.push({
                key: date,
                headerName: date || "NA",
                field: date,
                width: 120,
                renderCell: RenderCell,
            });
        });

        return headers;
    }, [])


    useEffect(() => {
        setHeader([]);
        setData([]);

            getMonthlyKmReport(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'))
            .then(data => {
                const { result, vehicleCount } = data;


                const dateRange = getDatesInRange(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));

                const tableColumns = generateReportHeaders(dateRange);
                setHeader(tableColumns);


                // object to store total. ( center: 'Total' , mock value to display total in center column, last row )
                const totals = { id: 'totals', totalKms: 0, noOfBuses: 0, avgKms: 0, center: 'Total' } as any;

                const dayNames = { id: 'dayName', center: 'Day' } as any;

                // populate day names against each date and default total, i.e 0
                dateRange.forEach(({ date, day }: any) => {
                    totals[date]! = 0;
                    dayNames[date] = day;
                });




                const centerMap = new Map();
                // put all date data to single object against each center
                result?.forEach(({ date, kms, center_id }: any) => {
                    if (centerMap.has(center_id)) {
                        centerMap.get(center_id)[date] = kms || 0;
                    } else {
                        centerMap.set(center_id, { [date]: kms || 0, limit: limits[center_id] || 0, editable: true })
                    }
                    (totals as any)[date] = ((totals as any)[date] || 0) + kms || 0;
                });

                // attach additional data to each center row
                vehicleCount.forEach(({ centerId, busesCount, centerName }: any) => {
                    if (centerMap.has(centerId)) {
                        const row = centerMap.get(centerId);

                        const centerTotal = Object.keys(totals).reduce((sum, key) => {
                            if (!['center', 'id', 'noOfBuses', 'avgKms', 'bus', 'center', 'totalKms', 'centerId'].includes(key)) {
                                sum += row[key] ?? 0;
                            }
                            return sum;
                        }, 0)

                        row['id'] = centerId;
                        row['center'] = centerName;
                        row['totalKms'] = centerTotal;


                        row['noOfBuses'] = busesCount > -1 ? busesCount : "N/A";
                        totals['noOfBuses'] += busesCount ?? 0;
                        totals['totalKms'] += centerTotal ?? 0;

                        const average = centerTotal / busesCount;
                        row['avgKms'] = average;
                        totals['avgKms'] += average;

                    }
                });

                const _data = Array.from(centerMap.values());
                setData([
                    dayNames,
                    ..._data,
                    totals
                ]);

            })
            .catch(error => {
                console.error("Error fetching user:", error);
            });

    }, [startDate, endDate, generateReportHeaders]);


    // update center limit and store in localstorage
    const processRowUpdate = (newRow: any) => {
        const { id, limit } = newRow;
        const updatedLimits = { ...limits, [id]: limit };
        setLimits(updatedLimits);
        return newRow
    };

    const getRowClassName = (params: any) => {
        if (params.id === 'totals') {
            return 'sum-row';
        }

        return ''
    };

    const getColumnsClassName = (params: any) => {
        const { field, id, value } = params
        // highlight summary columns
        if (['center', 'limit', 'totalKms', 'noOfBuses', 'avgKms'].includes(field)) {
            return 'sum-row';
        }

        if (['totals', 'dayName'].includes(id)) {
            return '';
        }

        const limit = (+limits[id]) || 0;
        if (!isNaN(limit) && limit != 0 && value >= limit) {
            return 'highlight'
        }
        return '';
    };

    return (
        <DataGrid
            style={{ padding: "0px 15px" }}
            rows={data}
            columns={header}
            isCellEditable={(params: any) => { return (params.field === "limit" && !['totals', 'dayName'].includes(params?.id)) }}
            slots={{ toolbar: GridToolbar }}
            getRowClassName={getRowClassName}
            editMode="cell"
            processRowUpdate={processRowUpdate}
            getCellClassName={getColumnsClassName}
        />
    )
}

export default SiteWiseKmReportCenter