import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import MenuItem from "@mui/material/MenuItem";
// import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { toast } from "sonner";
import { authClient } from "../../lib/auth/client";
import { useUser } from "../../hooks/use-user";
// import { GearSix as GearSixIcon } from "@phosphor-icons/react/dist/ssr/GearSix";
// import { SignOut as SignOutIcon } from "@phosphor-icons/react/dist/ssr/SignOut";
// import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";

// import { paths } from "../../paths";
// import { authClient } from '@/lib/auth/client';
// import { logger } from '@/lib/default-logger';
// import { useUser } from '@/hooks/use-user';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({
  anchorEl,
  onClose,
  open,
}: UserPopoverProps): React.JSX.Element {
  const { user } = useUser();
  const handleLogout =() => {
    authClient.signOut();
    toast.success("Logout Successfully");
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: "240px" } } }}
    >
      <Box sx={{ p: "16px 20px " }}>
        <Typography variant="subtitle1">Name: {user?.name}</Typography>
        <Typography color="text.secondary" variant="body2">
          Employee Id:{user?.employeeId}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: "10px 20px ", cursor: "pointer" }}>
        <Typography onClick={handleLogout} variant="body2">
          Logout
        </Typography>
      </Box>
    </Popover>
  );
}
