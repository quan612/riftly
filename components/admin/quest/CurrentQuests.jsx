import React, { useEffect, useState, useCallback, useRef } from "react";
import Enums from "enums";
import { Modal } from "/components/admin";
import { useRouter } from "next/router";
import Link from "next/link";
import { EditQuest, AddQuest } from "..";
import { useAdminQuestSoftDelete, withAdminQuestQuery } from "shared/HOC/quest";

import {
    Heading,
    Box,
    Flex,
    List,
    ListItem,
    Text,
    Button,
    Table,
    Tbody,
    Th,
    Thead,
    Tr,
    Td,
    useDisclosure,
    Divider,
    ButtonGroup,
    Icon,
} from "@chakra-ui/react";
import { AdminCard } from "@components/shared/Card";

import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { MdPreview } from "react-icons/md";
import EditQuestModal from "./EditQuestModal";
import AddQuestModal from "./AddQuestModal";
import { RiftlyCheckMark, RiftlyEditIcon } from "@components/shared/Icons";
import { debounce } from "@util/index";

const CurrentQuests = ({ quests, isLoading, error }) => {
    let router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentQuests, setCurrentQuests] = useState(null);
    const [currentSearch, setCurrentSearch] = useState("");
    const [deleteQuest, deletingQuest, handleOnDelete] = useAdminQuestSoftDelete();

    const editQuestModal = useDisclosure();
    const editQuestRef = useRef();

    const addQuestModal = useDisclosure();

    useEffect(() => {
        if (quests && !quests.isError) {
            setCurrentQuests(quests?.sort(shortByText));
        }
    }, [quests]);

    useEffect(() => {
        if (quests && !quests.isError) {
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
        <Box w="100%">
            <AdminCard>
                <Flex>
                    <ButtonGroup spacing="6" mb="15px">
                        <Button
                            w={{ base: "150px" }}
                            onClick={() => addQuestModal.onOpen()}
                            colorScheme="teal"
                            size="sm"
                            fontWeight="semibold"
                            fontSize="15px"
                        >
                            Add Quest
                        </Button>

                        {/* <Button
                                leftIcon={<BsFilter />}
                                onClick={openFilterSidebar}
                                variant="outline"
                                size="sm"
                                fontWeight="semibold"
                                fontSize="16px"
                            >
                                Filter
                            </Button> */}
                    </ButtonGroup>
                </Flex>
                {isLoading && <div> Get quests info...</div>}
                <Table variant="simple">
                    <Thead>
                        <Tr my=".8rem" pl="0px" color="gray.400" fontSize="18px">
                            <Th pl="0px" color="gray.500">
                                Quest
                            </Th>
                            <Th color="gray.500">Is Enabled</Th>
                            <Th color="gray.500">Actions</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {currentQuests &&
                            currentQuests.length > 0 &&
                            currentQuests.map((quest, index, row) => {
                                const { text, type, description } = quest;

                                return (
                                    <Tr key={index} pl="0px">
                                        <Td pl="0px" colSpan={1}>
                                            {quest.text}
                                            {quest.type.name === Enums.FOLLOW_TWITTER && (
                                                <Text as={"span"} color="teal.400" ms="2">
                                                    {quest.extendedQuestData.followAccount}
                                                </Text>
                                            )}

                                            {quest.type.name === Enums.FOLLOW_INSTAGRAM && (
                                                <Text as={"span"} color="red.400" ms="2">
                                                    {quest.extendedQuestData.followAccount}
                                                </Text>
                                            )}

                                            {quest.type.name === Enums.TWITTER_RETWEET && (
                                                <Text as={"span"} color="blue.400" ms="2">
                                                    {quest.extendedQuestData.tweetId}
                                                </Text>
                                            )}
                                        </Td>
                                        <Td>{quest.isEnabled && <RiftlyCheckMark />}</Td>

                                        <Td>
                                            <Flex gap="2">
                                                <RiftlyEditIcon
                                                    onClick={() => {
                                                        editQuestRef.current = quest;
                                                        editQuestModal.onOpen();
                                                    }}
                                                />

                                                <Icon
                                                    transition="0.8s"
                                                    color="red.300"
                                                    boxSize={5}
                                                    as={AiFillDelete}
                                                    _hover={{
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={async () => {
                                                        if (
                                                            !window.confirm(
                                                                "Proceed to delete quest"
                                                            )
                                                        ) {
                                                            return;
                                                        }
                                                        handleQuestSoftDelete(quest);
                                                    }}
                                                />

                                                {quest.type.name === Enums.IMAGE_UPLOAD_QUEST &&
                                                    quest.extendedQuestData.eventName && (
                                                        <Icon
                                                            transition="0.8s"
                                                            color="red.300"
                                                            boxSize={5}
                                                            as={MdPreview}
                                                            _hover={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={async () => {
                                                                // href={`/admin/image-approval/${quest.extendedQuestData.eventName}`}
                                                                router.push(
                                                                    `/admin/image-approval/${quest.extendedQuestData.eventName}`
                                                                );
                                                            }}
                                                        />
                                                    )}
                                            </Flex>
                                        </Td>

                                        {/* <div className="d-flex flex-column align-items-center ">
                                            <Link href={`${router.pathname}/?id=${quest.id}`}>
                                      
                                                <i
                                                    className="ri-edit-line"
                                                    style={{
                                                        fontSize: "1.5rem",
                                                    }}
                                                ></i>
                                            </Link>

                                            
                                            
                                        </div> */}
                                    </Tr>
                                );
                            })}
                    </Tbody>
                </Table>
            </AdminCard>

            {editQuestRef?.current && (
                <EditQuestModal
                    isOpen={editQuestModal.isOpen}
                    onClose={() => {
                        editQuestModal.onClose();
                    }}
                    quest={editQuestRef.current}
                />
            )}
            {addQuestModal.isOpen && (
                <AddQuestModal
                    isOpen={addQuestModal.isOpen}
                    onClose={() => {
                        addQuestModal.onClose();
                    }}
                />
            )}
        </Box>
    );
};

{
    /* 
            <h4 className="card-title mb-3">Customize Quests</h4>
            <div>
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Search Quests"
                    onChange={debouncedChangeHandler}
                />
            </div> */
}

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
