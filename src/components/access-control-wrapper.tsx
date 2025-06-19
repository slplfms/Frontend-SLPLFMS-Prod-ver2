import { useUser } from "../hooks/use-user";
import React, { ReactElement } from "react";

interface AccessControlProps {
  permissions: string[] | undefined;
  disabled?: boolean;
  children: ReactElement;
}

const AccessControlWrapper: React.FC<AccessControlProps> = ({
  permissions = [],
  disabled = false,
  children,
}) => {
  // Check if the user has the required permission
  const { user } = useUser();

  if (user) {
    if (permissions.length) {
      const hasPermission = permissions.some((item: any) => {
        return user?.permissions?.[item];
      });
      if (hasPermission) {
        return children;
      }
    } else {
      return children;
    }
  }

  if (disabled) {
    // Disable the UI element if disabled prop is true
    return React.cloneElement(children, { disabled: true });
  } else {
    // Otherwise, hide the UI element completely
    return null;
  }
};

export default AccessControlWrapper;
