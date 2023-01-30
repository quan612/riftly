import React, { useState } from "react";

import {
    Heading,
    Box,
    Flex,
    Link,
    List,
    ListItem,
    Text,
    Button,
    useColorMode,
    useColorModeValue,
    SimpleGrid,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Switch,
    Select,
    Checkbox,
    GridItem,
    Table,
    Tbody,
    Th,
    Thead,
    Tr,
    Td,
    Tooltip,
    IconButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    MenuItem,
    MenuList,
    useDisclosure,
    Icon,
    Menu,
} from "@chakra-ui/react";

import { ArrowRightIcon, ArrowDownIcon, ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";

export default function MultiSelect({ items, onSelectedItem, onDeSelectedItem }) {
    console.log(items);
    const [dropdown, setDropdown] = useState(false);
    const bg = useColorModeValue("white", "#1B254B");

    const [selectedItems, setSelected] = useState([]);

    const toogleDropdown = () => {
        setDropdown(!dropdown);
    };

    const addTag = (itemId) => {
        let item = items.find((i) => i.id === itemId);

        if (!selectedItems.includes(item.name)) {
            setSelected(selectedItems.concat(item.name));
            onSelectedItem(item);
            toogleDropdown();
        }
    };

    const removeTag = (e, item) => {
        e.stopPropagation();
        const filtered = selectedItems.filter((e) => e !== item);
        onDeSelectedItem(item);
        setSelected(filtered);
    };

    const textColor = useColorModeValue("secondaryGray.500", "white");
    const textHover = useColorModeValue(
        { color: "secondaryGray.900", bg: "unset" },
        { color: "secondaryGray.500", bg: "unset" }
    );
    const iconColor = useColorModeValue("brand.500", "white");
    const bgList = useColorModeValue("white", "black");
    const bgShadow = useColorModeValue("14px 17px 40px 4px rgba(112, 144, 176, 0.08)", "unset");
    const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const bgHover = useColorModeValue({ bg: "secondaryGray.400" }, { bg: "whiteAlpha.50" });
    const bgFocus = useColorModeValue({ bg: "secondaryGray.300" }, { bg: "whiteAlpha.100" });
    const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();

    return (
        // <div className="w-full h-full relative">
        <Box w="100%" onClick={onOpen1} pos="relative" h="100%">
            <MultiselectWrapper
                selectedItems={selectedItems}
                toogleDropdown={toogleDropdown}
                removeTag={removeTag}
            />

            {dropdown && (
                <Box pos={"absolute"} w="100%" h="100%">
                    <Flex
                        w="100%"
                        flexDirection={{
                            base: "column",
                        }}
                        h="100%"
                        mt="2"
                        bg={bg}
                    >
                        {items.map((item, key) => {
                            console.log(item);
                            return (
                                <Box
                                    h="100%"
                                    key={key}
                                    _hover={bgHover}
                                    onClick={() => addTag(item.id)}
                                    // bg={bgList}
                                    // colorScheme="gray"
                                >
                                    <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                                        <div className="w-full items-center flex">
                                            <div className="mx-2 leading-6  ">{item.name}</div>
                                        </div>
                                    </div>
                                </Box>
                            );
                        })}
                    </Flex>
                </Box>
            )}
        </Box>
    );
}

const MultiselectWrapper = ({ selectedItems, toogleDropdown, removeTag }) => {
    const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");

    return (
        <Flex
            flexDirection={{
                base: "column",
            }}
            w="100%"
            h="100%"
            alignItems={"center"}
            gap="1%"
        >
            <Box w="100%" h="inherit">
                <Flex
                    onClick={toogleDropdown}
                    border="2px solid "
                    borderColor={borderColor}
                    borderRadius="20px"
                    h="inherit"
                >
                    <Flex flexWrap="wrap" w="90%">
                        {selectedItems.map((tag, index) => {
                            return (
                                <Flex
                                    key={index}
                                    // className="flex  m-1 font-medium py-1 px-2 rounded-full text-teal-700 bg-teal-100 border border-teal-300 "
                                    borderRadius="20px"
                                    // borderColor={borderColor}
                                    justifyContent="center"
                                    alignItems="center"
                                    px="3"
                                    py="2"
                                    size="md"
                                >
                                    {/* <Box className="text-xs font-normal leading-none max-w-full flex-initial">
                                        {tag}
                                    </Box> */}
                                    <Button
                                        w={{ base: "120px" }}
                                        onClick={(e) => removeTag(e, tag)}
                                        colorScheme="teal"
                                        size="sm"
                                        fontWeight="semibold"
                                        fontSize="15px"
                                    >
                                        {tag}
                                    </Button>
                                    {/* <div className="flex flex-auto flex-row-reverse">
                                        <div onClick={(e) => removeTag(e, tag)}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="100%"
                                                height="100%"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </div>
                                    </div> */}
                                </Flex>
                            );
                        })}
                    </Flex>

                    <Flex py="1" pe="1" alignItems={"center"}>
                        <svg
                            viewBox="0 0 24 24"
                            role="presentation"
                            class="chakra-select__icon"
                            focusable="false"
                            aria-hidden="true"
                            style={{ width: "1em", height: "1em" }}
                        >
                            <path
                                fill="currentColor"
                                d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
                            ></path>
                        </svg>
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
};
