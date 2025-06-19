import { TableCell, TableRow, TextField } from "@mui/material";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { updateActivityList } from "../../Services/DailyKmService";
import { safeSubtraction } from "../../utils/number";

interface IFormItemProps {
  vehicleId: string | null;
  idx: number;
  registrationNumber: string;
  odometer: number;
  odometerStart: number;
  activityId: any;
  date: string;
  onUpdate: (data: any) => void;
}

function AdminDailyKmItem({
  vehicleId,
  idx,
  registrationNumber,
  odometer,
  odometerStart,
  activityId,
  date,
  onUpdate,
}: IFormItemProps) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({ odometer });
  const isUpdated = useRef(false);

  const handleChange = (field: "odometer" | "quantity", value: string) => {
    const parsed = parseInt(value);
    isUpdated.current = true;
    setValue((pre) => ({ ...pre, [field]: isNaN(parsed) ? value : parsed }));
  };

  const saveActivity = useCallback(
    function (newData: any) {
      if (loading || !newData.odometer) return;

      setLoading(true);
      toast.info("Updating...");

      updateActivityList({
        vehicleId,
        activityId,
        odometer: newData.odometer,
        date,
      })
        .then(({ data }) => {
          onUpdate && onUpdate(data.activity);
          toast.success('Saved')
        })
        .catch((err) => {
          console.log(err);
          toast.warning(err?.response?.data?.message || "Something went wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [activityId, date]
  );

  // Define the debounced saveActivity function
  const debouncedSaveActivity = useCallback(
    debounce((d) => {
      saveActivity(d);
    }, 1500), // 1500ms debounce delay, adjust as needed
    [activityId, date]
  );

  useEffect(() => {
    if (isUpdated.current) {
      debouncedSaveActivity({ ...value, activityId });
    }
  }, [value]);

  return (
    <TableRow hover key={vehicleId} selected={!!activityId}>
      <TableCell>{idx + 1}</TableCell>
      <TableCell>{registrationNumber}</TableCell>
      <TableCell sx={{ pb: 0, pt: "auto" }}>
        <TextField
          value={value.odometer}
          sx={{ mt: "auto", pb: 0, mb: "-5px" }}
          variant="standard"
          type="number"
          onChange={(e) => {
            handleChange("odometer", e.target.value);
          }}
          inputProps={{ min: 0 }}
          disabled={loading}
        />
      </TableCell>
      <TableCell>{safeSubtraction(odometer, odometerStart)} Km</TableCell>
    </TableRow>
  );
}

export default AdminDailyKmItem;
