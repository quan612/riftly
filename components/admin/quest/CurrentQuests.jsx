import React, { useEffect, useState, useCallback } from "react";
import Enums from "enums";
import { Modal } from "/components/admin";
import { useRouter } from "next/router";
import Link from "next/link";
import { EditQuest, AddQuest } from "..";
import { useAdminQuestSoftDelete, withAdminQuestQuery } from "shared/HOC/quest";
import { debounce } from "utils/";

const CurrentQuests = ({ quests, isLoading, error }) => {
    let router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentQuests, setCurrentQuests] = useState(null);
    const [currentSearch, setCurrentSearch] = useState("");
    const [deleteQuest, deletingQuest, handleOnDelete] = useAdminQuestSoftDelete();

    useEffect(() => {
        if (quests) {
            setCurrentQuests(quests.sort(shortByText));
        }
    }, [quests]);

    useEffect(() => {
        if (quests) {
            let filter = quests.filter((q) => {
                // search by name
                if (q.text.toLowerCase().indexOf(currentSearch.toLowerCase()) > -1) {
                    return true;
                }

                // search by extended quest data ~ collaboration
                if (
                    q.extendedQuestData?.collaboration
                        ?.toLowerCase()
                        .indexOf(currentSearch.toLowerCase()) > -1
                ) {
                    return true;
                }
            });
            setCurrentQuests(filter.sort(shortByText));
        }
    }, [currentSearch]);

    const handleOnChange = (e) => {
        e.preventDefault();

        let search = e.target.value;
        setCurrentSearch(search);
    };

    const debouncedChangeHandler = useCallback(debounce(handleOnChange, 500), []);

    const handleQuestSoftDelete = (quest) => {
        if (confirm(`Deleting this quest "${quest.text}" ?`)) {
            handleOnDelete(quest);
        }
    };
    return (
        <div className="col-xxl-6 col-xl-6 col-lg-6">
            <button
                type="button"
                className="btn btn-primary m-2"
                onClick={() => setModalOpen(true)}
            >
                Add New Quest
            </button>
            <h4 className="card-title mb-3">Customize Quests</h4>
            <div>
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Search Quests"
                    onChange={debouncedChangeHandler}
                />
            </div>

            <div className="card">
                {currentQuests && currentQuests.length > 0 && (
                    <div className="card-body">
                        {isLoading && <div> Get quests info...</div>}
                        {currentQuests.map((quest, index, row) => {
                            return (
                                <React.Fragment key={index}>
                                    <div className="verify-content">
                                        <div className="d-flex align-items-center">
                                            <span className="me-3 icon-circle bg-primary text-white">
                                                <i className="ri-bank-line"></i>
                                            </span>
                                            <div className="primary-number">
                                                <h5 className="mb-0">
                                                    {quest.text}
                                                    {quest.type.name === Enums.FOLLOW_TWITTER && (
                                                        <span className="text-teal-500 ml-1">
                                                            {quest.extendedQuestData.followAccount}
                                                        </span>
                                                    )}

                                                    {quest.type.name === Enums.FOLLOW_INSTAGRAM && (
                                                        <span className="text-red-500 ml-1">
                                                            {quest.extendedQuestData.followAccount}
                                                        </span>
                                                    )}

                                                    {quest.type.name === Enums.TWITTER_RETWEET && (
                                                        <span className="text-teal-500 ml-1">
                                                            {quest.extendedQuestData.tweetId}
                                                        </span>
                                                    )}
                                                    {quest.type.name ===
                                                        Enums.CollaborationFreeShell && (
                                                        <span className="text-teal-500 ml-1">
                                                            {quest.extendedQuestData.collaboration}
                                                        </span>
                                                    )}
                                                </h5>

                                                <small>{quest.description}</small>
                                                <br />

                                                {quest.isEnabled ? (
                                                    <span className="text-success">Enabled</span>
                                                ) : (
                                                    <span className="text-danger">Disabled</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center flex-col">
                                            <Link href={`${router.pathname}/?id=${quest.id}`}>
                                                <button className=" btn btn-dark">Manage</button>
                                            </Link>
                                            <button
                                                className=" btn btn-secondary mt-2"
                                                onClick={() => handleQuestSoftDelete(quest)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    {/* last row */}
                                    {index + 1 !== row.length && (
                                        <hr className="dropdown-divider my-4" />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* {router.query.typeId && ( */}
            <Modal
                isOpen={router.query?.id ? true : isModalOpen}
                onClose={() => {
                    router.push(`${router.pathname}`);
                    setModalOpen(false);
                }}
                render={(modal) => {
                    if (router.query?.id && quests) {
                        let quest = quests.filter((q) => q.id === parseInt(router.query.id))[0];

                        return (
                            <EditQuest
                                closeModal={() => {
                                    router.push(`${router.pathname}`);
                                    setModalOpen(false);
                                }}
                                quest={quest}
                            />
                        );
                    } else {
                        return (
                            <AddQuest
                                closeModal={() => {
                                    router.push(`${router.pathname}`);
                                    setModalOpen(false);
                                }}
                            />
                        );
                    }
                }}
                isConfirm={true}
            />
            {/* )} */}
        </div>
    );
};

function shortByText(a, b) {
    if (a.text?.toLowerCase() < b.text?.toLowerCase()) {
        return -1;
    }
    if (a.text?.toLowerCase() > b.text?.toLowerCase()) {
        return 1;
    }
    return 0;
}

export default withAdminQuestQuery(CurrentQuests);
