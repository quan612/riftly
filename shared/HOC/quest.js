import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";
import Enums from "enums";
import { useRouter } from "next/router";

const QUEST_TYPE_QUERY = `${Enums.BASEPATH}/api/admin/quest/type`;
const USER_QUEST_QUERY = `${Enums.BASEPATH}/api/user/quest/`;
const USER_QUEST_SUBMIT = `${Enums.BASEPATH}/api/user/quest/submit`;

const ADMIN_QUEST_UPSERT = `${Enums.BASEPATH}/api/admin/quest/upsert`;
const ADMIN_QUEST_DELETE = `${Enums.BASEPATH}/api/admin/quest/delete`;


export const withQuestUpsert =
    (Component) =>
        ({ ...props }) => {
            const queryClient = useQueryClient();
            const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
                "mutateQuest",
                (quest) => axios.post(ADMIN_QUEST_UPSERT, quest),
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries("adminQueryQuest");
                    },
                }
            );

            const handleOnUpsert = async (quest) => {
                return await mutateAsync(quest);
            };

            return (
                <Component
                    {...props}
                    isLoading={isLoading}
                    mutationError={error}
                    onUpsert={(quest) => handleOnUpsert(quest)}
                />
            );
        };
export const useAdminQuestSoftDelete = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, mutateAsync } = useMutation(
        "adminQuestDelete",
        (quest) => axios.post(ADMIN_QUEST_DELETE, quest).then((r) => r.data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("adminQueryQuest");
            },
        }
    );

    const handleOnDelete = async (quest) => {
        return await mutateAsync(quest);
    };

    return [data, isLoading, handleOnDelete];
};

export const useUserQuestSubmit = () => {
    const queryClient = useQueryClient();

    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(USER_QUEST_SUBMIT, payload)
            .then((r) => r.data);

    }, {
        onSuccess: () => {

            queryClient.invalidateQueries("userQueryQuest");
        },
    });

    return [data, isLoading, mutateAsync];
}

export const useCodeQuestSubmit = () => {
    const queryClient = useQueryClient();

    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`${Enums.BASEPATH}/api/user/quest/submit/code-quest`, payload)
            .then((r) => r.data);

    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("userQueryQuest");
        },
    });

    return [data, isLoading, mutateAsync];
}

export const useNftOwningQuestSubmit = () => {
    const queryClient = useQueryClient();

    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`${Enums.BASEPATH}/api/user/quest/submit/nft-quest`, payload)
            .then((r) => r.data);

    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("userQueryQuest");
        },
    });

    return [data, isLoading, mutateAsync];
}

export const useWalletAuthQuestSubmit = () => {
    const queryClient = useQueryClient();

    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`${Enums.BASEPATH}/api/user/wallet-sign-up`, payload)
            .then((r) => r.data);

    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("userQueryQuest");
        },
    });

    return [data, isLoading, mutateAsync];
}


export const usePhoneNumberQuestSubmit = () => {
    const queryClient = useQueryClient();

    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`${Enums.BASEPATH}/api/user/quest/submit/send-phone-for-sms`, payload)
            .then((r) => r.data);

    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("userQueryQuest");
        },
    });

    return [data, isLoading, mutateAsync];
}
// only after code sent to user phone
export const usePhoneCodeQuestSubmit = () => {
    const queryClient = useQueryClient();

    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`${Enums.BASEPATH}/api/user/quest/submit/send-code-for-verification`, payload)
            .then((r) => r.data);

    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("userQueryQuest");
        },
    });

    return [data, isLoading, mutateAsync];
}

export const useUserQuestClaim = () => {

    const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation((payload) => {
        return axios
            .post(`/api/user/quest/claim`, payload)
            .then((r) => r.data);

    },);

    return [data, isLoading, mutateAsync];
}



export const withUserOwningNftQuestSubmit =
    (Component) =>
        ({ ...props }) => {
            const queryClient = useQueryClient();
            const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
                "submitNftQuest",
                (quest) => axios.post(`${Enums.BASEPATH}/api/user/quest/submit/nft-quest`, quest),
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries("userRewardQuery");
                        queryClient.invalidateQueries("userQueryQuest");
                    },
                }
            );

            const handleOnSubmit = async (quest, currentQuests) => {
                let submitted = await mutateAsync(quest).then(r => r.data);

                if (!submitted.isError) {
                    let updatedQuests = currentQuests.map((q) => {
                        if (q.questId == quest.questId) {
                            q.hasStarted = true;
                        }
                        return q;
                    });

                    return await Promise.all(updatedQuests).then(() => {
                        updatedQuests.sort(isNotDoneFirst);
                        return updatedQuests;
                    });
                } else {
                    return submitted
                }
            }

            return (
                <Component
                    {...props}
                    isSubmitting={isLoading}
                    submittedQuest={data?.data}
                    mutationError={error}
                    onSubmit={(quest, currentQuests) => handleOnSubmit(quest, currentQuests)}
                />
            );
        };

