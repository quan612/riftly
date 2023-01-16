import React, { useEffect, useState, useContext } from "react";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";
import Enums from "enums";
import { useToast } from "@chakra-ui/react";
const fetcher = (url) => fetch(url).then((r) => r.json());
const takeNumber = Enums.ITEM_PER_PAGE;

const ImageUploadApproval = () => {
    const router = useRouter();
    const toast = useToast();

    const { eventName } = router.query;
    const [count, setCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [isWorking, setIsWorking] = useState(false);
    const { data, mutate, isValidating, error } = useSWR(
        eventName
            ? `${Enums.BASEPATH}/api/user/quest/getUserImageQuestsByEventName?eventName=${eventName}&page=${pageIndex}`
            : null,
        fetcher
    );
    useEffect(async () => {
        /** get all user quest */
        try {
            if (data && data.count) {
                setCount(data.count);
            }
            if (router.query) {
                eventName = router.query?.eventName?.toLowerCase();
            }
        } catch (error) {
            console.log(error);
        }
    }, [router, data]);

    const postToDiscord = async (userQuest) => {
        setIsWorking(true);
        try {
            let res = await axios
                .post(`${Enums.BASEPATH}/api/admin/quest/approve-image`, userQuest)
                .then((r) => r.data);

            if (res.isError) {
                toast({
                    title: "Exception",
                    description: `${res.message}`,
                    position: "bottom-right",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                mutate();
            }

            setIsWorking(false);
        } catch (error) {
            setIsWorking(false);
            console.log(error);
        }
    };
    const hideSubmission = async (userQuest) => {
        try {
            setIsWorking(true);
            let res = await axios.post(
                `${Enums.BASEPATH}/api/admin/quest/hide-userquest`,
                userQuest
            );

            mutate();
            setIsWorking(false);
        } catch (error) {
            setIsWorking(false);
            console.log(error);
        }
    };

    return (
        <div className="flex flex-column items-center">
            <span className="text-md text-secondary 700 dark:text-secondary 400">
                Showing{" "}
                <span className="font-semibold text-secondary 900 dark:text-white">
                    {pageIndex * takeNumber + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-secondary 900 dark:text-white">
                    {pageIndex * takeNumber + takeNumber}
                </span>{" "}
                of Total:{" "}
                <span className="font-semibold text-secondary 900 dark:text-white">{count}</span>{" "}
            </span>

            <div className="inline-flex mt-2 xs:mt-0">
                {pageIndex > 0 && (
                    <button
                        disabled={pageIndex === 0}
                        onClick={() => setPageIndex(pageIndex - 1)}
                        className="py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-secondary 400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        Prev
                    </button>
                )}
                {pageIndex * takeNumber < count && count > takeNumber && (
                    <button
                        onClick={() => setPageIndex(pageIndex + 1)}
                        className="py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-secondary 400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        Next
                    </button>
                )}
            </div>
            <div className="p-4 grid gap-5 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3">
                {data?.data?.map((uq, index) => {
                    const { extendedUserQuestData, user } = uq;
                    return (
                        <div className="card" key={index}>
                            <div className="card-body">
                                <div>
                                    <a
                                        href={`${extendedUserQuestData?.imageBase64}`}
                                        target="_blank"
                                        className="text-danger"
                                    >
                                        <img src={extendedUserQuestData?.imageBase64} alt="" />
                                    </a>
                                    <div className="text-sm break-words">
                                        Wallet: {user?.wallet}
                                    </div>
                                    <div className="text-sm mt-2 ">
                                        Discord: {user?.discordUserDiscriminator}
                                    </div>

                                    {extendedUserQuestData.hasOwnProperty("messageId") &&
                                        extendedUserQuestData.messageId.length > 0 && (
                                            <label className=" text-green-500">Submitted</label>
                                        )}
                                    {!extendedUserQuestData.hasOwnProperty("messageId") && (
                                        <>
                                            <button
                                                className="inline-flex items-center px-3 py-2 text-sm font-semibold leading-6 text-white transition duration-150 ease-in-out bg-indigo-500 rounded-md shadow hover:bg-indigo-400"
                                                onClick={() => postToDiscord(uq)}
                                                disabled={isValidating || isWorking}
                                            >
                                                {isValidating ||
                                                    (isWorking && (
                                                        <svg
                                                            className="w-5 h-5 me-3 -ml-1 text-white animate-spin"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            ></path>
                                                        </svg>
                                                    ))}
                                                Post
                                            </button>
                                            <button
                                                className="ml-2 inline-flex items-center px-3 py-2 text-sm font-semibold leading-6 text-white transition duration-150 ease-in-out bg-red-500 rounded-md shadow hover:bg-red-400"
                                                onClick={() => hideSubmission(uq)}
                                                disabled={isValidating || isWorking}
                                            >
                                                Hide
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ImageUploadApproval;
