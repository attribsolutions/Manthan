import React, { useEffect, useState, } from "react";
import {
    Button,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import Flatpickr from "react-flatpickr"
import { MetaTags } from "react-meta-tags";
import { AlertState, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,
    resetFunction,
} from "../../../components/Common/validationFunction";
import { Change_Button, SaveButton } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, btnIsDissablefunc, currentDate, loginCompanyID, loginPartyID, loginUserID, } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { getPartyTableListSuccess, saveManagementParties, saveManagementParties_Success } from "../../../store/Administrator/ManagementPartiesRedux/action";
import { getSupplier, Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import { DepositorBankFilter, ReceiptGoButtonMaster, ReceiptGoButtonMaster_Success, ReceiptTypeAPI, saveReceiptMaster, saveReceiptMaster_Success } from "../../../store/Accounting/Receipt/action";
import { postSelect_Field_for_dropdown } from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { postBanklist } from "../../../store/Account/BankRedux/action";

const PaymentEntry = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    const fileds = {
        ReceiptDate: currentDate,
        OpeningBalance: "",
        Customer: "",
        ReceiptMode: "",
        AmountPaid: "",
        Description: "",
        BankName: "",
        ChequeNo: "",
        DepositorBankName: "",
        ChequeDate: currentDate,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        ReceiptGoButton,
        pageField,
        RetailerList,
        BankList,
        ReceiptModeList,
        ReceiptType,
        DepositorBank,
        userAccess } = useSelector((state) => ({
            postMsg: state.ReceiptReducer.postMsg,
            ReceiptGoButton: state.ReceiptReducer.ReceiptGoButton,
            RetailerList: state.CommonAPI_Reducer.supplier,
            ReceiptModeList: state.PartyMasterBulkUpdateReducer.SelectField,
            BankList: state.BankReducer.BankList,
            DepositorBank: state.ReceiptReducer.DepositorBank,
            ReceiptType: state.ReceiptReducer.ReceiptType,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.PAYMENT_ENTRY
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(postBanklist())
        dispatch(DepositorBankFilter())
        dispatch(getSupplier())
    }, []);

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 4
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

    // Receipt Type API Values **** only Post Json Body
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 3
        });
        dispatch(ReceiptTypeAPI(jsonBody));
    }, []);

    const ReceiptTypeID = ReceiptType.filter((index) => {
        return index.Name === "Payment Entry"
    })

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

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
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        debugger
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveReceiptMaster_Success({ Status: false }))
            dispatch(ReceiptGoButtonMaster_Success([]))
            setState(() => resetFunction(fileds, state))// Clear form values 
            // dispatch(Breadcrumb_inputName(''))
            if (pageMode === "other") {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: url.PAYMENT_ENTRY_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveReceiptMaster_Success({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const ReceiptModeOptions = ReceiptModeList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const BankListOptions = BankList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const DepositorBankOptions = DepositorBank.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    function ReceiptDate_Onchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ReceiptDate = date;
            a.hasValid.ReceiptDate.valid = true
            return a
        })
    }

    function ChequeDate_Onchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ChequeDate = date;
            a.hasValid.ChequeDate.valid = true
            return a
        })
    }
    // function onChangeAmountHandler(event) {
    //     debugger
    //     let BalanceAmount = ReceiptGoButton.map((index) => {
    //         return parseInt(index.BalanceAmount)
    //     })
    //     const sum = BalanceAmount.reduce((partialSum, a) => partialSum + a, 0);

    //     let value1 = Math.max('', Math.min(sum, parseInt(event.target.value)));

    //     event.target.value = value1
    //     if (event.target.value === "NaN") {
    //         value1 = 0
    //     }
    //     setState((i) => {
    //         i.values.AmountPaid = value1
    //         i.hasValid.AmountPaid.valid = true;
    //         return i
    //     })
    //     let value = Number(event.target.value)
    //     ReceiptGoButton.map((index) => {
    //         debugger
    //         let amt = Number(index.BalanceAmount)
    //         if ((value > amt) && !(amt === 0)) {
    //             debugger
    //             let Amount = value - amt
    //             index.Calculate = amt.toFixed(3)
    //         }
    //         else if ((value <= amt) && (value > 0)) {
    //             index.Calculate = value.toFixed(3)
    //             value = 0
    //         }
    //         else {
    //             index.Calculate = 0;
    //         }
    //         try {
    //             document.getElementById(`batchQty${index.FullInvoiceNumber}`).value = index.Calculate
    //         } catch (e) { }

    //     })
    // }

    function CustomerOnChange(e) {
        const jsonBody = JSON.stringify({
            Party: loginPartyID(),
            Customer: e.value
        });
        dispatch(ReceiptGoButtonMaster(jsonBody));
    }

    const saveHandeller = async (event) => {
        debugger
        event.preventDefault();
        const btnId = event.target.id
        if (values.ReceiptMode.label === "Cheque") {
            const invalidMsg1 = []

            if (values.BankName === "") {
                invalidMsg1.push(`BankName Is Required`)
            }
            if (values.DepositorBankName === "") {
                invalidMsg1.push(`DepositorBankName Is Required`)
            };
            if (values.ChequeNo === "") {
                invalidMsg1.push(`ChequeNo Is Required`)
            };
            // if (values.ChequeDate === "") {
            //     invalidMsg1.push(`ChequeDate Is Required`)
            // };

            if ((values.BankName === "")
                || (values.DepositorBankName === "")
                || (values.ChequeNo === "")
            ) {

                dispatch(
                    AlertState({
                        Type: 4,
                        Status: true,
                        Message: JSON.stringify(invalidMsg1),
                    })
                );
                return;
            }
        }

        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })
                debugger
                const jsonBody = JSON.stringify({
                    "ReceiptDate": values.ReceiptDate,
                    "Description": values.Description,
                    "AmountPaid": values.AmountPaid,
                    "BalanceAmount": "",
                    "OpeningBalanceAdjusted": "",
                    "DocumentNo": values.ChequeNo,
                    "AdvancedAmountAjusted": "",
                    "Bank": values.BankName.value,
                    "Customer": values.Customer.value,
                    "ChequeDate": values.ChequeDate,
                    "DepositorBank": values.DepositorBankName.value,
                    "Party": loginPartyID(),
                    "ReceiptMode": values.ReceiptMode.value,
                    "ReceiptType": ReceiptTypeID[0].id,
                    "CreatedBy": loginUserID(),
                    "UpdatedBy": loginUserID(),
                    "ReceiptInvoices": []
                })

                if (pageMode === mode.edit) {
                    // dispatch(updateCategoryID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveReceiptMaster({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-2" >

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReceiptDate}  </Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name='ReceiptDate'
                                                value={values.ReceiptDate}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="Select..."
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                }}
                                                onChange={ReceiptDate_Onchange}
                                            />
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Customer} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="Customer "
                                                name="Customer"
                                                value={values.Customer}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={customerOptions}
                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                            />
                                            {isError.Customer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.OpeningBalance}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="OpeningBalance"
                                                id="txtName"
                                                disabled={true}
                                                value={values.OpeningBalance}
                                                type="text"
                                                className={isError.OpeningBalance.length > 0 ? "is-invalid form-control" : "form-control"}
                                                // placeholder="Please Enter Opening Balance"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.OpeningBalance.length > 0 && (
                                                <span className="invalid-feedback">{isError.OpeningBalance}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReceiptMode} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="ReceiptMode "
                                                name="ReceiptMode"
                                                value={values.ReceiptMode}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ReceiptModeOptions}
                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                            />
                                            {isError.ReceiptMode.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ReceiptMode}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            {(values.ReceiptMode.label === "Cheque") || (values.ReceiptMode.label === "RTGS") ?
                                < Row >
                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.BankName} </Label>
                                            <Col sm="7">
                                                <Select
                                                    name="BankName"
                                                    value={values.BankName}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={BankListOptions}
                                                    onChange={(hasSelect, evn) => {
                                                        onChangeSelect({ hasSelect, evn, state, setState });
                                                    }}
                                                />
                                                {isError.BankName.length > 0 && (
                                                    <span className="invalid-feedback">{isError.BankName}</span>
                                                )}
                                            </Col>

                                        </FormGroup>
                                    </Col >

                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.DepositorBankName} </Label>
                                            <Col sm="7">
                                                <Select
                                                    name="DepositorBankName"
                                                    value={values.DepositorBankName}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={DepositorBankOptions}
                                                    onChange={(hasSelect, evn) => {
                                                        onChangeSelect({ hasSelect, evn, state, setState });
                                                    }}
                                                />
                                                {isError.DepositorBankName.length > 0 && (
                                                    <span className="invalid-feedback">{isError.DepositorBankName}</span>
                                                )}
                                            </Col>

                                        </FormGroup>
                                    </Col >


                                </Row>
                                : null}

                            {(values.ReceiptMode.label === "Cheque") &&
                                <Row>

                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.ChequeNo}</Label>
                                            <Col sm="7">
                                                <Input
                                                    name="ChequeNo"
                                                    id="txtName"
                                                    value={values.ChequeNo}
                                                    type="text"
                                                    className={isError.ChequeNo.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    placeholder="Please Enter Cheque Number"
                                                    autoComplete='off'
                                                    autoFocus={true}
                                                    onChange={(event) => {
                                                        onChangeText({ event, state, setState })
                                                        // dispatch(Breadcrumb_inputName(event.target.value))
                                                    }}
                                                />
                                                {isError.ChequeNo.length > 0 && (
                                                    <span className="invalid-feedback">{isError.ChequeNo}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >

                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.ChequeDate}</Label>
                                            <Col sm="7">
                                                <Flatpickr
                                                    name='ChequeDate'
                                                    value={values.ChequeDate}
                                                    className="form-control d-block p-2 bg-white text-dark"
                                                    placeholder="Select..."
                                                    options={{
                                                        altInput: true,
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    onChange={ChequeDate_Onchange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >
                                </Row>
                            }

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.AmountPaid}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="AmountPaid"
                                                id="txtName"
                                                value={values.AmountPaid}
                                                type="text"
                                                className={isError.AmountPaid.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Amount"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                    // onChangeAmountHandler(event)
                                                }}
                                            />
                                            {isError.AmountPaid.length > 0 && (
                                                <span className="invalid-feedback">{isError.AmountPaid}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.Description}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="Description"
                                                id="txtName"
                                                value={values.Description}
                                                type="text"
                                                className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Amount"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Description.length > 0 && (
                                                <span className="invalid-feedback">{isError.Description}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                        </div>
                        {/* 
                        <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                        >
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider

                                    keyField="id"
                                    data={ReceiptGoButton}
                                    columns={pagesListColumns}

                                    search
                                >
                                    {toolkitProps => (
                                        <React.Fragment>
                                            <div className="table">
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    bordered={true}
                                                    striped={false}
                                                    noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                                    classes={"table align-middle table-nowrap table-hover"}
                                                    headerWrapperClasses={"thead-light"}

                                                    {...toolkitProps.baseProps}
                                                    {...paginationTableProps}
                                                />
                                                {countlabelFunc(toolkitProps, paginationProps, dispatch, "MRP")}
                                                {mySearchProps(toolkitProps.searchProps)}
                                            </div>

                                            <Row className="align-items-md-center mt-30">
                                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                    <PaginationListStandalone
                                                        {...paginationProps}
                                                    />
                                                </Col>
                                            </Row>
                                        </React.Fragment>
                                    )
                                    }
                                </ToolkitProvider>
                            )
                            }

                        </PaginationProvider> */}


                        <FormGroup>
                            <Col>
                                <SaveButton pageMode={pageMode}
                                    onClick={saveHandeller}
                                    userAcc={userPageAccessState}
                                    editCreatedBy={editCreatedBy}
                                    module={"PaymentEntry"}
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

export default PaymentEntry

