import { Typography, useTheme } from '@mui/material';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useState } from 'react'
import DateRangeComponent from 'src/utils/DateRange';
import LeakageReportFuel from './LeakageReportFuel';
import LeakageReportCenter from './LeakageReportCenter';

function LeakageReport() {
    const theme = useTheme();

    const [toggleViewSwitch, updateToggle] = useState(false);
    const [isPriceView, setIsPriceView] = useState(true);

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
                    Leakage Report
                </Typography>
                <div className="toggle-switch">
                    <label className="toggle">
                        <input
                            id="toggleViewSwitch1"
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
                            data-off="Center"
                        ></span>
                    </label>

                </div>
                {
                    toggleViewSwitch &&
                    <div className="toggle-switch">
                        <label className="toggle">
                            <input
                                id="toggleViewSwitchContext"
                                type="checkbox"
                                checked={isPriceView}
                                onChange={() => setIsPriceView(!isPriceView)}
                            />
                            <span className="slider"></span>
                            <span
                                className="labels"
                                data-on="Quantity"
                                data-off="Amount"
                            ></span>
                        </label>
                    </div>

                }
            </div>
            <div>
                <DateRangeComponent selectionRange={selectionRange} setSelectionRange={setSelectionRange} /> :
            </div>

            <div style={{ width: '100%', margin: "20px 0px", flex: 1, minHeight: 0 }}>
                {!toggleViewSwitch ?
                    <LeakageReportFuel startDate={selectionRange.startDate} endDate={selectionRange.endDate} /> :
                    <LeakageReportCenter isPriceView={isPriceView} startDate={selectionRange.startDate} endDate={selectionRange.endDate} />
                }
            </div>
        </div>
    )
}

export default LeakageReport