import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction,
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";

import { C_DatePicker, C_Select } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../../routes/index"
import { ClaimListfortracking, GenralMasterSubType } from "../../../helpers/backend_helper";
import { ClaimForTheMonthOtion, CurrentMonthAndYear } from './ClaimRelatedData';
import { getcompanyList } from "../../../store/Administrator/CompanyRedux/actions";
import { getPartyListAPI, getPartyListAPISuccess } from "../../../store/Administrator/PartyRedux/action";
import { priceListByCompay_Action } from "../../../store/Administrator/PriceList/action";
import { editClaimTrackingEntryIDSuccess, saveClaimTrackingEntry, saveClaimTrackingEntry_Success, updateClaimTrackingEntryID, updateClaimTrackingEntryIDSuccess } from "../../../store/Accounting/ClaimTrackingEntryRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const ClaimTrackingEntry = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();
    const currentDate_ymd = _cfunc.date_ymd_func()
    const SelectedMonth = () => _cfunc.getCurrentMonthAndYear()

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    const [typeOption, setTypeOption] = useState([]);
    const [typeOfClaimOption, setTypeOfClaimOption] = useState([]);
    const [claimCheckByOption, setClaimCheckByOption] = useState([]);
    const [creditNoteStatusOption, setCreditNoteStatusOption] = useState([]);
    const [claimListfortrackingApi, setClaimListfortrackingApi] = useState([]);

    const [yearAndMonth, setYearAndMonth] = useState({ Year: '', Month: '' });

    const fileds = {
        Date: currentDate_ymd,
        ClaimId: "",
        ClaimText: "",
        PartyName: "",
        Type: "",
        ClaimReceivedSource: "",
        ClaimTrade: "",
        TypeOfClaim: "",
        ClaimForTheMonth: SelectedMonth(),
        ClaimAmount: "",
        Remark: "",
        CompanyName: "",
        ClaimCheckBy: "",
        CreditNotestatus: "",
        CreditNoteNo: "",
        CreditNoteDate: currentDate_ymd,
        ClaimSummaryDate: currentDate_ymd,
        CreditNoteAmount: "",
        CreditNoteUpload: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { partyList,
        saveBtnloading,
        postMsg,
        partyDropdownLoading,
        PriceList,
        updateMsg,
        pageField,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.ClaimTrackingEntry_Reducer.saveBtnloading,
            postMsg: state.ClaimTrackingEntry_Reducer.postMsg,
            partyList: state.CommonPartyDropdownReducer.commonPartyDropdown,
            partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,

            // partyList: state.PartyMasterReducer.partyList,
            // partyDropdownLoading: state.PartyMasterReducer.goBtnLoading,
            PriceList: state.PriceListReducer.priceListByCompany,
            updateMsg: state.ClaimTrackingEntry_Reducer.updateMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) {
            locationPath = props.masterPath;
        };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        const page_Id = pageId.CLAIM_TRACKING_ENTRY
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id));
        // dispatch(getPartyListAPI())
        dispatch(priceListByCompay_Action());
        return () => { dispatch(getPartyListAPISuccess([])) }

    }, []);

    const fetchDataAndSetDropdown = async (TypeID, setDropdown) => {
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: TypeID,
        });
        const resp = await GenralMasterSubType(jsonBody);
        if (resp.StatusCode === 200) {
            setDropdown(
                resp.Data.map((index) => ({
                    value: index.id,
                    label: index.Name,
                })));
        }
    };

    useEffect(async () => {
        fetchDataAndSetDropdown(76, setTypeOption);
        fetchDataAndSetDropdown(78, setTypeOfClaimOption);
        fetchDataAndSetDropdown(79, setClaimCheckByOption);
        fetchDataAndSetDropdown(82, setCreditNoteStatusOption);
        dispatch(getcompanyList());

        let selectedMonth = SelectedMonth();
        const { Year, Month } = _cfunc.getFirstAndLastDateOfMonth(selectedMonth);
        const jsonBody = JSON.stringify({
            "Year": CurrentMonthAndYear().Year,
            "Month": CurrentMonthAndYear().Month
        });

        const resp = await ClaimListfortracking(jsonBody);
        setClaimListfortrackingApi(resp.StatusCode === 200 ? resp.Data : []);

        setYearAndMonth({ Year, Month });

    }, []);

    const partyListOptions = partyList.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const ClaimIdOptions = claimListfortrackingApi.map((i, index) => ({
        value: index + 1,
        claimId: i.id,
        label: `${i.id} ${i.PartyName} /${i.PartyTypeName} (${i.ClaimAmount})`,
        Party: { value: i.PartyID, label: i.PartyName },
        ClaimAmount: i.ClaimAmount,
        PartyTypeID: i.PartyTypeID
    }));

    const ClaimTradeOptions = PriceList.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const Date_Onchange = (e, date) => {
        setState((i) => {
            const a = { ...i }
            a.values.Date = date;
            a.hasValid.Date.valid = true
            return a
        })
    };

    const partyOnChange = (hasSelect, evn) => {
        onChangeSelect({ hasSelect, evn, state, setState });
    };

    const ClaimIdOnChange = (hasSelect, evn) => {

        onChangeSelect({ hasSelect, evn, state, setState });
        setState((i) => {
            debugger
            const a = { ...i }
            a.values.ClaimAmount = hasSelect.ClaimAmount;
            a.values.PartyName = hasSelect.Party;
            a.hasValid.PartyName.valid = true
            a.hasValid.ClaimAmount.valid = true

            return a
        })
    };

    async function MonthAndYearOnchange(e, InitialDate) {

        let selectedMonth = InitialDate ? e : e.target.value;
        const { Year, Month } = _cfunc.getFirstAndLastDateOfMonth(selectedMonth);

        const jsonBody = JSON.stringify({
            "Year": InitialDate ? CurrentMonthAndYear().Year : Year.toString(),
            "Month": InitialDate ? CurrentMonthAndYear().Month : Month.toString().padStart(2, '0')
        });

        const resp = await ClaimListfortracking(jsonBody);
        setClaimListfortrackingApi(resp.StatusCode === 200 ? resp.Data : []);

        setYearAndMonth({ Year, Month });

        setState((i) => {
            const a = { ...i }
            a.values.ClaimAmount = '';
            a.values.ClaimId = '';
            a.values.PartyName = '';
            a.hasValid.ClaimId.valid = true
            a.hasValid.PartyName.valid = false
            a.hasValid.ClaimAmount.valid = false
            return a
        })
    }

    const getFormattedDate = (date, format) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return format.replace('yyyy', year).replace('MM', month);
    };

    const currentMonth = getFormattedDate(new Date(), "yyyy-MM");

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        if ((hasShowloction || hasShowModal) && pageField) {

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

                const { id, Date, ClaimReceivedSource, ClaimAmount, Remark, CreditNoteNo, CreditNoteDate,
                    CreditNoteAmount, ClaimSummaryDate, CreditNoteUpload, Claim, TypeName, Type,
                    ClaimTradeName, ClaimTrade, TypeOfClaimName, TypeOfClaim, ClaimCheckByName, ClaimCheckBy,
                    CreditNotestatusName, CreditNotestatus, PartyName, Party, Year, Month, PartyTypeName } = hasEditVal

                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Date.valid = true;
                hasValid.ClaimReceivedSource.valid = true;
                hasValid.ClaimAmount.valid = true;
                hasValid.Remark.valid = true;
                hasValid.CreditNoteNo.valid = true;
                hasValid.CreditNoteDate.valid = true;
                hasValid.CreditNoteAmount.valid = true;
                hasValid.ClaimSummaryDate.valid = true;
                hasValid.CreditNoteUpload.valid = true;
                hasValid.ClaimId.valid = true;
                hasValid.Type.valid = true;
                hasValid.ClaimTrade.valid = true;
                hasValid.TypeOfClaim.valid = true;
                hasValid.ClaimCheckBy.valid = true;
                hasValid.CreditNotestatus.valid = true;
                hasValid.PartyName.valid = true;
                hasValid.ClaimForTheMonth.valid = true;

                values.id = id;
                values.Date = Date;
                values.ClaimReceivedSource = ClaimReceivedSource;
                values.ClaimAmount = ClaimAmount;
                values.Remark = Remark;
                values.CreditNoteNo = CreditNoteNo;
                values.CreditNoteDate = CreditNoteDate;
                values.CreditNoteAmount = CreditNoteAmount;
                values.ClaimSummaryDate = ClaimSummaryDate;
                values.CreditNoteUpload = CreditNoteUpload;

                values.ClaimId = { label: `${id} ${PartyName} /${PartyTypeName} (${ClaimAmount})`, value: Claim };
                values.Type = { label: TypeName, value: Type };
                values.ClaimTrade = { label: ClaimTradeName, value: ClaimTrade };
                values.TypeOfClaim = TypeOfClaimName === null ? { label: "Select...", value: null } : { label: TypeOfClaimName, value: TypeOfClaim };
                values.ClaimCheckBy = { label: ClaimCheckByName, value: ClaimCheckBy };
                values.CreditNotestatus = { label: CreditNotestatusName, value: CreditNotestatus };
                values.PartyName = { label: PartyName, value: Party };

                setYearAndMonth({ Year: Year, Month: Month })

                setState({ values, fieldLabel, hasValid, required, isError })
                // dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }

            dispatch(editClaimTrackingEntryIDSuccess({ Status: false }))
        }
    }, [pageField,])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveClaimTrackingEntry_Success({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values 

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
                    history.push({ pathname: url.CLAIM_TRACKING_ENTRY_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveClaimTrackingEntry_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {

            setState(() => resetFunction(fileds, state)) // Clear form values 
            history.push({
                pathname: url.CLAIM_TRACKING_ENTRY_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateClaimTrackingEntryIDSuccess({ Status: false }));
            customAlert({
                Type: 3,
                Message: JSON.stringify(updateMsg.Message),
            })
        }
    }, [updateMsg, modalCss]);

    const saveHandeller = async (event) => {

        event.preventDefault();
        const btnId = event.target.id

        try {
            if (formValid(state, setState)) {

                _cfunc.btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({

                    "Date": values.Date,
                    "Month": !(yearAndMonth.Month) ? CurrentMonthAndYear().Month : yearAndMonth.Month,
                    "Year": !(yearAndMonth.Year) ? CurrentMonthAndYear().Year : yearAndMonth.Year,
                    "ClaimReceivedSource": values.ClaimReceivedSource,
                    "Type": values.Type.value,
                    "ClaimTrade": values.ClaimTrade.value,
                    "TypeOfClaim": values.TypeOfClaim === '' ? null : values.TypeOfClaim.value,
                    "ClaimAmount": values.ClaimAmount,
                    "Remark": values.Remark,
                    "ClaimCheckBy": values.ClaimCheckBy.value,
                    "CreditNotestatus": values.CreditNotestatus.value,
                    "CreditNoteNo": values.CreditNoteNo,
                    "CreditNoteDate": values.CreditNoteDate,
                    "CreditNoteAmount": values.CreditNoteAmount,
                    "ClaimSummaryDate": values.ClaimSummaryDate,
                    "CreditNoteUpload": null,
                    "Claim": values.ClaimId.claimId,
                    "Party": values.PartyName.value,
                    "FullClaimNo": values.ClaimText ? values.ClaimText : values.ClaimId.claimId,
                    "PartyType": values.ClaimId.PartyTypeID

                })

                if (pageMode === mode.edit) {
                    dispatch(updateClaimTrackingEntryID({ jsonBody, updateId: values.id, btnId }));
                }

                else {
                    dispatch(saveClaimTrackingEntry({ jsonBody, btnId }));
                }

            }
        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-2" >

                            {/* *******Claim Record Date***** &&& ******Claim For The Month********** */}
                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Date}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='Date'
                                                value={values.Date}
                                                onChange={Date_Onchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ClaimForTheMonth} </Label>
                                        <Col sm="7">
                                            {/* <Select
                                                name="ClaimForTheMonth"
                                                value={yearAndMonth}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={ClaimForTheMonthOtion}
                                                onChange={(hasSelect, evn) => {
                                                    ClaimForTheMonthOnchange(hasSelect, evn)
                                                }}
                                            />
                                            {isError.ClaimForTheMonth.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ClaimForTheMonth}</small></span>
                                            )} */}
                                            <Input className="form-control"
                                                type="month"
                                                defaultValue={yearAndMonth.Year === '' ? SelectedMonth() : yearAndMonth}
                                                // id="example-month-input"
                                                onChange={MonthAndYearOnchange}
                                                max={currentMonth}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            {/* *******Select Claim Id dropdown***** &&& ******Select Claim Id Inputbox********** */}
                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ClaimId} </Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="ClaimId "
                                                name="ClaimId"
                                                value={values.ClaimId}
                                                className="react-dropdown"
                                                isDisabled={!(values.ClaimText === '') && true}
                                                classNamePrefix="dropdown"
                                                options={ClaimIdOptions}
                                                onChange={(hasSelect, evn) => {
                                                    ClaimIdOnChange(hasSelect, evn)
                                                }}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                            />
                                            {isError.ClaimId.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ClaimId}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.ClaimText}</Label>
                                        <Col sm="7">
                                            <Input
                                                type="text"
                                                name="ClaimText"
                                                id="ClaimText"
                                                placeholder="Please Enter Full Claim No."
                                                disabled={values.ClaimId.value > 0 && true}
                                                value={values.ClaimText}
                                                onChange={(event) => { onChangeText({ event, state, setState }) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            {/* *******Party***** &&& ********* Claim Received Source********** */}
                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.PartyName} </Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="PartyName "
                                                name="PartyName"
                                                value={values.PartyName}
                                                isSearchable={true}
                                                isLoading={partyDropdownLoading}
                                                isDisabled={values.ClaimId.value > 0 && true}
                                                className="react-dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                classNamePrefix="dropdown"
                                                options={!(values.ClaimId.value > 0) ? partyListOptions : []}
                                                onChange={(hasSelect, evn) => {
                                                    partyOnChange(hasSelect, evn)
                                                }}
                                            />
                                            {isError.PartyName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.PartyName}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ClaimReceivedSource}</Label>
                                        <Col sm="7">
                                            <Input
                                                type="text"
                                                name="ClaimReceivedSource"
                                                id="ClaimReceivedSource"
                                                placeholder="Please Enter Claim Received Source"
                                                value={values.ClaimReceivedSource}
                                                onChange={(event) => { onChangeText({ event, state, setState }) }}
                                            />
                                            {isError.ClaimReceivedSource.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ClaimReceivedSource}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            {/* *******Type***** &&& ********* Claim Trade********** */}
                            < Row >
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Type} </Label>
                                        <Col sm="7">
                                            <Select
                                                name="Type"
                                                value={values.Type}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={typeOption}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }}
                                            />
                                            {isError.Type.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Type}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ClaimTrade} </Label>
                                        <Col sm="7">
                                            <Select
                                                name="ClaimTrade"
                                                value={values.ClaimTrade}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={ClaimTradeOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }}
                                            />
                                            {isError.ClaimTrade.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ClaimTrade}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.TypeOfClaim} </Label>
                                        <Col sm="7">
                                            <Select
                                                name="TypeOfClaim"
                                                value={values.TypeOfClaim}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={typeOfClaimOption}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }}
                                            />
                                            {isError.TypeOfClaim.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.TypeOfClaim}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.ClaimAmount}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="ClaimAmount"
                                                id="ClaimAmount"
                                                value={values.ClaimAmount}
                                                type="text"
                                                className={isError.ClaimAmount.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Claim Amount"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.ClaimAmount.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ClaimAmount}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            {/* ************** Remark **************  */}
                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.Remark}</Label>
                                        <Col sm="7">

                                            <Input
                                                type="text"
                                                name="Remark"
                                                id="Remark"
                                                placeholder="Please Enter Remark"
                                                autoComplete='off'
                                                value={values.Remark}
                                                onChange={(event) => { onChangeText({ event, state, setState }) }}
                                            />
                                            {isError.Remark.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Remark}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            {/* ******* Claim Check By ***** &&& *********Credit Note status ********** */}
                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ClaimCheckBy} </Label>
                                        <Col sm="7">
                                            <Select
                                                name="ClaimCheckBy"
                                                value={values.ClaimCheckBy}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={claimCheckByOption}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }}
                                            />
                                            {isError.ClaimCheckBy.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ClaimCheckBy}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.CreditNotestatus} </Label>
                                        <Col sm="7">
                                            <Select
                                                name="CreditNotestatus"
                                                value={values.CreditNotestatus}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={creditNoteStatusOption}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }}
                                            />
                                            {isError.CreditNotestatus.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.CreditNotestatus}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                            </Row>

                            {/* ******* Credit Note No ***** &&& ********* Credit Note Date ********** */}
                            <Row>

                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.CreditNoteNo}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="CreditNoteNo"
                                                id="CreditNoteNo"
                                                value={values.CreditNoteNo}
                                                type="text"
                                                className={isError.CreditNoteNo.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Credit Note No."
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            // style={{ width: "100%", height: "10px" }} // Adjust width and height as needed
                                            />
                                            {isError.CreditNoteNo.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.CreditNoteNo}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.CreditNoteDate}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='CreditNoteDate'
                                                value={values.CreditNoteDate}
                                                onChange={Date_Onchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                            </Row>

                            {/* ******* Credit Note Amount ***** &&& ********* Credit Note Upload Date ********** */}
                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.CreditNoteAmount}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="CreditNoteAmount"
                                                id="CreditNoteAmount"
                                                value={values.CreditNoteAmount}
                                                type="text"
                                                className={isError.CreditNoteAmount.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Credit Note Amount"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            // style={{ width: "100%", height: "10px" }} // Adjust width and height as needed
                                            />
                                            {isError.CreditNoteAmount.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.CreditNoteAmount}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ClaimSummaryDate}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='ClaimSummaryDate'
                                                value={values.ClaimSummaryDate}
                                                onChange={Date_Onchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                            </Row>
                        </div>

                        <FormGroup>
                            <Col>
                                <SaveButton pageMode={pageMode}
                                    loading={saveBtnloading}
                                    onClick={saveHandeller}
                                    userAcc={userPageAccessState}
                                    editCreatedBy={editCreatedBy}
                                />
                            </Col>
                        </FormGroup >

                    </form >
                </div >
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default ClaimTrackingEntry

