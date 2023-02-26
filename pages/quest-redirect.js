import React from "react";

import { useRouter } from "next/router";

import {
    Heading,
    Box,
    Flex,
    Text,
    Button,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react"
import { ShortContainer } from "containers/user";
import { RiftlyFace, RiftlyLogoWhite } from "@components/shared/Logo";
import { getUserName } from "@utils/index";
import { LayoutWrapper } from "@components/end-user/UserLayout";


function QuestRedirectPage() {
    let router = useRouter();
    const { data: session, status } = useSession()
    return (
        <LayoutWrapper>
            <Box position="absolute"
                w="100%"
                h="25%"
                top={0}
            >
                <Flex
                    h="100%"
                    alignItems="center"
                    justifyContent={"center"}
                >
                    <Box w={{ base: "100px", md: "150px", xl: "200px" }}>
                        <RiftlyLogoWhite />
                    </Box>
                </Flex>

            </Box>

            <ShortContainer>
                <Flex alignItems={"center"} gap="24px">
                    <Box boxSize={24}>
                        <RiftlyFace />
                    </Box>
                    {session && (
                        <Heading size="md" fontWeight="700" color="#fff">{getUserName(session)}</Heading>
                    )}
                </Flex>



                {router?.query?.result && <Heading size="lg" color="#fff" mb="16px" align="center" >
                    {router?.query?.result}
                </Heading>}

                {router?.query?.error && <Heading size="lg" color="#fff" mb="16px" align="center" >
                    {router?.query?.error}
                </Heading>}

                <Button
                    w={"100%"}
                    size="lg"
                    variant="blue"
                    onClick={() => router.push("/")}
                >
                    {session ? "Back to Challenges" : "Back"}
                </Button>

            </ShortContainer>
        </LayoutWrapper>
    );
}

export default QuestRedirectPage;