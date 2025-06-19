import { LogLevel } from "./lib/logger";

export interface Config {
  site: { name: string; description: string; themeColor: string; url: string };
  logLevel: keyof typeof LogLevel;
}

export const config: Config = {
  site: {
    name: "Devias Kit",
    description: "",
    themeColor: "#090a0b",
    url: "http://localhost:5173",
  },
  logLevel:
    ("process.env.NEXT_PUBLIC_LOG_LEVEL" as keyof typeof LogLevel) ??
    LogLevel.ALL,
};
