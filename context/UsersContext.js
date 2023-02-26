import React, { useState, useEffect, useCallback } from "react";
import { useAdminRefreshUserStats, useAdminUserStatsQuery } from "@shared/HOC/user";
import {

  useDisclosure,

} from "@chakra-ui/react";
import Enums from "@enums/index";



export const UsersContext = React.createContext();

export function UsersProvider({ props, children }) {

  const [allUsers, isLoadingUserStats] = useAdminUserStatsQuery();
  const [filterUsers, filterUsersSet] = useState(null);
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
  })

  const filterSidebar = useDisclosure();
  const userSidebar = useDisclosure();

  useEffect(async () => {
    if (allUsers) {
      try {
        let filterResult = [...allUsers];
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
  }, [allUsers, filterObj]);

  const viewUserDetails = useCallback((user) => {
    userDetailsSet(user);
    userSidebar.onOpen();
  });

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