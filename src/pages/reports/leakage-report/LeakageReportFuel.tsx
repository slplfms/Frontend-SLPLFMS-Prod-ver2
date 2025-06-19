import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { getLeakageReportByVehicle } from 'src/Services/LeakageReportService';
import { decimalPlaceFormatter } from 'src/utils/number';

interface ILeakageReportFuelProps {
  startDate: Date;
  endDate: Date;
}

function LeakageReportFuel({ startDate, endDate }: ILeakageReportFuelProps) {
  const [rows, setRows] = useState<any[]>([]);

  const columns = [
    { field: "vehicleId", headerName: "Vehicle No", width: 130 },
    { field: "centerName", headerName: "Center" },
    { field: "seater", headerName: "Seater" },
    { field: "kms", headerName: "Total Km" },
    { field: "fuelQuantity", headerName: "Fuel Quantity", width: 110 },
    { field: "avgFuelPrice", headerName: "Avg. Fuel Price", width: 120 },
    { field: "fuelPrice", headerName: "Total Fuel Cost", width: 140 },
    { field: "actualAvg", headerName: "Actual Average", width: 130 },
    { field: "expectAvg", headerName: "Expected Average", width: 130 },
    { field: "expectedLiters", headerName: "Expected Liters", width: 130 },
    { field: "differenceLtr", headerName: "Difference Liters", width: 130 },
    { field: "amountDifference", headerName: "Amount Difference", width: 130 },
  ];

  useEffect(() => {
    getLeakageReportByVehicle(
      format(startDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd")
    )
      .then((data) => {
        const { result } = data;

        const formattedRows = result.map((item: any) => {
          const {
            Center,
            Vehicle,
            actualAvg,
            fuelPrice,
            fuelQuantity,
            kms,
            avgFuelPrice,
            differenceLtr,
            amountDifference,
            expectedLiters,
          } = item;

          return {
            id: Vehicle?.id ?? `${item?.Center?.id}-${Math.random()}`,
            vehicleId: Vehicle?.registrationNumber ?? "N/A",
            centerName: Center?.name ?? " - ",
            seater: Vehicle?.seater ?? " - ",
            kms: kms ?? 0,
            actualAvg: decimalPlaceFormatter(actualAvg) ?? "0.00",
            expectAvg: decimalPlaceFormatter(Vehicle?.expectedAvg) ?? "0.00",
            expectedLiters: decimalPlaceFormatter(expectedLiters) ?? "0.00",
            differenceLtr: decimalPlaceFormatter(differenceLtr) ?? "0.00",
            fuelPrice: fuelPrice ? decimalPlaceFormatter(fuelPrice) : "0.00",
            fuelQuantity: fuelQuantity ? decimalPlaceFormatter(fuelQuantity) : "0.00",
            avgFuelPrice: decimalPlaceFormatter(avgFuelPrice) ?? "0.00",
            amountDifference: decimalPlaceFormatter(amountDifference) ?? "0.00",
          };
        });

        setRows(formattedRows);
      })
      .catch((error) => {
        console.error("Error fetching leakage report:", error);
      });
  }, [startDate, endDate]);

  return (
    <DataGrid
      style={{ padding: "0px 15px" }}
      rows={rows}
      columns={columns}
      slots={{ toolbar: GridToolbar }}
    />
  );
}

export default LeakageReportFuel;
