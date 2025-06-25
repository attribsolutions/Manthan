
import React, { useEffect, useState } from "react";
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
import PartySettingsTable from "./PartySettingsTable";
import { vieBtnCss } from "../../../components/Common/ListActionsButtons";
import SaveButtonDraggable from '../../../components/Common/saveButtonDraggable';


const PosServiceSetting = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        groupList: "",
        Setting_Key: "",
        Is_Disabled: false,
        Description: "",
        Setting_Value: "",
        Setting_Type: false,
        SettingDetails: [],

    }
    const [buttonShow, setButtonShow] = useState(false);
    const [partyRedux, setPartyRedux] = useState([]);
    const [partySelect, setPartySelect] = useState({ value: 0, label: "All" });
    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");




    const [tableData, setTableData] = useState([]);



    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.PosServiceSettingReducer.saveBtnloading,
            postMsg: state.PosServiceSettingReducer.postMsg,
            updateMsg: state.PosServiceSettingReducer.updateMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField,
            tableList: state.PosServiceSettingReducer.groupList,
        }));

    const { values } = state
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)





    useEffect(() => {
        const page_Id = pageId.POS_SERVICE_SETTING
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


    // party code 
    useEffect(async () => {//initioal Api

        const resp3 = await commonPartyDropdown_API(loginEmployeeID())
        if (resp3.StatusCode === 200) {
            setPartyRedux(resp3.Data)
        }
    }, [])



    const partyOptions = partyRedux
        ?.filter((data) => data.PartyType === "Franchises")
        .map((data) => ({
            value: data.id,
            label: data.Name
        }));


    // userAccess useEffect
    partyOptions.unshift({ value: 0, label: "All" })

    function onChangeParty(e) {
        setPartySelect(e);
        // setTableData([]);
    }



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


                const { id, Setting_Key, Is_Disabled, Description, Setting_Value, Setting_Type } = hasEditVal[0]
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                values.id = id
                values.Setting_Key = Setting_Key;
                values.Is_Disabled = Is_Disabled;
                values.Description = Description
                values.Setting_Value = Setting_Value
                values.Setting_Type = Setting_Type

                hasValid.Setting_Key.valid = true;
                hasValid.Is_Disabled.valid = true;
                hasValid.Description.valid = true;
                hasValid.Setting_Value.valid = true;
                hasValid.Setting_Type.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editPosServiceSettingIDSuccess({ Status: false }))
        }
    }, [])



    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state))// Clear form values
            history.push({
                pathname: url.POS_SERVICE_SETTING_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updatePosServiceSettingIDSuccess({ Status: false }));
            customAlert({
                Type: 3,
                Message: JSON.stringify(updateMsg.Message),
            })
        }
    }, [updateMsg, modalCss]);

    useEffect(() => saveMsgUseEffect({
        postMsg, pageMode,
        history, dispatch,
        postSuccss: savePosServiceSettingMaster_Success,
        resetFunc: { fileds, state, setState },
        listPath: url.POS_SERVICE_SETTING_LIST      // redirect path       
    }), [postMsg])


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
                    ? []
                    : (values.SettingDetails || []).map(row => ({
                        Value: row.SettingValue,
                        IsDisable: row.isDisable ? 1 : 0,
                        IsDeleted: 0,
                        CreatedBy: loginUserID(),
                        UpdatedBy: loginUserID(),
                        Company: loginCompanyID(),
                        Party: row.Party.value
                    }));

                const jsonBody = JSON.stringify({
                    Setting_Key: values.Setting_Key,
                    Description: values.Description,
                    Is_Disabled: values.Is_Disabled,
                    Setting_Type: values.Setting_Type,
                    Setting_Value: values.Setting_Value,
                    SettingDetails: settingDetails
                });

                if (pageMode === mode.edit) {
                    dispatch(updatePosServiceSettingID({
                        jsonBody,
                        updateId: values.id,
                    }));

                } else {
                    dispatch(savePosServiceSettingMaster({ jsonBody }));
                }
            }
        } catch (e) {
            CommonConsole(e);
        }
    };



    const addOrUpdateDataHandler = (e, btnMode) => {
        try {
            if (!partySelect?.value) return customAlert({ Type: 4, Message: "Please select a party." });

            const newRow = {
                RowId: tableData.length + 1,
                Party: partySelect,
                isDisable: false,
                SettingValue: "",
            };

            if (btnMode === "update") {

                updateTableData(tableData); // 👈
                setButtonShow(false);
            } else {
                updateTableData([...tableData, newRow]); // 👈
            }

            setPartySelect(null);
        } catch (error) {
            console.error("AddOrUpdate Error:", error);
        }
    };



    const updateTableData = (newData) => {
        setTableData(newData);
        setState(prev => ({
            ...prev,
            values: {
                ...prev.values,
                SettingDetails: newData // 👈 Set in state.values
            }
        }));
    }

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
                                                    <Label htmlFor="validationCustom01">{fieldLabel.Setting_Key}  </Label>
                                                    <Input
                                                        name="Setting_Key"
                                                        id="txtName"
                                                        value={values.Setting_Key}
                                                        type="text"
                                                        disabled={pageMode === mode.edit}
                                                        // className={isError.Setting_Key.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        placeholder="Please Enter SettingName"
                                                        autoComplete='off'
                                                        autoFocus={true}
                                                        onChange={(event) => {
                                                            onChangeText({ event, state, setState })
                                                            dispatch(Breadcrumb_inputName(event.target.value))
                                                        }}
                                                    />
                                                    {isError.Setting_Key.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Setting_Key}</span>
                                                    )}
                                                </FormGroup>




                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label htmlFor="validationCustom01">{fieldLabel.Setting_Value} </Label>
                                                    <Input
                                                        name="Setting_Value"
                                                        id="txtName"
                                                        value={values.Setting_Value}
                                                        type="text"
                                                        className={isError.Setting_Value.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        placeholder="Please Enter Setting_Value"
                                                        autoComplete='off'
                                                        autoFocus={true}
                                                        onChange={(event) => {
                                                            onChangeText({ event, state, setState })
                                                            dispatch(Breadcrumb_inputName(event.target.value))
                                                        }}
                                                    />
                                                    {isError.Setting_Value.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Setting_Value}</span>
                                                    )}
                                                </FormGroup>

                                                <Col sm="1"></Col>

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

                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label  " >{fieldLabel.Is_Disabled} </Label>
                                                <Col md="1"  >
                                                    <div className="form-check form-switch form-switch-md  " dir="ltr">
                                                        <Input type="checkbox" className="form-check-input mt-2  "
                                                            checked={values.Is_Disabled}
                                                            name="Is_Disabled"
                                                            onChange={(event) => {
                                                                setState((i) => {
                                                                    const a = { ...i }
                                                                    a.values.Is_Disabled = event.target.checked
                                                                    return a
                                                                })
                                                            }}
                                                        />
                                                        <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                    </div>
                                                </Col>








                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label " style={{ marginLeft: "115px" }} >{fieldLabel.Setting_Type}</Label>
                                                <Col md="1" className="" >
                                                    <div className="form-check form-switch form-switch-md  " dir="ltr">
                                                        <Input type="checkbox" className="form-check-input mt-2  "
                                                            checked={values.Setting_Type}
                                                            // disabled={pageMode === mode.edit}
                                                            name="Is_Disabled"
                                                            onChange={(event) => {
                                                                setState((i) => {
                                                                    const a = { ...i }
                                                                    a.values.Setting_Type = event.target.checked
                                                                    return a
                                                                })
                                                            }}
                                                        />
                                                        <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                    </div>
                                                </Col>


                                            </Row>






                                        </CardBody>

                                    </Card>

                                </form>

                            </CardBody>
                        </Card>
                        <Card className="text-black" style={{ backgroundColor: "whitesmoke" }} >
                            <CardBody className='text-black'>
                                <Row className='align-items-end'>
                                    <Col sm="4">
                                        <FormGroup className="mb-0">
                                            <Label className="form-label" htmlFor="transactionType">
                                                Party
                                            </Label>
                                            <div className="d-flex align-items-center">
                                                <Col sm={6}>
                                                    <C_Select
                                                        id="party"
                                                        placeholder="Select Party"
                                                        classNamePrefix="select2-Customer"
                                                        value={partySelect}
                                                        options={partyOptions}
                                                        onChange={onChangeParty}
                                                        styles={{
                                                            menu: (provided) => ({ ...provided, zIndex: 2 }),
                                                        }}
                                                    /></Col>
                                                &nbsp;
                                                {
                                                    !(buttonShow) ?
                                                        <Button
                                                            className={`btn-edit ${vieBtnCss} mx-xxl-2`}
                                                            data-mdb-toggle="tooltip"
                                                            data-mdb-placement="top"
                                                            title="Edit Party Type"
                                                            onClick={(e) => addOrUpdateDataHandler(e, "add")}
                                                        ><i className="dripicons-plus font-size-18"></i></Button>
                                                        :
                                                        <C_Button
                                                            type="button"
                                                            className="btn btn-info btn-sm ms-2"
                                                            onClick={(e) => addOrUpdateDataHandler(e, "update")}
                                                        >
                                                            Update
                                                        </C_Button>
                                                }
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                {tableData.length > 0 && (
                                    <PartySettingsTable
                                        tableData={tableData}
                                        setTableData={setTableData}
                                    />
                                )}
                            </CardBody>


                        </Card>

                        <SaveButtonDraggable>

                            <Col sm={2}>
                                <SaveButton
                                    loading={saveBtnloading}
                                    pageMode={pageMode}
                                    onClick={SaveHandler}
                                    userAcc={userPageAccessState}
                                    editCreatedBy={editCreatedBy}
                                    module={"PosServiceSetting"}
                                />
                            </Col>
                        </SaveButtonDraggable>
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

export default PosServiceSetting;

