import React, { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";

import { ethers, utils } from "ethers";
import axios from "axios";
import Enums from "enums";
import WalletConnectProvider from "@walletconnect/web3-provider";

const util = require("util");
const API_ADMIN = `${Enums.BASEPATH}/api/admin`;
const API_USER = `${Enums.BASEPATH}/api/user`;

import UAuth from "@uauth/js";
// import { useWalletAuthQuestSubmit } from "@shared/HOC/quest";
const { default: Resolution } = require("@unstoppabledomains/resolution");
const resolution = new Resolution();

const uauth = new UAuth({
    clientID: process.env.NEXT_PUBLIC_UNSTOPPABLE_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_UNSTOPPABLE_REDIRECT_URI,
    scope: "openid wallet",
});

export const Web3Context = React.createContext();
export function Web3Provider({ session, children }) {
    const [web3Error, setWeb3Error] = useState(null);

    let signMessageTimeout;

    function iOS() {
        return (
            [
                "iPad Simulator",
                "iPhone Simulator",
                "iPod Simulator",
                "iPad",
                "iPhone",
                "iPod",
            ].includes(navigator.platform) ||
            // iPad on iOS 13 detection
            (navigator.userAgent.includes("Mac") && "ontouchend" in document)
        );
    }

    useEffect(() => {
        removeLocalStorageWalletConnect();
        document.addEventListener("visibilitychange", function () {
            // if (window.visibilityState === "hidden") {
            localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
            //  }
        });

        return () => {
            if (signMessageTimeout) {
                clearTimeout(signMessageTimeout);
            }
        };
    }, []);

    useEffect(async () => {
        if (session && window?.ethereum) {
            if (window?.ethereum) {
                subscribeProvider(window.ethereum);
            }
        }
    }, [session]);

    const subscribeProvider = async (provider) => {
        try {
            provider.on("error", (e) => console.error("WS Error", e));
            provider.on("end", (e) => console.error("WS End", e));

            provider.on("accountsChanged", async (accounts) => {
                SignOut();
            });

            provider.on("chainChanged", async (chainId) => {
                SignOut();
            });

            provider.on("connect", (info) => {});

            provider.on("disconnect", async (error) => {
                SignOut();
            });
        } catch (error) {}
    };

    const adminSignIn = async (walletType) => {
        if (!walletType) {
            throw new Error("Missing type of wallet when trying to setup wallet provider");
        }

        let addresses, providerInstance;
        if (walletType === Enums.METAMASK) {
            providerInstance = new ethers.providers.Web3Provider(window.ethereum);
            addresses = await providerInstance.send("eth_requestAccounts", []);
            subscribeProvider(window.ethereum);
        } else if (walletType === Enums.WALLETCONNECT) {
            let provider = new WalletConnectProvider({
                infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
                qrcodeModalOptions: {
                    mobileLinks: ["trust"],
                    desktopLinks: ["encrypted ink"],
                },
            });
            await provider.enable();

            providerInstance = new ethers.providers.Web3Provider(provider);
            addresses = provider.accounts;

            subscribeProvider(provider);
        }

        try {
            if (addresses.length === 0) {
                setWeb3Error("Account is locked, or is not connected, or is in pending request.");
                return;
            }

            const admin = await axios.get(API_ADMIN, {
                params: {
                    address: addresses[0],
                },
            });

            if (!admin.data) {
                setWeb3Error("Cannot authenticate as admin with current wallet account");
                return;
            }

            const nonce = admin.data.nonce.trim();

            signMessageTimeout = setTimeout(async () => {
                const signer = await providerInstance.getSigner();
                const signature = await signer.signMessage(`${Enums.ADMIN_SIGN_MSG}: ${nonce}`);
                const address = await signer.getAddress();

                await signIn("admin-authenticate", {
                    redirect: true,
                    signature,
                    address,
                });
            }, 1000);
        } catch (error) {}
    };

    const signInWithWallet = async (walletType) => {
        if (!walletType) {
            throw new Error("Missing wallet type.");
        }
        try {
            let addresses, providerInstance;

            if (walletType === Enums.METAMASK) {
                providerInstance = new ethers.providers.Web3Provider(window.ethereum);
                addresses = await providerInstance.send("eth_requestAccounts", []);
                subscribeProvider(window.ethereum);
            } else if (walletType === Enums.WALLETCONNECT) {
                let provider = new WalletConnectProvider({
                    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
                    qrcodeModalOptions: {
                        mobileLinks: ["trust", "metamask", "coinbase", "rainbow"],
                        desktopLinks: ["encrypted ink"],
                    },
                });
                await provider.enable();

                providerInstance = new ethers.providers.Web3Provider(provider);

                addresses = provider?.accounts;
                subscribeProvider(provider);
            }

            if (addresses.length === 0) {
                setWeb3Error("Account is locked, or is not connected, or is in pending request.");
                return;
            }
            const user = await axios.get(API_USER, {
                params: {
                    address: addresses[0],
                },
            });

            if (!user || !user.data || user.data.isError) {
                setWeb3Error("User not found, please sign up.");
                return;
            }

            const promise = new Promise((resolve, reject) => {
                let timeout = setTimeout(async function () {
                    try {
                        let signer, signature;

                        signer = await providerInstance.getSigner();

                        signature = await signer
                            .signMessage(`${Enums.USER_SIGN_MSG}`)
                            .catch((err) => {
                                console.log(1);
                                throw new Error("User rejects signing.");
                            });

                        if (signature && addresses[0]) {
                            signIn("non-admin-authenticate", {
                                redirect: true,
                                signature,
                                address: addresses[0],
                            }).catch((error) => {
                                setWeb3Error(error.message);
                                reject(error.message);
                            });
                            clearTimeout(timeout);
                            resolve(); // if the previous line didn't always throw
                        }
                        clearTimeout(timeout);
                        reject("Missing address or signature");
                    } catch (e) {
                        clearTimeout(timeout);
                        reject(e);
                    }
                }, 500);
            });

            return promise;
        } catch (error) {
            if (error.message.indexOf("user rejected signing") !== -1) {
                setWeb3Error("User rejected signing message.");
            } else {
                setWeb3Error(error.message);
            }
        }
    };

    const signUpWithWallet = async (walletType) => {
        try {
            if (!walletType) {
                throw new Error("Missing type of wallet when trying to setup wallet provider");
            }

            let addresses, providerInstance;

            if (walletType === Enums.METAMASK) {
                providerInstance = new ethers.providers.Web3Provider(window.ethereum);
                addresses = await providerInstance.send("eth_requestAccounts", []);
            } else if (walletType === Enums.WALLETCONNECT) {
                let provider = new WalletConnectProvider({
                    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
                    qrcodeModalOptions: {
                        mobileLinks: ["trust"],
                        desktopLinks: ["encrypted ink"],
                    },
                });
                await provider.enable();

                providerInstance = new ethers.providers.Web3Provider(provider);
                addresses = provider.accounts;
            }

            if (addresses.length === 0) {
                setWeb3Error("Account is locked, or is not connected, or is in pending request.");
                return;
            }

            const promise = new Promise((resolve, reject) => {
                let timeout = setTimeout(async function () {
                    try {
                        let signer, signature;

                        signer = await providerInstance.getSigner();

                        signature = await signer
                            .signMessage(`${Enums.USER_SIGN_MSG}`)
                            .catch((err) => {
                                console.log(1);
                                throw new Error("User rejects signing.");
                            });

                        if (signature && addresses[0]) {
                            resolve({ signature, address: addresses[0] }); // if the previous line didn't always throw
                            // clearTimeout(timeout);
                        }
                        reject("Missing address or signature");
                    } catch (e) {
                        reject(e);
                    }
                }, 500);
            });

            return promise;
        } catch (error) {
            throw error;
        }
    };

    const SignOut = async () => {
        removeLocalStorageWalletConnect();
        removeLocalStorageUath();
        signOut();
    };

    const tryConnectAsUnstoppable = async () => {
        try {
            const authorization = await uauth.loginWithPopup();
            // console.log(authorization);
            // let authorization = true;
            if (authorization) {
                let user = await uauth.user();
                // console.log(user);
                let uathUser = user.sub;
                let address = user?.wallet_address;
                let message = user?.eip4361_message;
                let signature = user?.eip4361_message;

                // let uathUser = "quan612.wallet";
                // let address = "0x9128c112f6bb0b2d888607ae6d36168930a37087";
                // let message = "";
                // let signature = "";

                signIn("unstoppable-authenticate", {
                    redirect: true,
                    uathUser,
                    address,
                    message,
                    signature,
                    authorization: JSON.stringify(authorization),
                })
                    .then(({ ok, error }) => {
                        if (ok) {
                            return true;
                        } else {
                            return false;
                        }
                    })
                    .catch((err) => {});
            } else {
                setError("something wrong");
                setWeb3Error("Cannot authenticate with unstoppable");
            }
        } catch (error) {
            console.log(error);
            setWeb3Error(error.message);
        }
    };

    return (
        <Web3Context.Provider
            value={{
                adminSignIn,
                signInWithWallet,
                SignOut,
                signUpWithWallet,
                tryConnectAsUnstoppable,
                web3Error,
                setWeb3Error,
                session,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
}

const removeLocalStorageWalletConnect = () => {
    const walletConnectCache = localStorage.getItem("walletconnect");
    if (walletConnectCache) {
        localStorage.removeItem("walletconnect");
    }
    const walletMobileCache = localStorage.getItem("WALLETCONNECT_DEEPLINK_CHOICE");
    if (walletMobileCache) {
        localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
    }
};

const removeLocalStorageUath = () => {
    const openidCache = localStorage.getItem("openidConfiguration:");
    if (openidCache) {
        localStorage.removeItem("openidConfiguration:");
    }
    const uathRequestCache = localStorage.getItem("request");
    if (uathRequestCache) {
        localStorage.removeItem("request");
    }
    const uathUserCache = localStorage.getItem("username");
    if (uathUserCache) {
        localStorage.removeItem("username");
    }
};
