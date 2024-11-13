import React, { useEffect, useState, } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Label,
    Row,
    Input,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import {
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess
} from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeCheckbox,
    onChangeDate,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../../components/Common/validationFunction";
import { SaveButton } from "../../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    loginCompanyID,
    btnIsDissablefunc,
    metaTagLabel,
    currentDate_ymd,
    loginPartyID,
} from "../../../../components/Common/CommonFunction";
import * as pageId from "../../../../routes/allPageID";
import * as url from "../../../../routes/route_url";
import * as mode from "../../../../routes/PageMode";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import { C_DatePicker } from "../../../../CustomValidateForm";
import { GenralMasterSubType } from "../../../../helpers/backend_helper";
import { SPos_MachineTypeList_Success, SPos_MachineTypeSave_Action, SPos_MachineTypeSave_Success } from "../../../../store/SweetPOSStore/Administrator/MachineTypeMasterRedux/action";
import SaveButtonDraggable from "../../../../components/Common/saveButtonDraggable";

const MachineTypeMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const { location } = history

    const fileds = {
        id: "",
        MacID: "",
        MachineType: "",
        IsServer: false,
        ClientID: "",
        MachineRole: "",
        IsAutoUpdate: false,
        IsGiveUpdate: false,
        IsService: false,
        MachineName: "",
        ServerSequence: "",
        UploadSaleRecordCount: "",
        Validity: "",
        Version: "",
        ServerDatabase: "",
        ServerHost: "",
        ServerName: "",
        ServerPassWord: "",
        ServerUser: "",
        Invoiceprefix: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [machineTypeOptions, setMachineTypeOptions] = useState([]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        saveBtnloading,
        userAccess } = useSelector((state) => ({

            postMsg: state.SPos_MachineType_Reducer.postMsg,
            saveBtnloading: state.SPos_MachineType_Reducer.saveBtnloading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField,
        }));


    useEffect(() => {
        const page_Id = pageId.SWEET_POS_MACHINE_MASTER
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        return () => {
            dispatch(SPos_MachineTypeSave_Success({ Status: false }));
            dispatch(SPos_MachineTypeList_Success([]));
        }
    }, []);

    const hasShowloction = location.hasOwnProperty("rowData")
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    // userAccess useEffect
    useEffect(() => {

        let userAcc = null;
        let locationPath;

        if (props.pageMode === mode.dropdownAdd) {
            locationPath = props.masterPath;
        } else {
            locationPath = location.pathname;
        }

        if (hasShowModal) {
            locationPath = props.masterPath;
        };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc);
            if (!props.isdropdown) {
                breadcrumbReturnFunc({ dispatch, userAcc });
            }
        };
    }, [userAccess])

    useEffect(async () => {

        const jsonBody = {
            Company: loginCompanyID(),
            TypeID: 179
        };
        const response = await GenralMasterSubType(jsonBody)

        setMachineTypeOptions(response.Data.map((index) => ({
            value: index.id,
            label: index.Name,
        })))
    }, [])

    useEffect(async () => {
        setState((i) => {
            const a = { ...i }
            a.values.IsService = values.IsServer
            a.hasValid.IsService.valid = true
            return a
        })

    }, [values.IsServer])


    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time
    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.rowData
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
            }

            if (hasEditVal) {
                const { id, ClientID, IsAutoUpdate, IsGiveUpdate, IsServer, IsService,
                    MacID, MachineName, MachineRoleName, MachineTypeDetails, ServerSequence,
                    UploadSaleRecordCount, Validity, Version, Invoiceprefix,
                    ServerDatabase, ServerHost, ServerName, ServerPassWord, ServerUser

                } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.ClientID.valid = true;
                hasValid.IsAutoUpdate.valid = true;
                hasValid.IsGiveUpdate.valid = true;
                hasValid.IsServer.valid = true;
                hasValid.IsService.valid = true;
                hasValid.MacID.valid = true;
                hasValid.MachineName.valid = true;
                hasValid.MachineRole.valid = true;
                hasValid.MachineType.valid = true;
                hasValid.ServerSequence.valid = true;
                hasValid.UploadSaleRecordCount.valid = true;
                hasValid.Validity.valid = true;
                hasValid.Version.valid = true;
                hasValid.ServerDatabase.valid = true;
                hasValid.ServerHost.valid = true;
                hasValid.ServerName.valid = true;
                hasValid.ServerPassWord.valid = true;
                hasValid.ServerUser.valid = true;
                hasValid.Invoiceprefix.valid = true


                values.id = id
                values.ClientID = id
                values.IsAutoUpdate = IsAutoUpdate
                values.MachineType = MachineTypeDetails.map(i => ({
                    label: i.MachineTypeName,
                    value: i.id
                }));
                values.IsGiveUpdate = IsGiveUpdate
                values.IsServer = IsServer
                values.IsService = IsService
                values.MacID = MacID
                values.MachineName = MachineName
                values.MachineRole = MachineRoleName
                values.ServerSequence = ServerSequence
                values.UploadSaleRecordCount = UploadSaleRecordCount
                values.IsAutoUpdate = IsAutoUpdate
                values.Validity = Validity
                values.Version = Version
                values.ServerDatabase = ServerDatabase
                values.ServerHost = ServerHost
                values.ServerName = ServerName
                values.ServerPassWord = ServerPassWord
                values.ServerUser = ServerUser
                values.Invoiceprefix = Invoiceprefix


                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.RoleMaster))
            }
        }
    }, [location]);

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(SPos_MachineTypeSave_Success({ Status: false }));
            dispatch(SPos_MachineTypeList_Success([]));
            setState(() => resetFunction(fileds, state)) // Clear form values 

            if (pageMode === "other") {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let isPermission = await customAlert({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                })
                if (isPermission) {
                    history.push({ pathname: url.SWEET_POS_MACHINE_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(SPos_MachineTypeSave_Success({ Status: false }))
            dispatch(SPos_MachineTypeList_Success([]));
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id

        // if (!values.IsServer){
        //     customAlert({
        //         Type:3,
        //         Message:""
        //     })
        // }

            try {
                if (formValid(state, setState)) {
                    btnIsDissablefunc({ btnId, state: true })

                    const jsonBody = JSON.stringify([{

                        "MacID": values.MacID,
                        "MachineType": values.MachineType.map(i => i.value).join(','),
                        "Party": loginPartyID(),
                        "ClientID": values.ClientID,
                        "IsAutoUpdate": values.IsAutoUpdate,
                        "IsGiveUpdate": values.IsGiveUpdate,
                        "MachineName": values.MachineName,
                        "MachineRole": values.MachineRole,
                        "ServerSequence": values.ServerSequence,
                        "UploadSaleRecordCount": values.UploadSaleRecordCount,
                        "Validity": values.Validity,
                        "Version": values.Version,

                        "IsServer": values.IsServer,
                        "IsService": !(values.IsServer) ? false : values.IsService,
                        "ServerDatabase": !(values.IsServer) ? null : values.ServerDatabase,
                        "ServerHost": !(values.IsServer) ? null : values.ServerHost,
                        "SeverName": !(values.IsServer) ? null : values.ServerName,
                        "ServerPassWord": !(values.IsServer) ? null : values.ServerPassWord,
                        "ServerUser": !(values.IsServer) ? null : values.ServerUser,
                        "Invoiceprefix": !(values.IsServer) ? null : values.Invoiceprefix
                    }]);
                    dispatch(SPos_MachineTypeSave_Action({ jsonBody }));

                }
            } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" >
                    <Container fluid>
                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                        <Card className="text-black" style={{ marginTop: "3px" }}>
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form noValidate>

                                    <Col md={12}>
                                        <Card>
                                            <CardBody className="c_card_body">
                                                <Row>
                                                    <FormGroup className="mb-2 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.MachineType} </Label>
                                                        <Select
                                                            id="MachineType "
                                                            name="MachineType"
                                                            value={values.MachineType}
                                                            isSearchable={true}
                                                            autoFocus={true}
                                                            isMulti={true}
                                                            className="react-dropdown"
                                                            classNamePrefix="dropdown"
                                                            options={machineTypeOptions}
                                                            onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                        />
                                                        {isError.MachineType.length > 0 && (
                                                            <span className="text-danger f-8"><small>{isError.MachineType}</small></span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>
                                                    <FormGroup className="mb-2 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.MacID} </Label>
                                                        <Input
                                                            name="MacID"
                                                            id="MacID"
                                                            value={values.MacID}
                                                            type="text"
                                                            disabled={true}
                                                            className={isError.MacID.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter MacID"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.MacID.length > 0 && (
                                                            <span className="invalid-feedback">{isError.MacID}</span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>
                                                    <FormGroup className="mb-2 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.ClientID} </Label>
                                                        <Input
                                                            name="ClientID"
                                                            id="ClientID"
                                                            value={values.ClientID}
                                                            type="text"
                                                            disabled={true}
                                                            className={isError.ClientID.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Client ID"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.ClientID.length > 0 && (
                                                            <span className="invalid-feedback">{isError.ClientID}</span>
                                                        )}
                                                    </FormGroup>
                                                </Row>



                                                <Row className="mt-1">
                                                    <FormGroup className="mb-1 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.UploadSaleRecordCount} </Label>
                                                        <Input
                                                            name="UploadSaleRecordCount"
                                                            id="UploadSaleRecordCount"
                                                            value={values.UploadSaleRecordCount}
                                                            type="text"
                                                            className={isError.UploadSaleRecordCount.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Upload Sale Record Count"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.UploadSaleRecordCount.length > 0 && (
                                                            <span className="text-danger f-8"><small>{isError.UploadSaleRecordCount}</small></span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>

                                                    <FormGroup className="mb-1 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.Validity} </Label>
                                                        <C_DatePicker
                                                            name="Validity"
                                                            value={values.Validity}
                                                            options={{
                                                                altInput: true,
                                                                altFormat: "d-m-Y",
                                                                dateFormat: "Y-m-d",
                                                            }}
                                                            placeholder={"DD/MM/YYYY"}
                                                            onChange={(y, v, e) => {
                                                                onChangeDate({ e, v, state, setState })
                                                            }}
                                                        />
                                                    </FormGroup>

                                                    <Col md="1">  </Col>
                                                    <FormGroup className="mb-1 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.Version} </Label>
                                                        <Input
                                                            name="Version"
                                                            id="Version"
                                                            value={values.Version}
                                                            type="text"
                                                            className={isError.Version.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Version"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.Version.length > 0 && (
                                                            <span className="invalid-feedback">{isError.Version}</span>
                                                        )}
                                                    </FormGroup>
                                                </Row>

                                                <Row className="mt-1">
                                                    {/* <FormGroup className="mb-2 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.MachineName} </Label>
                                                        <Input
                                                            name="MachineName"
                                                            id="MachineName"
                                                            value={values.MachineName}
                                                            type="text"
                                                            className={isError.MachineName.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Machine Name"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.MachineName.length > 0 && (
                                                            <span className="text-danger f-8"><small>{isError.MachineName}</small></span>
                                                        )}
                                                    </FormGroup> */}

                                                    {/* <Col md="1">  </Col> */}
                                                    <FormGroup className="mb-2 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.MachineRole} </Label>
                                                        <Input
                                                            name="MachineRole"
                                                            id="MachineRole"
                                                            value={values.MachineRole}
                                                            type="textarea"
                                                            rows="1"
                                                            disabled={true}
                                                            className={isError.MachineRole.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Machine Role"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.MachineRole.length > 0 && (
                                                            <span className="invalid-feedback">{isError.MachineRole}</span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>
                                                    <FormGroup className="mb-2 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.ServerSequence} </Label>
                                                        <Input
                                                            name="ServerSequence"
                                                            id="ServerSequence"
                                                            value={values.ServerSequence}
                                                            type="text"
                                                            className={isError.ServerSequence.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Server Sequence"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.ServerSequence.length > 0 && (
                                                            <span className="invalid-feedback">{isError.ServerSequence}</span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>
                                                    <Col md="3">
                                                        <FormGroup >
                                                            <Row style={{ marginTop: '25px' }}>
                                                                <Label className="col-sm-5 col-form-label"> {fieldLabel.IsAutoUpdate}
                                                                </Label>
                                                                <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                                                    <div className="form-check form-switch form-switch-md mb-1">
                                                                        <Input
                                                                            type="checkbox"
                                                                            className="form-check-input"
                                                                            checked={values.IsAutoUpdate}
                                                                            name="IsAutoUpdate"
                                                                            onChange={(event) => onChangeCheckbox({ event, state, setState })}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md="1">  </Col>
                                                    <Col md="3">
                                                        <FormGroup >
                                                            <Row style={{ marginTop: '25px' }}>
                                                                <Label className="col-sm-5 col-form-label">  {fieldLabel.IsGiveUpdate}
                                                                </Label>
                                                                <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                                                    <div className="form-check form-switch form-switch-md mb-1">
                                                                        <Input
                                                                            type="checkbox"
                                                                            className="form-check-input"
                                                                            checked={values.IsGiveUpdate}
                                                                            name="IsGiveUpdate"
                                                                            onChange={(event) => onChangeCheckbox({ event, state, setState })}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>


                                    <div className="row ">

                                        <Col md={12}>
                                            <Card>
                                                <CardBody className="c_card_body">
                                                    <Row className="mt-n4 mb-3">
                                                        <Col md="3">
                                                            <FormGroup className="mb-1">
                                                                <Row style={{ marginTop: '25px' }}>
                                                                    <Label className="col-sm-5 col-form-label">{fieldLabel.IsServer}</Label>
                                                                    <Col md={4} style={{ marginTop: '7px' }} className="form-check form-switch form-switch-sm">
                                                                        <div className="form-check form-switch form-switch-md mb-1">
                                                                            <Input
                                                                                type="checkbox"
                                                                                className="form-check-input"
                                                                                checked={values.IsServer}
                                                                                name="IsServer"
                                                                                onChange={(event) => onChangeCheckbox({ event, state, setState })}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="1">  </Col>

                                                        {values.IsServer &&

                                                            <Col md="3">
                                                                <FormGroup className="mb-1">
                                                                    <Row style={{ marginTop: '25px' }}>
                                                                        <Label className="col-sm-5 col-form-label">{fieldLabel.IsService}</Label>
                                                                        <Col md={4} style={{ marginTop: '7px' }} className="form-check form-switch form-switch-sm">
                                                                            <div className="form-check form-switch form-switch-md mb-1">
                                                                                <Input
                                                                                    type="checkbox"
                                                                                    className="form-check-input"
                                                                                    checked={values.IsService}
                                                                                    name="IsService"
                                                                                    onChange={(event) => onChangeCheckbox({ event, state, setState })}
                                                                                />
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                            </Col>}

                                                    </Row>

                                                    {/* Conditionally render other fields if IsServer is true */}
                                                    {values.IsServer && (
                                                        <>
                                                            <Row className="mt-1">
                                                                <FormGroup className="mb-2 col col-sm-3">
                                                                    <Label>{fieldLabel.ServerHost}</Label>
                                                                    <Input
                                                                        name="ServerHost"
                                                                        value={values.ServerHost}
                                                                        type="text"
                                                                        className={isError.ServerHost.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                        placeholder="Please Enter Server Host"
                                                                        autoComplete="off"
                                                                        onChange={(event) => onChangeText({ event, state, setState })}
                                                                    />
                                                                    {isError.ServerHost.length > 0 && <span className="text-danger f-8"><small>{isError.ServerHost}</small></span>}
                                                                </FormGroup>

                                                                <Col md="1">  </Col>
                                                                <FormGroup className="mb-2 col col-sm-3">
                                                                    <Label>{fieldLabel.ServerName}</Label>
                                                                    <Input
                                                                        name="ServerName"
                                                                        value={values.ServerName}
                                                                        type="text"
                                                                        className={isError.ServerName.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                        placeholder="Please Enter Server Name"
                                                                        autoComplete="off"
                                                                        onChange={(event) => onChangeText({ event, state, setState })}
                                                                    />
                                                                    {isError.ServerName.length > 0 && <span className="text-danger f-8"><small>{isError.ServerName}</small></span>}
                                                                </FormGroup>

                                                                <Col md="1">  </Col>
                                                                <FormGroup className="mb-2 col col-sm-3">
                                                                    <Label>{fieldLabel.ServerUser}</Label>
                                                                    <Input
                                                                        name="ServerUser"
                                                                        value={values.ServerUser}
                                                                        type="text"
                                                                        className={isError.ServerUser.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                        placeholder="Please Enter Server User"
                                                                        autoComplete="off"
                                                                        onChange={(event) => onChangeText({ event, state, setState })}
                                                                    />
                                                                    {isError.ServerUser.length > 0 && <span className="text-danger f-8"><small>{isError.ServerUser}</small></span>}
                                                                </FormGroup>
                                                            </Row>

                                                            <Row className="mt-1">
                                                                <FormGroup className="mb-2 col col-sm-3">
                                                                    <Label>{fieldLabel.ServerDatabase}</Label>
                                                                    <Input
                                                                        name="ServerDatabase"
                                                                        value={values.ServerDatabase}
                                                                        type="text"
                                                                        className={isError.ServerDatabase.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                        placeholder="Please Enter Server Database"
                                                                        autoComplete="off"
                                                                        onChange={(event) => onChangeText({ event, state, setState })}
                                                                    />
                                                                    {isError.ServerDatabase.length > 0 && <span className="text-danger f-8"><small>{isError.ServerDatabase}</small></span>}
                                                                </FormGroup>

                                                                <Col md="1">  </Col>
                                                                <FormGroup className="mb-2 col col-sm-3">
                                                                    <Label>{fieldLabel.ServerPassWord}</Label>
                                                                    <Input
                                                                        name="ServerPassWord"
                                                                        value={values.ServerPassWord}
                                                                        type="text"
                                                                        className={isError.ServerPassWord.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                        placeholder="Please Enter Server PassWord"
                                                                        autoComplete="off"
                                                                        onChange={(event) => onChangeText({ event, state, setState })}
                                                                    />
                                                                    {isError.ServerPassWord.length > 0 && <span className="text-danger f-8"><small>{isError.ServerPassWord}</small></span>}
                                                                </FormGroup>

                                                                <Col md="1">  </Col>
                                                                <FormGroup className="mb-2 col col-sm-3">
                                                                    <Label>{fieldLabel.Invoiceprefix}</Label>
                                                                    <Input
                                                                        name="Invoiceprefix"
                                                                        value={values.Invoiceprefix}
                                                                        type="text"
                                                                        className={isError.Invoiceprefix.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                        placeholder="Please Enter Invoice Prefix"
                                                                        autoComplete="off"
                                                                        onChange={(event) => onChangeText({ event, state, setState })}
                                                                    />
                                                                    {isError.Invoiceprefix.length > 0 && <span className="text-danger f-8"><small>{isError.Invoiceprefix}</small></span>}
                                                                </FormGroup>
                                                            </Row>
                                                        </>
                                                    )}
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </div>

                                    <SaveButtonDraggable>
                                        <SaveButton pageMode={pageMode}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                        />
                                    </SaveButtonDraggable>
                                </form>
                            </CardBody>
                        </Card>

                    </Container>
                </div>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default MachineTypeMaster

