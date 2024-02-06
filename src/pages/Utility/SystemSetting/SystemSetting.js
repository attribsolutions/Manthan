
import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import {
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,

} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    CommonConsole,
    isSuperAdmin,
    loginCompanyID,
    loginUserID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import { mode, url, pageId } from "../../../routes/index";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { saveMsgUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";
import { editSystemSettingIDSuccess, saveSystemSettingMaster, saveSystemSettingMaster_Success, updateSystemSettingID, updateSystemSettingIDSuccess } from "../../../store/Utilites/SystemSettingRedux/action";

const SystemSetting = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        SystemSetting: "",
        IsActive: false,
        Description: "",
        DefaultValue: "",
        IsPartyRelatedSetting: false,

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.SystemSettingReducer.saveBtnloading,
            postMsg: state.SystemSettingReducer.postMsg,
            updateMsg: state.SystemSettingReducer.updateMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    const { values } = state
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        const page_Id = pageId.SYSTEM_SETTING
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))

    }, []);

    // userAccess useEffect
    useEffect(() => userAccessUseEffect({
        props,
        userAccess,
        dispatch,
        setUserAccState,

    }), [userAccess]);




    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
                setModalCss(true)
            }

            if (hasEditVal) {


                const { id, SystemSetting, IsActive, Description, DefaultValue, IsPartyRelatedSetting } = hasEditVal[0]
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                values.id = id
                values.SystemSetting = SystemSetting;
                values.IsActive = IsActive;
                values.Description = Description
                values.DefaultValue = DefaultValue
                values.IsPartyRelatedSetting = IsPartyRelatedSetting

                hasValid.SystemSetting.valid = true;
                hasValid.IsActive.valid = true;
                hasValid.Description.valid = true;
                hasValid.DefaultValue.valid = true;
                hasValid.IsPartyRelatedSetting.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editSystemSettingIDSuccess({ Status: false }))
        }
    }, [])


    useEffect(() => saveMsgUseEffect({
        postMsg, pageMode,
        history, dispatch,
        postSuccss: saveSystemSettingMaster_Success,
        resetFunc: { fileds, state, setState },
        listPath: url.SYSTEM_SETTING_LIST
    }), [postMsg])


    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state))// Clear form values
            history.push({
                pathname: url.SYSTEM_SETTING_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateSystemSettingIDSuccess({ Status: false }));
            customAlert({
                Type: 3,
                Message: JSON.stringify(updateMsg.Message),
            })
        }
    }, [updateMsg, modalCss]);


    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])


    const SaveHandler = async (event) => {

        event.preventDefault();
        const issuperAdmin = isSuperAdmin()

        try {
            if (formValid(state, setState)) {
                const jsonBody = JSON.stringify(
                    {
                        SystemSetting: values.SystemSetting,
                        Description: values.Description,
                        IsActive: values.IsActive,
                        IsPartyRelatedSetting: values.IsPartyRelatedSetting,
                        DefaultValue: values.DefaultValue,
                        SettingDetails: issuperAdmin ? [] : [{
                            Value: values.DefaultValue,
                            IsDeleted: 0,
                            CreatedBy: loginUserID(),
                            UpdatedBy: loginUserID(),
                            Company: loginCompanyID()
                        }]
                    }

                );

                if (pageMode === mode.edit) {
                    dispatch(updateSystemSettingID({ jsonBody, updateId: values.id, }));
                }
                else {
                    dispatch(saveSystemSettingMaster({ jsonBody }));
                }

            }
        } catch (e) { CommonConsole(e) }
    };


    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black " >
                                <form noValidate>

                                    <Card>
                                        <CardBody className="c_card_body">
                                            <Row>
                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label htmlFor="validationCustom01">{fieldLabel.SystemSetting} </Label>
                                                    <Input
                                                        name="SystemSetting"
                                                        id="txtName"
                                                        value={values.SystemSetting}
                                                        type="text"
                                                        disabled={pageMode === mode.edit}
                                                        className={isError.SystemSetting.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        placeholder="Please Enter SettingName"
                                                        autoComplete='off'
                                                        autoFocus={true}
                                                        onChange={(event) => {
                                                            onChangeText({ event, state, setState })
                                                            dispatch(Breadcrumb_inputName(event.target.value))
                                                        }}
                                                    />
                                                    {isError.SystemSetting.length > 0 && (
                                                        <span className="invalid-feedback">{isError.SystemSetting}</span>
                                                    )}
                                                </FormGroup>



                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label htmlFor="validationCustom01">{fieldLabel.DefaultValue} </Label>
                                                    <Input
                                                        name="DefaultValue"
                                                        id="txtName"
                                                        value={values.DefaultValue}
                                                        type="text"
                                                        className={isError.DefaultValue.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        placeholder="Please Enter DefaultValue"
                                                        autoComplete='off'
                                                        autoFocus={true}
                                                        onChange={(event) => {
                                                            onChangeText({ event, state, setState })
                                                            dispatch(Breadcrumb_inputName(event.target.value))
                                                        }}
                                                    />
                                                    {isError.DefaultValue.length > 0 && (
                                                        <span className="invalid-feedback">{isError.DefaultValue}</span>
                                                    )}
                                                </FormGroup>
                                            </Row>
                                            <Row>
                                                <FormGroup className="mb-2 col col-sm-8">
                                                    <Label htmlFor="validationCustom01">{fieldLabel.Description} </Label>
                                                    <Input
                                                        name="Description"
                                                        id="txtName"
                                                        value={values.Description}
                                                        type="text"
                                                        className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        placeholder="Please Enter Description"
                                                        autoComplete='off'
                                                        autoFocus={true}
                                                        onChange={(event) => {
                                                            onChangeText({ event, state, setState })
                                                            dispatch(Breadcrumb_inputName(event.target.value))
                                                        }}
                                                    />
                                                    {isError.Description.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Description}</span>
                                                    )}
                                                </FormGroup>
                                            </Row>
                                            <Row>
                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label  " >{fieldLabel.IsActive} </Label>
                                                <Col md="1"  >
                                                    <div className="form-check form-switch form-switch-md  " dir="ltr">
                                                        <Input type="checkbox" className="form-check-input mt-2  "
                                                            checked={values.IsActive}
                                                            name="IsActive"
                                                            onChange={(event) => {
                                                                setState((i) => {
                                                                    const a = { ...i }
                                                                    a.values.IsActive = event.target.checked
                                                                    return a
                                                                })
                                                            }}
                                                        />
                                                        <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                    </div>
                                                </Col>


                                            </Row>

                                            <Row>



                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label  " >{fieldLabel.IsPartyRelatedSetting} </Label>
                                                <Col md="1"  >
                                                    <div className="form-check form-switch form-switch-md  " dir="ltr">
                                                        <Input type="checkbox" className="form-check-input mt-2  "
                                                            checked={values.IsPartyRelatedSetting}
                                                            disabled={pageMode === mode.edit}
                                                            name="IsActive"
                                                            onChange={(event) => {
                                                                setState((i) => {
                                                                    const a = { ...i }
                                                                    a.values.IsPartyRelatedSetting = event.target.checked
                                                                    return a
                                                                })
                                                            }}
                                                        />
                                                        <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                    </div>
                                                </Col>


                                            </Row>

                                            <FormGroup className="mt-1">
                                                <Row>
                                                    <Col sm={2}>
                                                        <SaveButton
                                                            loading={saveBtnloading}
                                                            pageMode={pageMode}
                                                            onClick={SaveHandler}
                                                            userAcc={userPageAccessState}
                                                            editCreatedBy={editCreatedBy}
                                                            module={"GroupMaster"}
                                                        />
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                        </CardBody>
                                    </Card>
                                </form>
                            </CardBody>
                        </Card>
                    </Container>
                </div>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default SystemSetting;