export const withUserUnstoppableAuthQuestSubmit =
    (Component) =>
        ({ ...props }) => {
            const queryClient = useQueryClient();
            const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
                "submitUnstopableAuthQuest",
                (quest) => axios.post(`${Enums.BASEPATH}/api/user/quest/submit/unstoppable-auth`, quest),
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries("userRewardQuery");
                        queryClient.invalidateQueries("userQueryQuest");
                    },
                }
            );

            const handleOnSubmit = async (quest, currentQuests) => {
                let submitted = await mutateAsync(quest).then(r => r.data);

                if (!submitted.isError) {
                    let updatedQuests = currentQuests.map((q) => {
                        if (q.questId == quest.questId) {
                            q.hasStarted = true;
                        }
                        return q;
                    });

                    return await Promise.all(updatedQuests).then(() => {
                        updatedQuests.sort(isNotDoneFirst);
                        return updatedQuests;
                    });
                } else {
                    return submitted
                }
            }

            return (
                <Component
                    {...props}
                    isSubmitting={isLoading}
                    submittedQuest={data?.data}
                    mutationError={error}
                    onSubmit={(quest, currentQuests) => handleOnSubmit(quest, currentQuests)}
                />
            );
        };

export const withUserImageQuestSubmit =
    (Component) =>
        ({ ...props }) => {
            const queryClient = useQueryClient();
            const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
                "submitImageQuest",
                (quest) => axios.post(`${Enums.BASEPATH}/api/user/quest/submit/image-upload`, quest),
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries("userRewardQuery");
                    },
                }
            );

            const handleOnSubmit = async (quest, currentQuests) => {
                return await mutateAsync(quest);
            };

            return (
                <Component
                    {...props}
                    isSubmitting={isLoading}
                    submittedQuest={data?.data}
                    mutationError={error}
                    onSubmitImageQuest={(quest, currentQuests) => handleOnSubmit(quest, currentQuests)}
                />
            );
        };

export const withUserQuestQuery =
    (Component) =>
        ({ ...props }) => {
            const { data, status, isLoading, error } = useQuery("userQueryQuest", () =>
                axios.get(USER_QUEST_QUERY)
            );
            return (
                <Component
                    {...props}
                    isFetchingUserQuests={isLoading}
                    userQuests={data?.data}
                    queryError={error}
                />
            );
        };

export const withUserCollaborationQuestQuery =
    (Component) =>
        ({ ...props }) => {
            const { data, status, isLoading, error } = useQuery("userQueryCollaborationQuest", () =>
                axios.get(`${Enums.BASEPATH}/api/user/quest/collaboration/${props?.collaboration}`)
            );
            return (
                <Component
                    {...props}
                    isFetchingUserQuests={isLoading}
                    userQuests={data?.data}
                    queryError={error}
                />
            );
        };



export const withUserUnstoppableAuthQuestQuery =
    (Component) =>
        ({ ...props }) => {

            const { data, status, isLoading, error } = useQuery("userQueryUnstoppableAuthQuest", () =>
                // axios.get(`${Enums.BASEPATH}/api/user/quest/unstopple-quest?event=domain-auth`),
                axios.get(`${Enums.BASEPATH}/api/user/quest/unstoppable-quest`),

            );
            return (
                <Component
                    {...props}
                    isFetchingUserQuests={isLoading}
                    userQuests={data?.data}
                    queryError={error}
                />
            );
        };

export const withUserImageQuestQuery =
    (Component) =>
        ({ ...props }) => {

            const router = useRouter();
            const imageQuestEvent = typeof router.query?.eventName === "string" ? router.query.eventName : "";

            const { data, status, isLoading, error } = useQuery("userQueryCollaborationQuest", () =>
                axios.get(`${Enums.BASEPATH}/api/user/quest/image-quest?eventName=${imageQuestEvent}`).then(r => r.data),
                { enabled: imageQuestEvent.length > 0 }
            );
            return (
                <Component
                    {...props}
                    isFetchingUserQuests={isLoading}
                    userQuests={data}
                    queryError={error}
                />
            );
        };

export const withUserOwningNftQuestQuery =
    (Component) =>
        ({ ...props }) => {

            const router = useRouter();
            const nft = typeof router.query?.nft === "string" ? router.query.nft : "";

            const { data, status, isLoading, error } = useQuery("userQueryOwningNftQuest", () =>
                axios.get(`${Enums.BASEPATH}/api/user/quest/nft-quest?nft=${nft}`),
                { enabled: !!nft }
            );
            return (
                <Component
                    {...props}
                    isFetchingUserQuests={isLoading}
                    userQuests={data?.data}
                    queryError={error}
                />
            );
        };

export const withQuestTypeQuery =
    (Component) =>
        ({ ...props }) => {
            const { data, status, isLoading, error } = useQuery("questTypeQuery", () =>
                axios.get(QUEST_TYPE_QUERY)
            );

            return (
                <Component
                    {...props}
                    isFetchingRewardType={isLoading}
                    questTypes={data?.data}
                    queryError={error}
                />
            );
        };



export const withAdminQuestQuery =
    (Component) =>
        ({ ...props }) => {
            const { data, error, status, isLoading } = useQuery("adminQueryQuest", () =>
                axios.get(`${Enums.BASEPATH}/api/admin/quest/`).then(r => r.data)
            );

            return <Component {...props} isLoading={isLoading} quests={data} error={error} />;
        };



function isNotDoneFirst(a, b) {
    return Number(a.hasStarted) - Number(b.hasStarted);
}
