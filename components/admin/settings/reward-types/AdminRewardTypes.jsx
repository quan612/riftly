import React, { useEffect, useState, useCallback, useRef } from "react";
import Enums from "enums";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";

import { debounce } from "@util/index";
import {
    Heading,
    Box,
    Flex,
    Table,
    Tbody,
    Th,
    Thead,
    Tr,
    Td,
    Text,
    Button,
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
    Tooltip,
    useToast,
    Icon,
    ButtonGroup,
} from "@chakra-ui/react";

import { useAdminRewardTypeMutation, useRewardTypesQuery } from "@shared/HOC/reward-types";
import { AdminCard } from "@components/shared/Card";
import { RiftlyCheckMark, RiftlyEditIcon, RiftlyTooltip } from "@components/shared/Icons";
import Card from "@components/shared/Card";

const AdminRewardTypes = () => {
    const [rewardTypes, isLoadingRewardTypes] = useRewardTypesQuery();
    const [data, isUpserting, upsertRewardTypeAsync] = useAdminRewardTypeMutation();

    const [createRewardType, createRewardTypeSet] = useState({
        id: -1,
        reward: "",
        rewardPreview: "",
        rewardIcon: "",
        isUpdating: false,
        isEnabled: true,
    });

    console.log(rewardTypes);

    return (
        <Box w="100%" display={"flex"} flexDirection="column" gap="24px">
            <Heading color="#fff" size="md">
                Create Reward Type
            </Heading>
            <CreateRewardTypes
                upsertRewardTypeAsync={upsertRewardTypeAsync}
                createRewardType={createRewardType}
                createRewardTypeSet={createRewardTypeSet}
            />
            <Heading color="#fff" size="md">
                Current Reward Types
            </Heading>
            <AdminCard>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Reward</Th>
                            <Th>Preview</Th>
                            <Th>Icon</Th>
                            <Th>Enabled</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {rewardTypes &&
                            rewardTypes?.map((rewardType, index) => {
                                return (
                                    <Tr key={index}>
                                        <Td>{rewardType.reward}</Td>
                                        <Td>
                                            {rewardType?.rewardPreview?.length > 0 && (
                                                <img
                                                    src={`${rewardType?.rewardPreview}`}
                                                    style={{ width: "120px" }}
                                                />
                                            )}
                                        </Td>
                                        <Td>
                                            {rewardType?.rewardIcon?.length > 0 && (
                                                <img
                                                    src={`${rewardType?.rewardIcon}`}
                                                    style={{ width: "50px" }}
                                                />
                                            )}
                                        </Td>
                                        <Td>{rewardType?.isEnabled && <RiftlyCheckMark />}</Td>
                                        <Td>
                                            <RiftlyEditIcon
                                                onClick={() => {
                                                    createRewardTypeSet({
                                                        id: rewardType.id,
                                                        reward: rewardType.reward,
                                                        rewardPreview: rewardType.rewardPreview,
                                                        isUpdating: true,
                                                        isEnabled: rewardType.isEnabled,
                                                    });
                                                }}
                                            />
                                        </Td>
                                    </Tr>
                                );
                            })}
                    </Tbody>
                </Table>
            </AdminCard>
        </Box>
    );
};

export default AdminRewardTypes;

