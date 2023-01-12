import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";
import Enums from "enums";
import { utils } from "ethers";

export const useAdminUserQuestsQuery = () => {
    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`${Enums.BASEPATH}/api/admin/search/user-quests`, payload)
            .then((r) => r.data);

    });

    return [data, isLoading, mutateAsync];
};

export const useAdminUserQuestDelete = () => {
    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`${Enums.BASEPATH}/api/admin/user-quest/delete`, payload)
            .then((r) => r.data);

    });

    return [data, isLoading, mutateAsync];
};
// export const useAdminRewardTypeMutation = () => {
//     const queryClient = useQueryClient();
//     const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
//         return axios
//             .post(`${Enums.BASEPATH}/api/admin/settings/reward-types/upsert`, payload)
//             .then((r) => r.data);

//     }, {
//         onSuccess: () => {
//             queryClient.invalidateQueries("rewardTypesQuery");
//         },
//     });

//     return [data, isLoading, mutateAsync];
// };