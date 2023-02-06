import React, { useEffect, useContext } from "react";
import { Web3Context } from "@context/Web3Context";
import { Text } from "@chakra-ui/react";

export function AdminGuard({ children }) {
    const { web3Error, session } = useContext(Web3Context);
    if (web3Error) {
        return <Text color="red.300">{web3Error}</Text>;
    }

    if (session && session.user.isAdmin) {
        return <>{children}</>;
    }

    if (session && !session.user?.isAdmin) {
        return <Text color="red.300">Not having admin privileges</Text>;
    }

    return null;
}
