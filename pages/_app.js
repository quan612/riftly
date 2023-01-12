import React, { StrictMode, useEffect } from "react";
import "../styles/globals.css";
import "/sass/admin/adminBootstrap.css";

import { Web3Provider } from "context/Web3Context";
import { SessionProvider } from "next-auth/react";
import { AdminGuard } from "containers/admin/AdminGuard";
import { QueryClient, QueryClientProvider } from "react-query";
import Script from "next/script";
import * as gtag from "../lib/ga/gtag";
import { useRouter } from "next/router";
import { ChakraProvider } from "@chakra-ui/react";
import { useChallengerPageLoading } from "lib/hooks/useChallengerPageLoading";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

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
                                page_path: window.location.pathname,
                                });
                            `}
                        </Script>
                        <ChakraProvider>
                            {Component.requireAdmin ? (
                                <Component.Layout>
                                    <AdminGuard>
                                        <Component {...pageProps} />
                                    </AdminGuard>
                                </Component.Layout>
                            ) : (
                                <>
                                    <Component {...pageProps} />
                                    <Analytics />
                                </>
                            )}
                        </ChakraProvider>
                    </StrictMode>
                </QueryClientProvider>
            </Web3Provider>
        </SessionProvider>
    );
}

export default MyApp;
