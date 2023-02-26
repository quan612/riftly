import React, { useEffect, useState, useCallback, useMemo, useContext } from "react";
import { ErrorMessage, Field, Form, Formik, FieldArray, getIn } from "formik";
import { object, array, string, number, ref } from "yup";
import { utils } from "ethers";

import { UsersContext } from "@context/UsersContext";

import {
    Heading,
    Box,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Select,
    GridItem,
    ButtonGroup,
} from "@chakra-ui/react";

import Enums from "@enums/index";

const FilterUsersSidebar = () => {
    const { filterObj, filterObjSet, resetFilter } = useContext(UsersContext);
    console.log(filterObj);
    return (
        <Box>
            <Formik
                enableReinitialize
                initialValues={filterObj}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={(fields, { setStatus, resetForm }) => {
                    filterObjSet(fields);
                }}
            >
                {({ errors, status, touched, setFieldValue, values, resetForm }) => {
                    return (
                        <Form>
                            <GridItem colSpan={{ base: 1, xl: 1 }}>
                                <FormControl mb="16px">
                                    <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                        User Type
                                    </FormLabel>
                                    <Field name="type" as={Select} fontSize="md" ms="4px" size="lg">
                                        <option value={Enums.WALLET}>{Enums.WALLET}</option>
                                        <option value={Enums.DISCORD}>{Enums.DISCORD}</option>
                                        <option value={Enums.TWITTER}>{Enums.TWITTER}</option>
                                    </Field>
                                </FormControl>
                            </GridItem>

                            <GridItem colSpan={{ base: 1, xl: 2 }}>
                                <FormControl mb="16px">
                                    <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                        User
                                    </FormLabel>

                                    <Field
                                        as={Input}
                                        name="user"
                                        type="text"
                                        variant="auth"
                                        fontSize="sm"
                                    />
                                </FormControl>
                            </GridItem>

                            <GridItem colSpan={1}>
                                <FormControl mb="24px">
                                    <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                        Contract Address
                                    </FormLabel>
                                    <Field
                                        name="contract"
                                        type="text"
                                        as={Input}
                                        variant="auth"
                                        fontSize="sm"
                                    />
                                </FormControl>
                            </GridItem>

                            <ButtonGroup display={"flex"} justifyContent={"space-around"}>
                                <Button
                                    w={{ base: "100px" }}
                                    my="16px"
                                    type="submit"
                                    colorScheme="blue"
                                    fontSize="16px"
                                >
                                    Apply
                                </Button>
                                <Button
                                    w={{ base: "100px" }}
                                    my="16px"
                                    colorScheme="blue"
                                    variant="outline"
                                    fontSize="16px"
                                    onClick={() => {
                                        resetForm();
                                        resetFilter();
                                    }}
                                >
                                    Clear All
                                </Button>
                            </ButtonGroup>
                        </Form>
                    );
                }}
            </Formik>
        </Box>
    );
};

export default FilterUsersSidebar;
