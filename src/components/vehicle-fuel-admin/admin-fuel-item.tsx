import { TableCell, TableRow, TextField } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { saveReceiptActivity } from "../../Services/fuel-receipt";
import { safeSubtraction } from "../../utils/number";
import { debounce } from "lodash";

interface IFormItemProps {
  vehicleId: string | null;
  idx: number;
  registrationNumber: string;
  expectedAvg: number;
  odometer: number;
  quantity: number;
  odometerStart: number;
  activityId: any;
  tankCapacity: number;
  receiptId: string;
  onUpdate: (data: any) => void;
}

function AdminFuelItem({
  vehicleId,
  idx,
  registrationNumber,
  expectedAvg,
  odometer,
  odometerStart,
  quantity,
  tankCapacity,
  receiptId,
  activityId,
  onUpdate,
}: IFormItemProps) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({ odometer, quantity });
  const isUpdated = useRef(false);

  const handleChange = (field: "odometer" | "quantity", value: string) => {
    let parsed;

    if (field === "quantity") {
      parsed = parseFloat(value);
      // Ensure that the value allows up to 2 decimal places
      if (!isNaN(parsed)) {
        parsed = parseFloat(parsed.toFixed(2)); // Keep the number in float format
      }
    } else {
      parsed = parseInt(value, 10); // Continue using parseInt for odometer
    }
    isUpdated.current = true;
    setValue((pre) => ({ ...pre, [field]: isNaN(parsed) ? value : parsed }));
  };

  const saveActivity = useCallback(
    function (newData: any) {
      if (loading || !newData.odometer || !newData.quantity) return;

      if (value.quantity > tankCapacity) {
        toast.warning(`Invalid Quantity. Max Allowed: ${tankCapacity}`);
        return;
      }

      setLoading(true);
      toast.info("Updating...");

      saveReceiptActivity(receiptId, { ...newData, vehicleId, activityId })
        .then(({ data }) => {
          onUpdate && onUpdate(data.activity);
          toast.success("Saved");
        })
        .catch((err) => {
          toast.warning(err?.response?.data?.message || "Something went wrong");
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [activityId]
  );

  // Define the debounced saveActivity function
  const debouncedSaveActivity = useCallback(
    debounce((d) => {
      saveActivity(d);
    }, 1500), // 1500ms debounce delay, adjust as needed
    [activityId]
  );

  useEffect(() => {
    if (isUpdated.current) {
      debouncedSaveActivity({ ...value, activityId });
    }
  }, [value]);
  return (
    <TableRow hover key={vehicleId} selected={activityId}>
      <TableCell>{idx + 1}</TableCell>
      <TableCell>{registrationNumber}</TableCell>
      <TableCell> {expectedAvg} </TableCell>
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
      <TableCell sx={{ pb: 0, pt: "auto" }}>
        <TextField
          value={value.quantity}
          sx={{ mt: "auto", pb: 0, mb: "-5px" }}
          variant="standard"
          type="number"
          onChange={(e) => {
            handleChange("quantity", e.target.value);
          }}
          inputProps={{ min: 0 }}
          disabled={loading}
        />
      </TableCell>
      <TableCell>{safeSubtraction(odometer, odometerStart)} Km</TableCell>
    </TableRow>
  );
}

export default AdminFuelItem;
