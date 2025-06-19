import { Navigate } from "react-router-dom";
import { useUser } from "../../hooks/use-user";
import { authClient } from "../../lib/auth/client";
import { paths } from "../../paths";
import { JSXElementConstructor, ReactElement, cloneElement } from "react";

type AuthRequiredProps = {
  permissions?: string[];
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  type?: "component" | "button" | "navItem",
};

export default function AuthRequired({
  permissions,
  children,
  type = "component",
}: AuthRequiredProps) {
  const { user } = useUser();


  if (!user) {
    authClient.signOut();
    return <Navigate to={paths.auth.signIn} />;
  }

  if (permissions) {
    const hasPermission = permissions.some((item: any) => {
      return user.permissions?.[item];
    });
    if (hasPermission) {
      return children;
    } else {
      if (type === "component") {
        return <Navigate to={paths.dashboard.overview} />;
      }
      else if (type === "navItem") {
        return null;
      }
      else if (type === "button") {
        return cloneElement(children, { style: {  pointerEvents: "none", textDecoration: 'none', color: 'gray' } })
      }
    }
  } else {
    return children;
  }
}
