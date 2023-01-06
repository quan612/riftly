import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import {
    recoverPersonalSignature,
    recoverTypedSignature,
    SignTypedDataVersion,
} from "@metamask/eth-sig-util";
import * as ethUtil from "ethereumjs-util";
import { prisma } from "@context/PrismaContext";
import { utils } from "ethers";
import Enums from "enums";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";

import UAuth from "@uauth/js";
import { getVariableConfig } from "repositories/config";
const { default: Resolution } = require("@unstoppabledomains/resolution");
const resolution = new Resolution();

const uauth = new UAuth({
    clientID: process.env.NEXT_PUBLIC_UNSTOPPABLE_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_UNSTOPPABLE_REDIRECT_URI,
    scope: "openid wallet",
});

const CryptoJS = require("crypto-js");

const {
    NEXT_PUBLIC_NEXTAUTH_SECRET,
} = process.env;



export const authOptions = {
    providers: [
        /*   
            Update new nonce for next time authentication
            Authenticating by rebuilding the owner address from the signature and compare with the submitted address
        */
        CredentialsProvider({
            id: "admin-authenticate",
            name: "admin-authenticate",
            type: "credentials",

            authorize: async (credentials, req) => {
                try {
                    const { address, signature } = credentials;
                    if (!address || !signature) throw new Error("Missing address or signature");

                    let wallet = utils.getAddress(address);
                    if (!wallet && !utils.isAddress(address))
                        throw new Error("Invalid wallet address");

                    const admin = await prisma.admin.findUnique({
                        where: {
                            wallet,
                        },
                    });

                    if (!admin) throw new Error("Wallet address not belong to any admin!");

                    const nonce = admin.nonce.trim();
                    const msg = `${Enums.ADMIN_SIGN_MSG}: ${nonce}`;

                    const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, "utf8"));
                    const originalAddress = recoverPersonalSignature({
                        data: msgBufferHex,
                        signature: signature,
                    });

                    if (originalAddress.toLowerCase() !== address.toLowerCase())
                        throw new Error("Signature verification failed");

                    const newNonce = CryptoJS.lib.WordArray.random(16).toString();

                    let res = await prisma.Admin.update({
                        where: {
                            //wallet: { equals: originalAddress.toLowerCase(), mode: "insensitive" },
                            id: admin.id,
                        },
                        data: {
                            nonce: newNonce,
                        },
                    });

                    if (!res) {
                        console.error("cannot update new nonce");
                    }

                    console.log("Authenticated as admin successfully");
                    return { address: originalAddress, isAdmin: true };
                } catch (error) {
                    throw new Error(error);
                }
            },
        }),
        CredentialsProvider({
            id: "non-admin-authenticate",
            name: "Non-admin authentication",
            type: "credentials",
            authorize: async (credentials, req) => {
                try {
                    console.log("Authenticating as user");
                    let { address, signature } = credentials;

                    if (!address || !signature) throw new Error("Missing address or signature");

                    if (utils.getAddress(address) && !utils.isAddress(address))
                        throw new Error("Invalid address");

                    const user = await prisma.whiteList.findFirst({
                        where: {
                            wallet: { equals: address, mode: "insensitive" },
                        },
                    });

                    if (!user) {
                        throw new Error("This wallet account is not in our record.");
                    }

                    const msg = `${Enums.USER_SIGN_MSG}`;

                    const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, "utf8"));

                    const originalAddress = recoverPersonalSignature({
                        data: msgBufferHex,
                        signature: signature.trim(),
                    });

                    if (originalAddress.toLowerCase() !== address.toLowerCase())
                        throw new Error("Signature verification failed");

                    console.log("Authenticated as user successfully");



                    return { address: originalAddress, isAdmin: false, userId: user.userId };
                } catch (error) {
                    console.log(error);
                }
            },
        }),
        CredentialsProvider({
            id: "unstoppable-authenticate",
            name: "Unstoppable authentication",
            type: "credentials",
            authorize: async (credentials, req) => {
                try {

                    console.log("Authenticating as unstoppable user");
                    let { uathUser, address, message, signature, authorization } = credentials;

                    // if (!address || !uathUser || !authorization) {
                    //     console.log("Missing unstoppable info");
                    //     throw new Error("Missing unstoppable info");
                    // }

                    if (utils.getAddress(address) && !utils.isAddress(address))
                        throw new Error("Invalid address");

                    const user = await prisma.whiteList.findFirst({
                        where: {
                            uathUser,
                        },
                    });
                    // let test = await uauth.user();
                    // console.log("test", test)

                    let type = "sig",
                        version = "v1";

                    const {
                        address: originalAddress,
                        message: originalMessage,
                        signature: originalSignature,
                    } = await uauth.getAuthorizationAccount(JSON.parse(authorization), type, version);

                    console.log("Authenticated as user successfully");

                    return {
                        address,
                        message,
                        signature,
                        isAdmin: false,
                        userId: user?.userId,
                        uauthUser: uathUser,
                        originalAddress,
                        originalMessage,
                        originalSignature,
                    };
                } catch (error) {
                    console.log(error);
                }
            },
        }),
        DiscordProvider({
            /* default should be [origin]/api/auth/callback/[provider] ~ https://next-auth.js.org/configuration/providers/oauth */
            clientId: await getVariableConfig("discordId"),
            clientSecret: await getVariableConfig("discordSecret")
        }),
        TwitterProvider({
            clientId: await getVariableConfig("twitterId"),
            clientSecret: await getVariableConfig("twitterSecret"),
            version: "2.0",
        }),
    ],
    debug: false,
    session: {
        jwt: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
    },
    jwt: {
        signingKey: NEXT_PUBLIC_NEXTAUTH_SECRET,
    },
    callbacks: {
        signIn: async (user, account, profile) => {
            // console.log("Provider: " + user?.account?.provider);

            if (user?.account?.provider === "unstoppable-authenticate") {
                let uathUser = user.credentials.uathUser;
                const existingUser = await prisma.whiteList.findFirst({
                    where: {
                        uathUser: uathUser,
                    },
                });
                if (!existingUser) {
                    console.log("Unstoppable domain is not linked.");
                    let error = `Unstoppable domain ${uathUser} is not linked.`;
                    return `/challenger/quest-redirect?error=${error}`;
                }

                let credentials = user?.credentials;
                let userInfo = user?.user;

                // console.log(credentials.message)
                // console.log(credentials.signature)
                // console.log(userInfo.message)
                // console.log(userInfo.signature)
                if (
                    // credentials.address.toLowerCase() != userInfo.address.toLowerCase() ||
                    credentials.message != userInfo.message ||
                    credentials.signature != userInfo.signature
                ) {
                    console.log("Invalid unstoppable authorization.")
                    let error = `Invalid unstoppable authorization.`;
                    return `/challenger/quest-redirect?error=${error}`;
                }



                return true;
            }
            if (user?.account?.provider === "discord") {
                let discordId = user.account.providerAccountId;
                const existingUser = await prisma.whiteList.findFirst({
                    where: {
                        discordId,
                    },
                });

                if (!existingUser) {
                    let error = `Discord ${user.profile.username}%23${user.profile.discriminator} not found in our database.`;
                    return `/challenger/quest-redirect?error=${error}`;
                }
                return true;
            }

            if (user.account.provider === "twitter") {
                let twitterId = user.account.providerAccountId;

                const existingUser = await prisma.whiteList.findFirst({
                    where: {
                        twitterId,
                    },
                });

                if (!existingUser) {
                    let error = `Twitter account ${user.user.name} not found in our database.`;
                    return `/challenger/quest-redirect?error=${error}`;
                }
                return true;
            }

            return true;
        },
        async redirect({ url, baseUrl }) {
            return url;
        },
        async jwt({ token, user, account, profile }) {
            if (user) {
                token.profile = profile;
                token.user = user;
                token.provider = account?.provider;
            }

            return token;
        },
        async session({ session, token }) {
            if (token.provider === "admin-authenticate") {
                session.profile = token.profile || null;
                session.user = token.user;
                session.provider = token.provider;
                return session;
            } else {
                let userQuery;
                if (token.provider === "twitter") {
                    userQuery = await prisma.whiteList.findFirst({
                        where: {
                            twitterId: token?.user?.id,
                        },
                    });
                }
                if (token.provider === "discord") {
                    userQuery = await prisma.whiteList.findFirst({
                        where: {
                            discordId: token?.user?.id,
                        },
                    });
                }

                session.profile = token.profile || null;
                session.user = token.user;
                session.provider = token.provider;

                if (!session.user.userId) {
                    session.user.address = userQuery.wallet || "";
                    session.user.userId = userQuery.userId;
                    session.user.uathUser = userQuery.uathUser || "";
                }
                return session;
            }
        },
    },
    secret: NEXT_PUBLIC_NEXTAUTH_SECRET,
};

