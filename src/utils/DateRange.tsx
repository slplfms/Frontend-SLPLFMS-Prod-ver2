import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Collapse, Button, TextField } from '@mui/material';
import '../utils/highlight.css';
import { format } from 'date-fns';

const DateRangeComponent = ({ selectionRange, setSelectionRange, limit, setLimit, includeLimit = false }: any) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = (ranges: any) => {
    setSelectionRange(ranges.selection);
    setShowPicker(!showPicker);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  return (
    <>
      <div className="date-range-container" style={{ display: "flex", alignItems: 'center', justifyContent: "space-between", gap: "10px" }}>
        <div style={{ position: "relative" }}>
          <Button
            sx={{
              fontSize: {
                xs: '11px',
                sm: '14px',
              },
              marginBottom: '5px'
            }}
            onClick={togglePicker}
            variant="outlined"
            color="primary"
          >
            {`${format(selectionRange.startDate, 'yyyy-MM-dd')} - ${format(selectionRange.endDate, 'yyyy-MM-dd')}`}
          </Button>
          <Collapse in={showPicker} style={{ position: 'absolute', zIndex: 10 }}>
            <div className='date-range-box'>
              <DateRangePicker
                ranges={[selectionRange]}
                onChange={handleSelect}
                preventSnapRefocus={true}
                moveRangeOnFirstSelection={false}
              />
            </div>
          </Collapse>
        </div>
        {includeLimit &&
          <TextField
            value={limit}
            variant="outlined"
            label="Limit"
            InputLabelProps={{ shrink: true }}
            type="number"
            placeholder='Enter limit here'
            onChange={(e) => { setLimit(e.target.value) }}
          />}
      </div>
    </>
  );
};

export default DateRangeComponent;
