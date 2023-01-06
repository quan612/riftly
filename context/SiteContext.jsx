import React, { useState } from "react";

export const SiteContext = React.createContext();

export function SiteProvider({ children }) {
    const [currentAccount, setCurrentAccount] = useState("");

    function handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            // MetaMask is locked or the user has not connected any accounts
        } else if (accounts[0] !== currentAccount) {
            return accounts[0];
        }
    }

    const CheckIfWalletIsConnected = async (ethereum) => {
        try {
            if (!ethereum)
                return alert(
                    "Metamask is either not installed or you haven't enabled it for this website."
                );

            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (accounts.length) {
                return accounts[0];
            } else {
            }
        } catch (error) {
            throw new error("No ethereum object from Metamask");
        }
    };

    const ConnectWallet = async (ethereum) => {
        if (!ethereum.isConnected())
            return alert(
                "Metamask is either not installed or you haven't enabled it for this website."
            );

        let account = await ethereum
            .request({ method: "eth_requestAccounts" })
            .then(handleAccountsChanged)
            .catch((err) => {
                if (err.code === 4001) {
                    // EIP-1193 userRejectedRequest error
                    // If this happens, the user rejected the connection request.
                } else {
                    console.error(err);
                }
            });
        setCurrentAccount(account);
        ListenToWalletAccountChange(ethereum);
    };

    const ListenToWalletAccountChange = async (ethereum) => {
        ethereum.on("accountsChanged", async function () {
            setCurrentAccount(null);
        });
    };

    return (
        <SiteContext.Provider
            value={{
                ConnectWallet,
                CheckIfWalletIsConnected,
                currentAccount,
            }}
        >
            {children}
        </SiteContext.Provider>
    );
}
