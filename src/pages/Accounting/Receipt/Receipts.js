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
import { breadcrumbReturnFunc, btnIsDissablefunc, currentDate, loginCompanyID, loginPartyID, } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { getPartyTableListSuccess, saveManagementParties, saveManagementParties_Success } from "../../../store/Administrator/ManagementPartiesRedux/action";
import { Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import { ReceiptGoButtonMaster } from "../../../store/Accounting/Receipt/action";
import { postSelect_Field_for_dropdown } from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";

const Receipts = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const [array, setArray] = useState([]);
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [orderlistFilter, setorderlistFilter] = useState({ Date: currentDate });
    const fileds = {
        Date: "",
        OpeningBalance: "",
        CustomerName: "",
        ReceiptMode: "",
        AmountPaid: "",
        Description: "",
        BankName: "",
        ChequeNo: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        ReceiptGoButton,
        pageField,
        RetailerList,
        ReceiptModeList,
        userAccess } = useSelector((state) => ({
            postMsg: state.ManagementPartiesReducer.postMsg,
            ReceiptGoButton: state.ReceiptReducer.ReceiptGoButton,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            ReceiptModeList: state.PartyMasterBulkUpdateReducer.SelectField,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));
    const { Date } = orderlistFilter;

    useEffect(() => {
        const page_Id = pageId.RECEIPTS
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 4,
            PartyID: loginPartyID(),
            CompanyID: loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 3
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);


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
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveManagementParties_Success({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values 
            dispatch(Breadcrumb_inputName(''))
            dispatch(getPartyTableListSuccess([]))
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
                    RedirectPath: url.MANAGEMENT_PARTIES,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveManagementParties_Success({ Status: false }))
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
    const pagesListColumns = [
        {
            text: "Receipt Date",
            dataField: "InvoiceDate",
        },
        {
            text: "Bill No",
            dataField: "FullInvoiceNumber",
        },
        {
            text: "Bill Amount",
            dataField: "GrandTotal",
        },
        {
            text: "Paid",
            dataField: "PaidAmount",
        },
        {
            text: "Bal Amt",
            dataField: "BalanceAmount",
        },
        {
            text: "Calculate",
            dataField: "",
            formatter: (cellContent, row, key) => {
                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <Input
                        id=""
                        key={row.id}
                        // defaultChecked={row.Check}
                        type="text"
                        className="col col-sm text-center"
                    // onChange={e => { SelectAll(e.target.checked, row, key) }}
                    />
                </span>)
            },
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            },
        },

    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: ReceiptGoButton.length,
        custom: true,
    };

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        const CheckArray = array.filter((index) => {
            return (index.Check === true)
        })

        const PartiesJson = CheckArray.map((index) => ({
            Employee: values.Employee.value,
            Party: index.id,
        }))

        const trueValues = array.map((index) => {
            return (index.Check === true)
        })

        const totalTrueValues = trueValues.reduce((count, value) => {
            if (value === true) {
                count++
            }
            return count
        }, 0)

        if ((totalTrueValues === 0)) {
            dispatch(
                AlertState({
                    Type: 4,
                    Status: true,
                    Message: "At least One Party is Selected",
                })
            );
            return;
        }
        const jsonBody = JSON.stringify(PartiesJson)
        // console.log(jsonBody)
        dispatch(saveManagementParties({ jsonBody, btnId }));
    };

    function onChangeAmountHandler(event) {

        let BalanceAmount = ReceiptGoButton.map((index) => {
            return parseInt(index.BalanceAmount)
        })
        const sum = BalanceAmount.reduce((partialSum, a) => partialSum + a, 0);

        let value1 = Math.max('', Math.min(sum, parseInt(event.target.value)));

        event.target.value = value1
        if (event.target.value === "NaN") {
            value1 = 0
        }
        setState((i) => {
            i.values.AmountPaid = value1
            i.hasValid.AmountPaid.valid = true;
            return i
        })
        debugger
        values.AmountPaid = ReceiptGoButton.map((index) => {
            debugger
            let amt = Number(index.BalanceAmount)
            if ((values.AmountPaid > amt) && !(amt === 0)) {
                let Amount = values.AmountPaid - amt
                index.BalanceAmount = Amount.toFixed(3)
            }
        })
    }

    function CustomerOnChange(e) {
        const jsonBody = JSON.stringify({
            Party: loginPartyID(),
            Customer: e.value
        });
        dispatch(ReceiptGoButtonMaster(jsonBody));
    }

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
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Date}  </Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name="Date"
                                                value={Date}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="YYYY-MM-DD"
                                                autoComplete="0,''"
                                                // disabled={pageMode === mode.edit ? true : false}
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                    // defaultDate: (pageMode === mode.edit) ? values.Date : "today"
                                                }}
                                                onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                onReady={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                            />
                                            {isError.Date.length > 0 && (
                                                <span className="invalid-feedback">{isError.Date}</span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.CustomerName} </Label>
                                        <Col sm="7">
                                            <Select
                                                name="CustomerName"
                                                value={values.CustomerName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={customerOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                    CustomerOnChange(hasSelect)
                                                }
                                                }
                                            />
                                            {isError.CustomerName.length > 0 && (
                                                <span className="invalid-feedback">{isError.CustomerName}</span>
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
                                                value={values.OpeningBalance}
                                                type="text"
                                                className={isError.OpeningBalance.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Opening Balance"
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
                                                name="ReceiptMode"
                                                value={values.ReceiptMode}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ReceiptModeOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }}
                                            />
                                            {isError.ReceiptMode.length > 0 && (
                                                <span className="invalid-feedback">{isError.ReceiptMode}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>
                            {(values.ReceiptMode.label === "Cheque") && <Row>
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
                                                // options={RouteName_Options}
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
                            </Row>}


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
                                                    onChangeAmountHandler(event)
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

                        </PaginationProvider>
                    </form >
                </div >
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default Receipts

