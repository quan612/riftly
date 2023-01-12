import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";
import Enums from "enums";
import { utils } from "ethers";

const PENDING_REWARD_SUBMIT = `${Enums.BASEPATH}/api/admin/reward/addPending`;
const PENDING_REWARD_QUERY = `${Enums.BASEPATH}/api/user/reward/getPending`;
const USER_GET_CLAIMED_REWARD = `${Enums.BASEPATH}/api/user/reward/getClaimed`;
const USER_CLAIMED_REWARD = `${Enums.BASEPATH}/api/user/reward/claim`;

export const withRewardTypeQuery =
    (Component) =>
        ({ ...props }) => {
            const { data, status, isLoading, error } = useQuery("rewardTypeQuery", () =>
                axios.get(REWARD_TYPE_QUERY)
            );

            return (
                <Component
                    {...props}
                    isFetchingRewardType={isLoading}
                    rewardTypes={data?.data}
                    queryError={error}
                />
            );
        };


export const useRewardTypesQuery = () => {
    const { data, status, isLoading, error } = useQuery("rewardTypesQuery",
        () => { return axios.get(`${Enums.BASEPATH}/api/admin/rewardType`).then((r) => r.data); },
        { staleTime: 60 * 60 });

    return [data, isLoading];
};

export const useEnabledRewardTypesQuery = () => {
    const { data, status, isLoading, error } = useQuery("rewardTypesQuery",
        () => { return axios.get(`${Enums.BASEPATH}/api/admin/rewardType`).then((r) => r.data.filter(r => r.isEnabled === true)); },
        { staleTime: 60 * 60 });

    return [data, isLoading];
};

export const useAdminRewardTypeMutation = () => {
    const queryClient = useQueryClient();
    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`${Enums.BASEPATH}/api/admin/settings/reward-types/upsert`, payload)
            .then((r) => r.data);

    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("rewardTypesQuery");
        },
    });

    return [data, isLoading, mutateAsync];
};