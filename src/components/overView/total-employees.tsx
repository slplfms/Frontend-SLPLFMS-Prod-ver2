import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { Link } from 'react-router-dom';
import { paths } from '../../paths';

export interface TotalCustomersProps {
  sx?: SxProps;
  value: string;
}

export function TotalEmployees({ sx, value }: TotalCustomersProps): React.JSX.Element {


  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Total Employees
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-success-main)', height: '56px', width: '56px' }}>
              <UsersIcon fontSize="24px" />
            </Avatar>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Typography color="text.secondary" mt={1} variant="caption">
              <Link color="text.secondary" to={paths.dashboard.users} style={{ textDecoration: 'none', color: "#667B8D" }}>
                View All Employees
              </Link>
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}