import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";
import Enums from "enums";
import { useRouter } from "next/router";

const AdminDiscordChannelsQuery = `${Enums.BASEPATH}/api/admin/settings/discord-channels`

export const useAdminDiscordChannelsQuery = () => {

    const { data, isLoading } = useQuery(["AdminDiscordChannelsQuery"], () => {
        return axios
            .get(AdminDiscordChannelsQuery)
            .then((r) => r.data);

    }, { staleTime: 5 * 60 });

    return [data, isLoading];
};

export const useEnabledAdminDiscordChannelsQuery = () => {

    const [data, isLoading] = useAdminDiscordChannelsQuery();

    return [data?.filter(r => r.isEnabled === true), isLoading];
};

export const useAdminDiscordChannelsMutation = () => {
    const queryClient = useQueryClient();
    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`${Enums.BASEPATH}/api/admin/settings/discord-channels/upsert`, payload)
            .then((r) => r.data);

    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("AdminDiscordChannelsQuery");
        },
    });

    return [data, isLoading, mutateAsync];
};
