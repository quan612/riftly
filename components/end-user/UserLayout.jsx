import React from "react";
import { Box, Flex, Container } from "@chakra-ui/react";
import RiftlyConnectBoard from "./RiftlyConnectBoard";
import { Banner, FloatingFooter } from "./wrappers";
import { Router, useRouter } from "next/router";
import axios from "axios";

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
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
      //   Notification.requestPermission().then(async (perm) => {});
      //   if ("serviceWorker" in navigator) {
      //     // window.addEventListener("load", function () {
      //     navigator.serviceWorker.register("./sw.js").then(
      //       async function (registration) {
      //         // console.log("subscribe to push manager");
      //         const subscribeOptions = {
      //           userVisibleOnly: true,
      //           applicationServerKey: process.env.NEXT_PUBLIC_VAPID,
      //           //      "BHVgKdVS-qTStVoxSfoJXjq7jkih61cy3FGFA4IHqM_vh4xWUbgzJKq2fFrcwdssflAqxaYWzleTFzWiLdbkBz8",
      //         };
      //         let existingSubscription =
      //           await registration.pushManager.getSubscription();
      //         try {
      //           if (!existingSubscription) {
      //             console.log(
      //               "no subscription yet, going to subscribe one then save to database"
      //             );
      //             let pushSubscription =
      //               await registration.pushManager.subscribe(subscribeOptions);
      //             let newSubscription = await axios
      //               .post(`/api/user/web-push/save-subscription`, {
      //                 pushSubscription,
      //               })
      //               .then((r) => r.data);
      //             console.log("newSubscription", newSubscription);
      //           } else {
      //             console.log("subscription exists", existingSubscription);
      //           }
      //         } catch (err) {
      //           console.log(err);
      //         }
      //       },
      //       function (err) {
      //         console.log("Service Worker registration failed: ", err);
      //       }
      //     );
      //   }
      // }
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
      <Box
        w="100%"
        minH="100vh"
        h="auto"
        display={"flex"}
        position={"relative"}
      >
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
          <Box
            h="75px"
            minH="75px"
            bg="brand.neutral5"
            key="challenges-layout-hack"
          />
        </Box>
        <FloatingFooter />
      </Box>
    );
  } else {
    if (router.pathname === "/") {
      return (
        <Box
          w="100%"
          minH="100vh"
          h="auto"
          display={"flex"}
          position={"relative"}
        >
          <RiftlyConnectBoard />
        </Box>
      );
    } else {
      return (
        <Box
          w="100%"
          minH="100vh"
          h="auto"
          display={"flex"}
          position={"relative"}
        >
          {children}
        </Box>
      );
    }
  }
}
