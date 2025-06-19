import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import GlobalStyles from "@mui/material/GlobalStyles";
import { Outlet } from "react-router-dom";
import { AuthGuard } from "../components/auth/auth-guard";
import { MainNav } from "../components/layout/main-nav";
import { SideNav } from "../components/layout/side-nav";
import Loader from "../components/UI/Loader";

export default function RootLayout(): React.JSX.Element {

  return (
    <AuthGuard>
      <GlobalStyles
        styles={{
          body: {
            "--MainNav-height": "56px",
            "--MainNav-zIndex": 1000,
            "--SideNav-width": "280px",
            "--SideNav-zIndex": 1100,
            "--MobileNav-width": "320px",
            "--MobileNav-zIndex": 1100,
          },
        }}
      />

      <Box
        sx={{
          bgcolor: "var(--mui-palette-background-default)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          minHeight: "100%",
        }}
      >
        <SideNav />
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            pl: { lg: "var(--SideNav-width)" },
            height:'100vh'
          }}
        >
          <MainNav />
          <main style={{flex:1, minHeight:0}}>
            <Container maxWidth="xl" sx={{ pt: "10px", height: '100%' }}>
              <React.Suspense fallback={<Loader />}> <Outlet /></React.Suspense>
            </Container>
          </main>
        </Box>
      </Box>
    </AuthGuard>
  );
}
