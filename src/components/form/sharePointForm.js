import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router-dom';

import Recaptcha from './recaptcha';

import { sendFormDataStartAsync } from '../../redux/form/form.actions';
import { selectRecaptureResponse, selectIsSending, selectResponse } from '../../redux/form/form.selectors';

import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import {useFormikContext, Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RadioGroup, CheckboxWithLabel } from 'formik-material-ui';

import InputMask from 'react-input-mask';

import LicenseAgreement from './license-agreement/license-agreement';
import './form.scss';


const PhoneMask = (props) => {
    return <InputMask {...props}>{inputProps => (<TextField {...inputProps} />)}</InputMask>
}

const FormRef = ({recaptchaRes}) => {
    const { values, setFieldValue } = useFormikContext() ?? {};

    useEffect(() => {

        if (values.SharePoint_Deployment_Type === "Other_Deployment_Options") {
            setFieldValue("accept", false)
        }

    }, [values]);

    return null;
}

const SharePointForm = ({ sendFormDataStartAsync, recaptchaRes, formResponse, isSending }) => {

    let history = useHistory();
    const formikRef = useRef();

    const [showOtherRepos, setShowOtherRepos] = useState(false);

    const [showCaseWorkflow, setShowCaseWorkflow] = useState(false);

    const [showDocumentsWorkflow, setShowDocumentsWorkflow] = useState(false);

    const [showOther, setShowOther] = useState(false);

    //TODO: move up to FormRef

    useEffect(() => {

        if (formikRef.current) {
            formikRef.current.setFieldValue("recaptcha", recaptchaRes.success)
        }

    }, [recaptchaRes.success]);

    useEffect(() => {

        const { status } = formResponse || {};

        if (status !== null && status === 201) {
            history.push("/thankyou")
        }

    }, [formResponse])

    const handleCaseWorkflow = (event) => {
        setShowCaseWorkflow(event.target.checked);
    }

    const handleOtherRepos = (event) => {
        setShowOtherRepos(event.target.checked);
    }

    const handleShowDocumentsWorkflow = (event) => {
        setShowDocumentsWorkflow(event.target.checked);
    }

    const handleOther = (event) => {
        setShowOther(event.target.checked);
    }

    const handleSubmit = (values) => {
        sendFormDataStartAsync(values);
    }

    const initialValues = {
        org_name: '',
        full_name: '',
        title: '',
        email: '',
        phone: '',
        SharePoint_Deployment_Type: "PreConfigured_SharePoint_Demo_ICloud",
        Other_Repository_List: [],
        Connecting_to_Case_Workflow_Systems: [],
        Migrating_documents_workflow_from_one_repository_to_another: false,
        Connecting_documents_or_workflow_to_my_applications: [],
        Others_Explained: "",
        accept: false,
        recaptcha: false
    }

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const validationSchema = Yup.object().shape({
        org_name: Yup.string().required("Required"),
        full_name: Yup.string().required("Required"),
        title: Yup.string().required("Required"),
        email: Yup.string().email("Enter Valid Email").required("Required"),
        phone: Yup.string().matches(phoneRegExp, "Enter Valid Phone Number"),
        recaptcha: Yup.string().required(),
        accept: Yup.bool().when("SharePoint_Deployment_Type", (SharePoint_Deployment_Type) => {
            if (SharePoint_Deployment_Type !== "Other_Deployment_Options") {
                return Yup.bool().oneOf([true], "Accept License agreement is required").required("Required")
            }
        })
    });


    return (
        <Formik innerRef={formikRef} enableReinitialize={true} validateOnMount={true} initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
           

            {(props) => (


                <Form noValidate role="form" aria-label="Request access for Intellective Unity for SharePoint">
                     <FormRef />

                    <h1>Request access for Intellective Unity for SharePoint</h1>
                    <h2>You’re just minutes away from enabling a full 360 degree view of your enterprise data! <br />Fill out the basic information below to get started. </h2>

                    <section className="form__section">
                        <h3>1. Enter your Information</h3>
                        <Field as={TextField} id="org_name" name="org_name" className="form__input" label="Organization Name" variant="outlined" helperText={<ErrorMessage name="org_name" />} error={props.errors.org_name && props.touched.org_name} required />
                        <Field as={TextField} id="full_name" name="full_name" className="form__input" label="Full Name" variant="outlined" helperText={<ErrorMessage name="full_name" />} error={props.errors.full_name && props.touched.full_name} required />
                        <Field as={TextField} id="title" name="title" className="form__input" label="Title" variant="outlined" helperText={<ErrorMessage name="title" />} error={props.errors.title && props.touched.title} required />
                        <Field as={TextField} id="email" name="email" className="form__input" label="Email" type="email" variant="outlined" helperText={<ErrorMessage name="email" />} error={props.errors.email && props.touched.email} required />
                        <Field as={TextField} name="phone" className="form__input" render={({ field }) => (<PhoneMask {...field} mask="999 999-9999" type="tel" variant="outlined" helperText={<ErrorMessage name="phone" />} label="Phone" id="Phone" error={props.errors.phone && props.touched.phone} />)} />

                    </section>

                    <section className="form__section">
                        <div className="withHelper">
                            <h3 >2. Select SharePoint Deployment Type </h3>
                        </div>

                        <p>Intellective will deploy a personalized instance of Unity in our environment. Start using Unity immediately in our secure cloud to connect to content, process, data, and applications.</p>

                        <FormControl component="fieldset">
                            <Field component={RadioGroup} role="radiogroup" aria-label="SharePoint Deployment Type" id="SharePointDeploymentType" name="SharePoint_Deployment_Type" value={props.value} onChange={props.handleChange}>
                                <FormControlLabel role="radio" value="PreConfigured_SharePoint_Demo_ICloud" control={<Radio color="primary" />} label="Pre-Configured SharePoint Demo (Intellective Cloud)" checked={props.values.SharePoint_Deployment_Type === "PreConfigured_SharePoint_Demo_ICloud"} />
                                <FormControlLabel role="radio" value="SharePoint_Online_ICloud" control={<Radio color="primary" />} label="SharePoint Online (Intellective Cloud)" />
                                <FormControlLabel role="radio" value="SharePoint_Online_Customer_Env" control={<Radio color="primary" />} label="SharePoint Online (Customer Environment Cloud or On-Premise)" />
                                <FormControlLabel role="radio" value="SharePoint_OnPremise" control={<Radio color="primary" />} label="SharePoint On-Premise (Customer Environment Cloud or On-Premise)" />
                                <FormControlLabel role="radio" value="Other_Deployment_Options" control={<Radio color="primary" />} label="Contact Intellective for Other Deployment Options" />
                            </Field>
                        </FormControl>
                    </section>

                    <section className="form__section">
                        <h3>3. Also, I'm interested in...</h3>
                        <FormControlLabel
                            id="Other_Repositories"
                            name="Other_Repositories"
                            control={<Checkbox color="primary" />}
                            label="Connecting to other repositories"
                            onChange={handleOtherRepos}
                            role="checkbox"
                        />

                        {showOtherRepos ?
                            <div className="sub__categories" >

                                <FormControl component="fieldset" >

                                    <FormGroup>
                                        <Field component={CheckboxWithLabel}
                                            name="Other_Repository_List"
                                            value="IBM_FileNet_Content_Manager"
                                            id="IBM_FileNet_Content_Manager"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: 'IBM FileNet Content Manager' }}
                                            indeterminate={false}
                                            role="checkbox"
                                            color="primary"
                                        />

                                        <Field component={CheckboxWithLabel}
                                            name="Other_Repository_List"
                                            value="IBM_Content_Manager_OnDemand"
                                            id="IBM_Content_Manager_OnDemand"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: 'IBM Content Manager OnDemand' }}
                                            indeterminate={false}
                                            role="checkbox"
                                            color="primary"
                                        />
                                        <Field component={CheckboxWithLabel}
                                            name="Other_Repository_List"
                                            value="IBM_Content_Manager_Enterprise_Edition"
                                            id="IBM_Content_Manager_Enterprise_Edition"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: 'IBM Content Manager Enterprise Edition' }}
                                            indeterminate={false}
                                            role="checkbox"
                                            color="primary"
                                        />
                                        <Field component={CheckboxWithLabel}
                                            name="Other_Repository_List"
                                            value="Microsoft_OneDrive"
                                            id="Microsoft_OneDrive"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: 'Microsoft OneDrive' }}
                                            indeterminate={false}
                                            role="checkbox"
                                            color="primary"
                                        />
                                        <Field component={CheckboxWithLabel}
                                            name="Other_Repository_List"
                                            value="BoxCom"
                                            id="BoxCom"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: 'Box.com' }}
                                            indeterminate={false}
                                            role="checkbox"
                                            color="primary"
                                        />
                                        <Field component={CheckboxWithLabel}
                                            name="Other_Repository_List"
                                            value="Alfresco_Content_Services"
                                            id="Alfresco_Content_Services"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: 'Alfresco Content Services' }}
                                            indeterminate={false}
                                            role="checkbox"
                                            color="primary"
                                        />
                                        <Field component={CheckboxWithLabel}
                                            name="Other_Repository_List"
                                            value="Another_CMIS-Compliant_Respository"
                                            id="Another_CMIS-Compliant_Respository"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: 'Another CMIS-compliant repository' }}
                                            indeterminate={false}
                                            role="checkbox"
                                            color="primary"
                                        />
                                        <Field component={CheckboxWithLabel}
                                            name="Other_Repository_List"
                                            value="Other"
                                            id="Other"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: 'Other' }}
                                            indeterminate={false}
                                            color="primary"
                                            role="checkbox"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </div>

                            : null}

                        <FormControlLabel
                            value="Connecting_to_Case_Workflow_Systems"
                            name="Connecting_to_Case_Workflow_Systems_Control"
                            id="Connecting_to_Case_Workflow_Systems_Control"
                            control={<Checkbox color="primary" />}
                            label="Connecting to case or workflow systems"
                            onChange={handleCaseWorkflow}
                            defaultIndeterminate='false'
                            role="checkbox"
                        />
                        {showCaseWorkflow ?
                            <div className="sub__categories">
                                <FormControl component="fieldset" >
                                    <FormGroup>

                                        <Field component={CheckboxWithLabel}
                                            name="Connecting_to_Case_Workflow_Systems"
                                            value="IBM_Buisness_Automation_Workflow"
                                            id="IBM_Buisness_Automation_Workflow"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: 'IBM Business Automation Workflow' }}
                                            indeterminate={false}
                                            role="checkbox"
                                            color="primary"
                                        />
                                        <Field component={CheckboxWithLabel}
                                            value="IBM_Case_Manager"
                                            name="Connecting_to_Case_Workflow_Systems"
                                            id="IBM_Case_Manager"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: "IBM Case Manager" }}
                                            color="primary"
                                            indeterminate={false}
                                            role="checkbox"
                                        />
                                        <Field component={CheckboxWithLabel}
                                            value="IBM_Case_Foundation"
                                            name="Connecting_to_Case_Workflow_Systems"
                                            id="IBM_Case_Foundation"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: "IBM Case Foundation" }}
                                            color="primary"
                                            indeterminate={false}
                                            role="checkbox"
                                        />
                                        <Field component={CheckboxWithLabel}
                                            value="RedHat"
                                            name="Connecting_to_Case_Workflow_Systems"
                                            id="RedHat"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: "Red Hat Process Automation Manager" }}
                                            color="primary"
                                            indeterminate={false}
                                            role="checkbox"
                                        />
                                        <Field component={CheckboxWithLabel}
                                            value="JBPM"
                                            name="Connecting_to_Case_Workflow_Systems"
                                            id="JBPM"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: "JBPM Open Source Business Automation Toolkit" }}
                                            color="primary"
                                            indeterminate={false}
                                            role="checkbox"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </div>

                            : null}

                        <Field component={CheckboxWithLabel}
                            value="Migrating_documents_workflow_from_one_repository_to_another"
                            name="Migrating_documents_workflow_from_one_repository_to_another"
                            control={<Checkbox color="primary" />}
                            Label={{ label: "Migrating documents or workflow from one repository to another" }}
                            color="primary"
                            role="checkbox"

                        />
                        <FormControlLabel
                            value="Connecting_documents_or_workflow_to_my_applications"
                            name="Connecting_documents_or_workflow_to_my_applications_Control"
                            id="Connecting_documents_or_workflow_to_my_applications_Control"
                            control={<Checkbox color="primary" />}
                            label="Connecting documents or workflow to my applications"
                            onChange={handleShowDocumentsWorkflow}
                            role="checkbox"

                        />
                        {showDocumentsWorkflow ?
                            <div className="sub__categories">
                                <FormControl component="fieldset" >
                                    <FormGroup>
                                        <Field component={CheckboxWithLabel}
                                            name="Connecting_documents_or_workflow_to_my_applications"
                                            value="SalesForce"
                                            id="SalesForce"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: "SalesForce" }}
                                            color="primary"
                                            role="checkbox"
                                        />
                                        <Field component={CheckboxWithLabel}
                                            name="Connecting_documents_or_workflow_to_my_applications"
                                            value="Dynamics"
                                            id="Dynamics"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: "Dynamics 365" }}
                                            color="primary"
                                            role="checkbox"
                                        />
                                        <Field component={CheckboxWithLabel}
                                            name="Connecting_documents_or_workflow_to_my_applications"
                                            value="Other_Business_Applications"
                                            id="Other_Business_Applications"
                                            control={<Checkbox color="primary" />}
                                            Label={{ label: "Other Business Applications" }}
                                            color="primary"
                                            role="checkbox"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </div>
                            : null}
                        <FormControlLabel
                            value="Other"
                            control={<Checkbox color="primary" />}
                            label="Other"
                            role="checkbox"
                            onChange={handleOther}

                        />
                        {showOther ?
                            <Field as={TextareaAutosize}
                                placeholder="Please explain your business challenge..."
                                rows={4}
                                aria-label="Please explain your business challenge"
                                name="Others_Explained"
                                id="Others_Explained" />
                            : null}
                    </section>

                    { props.values.SharePoint_Deployment_Type !== "Other_Deployment_Options" ?

                        <section className="form__section">
                            <h3>4. License agreement</h3>
                            <div className="license_agreement" aria-label="license agreement">
                                <LicenseAgreement agreementType={props.values.SharePoint_Deployment_Type} />
                            </div>
                            <br />
                            <Field component={CheckboxWithLabel}
                                value="accept"
                                name="accept"
                                id="accept"
                                control={<Checkbox color="primary" />}
                                Label={{ label: "Accept License Agreement" }}
                                onChange={props.handleChange}
                                className={'form-check-input ' + (props.errors.accept && props.touched.accept ? ' is-invalid' : '')}
                                required
                                color="primary"
                                role="checkbox"
                            />
                            {props.errors.accept ? <ErrorMessage name="accept" >{msg => <div className="invalid-feedback">{msg}</div>}</ErrorMessage> : null}

                        </section>

                        : null}

                    <pre>{JSON.stringify(props.values, null, 2)}</pre>

                    <Recaptcha />

                    <section className="action__box">
                        <Button aria-label="Request Now" role="button" type="submit" variant="contained" color="primary" className="action__btn" disabled={!(props.isValid && props.dirty && recaptchaRes.success)}>Request Now</Button>
                        {isSending && <CircularProgress role="progressbar" size={24} />}
                        <Button type="reset" role="button" className="btn btn-secondary" aria-label="Cancel">Cancel</Button>
                    </section>

                </Form >
            )}
        </Formik>
    )
}

const mapStateToProps = createStructuredSelector({
    recaptchaRes: selectRecaptureResponse,
    isSending: selectIsSending,
    formResponse: selectResponse
})

const mapDispatchToProps = dispatch => ({
    sendFormDataStartAsync: formData => dispatch(sendFormDataStartAsync(formData))
});

export default connect(mapStateToProps, mapDispatchToProps)(SharePointForm);