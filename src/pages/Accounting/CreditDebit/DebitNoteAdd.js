import React, { useEffect, useState, } from "react";
import {
    Col,
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
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import Select from "react-select";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import {
    editBankIDSuccess,
} from "../../../store/Accounting/BankRedux/action";
import { Retailer_List, Retailer_List_Success } from "../../../store/CommonAPI/SupplierRedux/actions";
import { postSelect_Field_for_dropdown } from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { CredietDebitType, Receipt_No_List, Receipt_No_List_Success, saveCredit, saveCredit_Success } from "../../../store/Accounting/CreditRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { C_DatePicker } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction"

function initialState(history) {

    let page_Id = '';
    let listPath = ''
    let sub_Mode = history.location.pathname;
    if (sub_Mode === url.DEBIT_NOTE) {
        page_Id = pageId.DEBIT_NOTE;
        listPath = url.DEBIT_LIST
    }

    return { page_Id, listPath }
};

const Debit = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        CRDRNoteDate: currentDate_ymd,
        Customer: "",
        Comment: "",
        GrandTotal: "",
        ServiceItems: "",
        Narration: "",
        ReceiptNO: "",
        ReceiptDate: ""
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [page_id] = useState(() => initialState(history).page_Id)
    const [listPath] = useState(() => initialState(history).listPath)
    const [subPageMode] = useState(history.location.pathname)
    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        RetailerList,
        ReceiptModeList,
        CreditDebitType,
        ReceiptNumber,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.CredietDebitReducer.saveBtnloading,
            postMsg: state.CredietDebitReducer.postMsg,
            ReceiptNumber: state.CredietDebitReducer.ReceiptNumber,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            CreditDebitType: state.CredietDebitReducer.CreditDebitType,
            userAccess: state.Login.RoleAccessUpdateData,
            ReceiptModeList: state.PartyMasterBulkUpdateReducer.SelectField,
            pageField: state.CommonPageFieldReducer.pageField,
        }));

    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    // Common Party Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            partySelectButtonHandler();
        } else {
            partySelectOnChangeHandler();
        };
    }, [commonPartyDropSelect]);

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_id))
        return () => {
            dispatch(commonPageFieldSuccess(null));
        }
    }, []);


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

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
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
                const { id, Name } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;

                values.id = id
                values.Name = Name;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editBankIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveCredit_Success({ Status: false }))
            setState(() => resetFunction(fileds, state)) //Clear form values 
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === "other") {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                const promise = await customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (promise) {
                    history.push({
                        pathname: listPath,
                    })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveCredit_Success({ Status: false }))
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

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 4,
            PartyID: commonPartyDropSelect.value,
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 7
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 5
        });
        dispatch(CredietDebitType(jsonBody));
    }, [])

    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const ReceiptModeOptions = ReceiptModeList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const ReceiptNo_Options = ReceiptNumber.map((index) => ({
        value: index.Receipt,
        label: `${index.FullReceiptNumber} -${index.AmountPaid} -${_cfunc.date_dmy_func(index.ReceiptDate)}`,
        Amount: index.AmountPaid,
        ReceiptDate: _cfunc.date_dmy_func(index.ReceiptDate)
    }));

    function CRDRNoteDateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.CRDRNoteDate = date;
            a.hasValid.CRDRNoteDate.valid = true
            return a
        })
    };

    function PartyOnChangeHandler(hasSelect, evn) {
        setState((i) => {
            let a = { ...i }
            a.values.ReceiptNO = "";
            a.values.GrandTotal = "";
            a.values.ReceiptDate = "";
            a.hasValid.ReceiptNO.valid = true;
            a.hasValid.GrandTotal.valid = true;
            a.hasValid.ReceiptDate.valid = true;
        })
        onChangeSelect({ hasSelect, evn, state, setState, })
        dispatch(Receipt_No_List_Success([]))

        const jsonBody = JSON.stringify({
            PartyID: commonPartyDropSelect.value,
            CustomerID: hasSelect.value
        });
        dispatch(Receipt_No_List(jsonBody));
    }

    function ReceiptNumberHandler(hasSelect, evn) {

        setState((i) => {

            let a = { ...i }
            a.values.GrandTotal = hasSelect.Amount;
            a.values.ReceiptDate = hasSelect.ReceiptDate;
            a.hasValid.GrandTotal.valid = true;
            a.hasValid.ReceiptDate.valid = true;
            a.isError.GrandTotal = ""
        })
        onChangeSelect({ hasSelect, evn, state, setState, })
    }

    function partySelectButtonHandler() {
        const jsonBody = JSON.stringify({
            Type: 4,
            PartyID: commonPartyDropSelect.value,
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    };

    function partySelectOnChangeHandler() {
        dispatch(Retailer_List_Success([]));
        dispatch(Receipt_No_List_Success([]))
        setState(() => resetFunction(fileds, state)) //Clear form values 
    };

    const saveHandeller = async (event) => {

        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {

                function noteType_BySubPageMode() {

                    if (subPageMode === url.CREDIT_NOTE) {
                        return CreditDebitType.find((index) => index.Name === "CreditNote")?.id
                    }
                    else if (subPageMode === url.DEBIT_NOTE) {
                        return CreditDebitType.find((index) => index.Name === "DebitNote")?.id;
                    }
                }

                const jsonBody = JSON.stringify({
                    CRDRNoteDate: values.CRDRNoteDate,
                    Customer: values.Customer.value,
                    NoteType: noteType_BySubPageMode(),
                    GrandTotal: values.GrandTotal,
                    Narration: values.Narration,
                    Comment: values.Comment,
                    ReceiptNO: values.ReceiptNO.value,
                    ReceiptDate: values.ReceiptDate,
                    CRDRNoteItems: [],
                    CRDRInvoices: [],
                    Party: commonPartyDropSelect.value,
                    CreatedBy: _cfunc.loginUserID(),
                    UpdatedBy: _cfunc.loginUserID(),
                });

                if (pageMode === mode.edit) {
                    // dispatch(updateBankID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveCredit({ jsonBody, btnId }));
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

                <div className="page-content" style={{ marginTop: IsEditMode_Css, }}>
                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-2" >
                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.CRDRNoteDate}</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='CRDRNoteDate'
                                                value={values.CRDRNoteDate}
                                                onChange={CRDRNoteDateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Narration}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="Narration"
                                                id="Narration"
                                                value={values.Narration}
                                                type="text"
                                                className={isError.Narration.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Narration"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Narration.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Narration}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Customer}</Label>
                                        <Col sm="7">
                                            <Select
                                                id="Customer "
                                                name="Customer"
                                                value={values.Customer}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={customerOptions}
                                                onChange={(hasSelect, evn) => {
                                                    PartyOnChangeHandler(hasSelect, evn)
                                                }}
                                            />
                                            {isError.Customer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Comment}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="Comment"
                                                id="Comment"
                                                value={values.Comment}
                                                type="text"
                                                className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Comment"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Comment.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Comment}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ServiceItems}</Label>
                                        <Col sm="7">
                                            <Select
                                                id="ServiceItems "
                                                name="ServiceItems"
                                                value={values.ServiceItems}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ReceiptModeOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                }}
                                            />
                                            {isError.ServiceItems.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ServiceItems}</small></span>
                                            )}
                                        </Col>


                                    </FormGroup>
                                </Col >
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.GrandTotal}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="GrandTotal"
                                                id="GrandTotal"
                                                value={values.GrandTotal}
                                                disabled={(values.ReceiptNO) ? true : false}
                                                type="text"
                                                className={isError.GrandTotal.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Amount"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.GrandTotal.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.GrandTotal}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                            </Row>

                            {values.ServiceItems.label === "Cheque Bounce" ? <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReceiptNO}</Label>
                                        <Col sm="7">

                                            <Select
                                                id=" ReceiptNO"
                                                name="ReceiptNO"
                                                value={values.ReceiptNO}
                                                disabled={true}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ReceiptNo_Options}
                                                onChange={(hasSelect, evn) => {
                                                    ReceiptNumberHandler(hasSelect, evn)
                                                }}
                                            />
                                            {isError.ReceiptNO.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ReceiptNO}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReceiptDate}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="ReceiptDate"
                                                id="ReceiptDate"
                                                value={values.ReceiptDate}
                                                disabled={true}
                                                type="text"
                                            // className={isError.ReceiptDate.length > 0 ? "is-invalid form-control" : "form-control"}
                                            // placeholder="Please Enter ReceiptDate"
                                            // autoComplete='off'
                                            // autoFocus={true}
                                            // onChange={(event) => {
                                            //     onChangeText({ event, state, setState })
                                            // }}
                                            />
                                            {/* {isError.ReceiptDate.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ReceiptDate}</small></span>
                                            )} */}
                                        </Col>

                                    </FormGroup>
                                </Col >

                            </Row> : null}

                        </div>
                        <FormGroup>
                            <Col sm={2} style={{ marginLeft: "3px" }} >
                                <SaveButton pageMode={pageMode}
                                    loading={saveBtnloading}
                                    onClick={saveHandeller}
                                    userAcc={userPageAccessState}
                                    editCreatedBy={editCreatedBy}
                                    module={"Receipts"}
                                />

                            </Col>
                        </FormGroup >

                    </form >
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

export default Debit

