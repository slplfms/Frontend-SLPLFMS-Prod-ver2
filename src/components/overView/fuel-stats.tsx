import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { GasPump } from '@phosphor-icons/react/dist/ssr';

export interface BudgetProps {
  sx?: SxProps;
  value: string;
}

export function FuelStats({ sx, value }: BudgetProps): React.JSX.Element {
 

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Fuel Consumption
              </Typography>
              <Typography variant="h4">{value}<span style={{ fontSize: "16px", margin: "0px 0px 0px 3px" }}>liters</span></Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
            <GasPump size={26} />
            </Avatar>
          </Stack>
          
            <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
              <Typography color="text.secondary" variant="caption">
                Quantity Since last month
              </Typography>
            </Stack>
         
        </Stack>
      </CardContent>
    </Card>
  );
}