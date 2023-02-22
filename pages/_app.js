import React, { StrictMode, useEffect } from "react";
import "../styles/globals.css";

import { Web3Provider } from "context/Web3Context";
import { SessionProvider } from "next-auth/react";
import { AdminGuard } from "containers/admin/AdminGuard";
import { QueryClient, QueryClientProvider } from "react-query";
import Script from "next/script";
import * as gtag from "../lib/ga/gtag";
import { useRouter } from "next/router";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { useChallengerPageLoading } from "lib/hooks/useChallengerPageLoading";
import { Analytics } from "@vercel/analytics/react";
import theme from "theme/theme";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from "chart.js";
import AdminLayout from "../components/admin/AdminLayout";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

const queryClient = new QueryClient();

import { AnimatePresence } from "framer-motion";
import UserLayout from "@components/end-user/UserLayout";
export function reportWebVitals(metric) {
  // console.log(metric);
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { isPageLoading } = useChallengerPageLoading();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <SessionProvider
      session={pageProps.session}
      basePath={`/api/auth`}
      refetchInterval={3600} // Re-fetches session when window is focused
      refetchOnWindowFocus={true}
    >
      <Web3Provider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <StrictMode>
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            />

            <Script strategy="lazyOnload">
              {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                                page_path: window.location.pathname, 'debug_mode':true
                                });
                            `}
            </Script>
            <ChakraProvider theme={theme}>
              {Component.requireAdmin ? (
                <AdminLayout {...pageProps}>
                  <AdminGuard>
                    <Component {...pageProps} />
                  </AdminGuard>
                </AdminLayout>
              ) : (
                <UserLayout {...pageProps}>
                  <AnimatePresence
                    mode="wait"
                    initial={false}
                    transitionDuration="0.2s"
                  >
                    <Component {...pageProps} key={router.asPath} />
                  </AnimatePresence>

                  <Analytics />
                </UserLayout>
              )}
            </ChakraProvider>
          </StrictMode>
        </QueryClientProvider>
      </Web3Provider>
    </SessionProvider>
  );
}

export default MyApp;

export function UserGuard({ children }) {
  const { session } = useContext(Web3Context);
  const router = useRouter();

  if (session && session.user) {
    return <>{children}</>;
  }

  if (!session) {
    router.push("/");
  }

  return null;
}
