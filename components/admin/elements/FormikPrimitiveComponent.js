import React, { useRef } from "react";
import { useField } from "formik";
import { MultiSelect } from "./MultiSelect";

export const FormikInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    const ref = useRef();

    return (
        <Section title={label}>
            <Input {...field} {...props} invalid={meta.error} ref={ref} />
            {meta.touched && meta.error ? <ErrorMessage error={meta.error} /> : null}
        </Section>
    );
};

export const FormikSelect = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <>
            <Select {...field} {...props} />
            {meta.touched && meta.error ? <ErrorMessage>{meta.error.name}</ErrorMessage> : null}
        </>
    );
};

export const FormikMultiSelect = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <>
            <MultiSelect {...field} {...props} />
        </>
    );
};
