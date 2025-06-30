
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
    Row,
    Table
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
    FranchiesPartyType,
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
import { vieBtnCss } from "../../../components/Common/ListActionsButtons";



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
        PosSettingDetails: [],

    }
    const [buttonShow, setButtonShow] = useState(false);
    const [partyRedux, setPartyRedux] = useState([]);
    const [partySelect, setPartySelect] = useState();
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
        ?.filter((data) => data.PartyTypeID === FranchiesPartyType())
        .map((data) => ({
            value: data.id,
            label: data.Name
        }));



    function onChangeParty(e) {
        setPartySelect(e);

    }

    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null;
            if (hasShowloction) {
                setPageMode(location.pageMode);
                hasEditVal = location.editValue;
            } else if (hasShowModal) {
                hasEditVal = props.editValue;
                setPageMode(props.pageMode);
                setModalCss(true);
            }


            //  Check and bind full row data

            if ((hasEditVal)) {

                const {
                    id,
                    Setting_Key,
                    Is_Disabled,
                    Description,
                    Setting_Value,
                    Setting_Type,
                    PosSettingDetails,       //  Include table data
                    CreatedBy,
                    Name
                } = hasEditVal;

                const { values, fieldLabel, hasValid, required, isError } = { ...state };

                values.id = id;
                values.Setting_Key = Setting_Key;
                values.Is_Disabled = Is_Disabled;
                values.Description = Description;
                values.Setting_Value = Setting_Value;
                values.Setting_Type = Setting_Type;
                values.PosSettingDetails = PosSettingDetails;   //  Add to values

                setTableData(PosSettingDetails || []);            //  Bind table data

                hasValid.Setting_Key.valid = true;
                hasValid.Is_Disabled.valid = true;
                hasValid.Description.valid = true;
                hasValid.Setting_Value.valid = true;
                hasValid.Setting_Type.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError });
                dispatch(Breadcrumb_inputName(Name || ""));
                seteditCreatedBy(CreatedBy || "");
            } else {
                console.warn("hasEditVal is empty or invalid:", hasEditVal);
            }

            dispatch(editPosServiceSettingIDSuccess({ Status: false }));
        }

    }, []);


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
        debugger
        event.preventDefault();


        try {
            if (formValid(state, setState)) {


                values.PosSettingDetails = tableData;

                const blankSettingParties = [];
                const PosSettingDetails = (values.PosSettingDetails || []).map(row => {
                    if (row.Setting_Value === "") {
                        blankSettingParties.push(`${row.PartyName} This Party Setting value Required`); // or use partyList[row.PartyId] if PartyName is not directly available
                    }

                    return {
                        Setting_Value: row.Setting_Value,
                        Is_Disabled: row.Is_Disabled,
                        IsDeleted: 0,
                        CreatedBy: loginUserID(),
                        UpdatedBy: loginUserID(),
                        Company: loginCompanyID(),
                        PartyId: row.PartyId
                    };
                });

                if (blankSettingParties.length > 0) {
                    customAlert({
                        Type: 10,
                        Message: blankSettingParties,
                    });
                    return
                }


                const jsonBody = JSON.stringify({
                    Setting_Key: values.Setting_Key,
                    Description: values.Description,
                    Is_Disabled: values.Is_Disabled,
                    Setting_Type: values.Setting_Type,
                    Setting_Value: values.Setting_Value,
                    PosSettingDetails: PosSettingDetails
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
                PartyId: partySelect.value,
                PartyName: partySelect.label,
                isDisable: false,
                Setting_Value: "",
            };

            if (btnMode === "update") {

                updateTableData(tableData); // 👈 Update existing table data
                setButtonShow(false);
            } else {
                updateTableData([...tableData, newRow]); // 👈 Add new row to table data
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
                PosSettingDetails: newData // 👈 Set in state.values
            }
        }));
    }

    const handleToggle = (index) => {
        const updated = [...tableData];
        updated[index].Is_Disabled = !updated[index].Is_Disabled;
        setTableData(updated);
    };

    const handleSettingChange = (index, value) => {
        const updated = [...tableData];
        updated[index].Setting_Value = value;
        setTableData(updated);
    };

    const handleDelete = (rowId) => {
        const updated = tableData.filter(row => row.RowId !== rowId);
        setTableData(updated);
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
                                                    <Label htmlFor="validationCustom01">{fieldLabel.Setting_Key}  </Label>
                                                    <Input
                                                        name="Setting_Key"
                                                        id="txtName"
                                                        value={values.Setting_Key}
                                                        type="text"
                                                        // disabled={pageMode === mode.edit}
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
                            <CardBody className=" vh-10 0 text-black " >
                                <form noValidate>
                                    <Card>
                                        <CardBody className='text-black c_card_body'>
                                            <Row className='align-items-end'>
                                                <Col sm={12}>
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
                                                <Table bordered responsive className="mt-3">
                                                    <thead>
                                                        <tr>

                                                            <th>Party</th>
                                                            <th>Is Disable</th>
                                                            <th>Setting Value</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {tableData.map((row, index) => (
                                                            <tr key={row.RowId}>
                                                                <td>{row.PartyName}</td>
                                                                <td>



                                                                    <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                                                        <div className="form-check form-switch form-switch-md mb-3">
                                                                            <Input
                                                                                type="checkbox"
                                                                                className="form-check-input"
                                                                                defaultChecked={row.Is_Disabled}
                                                                                onChange={() => handleToggle(index)}

                                                                            />
                                                                        </div>
                                                                    </Col>

                                                                </td>
                                                                <td>
                                                                    <Input
                                                                        type="text"
                                                                        value={row.Setting_Value}
                                                                        onChange={(e) => handleSettingChange(index, e.target.value)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Button
                                                                        color="danger"
                                                                        size="sm"
                                                                        onClick={() => handleDelete(row.RowId)}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>


                                            )}

                                            <FormGroup className="mt-2">
                                                <Row>
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
                                                </Row>
                                            </FormGroup >

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

export default PosServiceSetting;

