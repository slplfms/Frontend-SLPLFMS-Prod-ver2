import Grid from "@mui/material/Grid";
import { FuelStats } from "../components/overView/fuel-stats";
// import { TotalEmployees } from "../components/overView/total-employees";
// import { KilometersTravel } from "../components/overView/kilometers-travel";
// import { VehicleCount } from "../components/overView/vehicle-count";
import { DocsReminder } from "../components/overView/docs-reminder";
import { useQuery } from "react-query";
import { DashboardStatsTable } from "../components/overView/dashboard-stats-table";
import tableHeaders from "../constants/dashboard";

import {
  getDashboardCardsData,
  getOverViewDailyActivity,
  getOverViewFuelActivityCenter,
  // getOverViewFuelActivityStation,
  getUsersDocsReminder,
  getVehicleDocsReminder,
  getOverViewLeakageReportByFuel,
  getLatestFuelActivities,
  // getCenterWiseLeakageSummary,
} from "../Services/dashboard-service";

export default function Dashboard() {
  // Cards Data
  const query = useQuery(["getOverViewData"], () => getDashboardCardsData(), {
    keepPreviousData: true,
  });

  
  // Leakage report by center
  // const leakageByCenterOverView = useQuery(
  //   ["getCenterWiseLeakageSummary"],
  //   () => getCenterWiseLeakageSummary(),
  //   {
  //     keepPreviousData: true,
  //   }
  // );
  
  // Leakage report by fuel
  const leakageByFuelOverView = useQuery(
    ["leakageByFuelOverView"],
    () => getOverViewLeakageReportByFuel(),
    {
      keepPreviousData: true,
    }
  );

  // daily km actitivty
  const dailyActivityQuery = useQuery(
    ["getOverViewDailyActivity"],
    () => getOverViewDailyActivity(),
    {
      keepPreviousData: true,
    }
  );

  // user docs reminder
  const userDocsReminderQuery = useQuery(
    ["getUsersDocsReminder"],
    () => getUsersDocsReminder(),
    {
      keepPreviousData: true,
    }
  );

  // vehicle docs reminder
  const vehicleDocsReminder = useQuery(
    ["getVehicleDocsReminder"],
    () => getVehicleDocsReminder(),
    {
      keepPreviousData: true,
    }
  );

  const fuelActivityQueryCenter = useQuery(
    ["getOverViewFuelActivityCenter"],
    () => getOverViewFuelActivityCenter(),
    {
      keepPreviousData: true,
    }
  );
  const latestFuelActivities = useQuery(
    ["getLatestFuelActivities"],
    () => getLatestFuelActivities(),
    {
      keepPreviousData: true,
    }
  );

  // const fuelActivityQueryStation = useQuery(
  //   ["getOverViewFuelActivityStation"],
  //   () => getOverViewFuelActivityStation(),
  //   {
  //     keepPreviousData: true,
  //   }
  // );
  return (
    <>
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} sm={6} md={3}>
          <FuelStats
            sx={{ height: "100%" }}
            value={query?.data?.fuel && query?.data?.fuel}
          />
        </Grid>
        {/* <Grid item xs={12} sm={6} md={3}>
          <TotalEmployees
            sx={{ height: "100%" }}
            value={query?.data?.users && query?.data?.users}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KilometersTravel
            sx={{ height: "100%" }}
            value={query?.data?.kms && query?.data?.kms}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <VehicleCount
            sx={{ height: "100%" }}
            value={query?.data?.vehicles && query?.data?.vehicles}
          />
        </Grid> */}
      </Grid>
      <Grid container mt={1} spacing={3}>
        <Grid item xs={12}>
          <DashboardStatsTable
            data={latestFuelActivities?.data?.fuelActivities || []}
            sx={{ height: "100%" }}
            title="Latest Fuel Activities"
            headers={tableHeaders.fuelList}
          />
        </Grid>
      </Grid>
      <Grid container mt={1} spacing={3}>
        <Grid item xs={12}>
          <DashboardStatsTable
            data={fuelActivityQueryCenter?.data || []}
            sx={{ height: "100%" }}
            title="Fuel Activity"
            headers={tableHeaders.fuelByCenter}
          />
        </Grid>
      </Grid>
      {/* <Grid container mt={1} spacing={3}>
        <Grid item xs={12}>
          <DashboardStatsTable
            data={leakageByCenterOverView?.data || []}
            sx={{ height: "100%" }}
            headers={tableHeaders.leakageByCenter || []}
            title={"Center Wise Leakage Summary"}
          />
        </Grid>
      </Grid> */}
      <Grid container mt={1} spacing={3}>
        <Grid item xs={12}>
          <DashboardStatsTable
            data={leakageByFuelOverView?.data?.result || []}
            sx={{ height: "100%" }}
            title="Leakage (Vehicle)"
            headers={tableHeaders.leakageByVehicle}
          />
        </Grid>
      </Grid>
      <Grid container mt={1} spacing={3}>
        <Grid item xs={12} lg={8}>
          <DashboardStatsTable
            data={dailyActivityQuery?.data || []}
            sx={{ height: "100%" }}
            headers={tableHeaders.dailyKmByCenter}
            title={"Kms (Center)"}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <DocsReminder
            userDocs={userDocsReminderQuery?.data}
            vehicleDocs={vehicleDocsReminder?.data}
          />
        </Grid>
      </Grid>
    </>
  );
}
