import React, { useState, useEffect, useCallback } from "react";
import { useAdminRefreshUserStats, useAdminUserStatsQuery } from "@shared/HOC/user";
import {
  useDisclosure,
} from "@chakra-ui/react";
import Enums from "@enums/index";
import type Prisma from "@prisma/client";
import { getNftOwners } from "@components/admin/search/user-stats/helper";
import { utils } from "ethers";
import { WhiteListAggregate } from "types/common";


type UsersContextType = {
        isLoadingUserStats: boolean,
        allUsers: Prisma.WhiteList[] | null,
        filterUsers: Prisma.WhiteList[] | null,
        filterSidebar: any,
        userSidebar: any,
        filterObj: any,
        filterObjSet: any,
        resetFilter: () => void,
        viewUserDetails: (user: Prisma.WhiteList ) => void,
        userDetails: WhiteListAggregate
};


export const UsersContext = React.createContext<UsersContextType | null>(null);

const UsersProvider: React.FC<React.ReactNode> = ({  children }) => {

  const {data: allUsers, isLoading : isLoadingUserStats } = useAdminUserStatsQuery();
  const [filterUsers , filterUsersSet] = useState(null);
  const [userDetails, userDetailsSet] = useState(null);

  const [filterObj, filterObjSet] = useState({
    type: Enums.WALLET,
    contract: "",
    user: "",
    chainId: "eth",
  });

  const resetFilter = useCallback(() => {
    filterObjSet({
      type: Enums.WALLET,
      contract: "",
      user: "",
      chainId: "eth",
    })
  },[filterObj])

  const filterSidebar = useDisclosure();
  const userSidebar = useDisclosure();

  useEffect( () => {

    const filterUsers = async() => {
      if (allUsers) {
        try {
          let filterResult = [...allUsers as  Prisma.WhiteList[]];
          const { contract, chainId, user } = filterObj;
          if (contract?.trim().length > 0) {
            let owners = await getNftOwners(utils.getAddress(contract), chainId);
            filterResult = filterResult.filter((w) => owners.includes(w.wallet));
          }
          if (user?.trim().length > 0) {
            filterResult = filterResult.filter((w) => w.wallet === user);
          }
  
          filterUsersSet(filterResult);
        } catch (error) {
          console.log(error);
        }
      }
    }
    filterUsers()
  }, [allUsers, filterObj]);

  const viewUserDetails = useCallback((user) => {
    userDetailsSet(user);
    userSidebar.onOpen();
  },[]);

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
        userDetails
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export  default UsersProvider;