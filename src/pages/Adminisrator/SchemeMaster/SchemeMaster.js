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
    getItemList
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    metaTagLabel,
} from "../../../components/Common/CommonFunction";
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { C_DatePicker } from "../../../CustomValidateForm";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { getCommonPartyDrodownOptionAction } from "../../../store/Utilites/PartyDrodown/action";
import { getSchemeListSuccess, saveSchemeMaster } from "../../../store/Administrator/SchemeMasterRedux/action";


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
        SchemeTypeID: "",
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

    useEffect(() => {
        const page_Id = pageId.SCHEME_MASTER
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getItemList());
        dispatch(getCommonPartyDrodownOptionAction())
        return () => {
            dispatch(getSchemeListSuccess({ Status: false }));
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

            if (hasEditVal) {
                const { SchemeName, SchemeValue, ValueIn, FromPeriod,
                    ToPeriod, ItemDetails, VoucherLimit, QRPrefix, IsActive,
                    SchemeTypeID, BillAbove, Message, OverLappingScheme,SchemeTypeName,
                    SchemeDetails, SchemeValueUpto, PartyDetails
                } = hasEditVal

                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.ToPeriod.valid = true;
                hasValid.IsActive.valid = true;
                hasValid.SchemeValue.valid = true;
                hasValid.ValueIn.valid = true;
                hasValid.SchemeName.valid = true;
                hasValid.QRPrefix.valid = true;
                hasValid.BillAbove.valid = true;
                hasValid.VoucherLimit.valid = true;
                hasValid.FromPeriod.valid = true;
                hasValid.SchemeTypeID.valid = true;
                hasValid.SchemeValueUpto.valid = true;
                hasValid.OverLappingScheme.valid = true;
                hasValid.SchemeDetails.valid = true;
                values.id = id
                values.ToPeriod = ToPeriod
                values.IsActive = IsActive
                values.Item = ItemDetails.map(i => ({
                    label: i.ItemName,
                    value: i.ItemID
                }));
                values.Party = PartyDetails.map(i => ({
                    label: i.PartyName,
                    value: i.PartyID
                }));
                values.SchemeValue = SchemeValue
                values.ValueIn = ValueIn
                values.QRPrefix = QRPrefix
                values.SchemeName = SchemeName
                values.BillAbove = BillAbove
                values.VoucherLimit = VoucherLimit
                values.IsActive = IsActive
                values.FromPeriod = FromPeriod
                values.Message = Message
                values.SchemeTypeID = {
                    label: SchemeTypeName,
                    value: SchemeTypeID
                },
                values.SchemeValueUpto = SchemeValueUpto
                values.OverLappingScheme = OverLappingScheme
                values.SchemeDetails = SchemeDetails
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.RoleMaster))
            }
        }
    }, [location]);

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(getSchemeListSuccess({ Status: false }));
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
            dispatch(getSchemeListSuccess({ Status: false }))
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
                    SchemeName: values.SchemeName,
                    SchemeValue: values.SchemeValue,
                    ValueIn: values.ValueIn,
                    FromPeriod: values.FromPeriod,
                    ToPeriod: values.ToPeriod,
                    FreeItemID: null,
                    VoucherLimit: values.VoucherLimit,
                    SchemeValueUpto: values.SchemeValueUpto,
                    BillAbove: values.BillAbove,
                    QrPrefix: values.QrPrefix,
                    IsActive: values.IsActive,
                    SchemeTypeID: values.SchemeTypeID.value,
                    BillEffect: 1,
                    ItemDetails: values.Item,
                    PartyDetails: values.Party,
                });
                dispatch(saveSchemeMaster({ jsonBody }));
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
                                                    <FormGroup className="mb-2 col col-sm-2 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.SchemeName} </Label>
                                                        <Input
                                                            name="SchemeName"
                                                            id="SchemeName"
                                                            value={values.SchemeName}
                                                            type="text"
                                                            className={isError.SchemeName.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Scheme Name"
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

                                                    <FormGroup className="mb-2 col col-sm-2 ">
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

                                                    <FormGroup className="mb-2 col col-sm-2 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.ToPeriod} </Label>
                                                        <C_DatePicker
                                                            name="ToPeriod"
                                                            value={values.ToPeriod}
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

                                                    <FormGroup className="mb-2  col-sm-2  align-items-start">
                                                        <Label htmlFor="ValueIn" style={{ width: "90px", paddingTop: "0.35rem" }}>
                                                            {fieldLabel.ValueIn}
                                                        </Label>
                                                        <div className="btn-group  col-xxl-12" role="group" aria-label="Value type">
                                                            <input
                                                                type="checkbox"
                                                                id="btncheckRS"
                                                                className="btn-check"
                                                                autoComplete="off"
                                                                checked={values.ValueIn === "RS"}
                                                                onChange={() =>
                                                                    setState(prev => ({
                                                                        ...prev,
                                                                        values: {
                                                                            ...prev.values,
                                                                            ValueIn: "RS",
                                                                        },
                                                                    }))
                                                                }
                                                            />
                                                            <label className="btn btn-outline-secondary" htmlFor="btncheckRS">
                                                                ₹
                                                            </label>

                                                            <input
                                                                type="checkbox"
                                                                id="btncheckPercent"
                                                                className="btn-check"
                                                                autoComplete="off"
                                                                checked={values.ValueIn === "%"}
                                                                onChange={() =>
                                                                    setState(prev => ({
                                                                        ...prev,
                                                                        values: {
                                                                            ...prev.values,
                                                                            ValueIn: "%",
                                                                        },
                                                                    }))
                                                                }
                                                            />
                                                            <label className="btn btn-outline-secondary" htmlFor="btncheckPercent">
                                                                %
                                                            </label>
                                                        </div>
                                                    </FormGroup>

                                                </Row>

                                                <Row className="mt-1">
                                                    <FormGroup className="mb-1 col col-sm-2 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.SchemeValue} </Label>
                                                        <Input
                                                            name="SchemeValue"
                                                            id="SchemeValue"
                                                            value={values.SchemeValue}
                                                            type="text"
                                                            className={isError.SchemeValue.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Upload Sale Record Count"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.SchemeValue.length > 0 && (
                                                            <span className="text-danger f-8"><small>{isError.SchemeValue}</small></span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>

                                                    <FormGroup className="mb-2 col col-sm-2 ">
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

                                                    <FormGroup className="mb-2 col col-sm-2 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.SchemeTypeID} </Label>
                                                        <Select
                                                            id="SchemeTypeID"
                                                            name="SchemeTypeID"
                                                            // value={Item}
                                                            isSearchable={true}

                                                            className="react-dropdown"
                                                            classNamePrefix="dropdown"
                                                            styles={{
                                                                menu: provided => ({ ...provided, zIndex: 2 })
                                                            }}
                                                            options={ItemList_Options}
                                                        // onChange={(e) => { setItem(e) }}
                                                        />
                                                        {isError.SchemeTypeID.length > 0 && (
                                                            <span className="invalid-feedback">{isError.SchemeTypeID}</span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>

                                                    <FormGroup className="mb-2  col-sm-2 align-items-start">
                                                        <Label htmlFor="ValueIn" style={{ width: "140px", paddingTop: "0.35rem" }}>
                                                            {fieldLabel.OverLappingScheme}
                                                        </Label>
                                                        <div className="btn-group col-xxl-12" role="group" aria-label="Value type">
                                                            <input
                                                                type="checkbox"
                                                                id="btncheckRS"
                                                                className="btn-check"
                                                                autoComplete="off"
                                                                checked={values.OverLappingScheme}
                                                                onChange={() =>
                                                                    setState(prev => ({
                                                                        ...prev,
                                                                        values: {
                                                                            ...prev.values,
                                                                            OverLappingScheme: true,
                                                                        },
                                                                    }))
                                                                }
                                                            />
                                                            <label className="btn btn-outline-secondary" htmlFor="btncheckRS">
                                                                Yes
                                                            </label>

                                                            <input
                                                                type="checkbox"
                                                                id="btncheckPercent"
                                                                className="btn-check"
                                                                autoComplete="off"
                                                                checked={!values.OverLappingScheme}
                                                                onChange={() =>
                                                                    setState(prev => ({
                                                                        ...prev,
                                                                        values: {
                                                                            ...prev.values,
                                                                            OverLappingScheme: false,
                                                                        },
                                                                    }))
                                                                }
                                                            />
                                                            <label className="btn btn-outline-secondary" htmlFor="btncheckPercent">
                                                                No
                                                            </label>
                                                        </div>
                                                    </FormGroup>
                                                </Row>


                                                <Row className="mt-1">
                                                    <FormGroup className="mb-2 col col-sm-2 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.VoucherLimit} </Label>
                                                        <Input
                                                            name="VoucherLimit"
                                                            id="VoucherLimit"
                                                            value={values.VoucherLimit}
                                                            className={isError.VoucherLimit.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Voucher Limit"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.VoucherLimit.length > 0 && (
                                                            <span className="invalid-feedback">{isError.VoucherLimit}</span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>

                                                    <FormGroup className="mb-2 col col-sm-2">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.QRPrefix} </Label>
                                                        <Input
                                                            name="QRPrefix"
                                                            id="QRPrefix"
                                                            value={values.QRPrefix}
                                                            type="text"
                                                            className={isError.QRPrefix.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter QR Prefix"
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

                                                    <FormGroup className="mb-2 col col-sm-2">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.SchemeValueUpto} </Label>
                                                        <Input
                                                            name="SchemeValueUpto"
                                                            id="SchemeValueUpto"
                                                            value={values.SchemeValueUpto}
                                                            type="text"
                                                            className={isError.SchemeValueUpto.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Scheme Value Upto"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.SchemeValueUpto.length > 0 && (
                                                            <span className="invalid-feedback">{isError.SchemeValueUpto}</span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>
                                                    <FormGroup className="mb-2  col-sm-2  align-items-start">
                                                        <Label htmlFor="ValueIn" style={{ width: "140px", paddingTop: "0.35rem" }}>
                                                            {fieldLabel.IsActive}
                                                        </Label>
                                                        <div className="btn-group  col-xxl-12" role="group" aria-label="Value type">
                                                            <input
                                                                type="checkbox"
                                                                id="btncheckRS"
                                                                className="btn-check"
                                                                autoComplete="off"
                                                                checked={values.IsActive}
                                                                onChange={() =>
                                                                    setState(prev => ({
                                                                        ...prev,
                                                                        values: {
                                                                            ...prev.values,
                                                                            IsActive: true,
                                                                        },
                                                                    }))
                                                                }
                                                            />
                                                            <label className="btn btn-outline-secondary" htmlFor="btncheckRS">
                                                                Yes
                                                            </label>
                                                            <input
                                                                type="checkbox"
                                                                id="btncheckPercent"
                                                                className="btn-check"
                                                                autoComplete="off"
                                                                checked={!values.IsActive}
                                                                onChange={() =>
                                                                    setState(prev => ({
                                                                        ...prev,
                                                                        values: {
                                                                            ...prev.values,
                                                                            IsActive: false,
                                                                        },
                                                                    }))
                                                                }
                                                            />
                                                            <label className="btn btn-outline-secondary" htmlFor="btncheckPercent">
                                                                No
                                                            </label>
                                                        </div>
                                                    </FormGroup>
                                                </Row>


                                                <Row className="mt-1">
                                                    <FormGroup className="mb-2 col col-11 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.SchemeDetails} </Label>
                                                        <Input
                                                            name="SchemeDetails"
                                                            id="SchemeDetails"
                                                            value={values.SchemeDetails}
                                                            type="text"
                                                            className={isError.SchemeDetails.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Scheme Details"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })

                                                            }}
                                                        />
                                                        {isError.SchemeDetails.length > 0 && (
                                                            <span className="invalid-feedback">{isError.SchemeDetails}</span>
                                                        )}
                                                    </FormGroup>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>


                                    <div className="row ">

                                        <CardBody className="c_card_body">
                                            <Col md={11}>

                                                <Label htmlFor="validationCustom01">{fieldLabel.Item} </Label>
                                                <Select
                                                    id="Item"
                                                    name="Item"
                                                    value={values.Item}
                                                    isSearchable={true}
                                                    isMulti={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                    options={ItemList_Options}
                                                    onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                />
                                                {isError.Item.length > 0 && (
                                                    <span className="invalid-feedback">{isError.Item}</span>
                                                )}


                                            </Col>
                                        </CardBody>
                                    </div>

                                    <div className="row ">

                                        <CardBody className="c_card_body">
                                            <Col md={11}>
                                                {/* <FormGroup className="mb-2 col col-sm-3 "> */}
                                                <Label htmlFor="validationCustom01">{fieldLabel.Party} </Label>
                                                <Select
                                                    id="Party"
                                                    name="Party"
                                                    value={values.Party}
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
                                            </Col>
                                        </CardBody>
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

