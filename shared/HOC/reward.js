import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";
import Enums from "enums";
import { utils } from "ethers";

const REWARD_TYPE_QUERY = `${Enums.BASEPATH}/api/admin/rewardType`;
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

export const withPendingRewardSubmit =
    (Component) =>
        ({ ...props }) => {
            const { data, error, isError, isLoading, isSuccess, mutateAsync } = useMutation(
                "pendingRewardSubmit",
                (pendingReward) => axios.post(`${Enums.BASEPATH}/api/admin/reward/addPending`, pendingReward)
            );

            const handleOnSubmit = async (pendingReward) => {
                return await mutateAsync(pendingReward);
            };

            return (
                <Component
                    {...props}
                    isSubmitting={isLoading}
                    submittedQuest={data?.data}
                    mutationError={error}
                    onSubmit={(pendingReward) => handleOnSubmit(pendingReward)}
                />
            );
        };

export const withClaimableRewardQuery =
    (Component) =>
        ({ ...props }) => {
            const router = useRouter();
            const username = typeof router.query?.username === "string" ? router.query.username : "";
            const specialcode =
                typeof router.query?.specialcode === "string" ? router.query.specialcode : "";

            const { data, status, isLoading, error } = useQuery(
                ["pendingRewardQuery", username, specialcode],
                () =>
                    axios.get(PENDING_REWARD_QUERY, { params: { username, generatedURL: specialcode } })
            );

            return (
                <Component
                    {...props}
                    isFetchingReward={isLoading}
                    reward={data?.data}
                    queryError={error}
                />
            );
        };

export const withClaimRewardSubmit =
    (Component) =>
        ({ ...props }) => {
            const queryClient = useQueryClient();
            const { data, error, isError, isLoading, isSuccess, mutateAsync } = useMutation(
                "claimRewardSubmit",
                (claimableReward) => axios.post(USER_CLAIMED_REWARD, claimableReward),
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries("pendingRewardQuery"); // query the old pending, should have pendingReward.isClaimed = true
                    },
                }
            );

            const handleOnSubmit = async (claimableReward) => {
                return await mutateAsync(claimableReward);
            };

            return (
                <Component
                    {...props}
                    isSubmittingReward={isLoading}
                    submittedReward={data?.data}
                    mutationError={error}
                    onSubmitReward={(claimableReward) => handleOnSubmit(claimableReward)}
                />
            );
        };

export const useUserRewardQuery = (session) => {
    let userId = session?.user?.userId;

    const { data, isLoading } = useQuery(["userRewardQuery", userId], () => {
        return axios
            .get(`${USER_GET_CLAIMED_REWARD}/${userId}`)
            .then((r) => r.data);

    }, { staleTime: 5 * 60, enabled: userId !== undefined });

    return [data, isLoading];
};
