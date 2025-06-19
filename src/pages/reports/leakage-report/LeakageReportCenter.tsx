import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { useEffect, useState } from 'react'
import { getLeakageReportByCenter } from 'src/Services/LeakageReportService';
import { RenderCell } from 'src/utils/RenderCell';
import { getDatesInRange } from 'src/utils/Time';


interface ILeakageReportCenterProps {
    startDate: Date,
    endDate: Date,
    isPriceView: boolean
}

function LeakageReportCenter({ startDate, endDate, isPriceView }: ILeakageReportCenterProps) {
    const [header, setHeader] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);


    const getRowClassName = (params: any) => {
        if (params.id === 'totals') {
            return 'sum-row';
        }
        return '';
    };



    useEffect(() => {
        // get unique centers list
        const centerMap = (results as any[]).reduce((centers, item) => {
            const { center_id, name } = item;
            if (!centers[center_id]) {
                centers[center_id] = { center_id, name }
            }
            return centers;
        }, {});

        const _header = Object.values(centerMap).map(({ center_id, name }: any) => ({
            key: center_id,
            headerName: name || "N/A",
            field: center_id,
            renderCell: RenderCell,
            width: 120

        }));

        setHeader([
            { headerName: "Date", field: "date", key: "date" },
            { headerName: "Day", field: "day", key: "day" },
            ..._header,
            { headerName: "Total", field: "rowSum", width: 140, renderCell: RenderCell },
        ]);

        const dateRange = getDatesInRange(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));

        const total: any = { id: "totals", date: 'Total', rowSum: 0 };

        // store all center data against single date
        const dateMap = new Map()


        dateRange.forEach(({ date, day }) => {
            dateMap.set(date, { id: date, date, day, rowSum: 0 });
        });
        results.forEach((stat: any) => {
            const { date, center_id, amountDifference, differenceLtrs } = stat;

            const value = isPriceView ? amountDifference : differenceLtrs;

            if (dateMap.has(date)) {
                const row = dateMap.get(date);

                row[center_id] = value.toFixed(2);
                row["rowSum"] += value;

            }

            if (total[center_id]) {
                total[center_id] += value
            }
            else {
                total[center_id] = value || 0
            }

            total["rowSum"] += value

        });

        const _data = Array.from(dateMap.values())
        setData([total, ..._data]);
    }, [results, isPriceView])

    useEffect(() => {
        setHeader([]);
        setData([]);
        getLeakageReportByCenter(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'))
            .then(data => {
                const { result } = data;
                setResults(result)
            })

    }, [startDate, endDate])
    return (
        <DataGrid
            style={{ padding: "0px 15px" }}
            rows={data}
            columns={header}
            slots={{ toolbar: GridToolbar }}
            getRowClassName={getRowClassName}
        />
    )
}

export default LeakageReportCenter