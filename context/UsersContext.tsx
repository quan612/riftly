import React, { useState, useEffect, useCallback } from "react";
import { useAdminRefreshUserStats, useAdminUserStatsQuery } from "@shared/HOC/user";
import { useDisclosure } from "@chakra-ui/react";
import Enums from "@enums/index";
import type Prisma from "@prisma/client";
import { getNftOwners } from "@components/admin/search/users/helper";
import { utils } from "ethers";
import { RewardFilterType, WhiteListAggregate } from "types/common";

type UsersFilterType = {
    type: string;
    contract: string;
    user: string;
    chainId: string;
    rewards?: RewardFilterType[];
};

type UsersContextType = {
    isLoadingUserStats: boolean;
    allUsers: Prisma.WhiteList[] | null;
    filterUsers: Prisma.WhiteList[] | null;
    filterSidebar: any;
    userSidebar: any;
    filterObj: UsersFilterType;
    filterObjSet: any;
    resetFilter: () => void;
    viewUserDetails: (user: Prisma.WhiteList) => void;
    userDetails: WhiteListAggregate;
};

export const UsersContext = React.createContext<UsersContextType | null>(null);

const UsersProvider: React.FC<React.ReactNode> = ({ children }) => {
    const { data: allUsers, isLoading: isLoadingUserStats } = useAdminUserStatsQuery();
    const [filterUsers, filterUsersSet] = useState(null);
    const [userDetails, userDetailsSet] = useState(null);

    const [filterObj, filterObjSet] = useState({
        type: Enums.WALLET,
        contract: "",
        user: "",
        chainId: "eth",
        rewards: [],
    });

    const resetFilter = useCallback(() => {
        filterObjSet({
            type: Enums.WALLET,
            contract: "",
            user: "",
            chainId: "eth",
            rewards: [],
        });
    }, [filterObj]);

    const filterSidebar = useDisclosure();
    const userSidebar = useDisclosure();

    useEffect(() => {
        const filterUsers = async () => {
            if (allUsers) {
                try {
                    let filterResult = [...(allUsers as WhiteListAggregate[])];
                    const { contract, chainId, user, rewards, type } = filterObj;
                    if (contract?.trim().length > 0) {
                        let owners = await getNftOwners(utils.getAddress(contract), chainId);
                        filterResult = filterResult.filter((w) => owners.includes(w.wallet));
                    }
                    if (user?.trim().length > 0) {
                        //todo change users filter here
                        switch (type) {
                            case Enums.WALLET:
                                filterResult = filterResult.filter((w) => w.wallet === user);
                                break;
                            case Enums.TWITTER:
                                filterResult = filterResult.filter(
                                    (w) => w.twitterUserName?.toLowerCase().indexOf(user.toLowerCase()) >= 0
                                );
                                break;
                            case Enums.DISCORD:
                                filterResult = filterResult.filter(
                                    (w) => w.discordUserDiscriminator?.toLowerCase().indexOf(user.toLowerCase()) >= 0
                                );
                                break;
                            case Enums.EMAIL:
                                filterResult = filterResult.filter((w) => w.email?.indexOf(user) >=0);
                                break;
                            default:
                        }
                    }
                    if (rewards.length > 0) {
                        for (let rewardFilter of rewards) {
                            if (rewardFilter?.minQty > 0) {
                                filterResult = filterResult.filter((row) => {
                                    let rewardIndex = row.rewards.findIndex(
                                        (userReward) => userReward.rewardTypeId === rewardFilter.id
                                    );
                                    if (rewardIndex === -1) {
                                        return false;
                                    }
                                    if (
                                        row.rewards[rewardIndex].quantity < rewardFilter.minQty ||
                                        row.rewards[rewardIndex].quantity > rewardFilter.maxQty
                                    ) {
                                        return false;
                                    }

                                    return true;
                                });
                            }
                        }
                    }

                    filterUsersSet(filterResult);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        filterUsers();
    }, [allUsers, filterObj]);

    const viewUserDetails = useCallback((user) => {
        userDetailsSet(user);
        userSidebar.onOpen();
    }, []);

    return (
        <UsersContext.Provider
            value={{
                isLoadingUserStats,
                allUsers,
                filterUsers,
                filterSidebar,
                userSidebar,
                filterObj,
                filterObjSet,
                resetFilter,
                viewUserDetails,
                userDetails,
            }}
        >
            {children}
        </UsersContext.Provider>
    );
};

export default UsersProvider;
