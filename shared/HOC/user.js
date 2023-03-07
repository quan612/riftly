import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import Enums from "enums";
// import type Prisma from "@prisma/client";


export const useAdminUsersSimpleStatisticsQuery = () => {
    const { data, isLoading } = useQuery("admin-query-users-simple-statistics", async () => {


        return axios
            .get(`${Enums.BASEPATH}/api/admin/user/simple-statistics`)
            .then((r) => r.data);

    }, { staleTime: 60 });

    return { data, isLoading };

}

export const useAdminUserStatsQuery = () => {
    const { data, isLoading } = useQuery("admin-query-user-stats", async () => {
        // console.time()
        let totalUsers = await axios.get(`/api/admin/user/count`).then(r => r.data); // || 100
        let skip = Enums.PAGINATION_SKIP;// 100 
        let totalPages = Math.ceil(totalUsers / skip);

        let data = [];

        let pagesArray = Array(totalPages).fill().map((v, i) => i);

        const allResults = await Promise.all(pagesArray.map(i => {
            return axios.post(`/api/admin/user-stats?page=${i}`).then(r => r.data)
        }))

        await Promise.all(allResults.map(r => {
            data = [...data, ...r.users];
        }))
        // console.timeEnd()
        return data

    }, { staleTime: 60 * 60 * 10 });

    return { data, isLoading };
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

export const useAdminUpdateManyUsersETH = () => {
    const queryClient = useQueryClient();
    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`${Enums.BASEPATH}/api/admin/user/update-users-eth`, payload)
            .then((r) => r.data);

    }, {
        // onSuccess: () => {
        //     queryClient.invalidateQueries("admin-query-user-stats");
        // },
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