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
import { validateEmail } from "util/index";
const { default: Resolution } = require("@unstoppabledomains/resolution");
const resolution = new Resolution();

const uauth = new UAuth({
    clientID: process.env.NEXT_PUBLIC_UNSTOPPABLE_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_UNSTOPPABLE_REDIRECT_URI,
    scope: "openid wallet",
});

const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");

const { NEXTAUTH_SECRET } = process.env;

import { AccountStatus } from "@prisma/client";
import { getIsSMSVerificationRequired } from "repositories/user";


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

                    return { address: originalAddress, isAdmin: true };
                } catch (error) {
                    throw new Error(error);
                }
            },
        }),
        CredentialsProvider({
            id: "web3-wallet",
            name: "web3-wallet",
            type: "credentials",
            authorize: async (credentials, req) => {
                try {

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

                    return { address: originalAddress, isAdmin: false, userId: user.userId };
                } catch (error) {
                    throw error;
                }
            },
        }),
        CredentialsProvider({
            id: "unstoppable-authenticate",
            name: "Unstoppable authentication",
            type: "credentials",
            authorize: async (credentials, req) => {
                try {

                    let { uathUser, address, message, signature, authorization } = credentials;

                    // if (!address || !uathUser || !authorization) {

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

                    let type = "sig",
                        version = "v1";

                    const {
                        address: originalAddress,
                        message: originalMessage,
                        signature: originalSignature,
                    } = await uauth.getAuthorizationAccount(
                        JSON.parse(authorization),
                        type,
                        version
                    );

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
                    throw error
                }
            },
        }),
        CredentialsProvider({
            id: "email",
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "email",
            credentials: {
                email: {
                    label: "email",
                    type: "email",
                    placeholder: "jsmith@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const { email, password } = credentials;

                // sanitize email field

                //check user and password
                if (!validateEmail(email)) {
                    throw new Error("Invalid email.");
                }
                if (password.trim().length === 0) {
                    throw new Error("Blank password.");
                }

                const currentUser = await prisma.whiteList.findFirst({
                    where: {
                        email: { equals: email, mode: "insensitive" },
                    },
                });

                if (!currentUser) {
                    throw new Error("This email account is not found.");
                }

                // bcrypt check
                const comparePassword = await bcrypt.compare(password, currentUser.password);
                if (!comparePassword) {
                    throw new Error("Wrong password entered.");
                }

                let isSMSVerificationRequired = await getIsSMSVerificationRequired()

                if (currentUser.status === AccountStatus.PENDING && isSMSVerificationRequired) {
                    throw new Error(`Pending Sign Up`);
                }

                return {
                    isAdmin: false,
                    userId: currentUser.userId,
                    email: currentUser.email,
                };
            },
        }),
        DiscordProvider({
            /* default should be [origin]/api/auth/callback/[provider] ~ https://next-auth.js.org/configuration/providers/oauth */
            clientId: await getVariableConfig("discordId"),
            clientSecret: await getVariableConfig("discordSecret"),
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
        maxAge: 60 * 60, // 7 days
    },
    jwt: {
        signingKey: NEXTAUTH_SECRET,
    },
    callbacks: {
        signIn: async (user, account, profile) => {

            if (user?.account?.provider === "admin-authenticate") {
                return true
            }
            let isSMSVerificationRequired = await getIsSMSVerificationRequired()
            if (user?.account?.provider === "unstoppable-authenticate") {
                let uathUser = user.credentials.uathUser;
                const existingUser = await prisma.whiteList.findFirst({
                    where: {
                        uathUser: uathUser,
                    },
                });
                if (!existingUser) {
                    let error = `Unstoppable domain ${uathUser} is not linked.`;

                    return `/quest-redirect?error=${error}`;
                }

                let credentials = user?.credentials;
                let userInfo = user?.user;

                if (
                    // credentials.address.toLowerCase() != userInfo.address.toLowerCase() ||
                    credentials.message != userInfo.message ||
                    credentials.signature != userInfo.signature
                ) {
                    let error = `Invalid unstoppable authorization.`;
                    return `/quest-redirect?error=${error}`;
                }
                return false; // not supporting right now
            }
            if (user?.account?.provider === "email") {
                try {

                    let email = user?.user?.email

                    await prisma.whiteList.findFirst({
                        where: {
                            email,
                        },
                    });

                    // should not be here, throw from authorize
                    // if (existingUser.status === AccountStatus.PENDING) {
                    //     throw new Error(`/sms-verification?account=${email}&type=${Enums.EMAIL}`);
                    // }

                    return true;
                } catch (error) {
                    return false
                }
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
                    return `/quest-redirect?error=${error}`;
                }
                if (existingUser.status === AccountStatus.PENDING && isSMSVerificationRequired) {
                    return `/sms-verification?account=${address}&type=${Enums.DISCORD}`;
                }
                return true;
            }
            if (user?.account?.provider === "twitter") {
                let twitterId = user.account.providerAccountId;

                const existingUser = await prisma.whiteList.findFirst({
                    where: {
                        twitterId,
                    },
                });

                if (!existingUser) {
                    let error = `Twitter account ${user.user.name} not found.`;
                    return `/quest-redirect?error=${error}`;
                }
                if (existingUser.status === AccountStatus.PENDING && isSMSVerificationRequired) {
                    return `/sms-verification?account=${address}&type=${Enums.TWITTER}`;
                }
                return true;
            }

            if (user?.account?.provider === "web3-wallet") {
                let userId = user?.user?.userId
                let address = user?.user?.address
                const existingUser = await prisma.whiteList.findUnique({
                    where: {
                        userId
                    },
                });

                if (!existingUser) {
                    let error = `Wallet account ${address} not found in our database.`;
                    return `/quest-redirect?error=${error}`;
                }

                if (existingUser.status === AccountStatus.PENDING && isSMSVerificationRequired) {
                    return `/sms-verification?account=${address}&type=${Enums.WALLET}`;
                }
                return true;
            }

            return false;
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

                let userQuery = await prisma.whiteList.findFirst({
                    where: {
                        userId: token?.user?.userId,
                    },
                });

                session.profile = token.profile || null;
                session.user = token.user;
                session.provider = token.provider;

                session.user.twitter = userQuery?.twitterUserName || ""
                session.user.discord = userQuery?.discordUserDiscriminator || ""
                session.user.email = userQuery?.email || ""
                session.user.avatar = userQuery?.avatar || ""
                session.user.wallet = userQuery?.wallet || "";

                if (!session.user.userId) {
                    session.user.userId = userQuery.userId;
                    session.user.uathUser = userQuery?.uathUser || "";
                }
                return session;
            }
        },
    },
    secret: NEXTAUTH_SECRET,
};

export default (req, res) => {
    if (process.env.VERCEL) {
        // prefer NEXTAUTH_URL, fallback to x-forwarded-host
        req.headers["x-forwarded-host"] =
            process.env.NEXTAUTH_URL || req.headers["x-forwarded-host"];
    }
    return NextAuth(req, res, authOptions);
};