export default (req, res) => {
    if (process.env.VERCEL) {
        // prefer NEXTAUTH_URL, fallback to x-forwarded-host
        req.headers["x-forwarded-host"] =
            process.env.NEXTAUTH_URL || req.headers["x-forwarded-host"];
    }
    return NextAuth(req, res, authOptions);
};

/*
 console.log("correct addr" + address);
                    // if (originalAddress.toLowerCase() !== address.toLowerCase())
                    //     throw new Error("Signature verification failed");
                    const provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/e26c48fe88884b9f997fc96344dd0f6a")
                    const web3 = new Web3(provider);

                    // console.log("signature", signature)
                    // console.log("message", message)


                    // let test = utils.verifyMessage(message, signature)
                    // console.log(test)

                    // const msg = `${Enums.USER_SIGN_MSG}`;

                    const msg =
                        `identity.unstoppabledomains.com wants you to sign in with your Ethereum account:0x9128C112f6BB0B2D888607AE6d36168930a37087
    
I consent to giving access to: openid wallet
    
URI: uns:quan612.wallet
Version: 1
Chain ID: 1
Nonce: 0x7615b547bc31c1b31029949196083b6a3014dbcce03f32139c895343ee01f935
Issued At: 2022-11-15T20:12:57.971Z`;

                    let data = web3.eth.accounts.recover(msg, signature);
                    console.log("web3 test: ", data);


                    const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, "utf8"));
                    const originalAddress = recoverPersonalSignature({
                        data: msgBufferHex,
                        signature: signature.trim(),
                    });
                    console.log("originalAddress: ", originalAddress)
                    // const msgBuffer = ethUtil.toBuffer("Signing abcdse");
                    // const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
                    // const signatureBuffer = ethUtil.toBuffer(signature);

                    // const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
                    // const publicKey = ethUtil.ecrecover(
                    //     msgHash,
                    //     signatureParams.v,
                    //     signatureParams.r,
                    //     signatureParams.s
                    // );
                    // const addressBuffer = ethUtil.publicToAddress(publicKey);
                    // const abcde = ethUtil.bufferToHex(addressBuffer);
                    // console.log(abcde)
*/
