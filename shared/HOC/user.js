import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import Enums from "enums";

const CURRENT_USER_API = `${Enums.BASEPATH}/api/user/current`;
const ADD_USER_API = `${Enums.BASEPATH}/api/admin/user/add`;

export const withUserUpsert =
    (Component) =>
        ({ ...props }) => {
            const { data, error, isError, isLoading, mutateAsync } = useMutation(
                "mutate-user",
                (user) => axios.post(ADD_USER_API, user),
                {
                    onSuccess: () => { },
                }
            );
            const handleOnUpsert = async (user) => {
                return await mutateAsync(user);
            };
            return (
                <Component
                    {...props}
                    isLoading={isLoading}
                    mutationError={error}
                    data={data?.data}
                    onUpsert={(user) => handleOnUpsert(user)}
                />
            );
        };

export const useAdminUserStatsQuery = () => {
    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useQuery("admin-query-user-stats", async () => {

        let data = [], page = 0,
            searchRes = {};
        do {
            searchRes = await axios.post(`/api/admin/user-stats?page=${page}`).then(r => r.data);
            data = [...data, ...searchRes.users];
            page = page + 1;
        } while (searchRes?.shouldContinue)

        return data

    }, { staleTime: 60 * 60 });


    return [data, isLoading];
}

export const useAdminUserMutation = () => {
    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`${Enums.BASEPATH}/api/admin/user/add`, payload)
            .then((r) => r.data);

    });

    return [data, isLoading, mutateAsync];
}

export const useAdminUserDelete = () => {
    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`${Enums.BASEPATH}/api/admin/user/delete`, payload)
            .then((r) => r.data);

    });

    return [data, isLoading, mutateAsync];
}

export const useAdminRefreshUserStats = () => {
    const queryClient = useQueryClient();
    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`${Enums.BASEPATH}/api/admin/user/refresh-stats`, payload)
            .then((r) => r.data);

    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("admin-query-user-stats");
        },
    });

    return [data, isLoading, mutateAsync];
}



export const useAdminBulkUsersMutation = () => {
    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`${Enums.BASEPATH}/api/admin/user/bulk-add`, payload)
            .then((r) => r.data);

    });

    return [data, isLoading, mutateAsync];
}

export const useCurrentUserQuery = () => {
    const { data, loading } = useQuery("currentUserQuery", () =>
        axios.get(CURRENT_USER_API).then((r) => r.data)
    );

    return [data, loading];
};
