import React from 'react'
import { useEffect, useState } from "react";
import {
    Button,
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
    getUserList,

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
import { C_Button, SaveButton } from "../../../components/Common/CommonButton";
import {
    CommonConsole,
    isSuperAdmin,
    loginCompanyID,
    loginEmployeeID,
    loginUserID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import { mode, url, pageId } from "../../../routes/index";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { saveMsgUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";
import { editPosServiceSettingIDSuccess, savePosServiceSettingMaster, savePosServiceSettingMaster_Success, updatePosServiceSettingID, updatePosServiceSettingIDSuccess } from "../../../store/Utilites/PosServiesSettingRedux/action";
import { C_Select } from "../../../CustomValidateForm";
import { commonPartyDropdown_API } from "../../../helpers/backend_helper";
import { CashierSummaryReport_GoButton_API_Success } from '../../../store/SweetPOSStore/Report/CashierSummaryRedux/action';
import { allLabelWithBlank } from '../../../components/Common/CommonErrorMsg/HarderCodeData';
import { editPhonePaySettingIDSuccess, savePhonePaySettingMaster, savePhonePaySettingMaster_Success, updatePhonePaySettingID, updatePhonePaySettingIDSuccess } from '../../../store/Utilites/PhonePaySettingRedux/action';
// import PartySettingsTable from "./PartySettingsTable";


export const PhonePaySetting = (props) => {
    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {

        id: "",
        client_id: "",
        party_id: "",
        user_id: "",
        base_url: "",
        merchant_id: "",
        provider_id: "",
        salt_key: "",
        key_index: "",
        store_id: "",
        store_name: "",
        terminal_id: "",
        merchant_name: "",
        x_callback_url: "",
        is_active: false,
      
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [modalCss, setModalCss] = useState(false);

    const {
        postMsg,
        updateMsg,
        pageField,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.PhonePaySettingReducer.saveBtnloading,
            postMsg: state.PhonePaySettingReducer.postMsg,
            updateMsg: state.PhonePaySettingReducer.updateMsg,
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
            const page_Id = pageId.PHONE_PAY_SETTING
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
            if (hasShowloction || hasShowModal) {
                let hasEditVal = null;
                if (hasShowloction) {
                    setPageMode(location.pageMode);
                    hasEditVal = location.editValue;
                } else if (hasShowModal) {
                    hasEditVal = props.editValue;
                    setPageMode(props.pageMode);
                    setModalCss(true);
                }
                if (hasEditVal) {
                    const {
                        id, client_id, party_id, user_id, base_url,
                        merchant_id, provider_id, salt_key, key_index,
                        store_id, store_name, terminal_id, merchant_name,
                        x_callback_url, is_active
                    } = hasEditVal[0];
        
                    const { values, fieldLabel, hasValid, required, isError } = { ...state };

                    values.id = id;
                    values.client_id = client_id;
                    values.party_id = party_id;
                    values.user_id = user_id;
                    values.base_url = base_url;
                    values.merchant_id = merchant_id;
                    values.provider_id = provider_id;
                    values.salt_key = salt_key;
                    values.key_index = key_index;
                    values.store_id = store_id;
                    values.store_name = store_name;
                    values.terminal_id = terminal_id;
                    values.merchant_name = merchant_name;
                    values.x_callback_url = x_callback_url;
                    values.is_active = is_active;

                    hasValid.client_id.valid = true;
                    hasValid.party_id.valid = true;
                    hasValid.user_id.valid = true;
                    hasValid.base_url.valid = true;
                    hasValid.merchant_id.valid = true;

                     hasValid.provider_id.valid = true;
                    hasValid.salt_key.valid = true;
                    hasValid.key_index.valid = true;
                    hasValid.store_id.valid = true;
                    hasValid.store_name.valid = true;

                    
                    hasValid.terminal_id.valid = true;
                    hasValid.merchant_name.valid = true;
                    hasValid.x_callback_url.valid = true;
                    hasValid.is_active.valid = true;

                    setState({ values, fieldLabel, hasValid, required, isError })
                    dispatch(Breadcrumb_inputName(hasEditVal.Name))
                    seteditCreatedBy(hasEditVal.CreatedBy)
                }
                dispatch(editPhonePaySettingIDSuccess({ Status: false }))
            }
        }, [])

        useEffect(() => saveMsgUseEffect({
            postMsg, pageMode,
            history, dispatch,
            postSuccss: savePhonePaySettingMaster_Success,
            resetFunc: { fileds, state, setState },
            listPath: url.PHONE_PAY_SETTING_LIST,
        }), [postMsg])
    
    
        useEffect(() => {
            if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
                setState(() => resetFunction(fileds, state))// Clear form values
                history.push({
                    pathname: url.PHONE_PAY_SETTING_LIST,
                })
            } else if (updateMsg.Status === true && !modalCss) {
                dispatch(updatePhonePaySettingIDSuccess({ Status: false }));
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
        const issuperAdmin = isSuperAdmin();

        try {
            if (formValid(state, setState)) {
                const settingDetails = issuperAdmin
                const jsonBody = JSON.stringify(
                    {
                        id: values.id,
                        client_id: values.client_id,
                        party_id: values.party_id,
                        user_id: values.user_id,
                        base_url: values.base_url,
                        merchant_id: values.merchant_id,
                        provider_id: values.provider_id,
                        salt_key: values.salt_key,
                        key_index: values.key_index,
                        store_id: values.store_id,
                        store_name: values.store_name,
                        terminal_id: values.terminal_id,
                        merchant_name: values.merchant_name,
                        x_callback_url: values.x_callback_url,
                        is_active: values.is_active,
                        CreatedBy: loginUserID(),
                        UpdatedBy: loginUserID(),
                        Company: loginCompanyID(),
                });

                if (pageMode === mode.edit) {
                    dispatch(updatePhonePaySettingID({

                    }));

                } else {
                    dispatch(savePhonePaySettingMaster({ jsonBody }));
                }
            }
        } catch (e) {
            CommonConsole(e);
        }
    };


    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content">


                    <Container fluid>

                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                        <Card>
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className="c_card_body">
                                <form noValidate>
                                  
                                        <CardBody>
                                            <Row className=" justify-content-around mb-3">
                                                <Col sm={3}>
                                                    <FormGroup>
                                                        <Label>Cashier</Label>
                                                        <C_Select
                                                            name="Cashier"
                                                            isSearchable={true}
                                                            className="react-dropdown"
                                                            classNamePrefix="dropdown"
                                                        // options={CashierOption}
                                                        // onChange={(e) => { CashierOnchange(e) }}
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col sm={3}>
                                                    <FormGroup>
                                                        <Label>MAC Address</Label>
                                                        <C_Select
                                                            name="macAddress"
                                                            isSearchable={true}
                                                            className="react-dropdown"
                                                            classNamePrefix="dropdown"
                                                        // options={MacAddressOption}
                                                        // onChange={(e) => { MacAddressOnchange(e) }}
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col sm={3}>
                                                    <FormGroup>
                                                        <Label>Store ID</Label>
                                                        <C_Select
                                                            name="storeId"
                                                            isSearchable={true}
                                                            className="react-dropdown"
                                                            classNamePrefix="dropdown"
                                                        // options={StoreIdOption}
                                                        // onChange={(e) => { StoreIdOnchange(e) }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Row className="mt-2 justify-content-around mt-3">
                                                <Col sm={3}>
                                                    <FormGroup >
                                                        <Label htmlFor="validationCustom01">Merchant id </Label>
                                                        <Input
                                                            name="Description"
                                                            id="txtName"
                                                            // value={values.Description}
                                                            type="text"
                                                            // className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter merchant id"
                                                            autoComplete='off'
                                                            autoFocus={true}
                                                        // onChange={(event) => {
                                                        //     onChangeText({ event, state, setState })
                                                        //     dispatch(Breadcrumb_inputName(event.target.value))
                                                        // }}
                                                        />
                                                        {/* {isError.Description.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Description}</span>
                                                    )} */}
                                                    </FormGroup>

                                                </Col>

                                                <Col sm={3}>
                                                    <FormGroup >
                                                        <Label htmlFor="validationCustom01">Provider Id </Label>
                                                        <Input
                                                            name="Description"
                                                            id="txtName"
                                                            // value={values.Description}
                                                            type="text"
                                                            // className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Provider Id"
                                                            autoComplete='off'
                                                            autoFocus={true}
                                                        // onChange={(event) => {
                                                        //     onChangeText({ event, state, setState })
                                                        //     dispatch(Breadcrumb_inputName(event.target.value))
                                                        // }}
                                                        />
                                                        {/* {isError.Description.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Description}</span>
                                                    )} */}
                                                    </FormGroup>

                                                </Col>

                                                <Col sm={3}>
                                                    <FormGroup >
                                                        <Label htmlFor="validationCustom01">Salt Key </Label>
                                                        <Input
                                                            name="Description"
                                                            id="txtName"
                                                            // value={values.Description}
                                                            type="text"
                                                            // className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Salt Key"
                                                            autoComplete='off'
                                                            autoFocus={true}
                                                        // onChange={(event) => {
                                                        //     onChangeText({ event, state, setState })
                                                        //     dispatch(Breadcrumb_inputName(event.target.value))
                                                        // }}
                                                        />
                                                        {/* {isError.Description.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Description}</span>
                                                    )} */}
                                                    </FormGroup>

                                                </Col>
                                            </Row>

                                            <Row className="mt-2 justify-content-around mt-3">




                                                <Col sm={3}>

                                                    <FormGroup >
                                                        <Label htmlFor="validationCustom01">Terminal ID </Label>
                                                        <Input
                                                            name="Description"
                                                            id="txtName"
                                                            // value={values.Description}
                                                            type="text"
                                                            // className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Salt Key"
                                                            autoComplete='off'
                                                            autoFocus={true}
                                                        // onChange={(event) => {
                                                        //     onChangeText({ event, state, setState })
                                                        //     dispatch(Breadcrumb_inputName(event.target.value))
                                                        // }}
                                                        />
                                                        {/* {isError.Description.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Description}</span>
                                                    )} */}
                                                    </FormGroup>

                                                </Col>

                                                <Col sm={3}>
                                                    <FormGroup >
                                                        <Label htmlFor="validationCustom01">Merchent Name </Label>
                                                        <Input
                                                            name="Description"
                                                            id="txtName"
                                                            // value={values.Description}
                                                            type="text"
                                                            // className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Salt Key"
                                                            autoComplete='off'
                                                            autoFocus={true}
                                                        // onChange={(event) => {
                                                        //     onChangeText({ event, state, setState })
                                                        //     dispatch(Breadcrumb_inputName(event.target.value))
                                                        // }}
                                                        />
                                                        {/* {isError.Description.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Description}</span>
                                                    )} */}
                                                    </FormGroup>

                                                </Col>


                                                <Col sm={3}>
                                                    <FormGroup >
                                                        <Label htmlFor="validationCustom01">X-Call Back_Url </Label>
                                                        <Input
                                                            name="Description"
                                                            id="txtName"
                                                            // value={values.Description}
                                                            type="text"
                                                            // className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Salt Key"
                                                            autoComplete='off'
                                                            autoFocus={true}
                                                        // onChange={(event) => {
                                                        //     onChangeText({ event, state, setState })
                                                        //     dispatch(Breadcrumb_inputName(event.target.value))
                                                        // }}
                                                        />
                                                        {/* {isError.Description.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Description}</span>
                                                    )} */}
                                                    </FormGroup>

                                                </Col>


                                            </Row>
                                            <Row className='mt-2 justify-content-start ms-1'>
                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label  ms-5" >Is_Disabled</Label>
                                                <Col md="1"  >
                                                    <div className="form-check form-switch form-switch-md  " dir="ltr">
                                                        <Input type="checkbox" className="form-check-input mt-2  "
                                                            // checked={values.Is_Disabled}
                                                            name="Is_Disabled"
                                                        // onChange={(event) => {
                                                        //     setState((i) => {
                                                        //         const a = { ...i }
                                                        //         a.values.Is_Disabled = event.target.checked
                                                        //         return a
                                                        //     })
                                                        // }}
                                                        />
                                                        <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                   
                                </form>

                               

                            </CardBody>

                            
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
export default PhonePaySetting
















