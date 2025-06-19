export const csvType = {
  USER: "user",
  VEHICLE: "vehicle",
  FUELING_STATION: "fueling-station",
  ROUTE: "route",
  CENTER: "center",
  DAILY_KM_ACTIVITY: "km-activity",
  FUEL_ACTIVITY: "fuel-activity",
  FUEL_MANAGEMENT: "fuel-receipts",
};

export const centerFields = [
  { id: "name", label: "Name", optional: false },
  { id: "address", label: "Address", optional: false },
  { id: "trustName", label: "Trust name", optional: false },
  { id: "dailyAvgKm", label: "Daily Kms", optional: false },
];

export const fuelingStationFields = [
  { id: "name", label: "Name", optional: false },
  { id: "price", label: "Price", optional: false },
];

export const roleFields = [
  { id: "name", label: "Name", optional: false },
  { id: "description", label: "description", optional: false },
];

export const routeFields = [{ id: "name", label: "Name", optional: false }];

export const vehicle = [
  { id: "route", label: "Route Name", optional: false },
  { id: "center", label: "Center Name", optional: false },
  { id: "registrationNumber", label: "Registration Number", optional: false },
  { id: "dateOfPurchase", label: "Date of Purchase", optional: false },
  { id: "vehicleStatus", label: "Vehicle Status", optional: false },
  { id: "make", label: "Make", optional: false },
  { id: "model", label: "Model", optional: false },
  { id: "primaryMeter", label: "Primary Meter", optional: false },
  { id: "tankCapacity", label: "Tank Capacity", optional: false },
  { id: "expectedAvg", label: "Avg Expected", optional: false },
  { id: "seater", label: "Seater", optional: false },
  { id: "engineNumber", label: "Engine Number", optional: false },
  { id: "chassisNumber", label: "Chassis Number", optional: false },
  { id: "financeBy", label: "Finance By", optional: false },
  { id: "emiAmount", label: "Emi Amount", optional: false },
  { id: "emiDate", label: "Emi Date", optional: false },
];

export const userFIelds = [
  { id: "employeeId", label: "Employee Id", optional: false },
  { id: "name", label: "Name", optional: false },
  { id: "center", label: "Center Name", optional: true },
  { id: "vehicle", label: "Vehicle Registration Number", optional: true },
  { id: "phoneNumber", label: "Phone Number", optional: false },
  { id: "joiningDate", label: "Joining Date", optional: false },
  { id: "pfNumber", label: "PF number", optional: false },
  { id: "esicNumber", label: "ESIC number", optional: true },
  { id: "comments", label: "Comments", optional: true },
  { id: "reportingManager", label: "Reporting manager", optional: true },
];

export const fuelActivity = [
  { id: "vehicle", label: "Vehicle Reg. No", optional: false },
  { id: "center", label: "Center", optional: false },
  { id: "startOdometer", label: "Start Odometer ", optional: false },
  { id: "endOdometer", label: "End Odometer", optional: false },
  { id: "user", label: "Employee Id", optional: false },
  { id: "fuelingStation", label: "Fuel Station", optional: false },
  { id: "price", label: "Price", optional: false },
  { id: "quantity", label: "Quantity", optional: false },
  { id: "receiptUrl", label: "Quantity", optional: false },
];

export const dailyActivity = [
  { id: "vehicle", label: "Vehicle", optional: false },
  { id: "user", label: "User", optional: false },
  { id: "center", label: "Center", optional: false },
  { id: "startOdometer", label: "Start Odometer", optional: false },
  { id: "endOdometer", label: "End Odometer", optional: false },
  // { id: "status", label: "Status", optional: false },
  { id: "date", label: "Date", optional: false },
  
];

export const fuelManagement = [
  { id: "date", label: "Date", optional: false },
  { id: "serialNo", label: "Serial No", optional: false },
  { id: "center", label: "Center", optional: false },
  { id: "fuelStation", label: "Fuel Station", optional: false },
  { id: "quantity", label: "Quantity", optional: false },
  { id: "price", label: "Price", optional: false },
  { id: "receiptUrl", label: "Receipt Link", optional: false },
];
