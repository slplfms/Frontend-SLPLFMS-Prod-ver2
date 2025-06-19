import * as React from "react";
// import Alert from "@mui/material/Alert";
// import { paths } from "../../paths";

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({
  children,
}: AuthGuardProps): React.JSX.Element | null {
  return <React.Fragment>{children}</React.Fragment>;
}