function CreateRewardTypes({ upsertRewardTypeAsync, createRewardType, createRewardTypeSet }) {
    const bg = useColorModeValue("white", "#1B254B");
    const shadow = useColorModeValue("0px 18px 40px rgba(112, 144, 176, 0.12)", "none");
    const initialValues = createRewardType;

    const CreateRewardTypeSchema = object().shape({
        reward: string().required("Reward Type is required"),
    });

    const hiddenIconFileInput = useRef(null);
    const [imageIcon, setImageIcon] = useState(null);

    function handleOnRewardIconChange(e, setFieldValue) {
        const reader = new FileReader();
        reader.onload = function (onLoadEvent) {
            setFieldValue("rewardIcon", onLoadEvent.target.result);
        };

        reader.readAsDataURL(e.target.files[0]);
        setImageIcon(e.target.files[0]);
    }

    const getButtonState = (values) => {
        if (createRewardType.isUpdating) {
            if (
                values?.reward === initialValues.reward &&
                values?.rewardPreview === initialValues.rewardPreview &&
                values?.rewardIcon === initialValues.rewardIcon &&
                values?.isEnabled === initialValues.isEnabled
            ) {
                return true;
            }
        } else {
            if (
                (values?.reward.length === 0 &&
                    values?.rewardPreview?.length === 0 &&
                    values?.rewardIcon?.length === 0) ||
                (values?.rewardPreview === initialValues.rewardPreview &&
                    values?.rewardIcon === initialValues.rewardIcon &&
                    values?.isEnabled === initialValues.isEnabled)
            )
                return true;
        }
        return false;
    };
    return (
        <>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={CreateRewardTypeSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async (fields, { setStatus, resetForm }) => {
                    setStatus(null);

                    const payload = {
                        ...fields,
                    };

                    let upsertOp = await upsertRewardTypeAsync(payload);

                    if (upsertOp.isError) {
                        setStatus(upsertOp.message);
                    } else {
                        resetForm();
                        createRewardTypeSet({
                            id: -1,
                            reward: "",
                            rewardPreview: "",
                            isUpdating: false,
                            isEnabled: true,
                        });

                        setImageIcon(null);
                    }
                }}
            >
                {({ errors, status, touched, setFieldValue, values, resetForm, handleChange }) => {
                    return (
                        <Box w="100%">
                            <Form>
                                <Flex
                                    flexDirection={{
                                        base: "row",
                                    }}
                                    w="100%"
                                    h="100%"
                                    justifyContent="center"
                                    gap="16px"
                                >
                                    <Card boxShadow={shadow} py="8" bg={bg}>
                                        <SimpleGrid
                                            columns={{ base: 1, lg: 3 }}
                                            columnGap={10}
                                            rowGap={4}
                                            w="full"
                                        >
                                            <GridItem colSpan={{ base: 1 }}>
                                                <FormControl
                                                    mb="24px"
                                                    isRequired
                                                    isInvalid={errors.reward && touched.reward}
                                                >
                                                    <FormLabel
                                                        ms="4px"
                                                        fontSize="md"
                                                        fontWeight="bold"
                                                    >
                                                        Reward Name
                                                    </FormLabel>

                                                    <Field
                                                        as={Input}
                                                        size="lg"
                                                        name="reward"
                                                        type="text"
                                                        variant="auth"
                                                        placeholder="Reward name"
                                                    />
                                                    <FormErrorMessage fontSize="md">
                                                        {errors.reward}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            </GridItem>

                                            <GridItem colSpan={{ base: 1 }}>
                                                <FormControl>
                                                    <FormLabel
                                                        ms="4px"
                                                        fontSize="md"
                                                        fontWeight="bold"
                                                    >
                                                        Icon
                                                    </FormLabel>
                                                    <Button
                                                        variant="signIn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            hiddenIconFileInput.current.click();
                                                        }}
                                                        className="btn btn-primary me-2"
                                                    >
                                                        <Box>
                                                            <span>Choose File</span>
                                                        </Box>
                                                    </Button>
                                                    {imageIcon && imageIcon.name}
                                                    <input
                                                        type="file"
                                                        name="file"
                                                        accept="image/jpeg, image/png"
                                                        style={{ display: "none" }}
                                                        ref={hiddenIconFileInput}
                                                        onChange={(e) =>
                                                            handleOnRewardIconChange(
                                                                e,
                                                                setFieldValue
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                            </GridItem>

                                            <GridItem colSpan={{ base: 2 }}>
                                                <FormControl mb="24px">
                                                    <FormLabel
                                                        ms="4px"
                                                        fontSize="md"
                                                        fontWeight="bold"
                                                    >
                                                        Image Preview URL (For Discord Embeded)
                                                    </FormLabel>

                                                    <Field
                                                        as={Input}
                                                        size="lg"
                                                        name="rewardPreview"
                                                        type="text"
                                                        variant="auth"
                                                        placeholder="Reward Image Url"
                                                    />
                                                </FormControl>
                                            </GridItem>

                                            <GridItem colSpan={{ base: 1 }}>
                                                <FormControl
                                                    display="flex"
                                                    flexDirection={"column"}
                                                    gap="4px"
                                                >
                                                    <FormLabel
                                                        htmlFor="quest-alerts"
                                                        color="#fff"
                                                        flex="80%"
                                                    >
                                                        Notify me about new Challenges
                                                        <RiftlyTooltip
                                                            label="Disable Reward Type would hide it from Reward
                                                    User page"
                                                        />
                                                    </FormLabel>

                                                    <Switch
                                                        name="isEnabled"
                                                        isChecked={values.isEnabled ? true : false}
                                                        onChange={handleChange}
                                                    />
                                                </FormControl>
                                            </GridItem>
                                            {/* <div className="col-12">
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        // defaultChecked={values.isEnabled ? true : false}
                                                        checked={values.isEnabled ? true : false}
                                                        name="isEnabled"
                                                        onChange={handleChange}
                                                    />
                                                    Enabled
                                                </div>
                                            </div> */}

                                            {status && (
                                                <Text fontSize="md" color="red.500" width={"100%"}>
                                                    {status}
                                                </Text>
                                            )}

                                            <ButtonGroup gap="24px">
                                                <Button
                                                    w={{ base: "200px" }}
                                                    type="submit"
                                                    colorScheme="teal"
                                                    disabled={getButtonState(values)}
                                                    // isLoading={createRewardType.isUpdating}
                                                >
                                                    Save
                                                </Button>

                                                <Button
                                                    w={{ base: "200px" }}
                                                    variant="signIn"
                                                    onClick={() => {
                                                        setImageIcon(null);

                                                        createRewardTypeSet({
                                                            id: -1,
                                                            reward: "",
                                                            rewardPreview: "",
                                                            isUpdating: false,
                                                            isEnabled: true,
                                                        });
                                                        resetForm();
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </ButtonGroup>
                                        </SimpleGrid>
                                    </Card>
                                </Flex>
                            </Form>
                        </Box>
                    );
                }}
            </Formik>
        </>
    );
}
