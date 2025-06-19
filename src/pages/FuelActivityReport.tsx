import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { getDatesInRange } from '../utils/Time';
import { getFuelActivityReport } from '../Services/FuelActivityReportService';
import { Typography } from '@mui/material';
import DateRange from '../utils/DateRange';
import '../utils/highlight.css'; // Import the CSS file
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useTheme } from "@mui/material";
import '../utils/highlight.css'
import { RenderCell } from '../utils/RenderCell';

export default function FuelActivityReport() {
    const theme = useTheme();
    const [data, setData] = useState<any[]>([]);
    const [header, setHeader] = useState<any[]>([]);
    const [type, setType] = useState<string>("fuelingStation");
    const [toggleViewSwitch, updateToggle] = useState(false)
    const [toggleViewSwitchContext, updateToggleContext] = useState(false)
    const [context, setContext] = useState<string>("amount");
    const currentDate = new Date();
    const startDate = startOfMonth(currentDate)
    const endDate = endOfMonth(currentDate)
    const [selectionRange, setSelectionRange] = useState({
        startDate,
        endDate,
        key: 'selection',
    });

    const [dataToHighlight, setDataToHighlight] = useState<number>(() => {
        const savedData = localStorage.getItem('dataToHighlight');
        return savedData ? JSON.parse(savedData) : "";
    });

    useEffect(() => {
        const isFuelingStation = !toggleViewSwitch;
        isFuelingStation ? setType("fuelingStation") : setType("center")
        !toggleViewSwitchContext ? setContext("amount") : setContext("quantity")
        getFuelActivityReport(format(selectionRange.startDate, 'yyyy-MM-dd'), format(selectionRange.endDate, 'yyyy-MM-dd'), type)
            .then(data => {
                const { result } = data;
                const _header = result.map((item: any) => ({
                    headerName: (isFuelingStation ? item?.FuelingStation?.name : item?.Center?.name) || "Demo",
                    field: isFuelingStation ? item?.FuelingStation?.id : item?.Center?.id,
                    width: 120,
                    renderCell: RenderCell
                }));
                setHeader([
                    { headerName: "Date", field: "id", width: 120 },
                    { headerName: "Day", field: "day", width: 120 },
                    ..._header,
                    { headerName: "Total", field: "rowSum", width: 140, renderCell: RenderCell },
                ]);
                const dateRange = getDatesInRange(format(selectionRange.startDate, 'yyyy-MM-dd'), format(selectionRange.endDate, 'yyyy-MM-dd'));
                const dateToMap = {} as any;
                const _temp = _header.reduce((prev: any, current: any) => {
                    prev[current.field] = " - ";
                    return prev;
                }, {});

                dateRange.forEach(({ date, day }) => {
                    dateToMap[date] = { id: date, day, rowSum: 0, ..._temp };
                });

                const total: any = { id: "Total Kms", rowSum: 0 }
                // const TotalSum: any = { headerName: "Total", field: "rowSum", width: 140, }
                result.forEach((stat: any) => {
                    if (context === "quantity") {
                        dateToMap[stat.date][isFuelingStation ? stat?.FuelingStation?.id : stat?.Center?.id] = stat.fuelQuantity;
                        dateToMap[stat.date]["rowSum"] += stat.fuelQuantity;
                        if (total[isFuelingStation ? stat?.FuelingStation?.id : stat?.Center?.id]) {
                            total[isFuelingStation ? stat?.FuelingStation?.id : stat?.Center?.id] += stat.fuelQuantity;
                        }
                        else {
                            total[isFuelingStation ? stat?.FuelingStation?.id : stat?.Center?.id] = stat.fuelQuantity || 0
                        }
                        total["rowSum"] += stat.fuelQuantity;

                    } else {
                        dateToMap[stat.date][isFuelingStation ? stat?.FuelingStation?.id : stat?.Center?.id] = stat.fuelPrice.toFixed(2);
                        dateToMap[stat.date]["rowSum"] += stat.fuelPrice;
                        if (total[isFuelingStation ? stat?.FuelingStation?.id : stat?.Center?.id]) {
                            total[isFuelingStation ? stat?.FuelingStation?.id : stat?.Center?.id] += stat.fuelPrice;
                        }
                        else {
                            total[isFuelingStation ? stat?.FuelingStation?.id : stat?.Center?.id] = stat.fuelPrice || 0
                        }
                        total["rowSum"] += stat.fuelPrice;
                    }
                });

                const _data = Array.from(Object.values(dateToMap))
                setData([total, ..._data]);
            })
            .catch(error => {
                console.error("Error fetching user:", error);
            });
    }, [type, context, selectionRange, toggleViewSwitch, toggleViewSwitchContext]);

    useEffect(() => {
        localStorage.setItem('dataToHighlight', JSON.stringify(dataToHighlight));
    }, [dataToHighlight]);

    const getCellClassName = (params: any) => {
        if (params.id === 'Total Kms') {
            return 'sum-row';
        }
        if (typeof params.value === 'number' && params.id !== 'Total Kms' && params.field !== 'day' && params.field !== 'rowSum' && params.value > dataToHighlight) {
            return 'highlight';
        }

        return '';
    };

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
                    Fuel Activity
                </Typography>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className='align-toggles'>
                        <div className="toggle-switch">
                            <label className="toggle">
                                <input
                                    id="toggleViewSwitch"
                                    type="checkbox"
                                    checked={toggleViewSwitch}
                                    onChange={() => {
                                        updateToggle(!toggleViewSwitch);
                                    }}
                                />
                                <span className="slider"></span>
                                <span
                                    className="labels"
                                    data-on="Fuel"
                                    data-off="center"
                                ></span>
                            </label>
                        </div>
                        <div className="toggle-switch">
                            <label className="toggle">
                                <input
                                    id="toggleViewSwitchContext"
                                    type="checkbox"
                                    checked={toggleViewSwitchContext}
                                    onChange={() => updateToggleContext(!toggleViewSwitchContext)}
                                />
                                <span className="slider"></span>
                                <span
                                    className="labels"
                                    data-on="Amount"
                                    data-off="Quantity"
                                ></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <DateRange selectionRange={selectionRange} setSelectionRange={setSelectionRange} limit={dataToHighlight} setLimit={setDataToHighlight} includeLimit={true} />
            <div style={{ flex: 1, minHeight: 0, width: '100%', margin: "20px 0px" }}>
                <DataGrid
                    style={{ padding: "0px 15px" }}
                    rows={data}
                    columns={header}
                    slots={{ toolbar: GridToolbar }}
                    getCellClassName={getCellClassName}
                />
            </div>
        </div>
    );
}
