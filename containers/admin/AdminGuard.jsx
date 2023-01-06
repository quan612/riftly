import React, { useEffect, useContext } from "react";
import { Web3Context } from "@context/Web3Context";

export function AdminGuard({ children }) {
    const { web3Error, session } = useContext(Web3Context);
    if (web3Error) {
        return (
            <div className="d-flex justify-content-center align-items-center fs-1 text-red-500">
                {web3Error}
            </div>
        );
    }

    if (session && session.user.isAdmin) {
        return <>{children}</>;
    }

    if (session && !session.user?.isAdmin) {
        return <>You are not admin.</>;
    }
    if (web3Error) {
        <div className="d-flex justify-content-center align-items-center fs-1 text-blue-500">
            {web3Error}
        </div>;
    }
    return (
        <div className="d-flex justify-content-center align-items-center fs-1 text-blue-500">
            PLEASE LOGIN {web3Error} {session}
        </div>
    );
}
