import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { paths } from '../../paths';
import { CarProfile } from '@phosphor-icons/react/dist/ssr';

export interface TotalProfitProps {
  sx?: SxProps;
  value: string;
}

export function VehicleCount({ value, sx }: TotalProfitProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Total Vehicles
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>
          <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
            <CarProfile size={26} />
          </Avatar>
        </Stack>
        <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
          <Typography color="text.secondary" mt={3} variant="caption">
            <Link color="text.secondary" to={paths.dashboard.manageVehicle} style={{ textDecoration: 'none', color: "#667B8D" }}>
              View All Vehicles
            </Link>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}