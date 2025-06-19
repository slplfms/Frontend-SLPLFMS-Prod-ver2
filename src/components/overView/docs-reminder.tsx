import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import type { SxProps } from '@mui/material/styles';
import dayjs from 'dayjs';
import { userDocumentsMap, vehicleDocumentsMap } from '../../constants/documents';

export interface LatestProductsProps {
    userDocs: any[];
    vehicleDocs: any[];
    sx?: SxProps;
}

export function DocsReminder({ userDocs = [], sx, vehicleDocs = [] }: LatestProductsProps): React.JSX.Element {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    return (
        <Card sx={sx}>
            <CardHeader title="Reminders" />
            <Divider />
            <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary">
                <Tab label="User" />
                <Tab label="Vehicle" />
            </Tabs>
            <Divider />
            <List>
                {(selectedTab === 0 && userDocs.length > 0) && (
                    <>
                        {(Array.isArray(userDocs) && userDocs.length > 0) ? userDocs?.map((product, index) => (
                            <ListItem divider={index < userDocs.length - 1} key={product.id}>
                                <ListItemAvatar>
                                    {product.image ? (
                                        <Box component="img" src={`${import.meta.env.VITE_STORAGE_URL || "https://storageslplfmsprod.blob.core.windows.net/"}${product.url}`} sx={{ borderRadius: 1, height: '48px', width: '48px' }} />
                                    ) : (
                                        <Box
                                            sx={{
                                                borderRadius: 1,
                                                backgroundColor: 'var(--mui-palette-neutral-200)',
                                                height: '48px',
                                                width: '48px',
                                            }}
                                        />
                                    )}
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${product?.User?.name || "N/A"} | ${userDocumentsMap[product.type as keyof typeof userDocumentsMap]?.title || "Title not available"}`}
                                    primaryTypographyProps={{ variant: 'subtitle1' }}
                                    secondary={`Expiry Date: ${dayjs(product.expiryDate).format('MMM D, YYYY')}`}
                                    secondaryTypographyProps={{ variant: 'body2' }}
                                />
                            </ListItem>
                        )) : null}
                    </>
                )}
                {(selectedTab === 1 && vehicleDocs.length > 0) && (
                    <>
                        {(Array.isArray(vehicleDocs) && vehicleDocs.length > 0) ? vehicleDocs?.map((product, index) => (
                            <ListItem divider={index < vehicleDocs.length - 1} key={product.id}>
                                <ListItemAvatar>
                                    {product.image ? (
                                        <Box component="img" src={`${import.meta.env.VITE_STORAGE_URL || "https://storageslplfmsprod.blob.core.windows.net/"}${product.url}`} sx={{ borderRadius: 1, height: '48px', width: '48px' }} />
                                    ) : (
                                        <Box
                                            sx={{
                                                borderRadius: 1,
                                                backgroundColor: 'var(--mui-palette-neutral-200)',
                                                height: '48px',
                                                width: '48px',
                                            }}
                                        />
                                    )}
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${product?.Vehicle?.registrationNumber || "N/A"} | ${vehicleDocumentsMap[product.type as keyof typeof vehicleDocumentsMap]?.title || "Title not available"}`}
                                    primaryTypographyProps={{ variant: 'subtitle1' }}
                                    secondary={`Expiry Date: ${dayjs(product.expiryDate).format('MMM D, YYYY')}`}
                                    secondaryTypographyProps={{ variant: 'body2' }}
                                />
                            </ListItem>
                        )) : null}
                    </>
                )}
            </List>
        </Card>
    );
}
