import React from "react";
import { Image, Input, ModalOverlay, Modal, ModalContent, ModalBody } from "@chakra-ui/react";

export default function Loading() {
    return (
        <Modal isOpen isCentered>
            <ModalOverlay bg="#1D3148" opacity="0.7" />
            <ModalContent
                w={"container.sm"}
                bg={"transparent"}
                maxW="container.sm"
                transition={"1.25s"}
                alignItems="center"
                justifyContent={"center"}
            >
                <Image
                    position={"absolute"}
                    src="/img/user/loading.gif"
                    w={{ base: "100px", lg: "150px" }}
                    fit={"fill"}
                />
            </ModalContent>
        </Modal>
    );
}
