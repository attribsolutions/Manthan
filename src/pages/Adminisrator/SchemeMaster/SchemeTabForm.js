import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, } from "react";
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
import { getSchemeTypelist } from "../../../store/Administrator/SchemeRedux/action";



const SchemeMaster = forwardRef((props, ref) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const { location } = history


    const fileds = {
        SchemeName: "",
        SchemeValue: "",
        ValueIn: "",
        FromPeriod: _cfunc.currentDate_ymd,
        ToPeriod: _cfunc.currentDate_ymd,
        Item: "",
        VoucherLimit: "",
        QRPrefix: "",
        IsActive: null,
        SchemeTypeID: "",
        BillAbove: "",
        Message: "",
        OverLappingScheme: null,
        SchemeDetails: "",
        SchemeValueUpto: "",
        Party: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [activeTab, setactiveTab] = useState("1")


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        saveBtnloading,
        ItemDropDown,
        Party,
        SchemeType,
        userAccess } = useSelector((state) => ({
            postMsg: state.SPos_MachineType_Reducer.postMsg,
            saveBtnloading: state.SPos_MachineType_Reducer.saveBtnloading,
            userAccess: state.Login.RoleAccessUpdateData,
            ItemDropDown: state.ItemMastersReducer.ItemList,
            SchemeType: state.SchemeTypeReducer.SchemeTypeList,
            Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
            pageField: state.CommonPageFieldReducer.pageField,
        }));

    useEffect(() => {
        const page_Id = pageId.SCHEME_MASTER
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getItemList());
        dispatch(getSchemeTypelist());
        dispatch(getCommonPartyDrodownOptionAction())
        return () => {
            dispatch(getSchemeListSuccess({ Status: false }));
        }
    }, []);

    useImperativeHandle(ref, () => ({
        getValue: () => state,
        updateValue: (newVal) => setState(newVal)
    }));

    const hasShowloction = location.hasOwnProperty("rowData")
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }

    const { isError } = state;
    debugger
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

 

    const SchemeType_Options = SchemeType.map((index) => ({
        value: index.id,
        label: index.SchemeTypeName,
    }));




    const Party_Option = Party.map(i => ({
        value: i.id,
        label: i.Name,
        PartyType: i.PartyType
    })).filter(index => index.PartyType === "Franchises");

    const toggle1 = tab => {
        if (activeTab !== tab) {
            setactiveTab(tab)
        }
    }

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
                    SchemeTypeID, BillAbove, Message, OverLappingScheme, SchemeTypeName,
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
                }
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



    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" >
                    <Container fluid>
                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                        <Card className="text-black" style={{ marginTop: "3px" }}>

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

                                                    <FormGroup className="mb-2 col-sm-2 align-items-start">
                                                        <Label htmlFor="ValueIn" style={{ width: "90px", paddingTop: "0.35rem" }}>
                                                            {fieldLabel.ValueIn}
                                                        </Label>
                                                        <div className="btn-group col-xxl-12" role="group" aria-label="Value type">
                                                            <input
                                                                type="checkbox"
                                                                id="ValueIn_id_RS"
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
                                                            <label className="btn btn-outline-secondary" htmlFor="ValueIn_id_RS">
                                                                ₹
                                                            </label>

                                                            <input
                                                                type="checkbox"
                                                                id="ValueIn_id_Persent"
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
                                                            <label className="btn btn-outline-secondary" htmlFor="ValueIn_id_Persent">
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
                                                            value={values.SchemeTypeID}
                                                            isSearchable={true}
                                                            // className="react-dropdown"
                                                            className={isError.SchemeDetails.length > 0 ? "is-invalid" : "react-dropdown"}
                                                            classNamePrefix="dropdown"
                                                            styles={{
                                                                menu: provided => ({ ...provided, zIndex: 2 })
                                                            }}
                                                            options={SchemeType_Options}
                                                            onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}

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
                                                                id="OverLappingScheme_id_true"
                                                                className="btn-check"
                                                                autoComplete="off"
                                                                checked={values.OverLappingScheme === true}
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
                                                            <label className="btn btn-outline-secondary" htmlFor="OverLappingScheme_id_true">
                                                                Yes
                                                            </label>

                                                            <input
                                                                type="checkbox"
                                                                id="OverLappingScheme_id_false"
                                                                className="btn-check"
                                                                autoComplete="off"
                                                                checked={values.OverLappingScheme === false}
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
                                                            <label className="btn btn-outline-secondary" htmlFor="OverLappingScheme_id_false">
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
                                                    <FormGroup className="mb-2 col-sm-2 align-items-start">
                                                        <Label htmlFor="IsActive" style={{ width: "140px", paddingTop: "0.35rem" }}>
                                                            {fieldLabel.IsActive}
                                                        </Label>
                                                        <div className="btn-group col-xxl-12" role="group" aria-label="Value type">
                                                            <input
                                                                type="checkbox"
                                                                id="IsActive_id_true"
                                                                className="btn-check"
                                                                autoComplete="off"
                                                                checked={values.IsActive === true}
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
                                                            <label className="btn btn-outline-secondary" htmlFor="IsActive_id_true">
                                                                Yes
                                                            </label>

                                                            <input
                                                                type="checkbox"
                                                                id="IsActive_id_false"
                                                                className="btn-check"
                                                                autoComplete="off"
                                                                checked={values.IsActive === false}
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
                                                            <label className="btn btn-outline-secondary" htmlFor="IsActive_id_false">
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
                                                {/* <FormGroup className="mb-2 col col-sm-3 "> */}
                                                <Label htmlFor="validationCustom01">{fieldLabel.Party} </Label>
                                                <Select
                                                    id="Party"
                                                    name="Party"
                                                    value={values.Party}
                                                    isMulti={true}
                                                    className={isError.Party.length > 0 ? "is-invalid" : "react-dropdown"}
                                                    isSearchable={true}
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
});

export default SchemeMaster

