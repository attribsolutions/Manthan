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
    commonPageFieldSuccess,
    Get_Items_Drop_Down,
    getItemList
} from "../../../store/actions";
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
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    loginCompanyID,
    btnIsDissablefunc,
    metaTagLabel,
    currentDate_ymd,
    loginPartyID,
    loginJsonBody,
    loginSelectedPartyID,
} from "../../../components/Common/CommonFunction";
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { C_DatePicker } from "../../../CustomValidateForm";
import { GenralMasterSubType, User_Component_GetMethod_API } from "../../../helpers/backend_helper";
import { SPos_MachineTypeList_Success, SPos_MachineTypeSave_Action, SPos_MachineTypeSave_Success } from "../../../store/SweetPOSStore/Administrator/MachineTypeMasterRedux/action";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { getCommonPartyDrodownOptionAction } from "../../../store/Utilites/PartyDrodown/action";


const SchemeMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const { location } = history

    const fileds = {
        SchemeName: "",
        SchemeValue: "",
        ValueIn: "",
        FromPeriod: false,
        ToPeriod: "",
        Item: "",
        VoucherLimit: false,
        QRPrefix: false,
        IsActive: false,
        SchemeType: "",
        BillAbove: "",
        Message: "",
        OverLappingScheme: "",
        SchemeDetails: "",
        SchemeValueUpto: "",
        Party: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [UserOptions, setUserOptions] = useState([]);


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        saveBtnloading,
        ItemDropDown,
        Party,
        userAccess } = useSelector((state) => ({
            postMsg: state.SPos_MachineType_Reducer.postMsg,
            saveBtnloading: state.SPos_MachineType_Reducer.saveBtnloading,
            userAccess: state.Login.RoleAccessUpdateData,
            ItemDropDown: state.ItemMastersReducer.ItemList,
            Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,

            pageField: state.CommonPageFieldReducer.pageField,
        }));

    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);
    useEffect(() => {
        const page_Id = pageId.SCHEME_MASTER
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getItemList());
        dispatch(getCommonPartyDrodownOptionAction())
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

    const ItemList_Options = ItemDropDown.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const Party_Option = Party.map(i => ({
        value: i.id,
        label: i.Name,
        PartyType: i.PartyType
    })).filter(index => index.PartyType === "Franchises");



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

            // if (hasEditVal) {
            //     const { id, ToPeriod, IsActive, IsGiveUpdate, IsServer, IsService,
            //         SchemeName, MachineName, QRPrefixName, MachineTypeDetails, BillAbove,
            //         VoucherLimit, FromPeriod, Version, Invoiceprefix,
            //         ServerDatabase, ServerHost, ServerName, ServerPassWord, ServerUser, PrimaryUserID, PrimaryUserName

            //     } = hasEditVal
            //     const { values, fieldLabel, hasValid, required, isError } = { ...state }

            //     hasValid.ToPeriod.valid = true;
            //     hasValid.IsActive.valid = true;
            //     hasValid.IsGiveUpdate.valid = true;
            //     hasValid.IsServer.valid = true;
            //     hasValid.IsService.valid = true;
            //     hasValid.SchemeName.valid = true;
            //     hasValid.MachineName.valid = true;
            //     hasValid.QRPrefix.valid = true;
            //     hasValid.MachineType.valid = true;
            //     hasValid.BillAbove.valid = true;
            //     hasValid.VoucherLimit.valid = true;
            //     hasValid.FromPeriod.valid = true;
            //     hasValid.Version.valid = true;
            //     hasValid.ServerDatabase.valid = true;
            //     hasValid.ServerHost.valid = true;
            //     hasValid.ServerName.valid = true;
            //     hasValid.ServerPassWord.valid = true;
            //     hasValid.ServerUser.valid = true;
            //     hasValid.Invoiceprefix.valid = true;
            //     hasValid.UserDetails.valid = true;






            //     values.id = id
            //     values.ToPeriod = id
            //     values.IsActive = IsActive
            //     values.MachineType = MachineTypeDetails.map(i => ({
            //         label: i.MachineTypeName,
            //         value: i.id
            //     }));
            //     values.IsGiveUpdate = IsGiveUpdate
            //     values.IsServer = IsServer
            //     values.IsService = IsService
            //     values.SchemeName = SchemeName
            //     values.MachineName = MachineName
            //     values.QRPrefix = QRPrefixName
            //     values.BillAbove = BillAbove
            //     values.VoucherLimit = VoucherLimit
            //     values.IsActive = IsActive
            //     values.FromPeriod = FromPeriod
            //     values.Version = Version
            //     values.ServerDatabase = ServerDatabase
            //     values.ServerHost = ServerHost
            //     values.ServerName = ServerName
            //     values.ServerPassWord = ServerPassWord
            //     values.ServerUser = ServerUser
            //     values.Invoiceprefix = Invoiceprefix
            //     values.UserDetails = {
            //         label: PrimaryUserName,
            //         value: PrimaryUserID
            //     };



            //     setState({ values, fieldLabel, hasValid, required, isError })
            //     dispatch(Breadcrumb_inputName(hasEditVal.RoleMaster))
            // }
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



        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({

                    "SchemeName": values.SchemeName,
                    "MachineType": values.MachineType.map(i => i.value).join(','),
                    "Party": commonPartyDropSelect.value,
                    "ToPeriod": values.ToPeriod,
                    "IsActive": values.IsActive,
                    "IsGiveUpdate": values.IsGiveUpdate,
                    "MachineName": values.MachineName,
                    "QRPrefix": values.QRPrefix,
                    "BillAbove": values.BillAbove,
                    "VoucherLimit": values.VoucherLimit,
                    "FromPeriod": values.FromPeriod,
                    "Version": values.Version,
                    "PrimaryUser": values.UserDetails.value,
                    "IsServer": values.IsServer,
                    "IsService": !(values.IsServer) ? false : values.IsService,
                    "ServerDatabase": !(values.IsServer) ? null : values.ServerDatabase,
                    "ServerHost": !(values.IsServer) ? null : values.ServerHost,
                    "SeverName": !(values.IsServer) ? null : values.ServerName,
                    "ServerPassWord": !(values.IsServer) ? null : values.ServerPassWord,
                    "ServerUser": !(values.IsServer) ? null : values.ServerUser,
                    "Invoiceprefix": !(values.IsServer) ? null : values.Invoiceprefix
                });
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
                                                        <Label htmlFor="validationCustom01">{fieldLabel.SchemeName} </Label>
                                                        <Input
                                                            name="SchemeName"
                                                            id="SchemeName"
                                                            value={values.SchemeName}
                                                            type="text"
                                                            disabled={true}
                                                            className={isError.SchemeName.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter SchemeName"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.SchemeName.length > 0 && (
                                                            <span className="text-danger f-8"><small>{isError.SchemeName}</small></span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>
                                                    <FormGroup className="mb-2 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.FromPeriod} </Label>
                                                        <C_DatePicker
                                                            name="FromPeriod"
                                                            value={values.FromPeriod}
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
                                                    <FormGroup className="mb-2 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.ToPeriod} </Label>
                                                        <C_DatePicker
                                                        // name="ToPeriod"
                                                        // value={values.ToPeriod}
                                                        // options={{
                                                        //     altInput: true,
                                                        //     altFormat: "d-m-Y",
                                                        //     dateFormat: "Y-m-d",
                                                        // }}
                                                        // placeholder={"DD/MM/YYYY"}
                                                        // onChange={(y, v, e) => {
                                                        //     onChangeDate({ e, v, state, setState })
                                                        // }}
                                                        />

                                                    </FormGroup>
                                                </Row>



                                                <Row className="mt-1">
                                                    <FormGroup className="mb-1 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.VoucherLimit} </Label>
                                                        <Input
                                                            name="VoucherLimit"
                                                            id="VoucherLimit"
                                                            value={values.VoucherLimit}
                                                            type="text"
                                                            className={isError.VoucherLimit.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Upload Sale Record Count"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.VoucherLimit.length > 0 && (
                                                            <span className="text-danger f-8"><small>{isError.VoucherLimit}</small></span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>

                                                    <FormGroup className="mb-1 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.FromPeriod} </Label>
                                                        <C_DatePicker
                                                            name="FromPeriod"
                                                            value={values.FromPeriod}
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


                                                </Row>

                                                <Row className="mt-1">

                                                    <FormGroup className="mb-2 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.QRPrefix} </Label>
                                                        <Input
                                                            name="QRPrefix"
                                                            id="QRPrefix"
                                                            value={values.QRPrefix}
                                                            type="textarea"
                                                            rows="1"
                                                            disabled={true}
                                                            className={isError.QRPrefix.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Machine Role"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.QRPrefix.length > 0 && (
                                                            <span className="invalid-feedback">{isError.QRPrefix}</span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>
                                                    <FormGroup className="mb-2 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.BillAbove} </Label>
                                                        <Input
                                                            name="BillAbove"
                                                            id="BillAbove"
                                                            value={values.BillAbove}
                                                            type="text"
                                                            className={isError.BillAbove.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Server Sequence"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.BillAbove.length > 0 && (
                                                            <span className="invalid-feedback">{isError.BillAbove}</span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>
                                                    <Col md="3">
                                                        <FormGroup >
                                                            <Row style={{ marginTop: '25px' }}>
                                                                <Label className="col-sm-5 col-form-label"> {fieldLabel.IsActive}
                                                                </Label>
                                                                <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                                                    <div className="form-check form-switch form-switch-md mb-1">
                                                                        <Input
                                                                            type="checkbox"
                                                                            className="form-check-input"
                                                                            checked={values.IsActive}
                                                                            name="IsActive"
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
                                                    <Label htmlFor="validationCustom01">{fieldLabel.Item} </Label>
                                                    <Select
                                                        id="Item"
                                                        name="Item"
                                                        // value={Item}
                                                        isSearchable={true}
                                                        isMulti={true}
                                                        className="react-dropdown"
                                                        classNamePrefix="dropdown"
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                        }}
                                                        options={ItemList_Options}
                                                    // onChange={(e) => { setItem(e) }}
                                                    />
                                                    {isError.Item.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Item}</span>
                                                    )}

                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </div>

                                    <div className="row ">

                                        <Col md={12}>
                                            <Card>
                                                <CardBody className="c_card_body">
                                                    {/* <FormGroup className="mb-2 col col-sm-3 "> */}
                                                    <Label htmlFor="validationCustom01">{fieldLabel.Party} </Label>
                                                    <Select
                                                        id="Party"
                                                        name="Party"
                                                        // value={values.Party}
                                                        isMulti={true}

                                                        isSearchable={true}
                                                        className="react-dropdown"
                                                        classNamePrefix="dropdown"
                                                        options={Party_Option}
                                                        onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                    />
                                                    {isError.Party.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Party}</span>
                                                    )}
                                                    {/* </FormGroup> */}
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

export default SchemeMaster

