import {
  Car,
  GasPump,
  Monitor,
  RoadHorizon,
  UserCircleCheck,
  Users,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import { BuildingOffice } from "@phosphor-icons/react/dist/ssr";

export const navIcons = {
  monitor: Monitor,
  users: Users,
  "building-office": BuildingOffice,
  car: Car,
  "road-horizon": RoadHorizon,
  "gas-pump": GasPump,
  "user-circle-check": UserCircleCheck,
} as Record<string, Icon>;
