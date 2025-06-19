import type { NavItemConfig } from "../../types/nav";
import { paths } from "../../paths";

export const navItems = [
  {
    key: "dashboard",
    title: "Dashboard",
    href: paths.dashboard.overview,
    icon: "monitor",
    permissions: ['createPermission', 'updatePermission', 'deletePermission', 'getPermission', 'getPermissions'],
  },
  {
    key: "manage-center",
    title: "Center Management",
    href: paths.dashboard.manageCenter,
    icon: "building-office",
    permissions: ['createCenter', 'updateCenter', 'deleteCenter']
  },
  {
    key: "users",
    title: "Users",
    href: paths.dashboard.users,
    icon: "users",
    permissions: ['createUser', 'updateUser', 'deleteUser']
  },
  {
    key: "manage-vehicle",
    title: "Vehicle Management",
    href: paths.dashboard.manageVehicle,
    icon: "car",
    permissions: ['createVehicle', 'updateVehicle', 'deleteVehicle']
  },
  {
    key: "manage-daily-km-list",
    title: "Daily KM (Supervisor)",
    href: paths.dashboard.manageDailyKmList,
    icon: "road-horizon",
    permissions: ['createFuelReceipt', 'updateFuelReceipt', 'deleteFuelReceipt', 'getFuelReceipts', 'getFuelReceipt']
  },
  {
    key: "manage-daily-km",
    title: "Daily KM",
    href: paths.dashboard.manageDailyKm,
    icon: "road-horizon",
    permissions: ['createDailyActivity', 'updateDailyActivity', 'deleteDailyActivity']
  },
  {
    key: "manage-fuel-receipt",
    title: "Fuel Management (Supervisor)",
    href: paths.dashboard.fuelReceipt,
    icon: "gas-pump",
    permissions: ['createFuelReceipt', 'updateFuelReceipt', 'deleteFuelReceipt', 'getFuelReceipts', 'getFuelReceipt']
  },
  {
    key: "manage-fuel",
    title: "Fuel Management",
    href: paths.dashboard.manageFuel,
    icon: "gas-pump",
    permissions: ['createFuelActivity', 'updateFuelActivity', 'deleteFuelActivity', 'getFuelActivity', 'getFuelActivities']
  },
  {
    key: "manage-roles",
    title: "Role Management",
    href: paths.dashboard.manageRoles,
    icon: "user-circle-check",
    permissions: ['createRole', 'updateRole', 'deleteRole']
  },
  {
    key: "manage-route",
    title: "Route Management",
    href: paths.dashboard.manageRoute,
    icon: "road-horizon",
    permissions: ['createRoute', 'updateRoute', 'deleteRoute']
  },
  {
    key: "fuel-station",
    title: "Fuel Station",
    href: paths.dashboard.fuelStation,
    icon: "building-office",
    permissions: ['createFuelingStation', 'updateFuelingStation', 'deleteFuelingStation']
  },
  {
    key: "Site-Wise-Report",
    title: "Sitewise Km Report",
    href: paths.reports.sitewiseReport,
    icon: "building-office",
    permissions:['getKmActivityReport']
  },
  {
    key: "Fuel-Activity-Report",
    title: "Fuel Activity Report",
    href: paths.reports.fuelActivityReport,
    icon: "building-office",
    permissions:['getFuelReport']
  },
  {
    key: "Diesel-Pump-Wise-Report",
    title: "Leakage Report",
    href: paths.reports.dieselPumpWiseReport,
    icon: "building-office",
    permissions:['getLeakageReport']
  },
] satisfies NavItemConfig[];
