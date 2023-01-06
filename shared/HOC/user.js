import { useQuery, useMutation } from "react-query";
import axios from "axios";
import Enums from "enums";

const CURRENT_USER_API = `${Enums.BASEPATH}/api/user/current`;
const ADD_USER_API = `${Enums.BASEPATH}/api/admin/user/add`;

export const withUserUpsert =
    (Component) =>
    ({ ...props }) => {
        const { data, error, isError, isLoading, mutateAsync } = useMutation(
            "mutateUser",
            (user) => axios.post(ADD_USER_API, user),
            {
                onSuccess: () => {},
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

export const useCurrentUserQuery = () => {
    const { data, loading } = useQuery("currentUserQuery", () =>
        axios.get(CURRENT_USER_API).then((r) => r.data)
    );

    return [data, loading];
};
