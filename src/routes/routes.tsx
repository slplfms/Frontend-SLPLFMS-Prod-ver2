import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { paths } from "../paths";
import FuelActivityReport from "../pages/FuelActivityReport";

const RootLayout = lazy(() => import("./root"));
const NotFound = lazy(() => import("../pages/not-found"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const ManageCenter = lazy(() => import("../pages/manage-center"));
const Users = lazy(() => import("../pages/users"));
const ManageVehicle = lazy(() => import("../pages/manage-vehicle"));
const ManageDailyKm = lazy(() => import("../pages/manage-daily-km"));
const ManageFuel = lazy(() => import("../pages/manage-fuel"));
const ManageRoles = lazy(() => import("../pages/manage-roles"));
const SignIn = lazy(() => import("../pages/sign-in"));
const AuthRequired = lazy(() => import("../components/auth/auth-required"));
const AddUser = lazy(() => import("../components/user/add-user"));
const AddRole = lazy(() => import("../components/manageRoles/add-role"));
const VehicleForm = lazy(() => import("../components/vehicle/vehicle-form"));
const CenterForm = lazy(() => import("../components/center/center-form"));
const AddFuelManagement = lazy(
  () => import("../components/FuelManagement/AddFuelManagement")
);
const AddDailyKm = lazy(
  () => import("../components/Manage-Daily_Km/AddDailyKm")
);
const ManageRoute = lazy(() => import("../pages/manage-route"));
const AddRoute = lazy(() => import("../components/manageRoute/add-route"));
const FuelStation = lazy(() => import("../pages/Fuel-Station"));
const AddFuelStation = lazy(
  () => import("../components/FuelStation/addFuelStation")
);

const SiteWiseKmReport = lazy(() => import("src/pages/reports/km-report/SiteWiseKmReport"));

const LeakageReport = lazy(() => import("src/pages/reports/leakage-report/LeakageReport"));

const FuelReceipt = lazy(() => import("../pages/fuel-receipt"));
const ManageFuelReceipt = lazy(() => import("../components/fuel-receipt/add-fuel-receipt"));
const ManageVehicleFuel = lazy(() => import("../components/vehicle-fuel-admin/vehicle-fuel-form"));
const ManageDailyKmList = lazy(() => import("../components/daily-km-admin/daily-km-admin"));

export const routes = [
  {
    path: paths.home,
    element: <Navigate to="/dashboard" replace />,
    errorElement: <NotFound />,
  },
  {
    path: paths.dashboard.overview,
    element: <RootLayout />,
    children: [
      {
        path: paths.dashboard.overview,
        element: (
          <AuthRequired
            permissions={[
              "createPermission",
              "updatePermission",
              "deletePermission",
              "getPermission",
              "getPermissions",
            ]}
          >
            <Dashboard />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.manageCenter,
        element: (
          <AuthRequired
            permissions={[
              "createCenter",
              "updateCenter",
              "deleteCenter",
              // "getCenter",
              // "getCenters",
            ]}
          >
            <ManageCenter />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.users,
        element: (
          <AuthRequired
            permissions={[
              "createUser",
              "updateUser",
              "deleteUser",
              // "getUser",
              // "getUsers",
            ]}
          >
            <Users />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.manageVehicle,
        element: (
          <AuthRequired
            permissions={[
              "createVehicle",
              "updateVehicle",
              "deleteVehicle",
              // "getVehicle",
              // "getVehicles",
            ]}
          >
            <ManageVehicle />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.manageDailyKm,
        element: (
          <AuthRequired
            permissions={[
              "createDailyActivity",
              "updateDailyActivity",
              "deleteDailyActivity",
              "getDailyActivity",
              "getDailyActivities",
            ]}
          >
            <ManageDailyKm />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.manageFuel,
        element: (
          <AuthRequired
            permissions={[
              "createFuelActivity",
              "updateFuelActivity",
              "deleteFuelActivity",
              "getFuelActivity",
              "getFuelActivities",
            ]}
          >
            <ManageFuel />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.fuelReceipt,
        element: (
          <AuthRequired
            permissions={[
              "createFuelReceipt",
              "updateFuelReceipt",
              "deleteFuelReceipt",
              "getFuelReceipts",
              "getFuelReceipt",
            ]}
          >
            <FuelReceipt />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.manageFuelReceipt,
        element: (
          <AuthRequired
            permissions={[
              "createFuelReceipt",
              "updateFuelReceipt",
            ]}
          >
            <ManageFuelReceipt />
          </AuthRequired>
        ),
      },
      {
        path: `${paths.dashboard.manageVehicleFuel}/:id`,
        element: (
          <AuthRequired
            permissions={[
              "createFuelReceipt",
              "updateFuelReceipt",
            ]}
          >
            <ManageVehicleFuel />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.manageDailyKmList,
        element: (
          <AuthRequired
            permissions={[
              "createFuelReceipt",
              "updateFuelReceipt",
            ]}
          >
            <ManageDailyKmList />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.manageRoles,
        element: (
          <AuthRequired
            permissions={[
              "createRole",
              "updateRole",
              "deleteRole",
              // "getRole",
              // "getRoles",
            ]}
          >
            <ManageRoles />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.manageRoute,
        element: (
          <AuthRequired
            permissions={[
              "createRoute",
              "updateRoute",
              "deleteRoute",
              // "getRoute",
              // "getRoute",
            ]}
          >
            <ManageRoute />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.fuelStation,
        element: (
          <AuthRequired
            permissions={[
              "createFuelingStation",
              "updateFuelingStation",
              "deleteFuelingStation",
              // "getFuelingStation",
              // "getFuelingStations",
            ]}
          >
            <FuelStation />
          </AuthRequired>
        ),
      },
      {
        path: paths.reports.sitewiseReport,
        element: (
          <AuthRequired permissions={["getKmActivityReport"]}>
            <SiteWiseKmReport />
          </AuthRequired>
        ),
      },
      {
        path: paths.reports.fuelActivityReport,
        element: (
          <AuthRequired permissions={["getFuelReport"]}>
            <FuelActivityReport />
          </AuthRequired>
        ),
      },
      {
        path: paths.reports.dieselPumpWiseReport,
        element: (
          <AuthRequired permissions={["getLeakageReport"]}>
            <LeakageReport />
          </AuthRequired>
        ),
      },
      {
        path: paths.reports.dieselCenterWiseReport,
        element: (
          <AuthRequired permissions={["getLeakageReport"]}>
            <FuelActivityReport />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.adduser,
        element: (
          <AuthRequired permissions={["createUser"]}>
            <AddUser editMode={false} />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.edituser,
        element: (
          <AuthRequired permissions={["updateUser"]}>
            <AddUser editMode={true} />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.addRole,
        element: (
          <AuthRequired permissions={["createRole"]}>
            <AddRole />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.updateRole,
        element: (
          <AuthRequired permissions={["updateRole"]}>
            <AddRole />
          </AuthRequired>
        ),
      },

      {
        path: paths.dashboard.addVehicle,
        element: (
          <AuthRequired permissions={["createVehicle"]}>
            <VehicleForm />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.editVehicle,
        element: (
          <AuthRequired permissions={["updateVehicle"]}>
            <VehicleForm />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.addCenter,
        element: (
          <AuthRequired permissions={["createUser"]}>
            <CenterForm />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.editCenter,
        element: (
          <AuthRequired permissions={["updateUser"]}>
            <CenterForm />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.addfuel,
        element: (
          <AuthRequired permissions={["createFuelActivity"]}>
            <AddFuelManagement />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.editfuel,
        element: (
          <AuthRequired permissions={["updateFuelActivity"]}>
            <AddFuelManagement />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.addDailyKm,
        element: (
          <AuthRequired permissions={["createDailyActivity"]}>
            <AddDailyKm />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.updateDailyKm,
        element: (
          <AuthRequired permissions={["getUsers"]}>
            <AddDailyKm />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.addRoute,
        element: (
          <AuthRequired permissions={["createRoute"]}>
            <AddRoute />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.updateRoute,
        element: (
          <AuthRequired permissions={["updateRoute"]}>
            <AddRoute />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.addfuelstation,
        element: (
          <AuthRequired permissions={["createFuelingStation"]}>
            <AddFuelStation />
          </AuthRequired>
        ),
      },
      {
        path: paths.dashboard.updatefuelstation,
        element: (
          <AuthRequired permissions={["updateFuelingStation"]}>
            <AddFuelStation />
          </AuthRequired>
        ),
      },
    ],
  },
  {
    path: paths.auth.signIn,
    element: <SignIn />,
  },
];
