export const permissionConfig = [
  {
    label: "User Management",
    modules: [
      { name: "createUser", label: "Create" },
      { name: "updateUser", label: "Update" },
      { name: "deleteUser", label: "Delete" },
      { name: "getUsers", label: "GetList" },
      { name: "getUser", label: "GetUser" }
    ]
  },
  {
    label: "Center Management",
    modules: [
      { name: "createCenter", label: "Create" },
      { name: "updateCenter", label: "Update" },
      { name: "deleteCenter", label: "Delete" },
      { name: "getCenters", label: "GetList" },
      { name: "getCenter", label: "GetCenter" }
    ]
  },
  {
    label: "Route Management",
    modules: [
      { name: "createRoute", label: "Create" },
      { name: "updateRoute", label: "Update" },
      { name: "deleteRoute", label: "Delete" },
      { name: "getRoutes", label: "GetList" },
      { name: "getRoute", label: "GetRoute" }
    ]
  },
  {
    label: "Role Management",
    modules: [
      { name: "createRole", label: "Create" },
      { name: "updateRole", label: "Update" },
      { name: "deleteRole", label: "Delete" },
      { name: "getRoles", label: "GetList" },
      { name: "getRole", label: "GetRole" }
    ]
  },
  {
    label: "Permission Management",
    modules: [
      { name: "createPermission", label: "Create" },
      { name: "updatePermission", label: "Update" },
      { name: "deletePermission", label: "Delete" },
      { name: "getPermissions", label: "GetList" },
      { name: "getPermission", label: "GetPermission" }
    ]
  },
  {
    label: "User Document Management",
    modules: [
      { name: "createUserDocument", label: "Create" },
      { name: "updateUserDocument", label: "Update" },
      { name: "deleteUserDocument", label: "Delete" },
      { name: "getUserDocuments", label: "GetList" },
      { name: "getUserDocument", label: "GetUserDocument" }
    ]
  },
  {
    label: "Vehicle Management",
    modules: [
      { name: "createVehicle", label: "Create" },
      { name: "updateVehicle", label: "Update" },
      { name: "deleteVehicle", label: "Delete" },
      { name: "getVehicles", label: "GetList" },
      { name: "getVehicle", label: "GetVehicle" }
    ]
  },
  {
    label: "Vehicle Document Management",
    modules: [
      { name: "createVehicleDocument", label: "Create" },
      { name: "updateVehicleDocument", label: "Update" },
      { name: "deleteVehicleDocument", label: "Delete" },
      { name: "getVehicleDocuments", label: "GetList" },
      { name: "getVehicleDocument", label: "GetVehicleDocument" }
    ]
  },
  {
    label: "Daily KM",
    modules: [
      { name: "createDailyActivity", label: "Create" },
      { name: "updateDailyActivity", label: "Update" },
      { name: "deleteDailyActivity", label: "Delete" },
      { name: "getDailyActivities", label: "GetList" },
      { name: "getDailyActivity", label: "GetDailyActivity" }
    ]
  },
  {
    label: "Fuel/KM Management (Supervisor)",
    modules: [
      { name: "createFuelReceipt", label: "Create" },
      { name: "updateFuelReceipt", label: "Update" },
      { name: "deleteFuelReceipt", label: "Delete" },
      { name: "getFuelReceipts", label: "GetList" },
      { name: "getFuelReceipt", label: "Get" }
    ]
  },
  {
    label: "Fuel Activity Management",
    modules: [
      { name: "createFuelActivity", label: "Create" },
      { name: "updateFuelActivity", label: "Update" },
      { name: "deleteFuelActivity", label: "Delete" },
      { name: "getFuelActivities", label: "GetList" },
      { name: "getFuelActivity", label: "GetFuelActivity" }
    ]
  },
  {
    label: "Fuel Station Management",
    modules: [
      { name: "createFuelingStation", label: "Create" },
      { name: "updateFuelingStation", label: "Update" },
      { name: "deleteFuelingStation", label: "Delete" },
      { name: "getFuelingStations", label: "GetList" },
      { name: "getFuelingStation", label: "GetFuelActivity" }
    ]
  },
  {
    label: "Reports",
    modules: [
      { name: "getKmActivityReport", label: "Daily km " },
      { name: "getFuelReport", label: "Fuel" },
      { name: "getLeakageReport", label: "Leakage" },
    ]
  },
  {
    label: "Utils",
    modules: [
      { name: "importCsv", label: "Import Data" },
      { name: "exportCsv", label: "Export Data" },
    ]
  },
];

export const defaultConfig = {
  createUser: false,
  updateUser: false,
  deleteUser: false,
  getUsers: false,
  getUser: false,
  createCenter: false,
  updateCenter: false,
  deleteCenter: false,
  getCenters: false,
  getCenter: false,
  createRoute: false,
  updateRoute: false,
  deleteRoute: false,
  getRoutes: false,
  getRoute: false,
  createRole: false,
  updateRole: false,
  deleteRole: false,
  getRoles: false,
  getRole: false,
  createPermission: false,
  updatePermission: false,
  deletePermission: false,
  getPermissions: false,
  getPermission: false,
  createUserDocument: false,
  updateUserDocument: false,
  deleteUserDocument: false,
  getUserDocuments: false,
  getUserDocument: false,
  createVehicle: false,
  updateVehicle: false,
  deleteVehicle: false,
  getVehicles: false,
  getVehicle: false,
  createVehicleDocument: false,
  updateVehicleDocument: false,
  deleteVehicleDocument: false,
  getVehicleDocuments: false,
  getVehicleDocument: false,
  createDailyActivity: false,
  updateDailyActivity: false,
  deleteDailyActivity: false,
  getDailyActivities: false,
  getDailyActivity: false,
  createFuelActivity: false,
  updateFuelActivity: false,
  deleteFuelActivity: false,
  getFuelActivities: false,
  getFuelActivity: false,
  createFuelingStation:false,
  updateFuelingStation:false,
  deleteFuelingStation:false,
  getFuelingStations:false,
  getFuelingStation:false,
};
