import React from "react";
import { Box, Flex, Container } from "@chakra-ui/react";
import RiftlyConnectBoard from "./RiftlyConnectBoard";
import { Banner, FloatingFooter } from "./wrappers";
import { Router, useRouter } from "next/router";
import axios from "axios";

const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export default function UserLayout({ session, children }) {
    let router = useRouter();

    let notifyInterval;
    React.useEffect(async () => {
        try {
            // if (session) {
            Notification.requestPermission().then(async (perm) => {
                //         // console.log(session);
                //         if (perm === "granted" && !notifyInterval) {
                //             // notifyInterval = setInterval(async () => {
                //             //check new quest
                //             let res = await axios
                //                 .get(`/api/user/quest/check-quest`)
                //                 .then((r) => r.data);
                //             console.log(res);
                //             // if()
                //             // const notification = new Notification("To do list", {
                //             //     body: "Hey its gooddddd",
                //             // });
                //             // }, 5000);
                //         }
            });
            // }

            if ("serviceWorker" in navigator) {
                console.log("trying to install 1 ");
                // window.addEventListener("load", function () {
                console.log("trying to install 2");
                navigator.serviceWorker
                    .register("./sw.js")
                    .then(
                        async function (registration) {
                            // console.log("subscribe to push manager");
                            const subscribeOptions = {
                                userVisibleOnly: true,
                                applicationServerKey:
                                    "BHVgKdVS-qTStVoxSfoJXjq7jkih61cy3FGFA4IHqM_vh4xWUbgzJKq2fFrcwdssflAqxaYWzleTFzWiLdbkBz8",
                            };
                            let existingSubscription =
                                await registration.pushManager.getSubscription();
                            if (!existingSubscription) {
                                return registration.pushManager.subscribe(subscribeOptions);
                            }
                            return existingSubscription;
                        },
                        function (err) {
                            console.log("Service Worker registration failed: ", err);
                        }
                    )
                    .then(function (pushSubscription) {
                        console.log(
                            "Received PushSubscription: ",
                            JSON.stringify(pushSubscription)
                        );
                        console.log(pushSubscription.endpoint);
                        return pushSubscription;
                    });
            }
        } catch (error) {
            clearInterval(notifyInterval);
        }

        if (Notification.permission !== "granted" && notifyInterval) {
            clearInterval(notifyInterval);
        }
        return () => {
            clearInterval(notifyInterval);
        };
    }, [session]);

    if (session) {
        return (
            <Box w="100%" minH="100vh" h="auto" display={"flex"} position={"relative"}>
                <Banner />
                <Box
                    minW={"100%"}
                    w="100%"
                    bg={"brand.neutral5"}
                    color="#262626"
                    borderTopRadius={"16px"}
                    position="absolute"
                    top={"160px"}
                    minH="100vh"
                    maxH="auto"
                    pb="16px"
                    zIndex="2"
                >
                    <Container
                        position={"relative"}
                        maxW="container.sm"
                        minW={{ sm: "100%", md: "container.sm" }}
                        padding={{ sm: "0px 16px", md: "0" }}
                    >
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            w="100%"
                            position="relative"
                            top="-16px"
                            gap="16px"
                        >
                            {children}
                        </Box>
                    </Container>
                    <Box h="75px" minH="75px" bg="brand.neutral5" key="challenges-layout-hack" />
                </Box>
                <FloatingFooter />
            </Box>
        );
    } else {
        if (router.pathname === "/") {
            return (
                <Box w="100%" minH="100vh" h="auto" display={"flex"} position={"relative"}>
                    <RiftlyConnectBoard />
                </Box>
            );
        } else {
            return (
                <Box w="100%" minH="100vh" h="auto" display={"flex"} position={"relative"}>
                    {children}
                </Box>
            );
        }
    }
}
