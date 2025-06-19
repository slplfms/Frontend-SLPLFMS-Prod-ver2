import { LocalizationProvider } from "@mui/x-date-pickers";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import { ThemeProvider } from "./components/core/theme-provider/theme-provider";
import { Suspense } from "react";
import { useUser } from "./hooks/use-user";
import { Toaster } from 'sonner'
import Loader from "./components/UI/Loader";
const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

export default function App() {
  const { isLoading } = useUser();

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider>
        <ThemeProvider>
          <Suspense fallback={<Loader />}>
            {isLoading ? (
              <Loader />
            ) : (
              <RouterProvider router={router} />
            )}
          </Suspense>
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}
