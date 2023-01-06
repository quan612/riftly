import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";
import Enums from "enums";

const GET_SHELL_REDEEM = `${Enums.BASEPATH}/api/user/shell-redeem`;
const ROLL_ALL = `${Enums.BASEPATH}/api/user/shell-redeem/roll-all`;

// export const withShellRedeemQuery =
//     (Component) =>
//         ({ ...props }) => {
//             const { data, status, isLoading, error } = useQuery("shellRedeemQuery", () =>
//                 axios.get(GET_SHELL_REDEEM)
//             );

//             return (
//                 <Component
//                     {...props}
//                     isFetchingShellRedeem={isLoading}
//                     shellRedeem={data?.data}
//                     queryError={error}
//                 />
//             );
//         };

export const useShellRedeemQuery = () => {
    const { data, loading, error } = useQuery("shellRedeemQuery", () =>
        axios.get(GET_SHELL_REDEEM).then((r) => r.data)
    );

    return [data, loading, error];
};

export const withShellRedeemRollAll =
    (Component) =>
        ({ ...props }) => {
            const { data, error, isError, isLoading, isSuccess, mutateAsync } = useMutation(
                "shellRedeemRollAllSubmit",
                () => axios.post(ROLL_ALL)
            );

            const handleOnRoll = async () => {
                return await mutateAsync();
            };

            return (
                <Component
                    {...props}
                    isRolling={isLoading}
                    rolledData={data?.data}
                    rollError={error}
                    onRollSubmit={() => handleOnRoll()}
                />
            );
        };
