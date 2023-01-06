import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";

const QuestFormTemplate = ({
    values,
    errors,
    touched,
    onTextChange,
    onCompletedTextChange,
    onDescriptionChange,
    onRewardTypeChange,
    onRewardQuantityChange,
    onIsEnabledChange,
    rewardTypes,
    ...props
}) => {
    return (
        <>
            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                <label className="form-label">Quest Text (to be shown on user-end)</label>
                <Field
                    name="text"
                    type="text"
                    className={
                        "form-control" + (errors?.text && touched?.text ? " is-invalid" : "")
                    }
                    onChange={(e) => onTextChange(e.target.value)}
                />
                <ErrorMessage name="text" component="div" className="invalid-feedback" />
            </div>

            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                <label className="form-label">Completed</label>
                <Field
                    name="completedText"
                    type="text"
                    className={
                        "form-control" +
                        (errors?.completedText && touched?.completedText ? " is-invalid" : "")
                    }
                    onChange={(e) => onCompletedTextChange(e.target.value)}
                />
                <ErrorMessage name="completedText" component="div" className="invalid-feedback" />
            </div>

            <div className="col-xxl-12 col-xl-12 col-lg-12 mb-3">
                <label className="form-label">Description</label>
                <Field
                    name="description"
                    type="text"
                    className={
                        "form-control" +
                        (errors?.description && touched?.description ? " is-invalid" : "")
                    }
                    onChange={(e) => onDescriptionChange(e.target.value)}
                />
                <ErrorMessage name="description" component="div" className="invalid-feedback" />
            </div>

            <div className="col-6 mb-3">
                <label className="form-label">Reward Type</label>
                <Field
                    name="rewardTypeId"
                    as="select"
                    className={
                        "form-control" +
                        (errors?.rewardTypeId && touched?.rewardTypeId ? " is-invalid" : "")
                    }
                    onChange={(e) => onRewardTypeChange(e.target.value)}
                >
                    {rewardTypes &&
                        rewardTypes.map((type, index) => {
                            return (
                                <option key={index} value={parseInt(type.id)}>
                                    {type.reward}
                                </option>
                            );
                        })}
                </Field>
            </div>

            <div className="col-6 mb-3">
                <label className="form-label">Quantity</label>
                <Field
                    name="quantity"
                    type="number"
                    className={
                        "form-control" +
                        (errors?.quantity && touched?.quantity ? " is-invalid" : "")
                    }
                    onChange={(e) => onRewardQuantityChange(parseInt(e.target.value))}
                />
                <ErrorMessage name="quantity" component="div" className="invalid-feedback" />
            </div>

            <div className="col-6 mb-3">
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        defaultChecked={values.isEnabled}
                        name="isEnabled"
                        onChange={onIsEnabledChange}
                    />
                    Enabled
                </div>
            </div>
        </>
    );
};

export default QuestFormTemplate;
