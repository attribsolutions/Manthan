
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
import { AlertState } from "../../../store/actions";
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
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    loginCompanyID,
    loginPartyID,
    loginUserID
} from "../../../components/Common/CommonFunction";
import Select from "react-select";
import Flatpickr from "react-flatpickr"
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import {
    updateBankIDSuccess
} from "../../../store/Accounting/BankRedux/action";
import { currentDate } from "../../../components/Common/CommonFunction"
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import CInput from "../../../CustomValidateForm/CInput";
import { decimalRegx } from "../../../CustomValidateForm/RegexPattern"
import { ReceiptGoButtonMaster, ReceiptGoButtonMaster_Success } from "../../../store/Accounting/Receipt/action";
import { Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import { postSelect_Field_for_dropdown } from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";
import { CredietDebitType, EditCreditlistSuccess, saveCredit, saveCredit_Success } from "../../../store/Accounting/CreditRedux/action";
import { InvoiceNumber } from "../../../store/Sales/SalesReturnRedux/action";


const Credit = (props) => {
    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        NoteDate: currentDate,
        Customer: "",
        NoteReason: "",
        servicesItem: "",
        Narration: "",
        GrandTotal: 0,
        InvoiceNO: ""

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(198);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        ReceiptGoButton,
        updateMsg,
        RetailerList,
        InvoiceNo,
        CreditDebitType,
        ReceiptModeList,
        userAccess } = useSelector((state) => ({
            postMsg: state.CredietDebitReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            CreditDebitType: state.CredietDebitReducer.CreditDebitType,
            ReceiptGoButton: state.ReceiptReducer.ReceiptGoButton,
            ReceiptModeList: state.PartyMasterBulkUpdateReducer.SelectField,
            InvoiceNo: state.SalesReturnReducer.InvoiceNo,
            updateMsg: state.BankReducer.updateMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.CREDIT//changes
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(ReceiptGoButtonMaster_Success([]))
    }, []);

debugger
    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    let { Data = [] } = ReceiptGoButton

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)//changes
    const hasShowModal = props.hasOwnProperty(mode.editValue)//changes



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



    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        debugger
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
                const { NoteDate, Customer, NoteReason, servicesItem, Narration, GrandTotal, } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                // hasValid.Name.valid = true;

                values.NoteDate = NoteDate;
                values.Customer = Customer;
                values.NoteReason = NoteReason;
                values.servicesItem = servicesItem;
                values.Narration = Narration;
                values.GrandTotal = GrandTotal;




                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(EditCreditlistSuccess({ Status: false }))
        }
    }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveCredit_Success({ Status: false }))
            setState(() => resetFunction(fileds, state)) //Clear form values 
            dispatch(Breadcrumb_inputName(''))

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
                    RedirectPath: url.CREDIT_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveCredit_Success({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    // useEffect(() => {
    //     if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
    //         setState(() => resetFunction(fileds, state)) // Clear form values 
    //         history.push({
    //             pathname: url.BANK_LIST,
    //         })
    //     } else if (updateMsg.Status === true && !modalCss) {
    //         dispatch(updateBankIDSuccess({ Status: false }));
    //         dispatch(
    //             AlertState({
    //                 Type: 3,
    //                 Status: true,
    //                 Message: JSON.stringify(updateMsg.Message),
    //             })
    //         );
    //     }
    // }, [updateMsg, modalCss]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])






    // Retailer DropDown List Type 1 for credit list drop down
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: loginPartyID(),
            CompanyID: loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);



    // Note Reason Type id 6 Required
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 6
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);



    //   Note Type Api for Type identify
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 5
        });
        dispatch(CredietDebitType(jsonBody));
    }, [])


    const PartyOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const ReceiptModeOptions = ReceiptModeList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const InvoiceNo_Options = InvoiceNo.map((index) => ({
        value: index.Invoice,
        label: index.FullInvoiceNumber,
    }));

    function DateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.DebitDate = date;
            a.hasValid.DebitDate.valid = true
            return a
        })
    }
    function CustomerOnChange(e) { // Customer dropdown function

        setState((i) => {
            i.values.GrandTotal = 0
            i.hasValid.GrandTotal.valid = true;
            return i
        })

        const jsonBody = JSON.stringify({
            PartyID: loginPartyID(),
            CustomerID: e.value,
            InvoiceID: ""
        });
        const body = { jsonBody, pageMode }
        dispatch(ReceiptGoButtonMaster(body));

        const jsonBody1 = JSON.stringify({
            PartyID: loginPartyID(),
            CustomerID: e.value
        });

        dispatch(InvoiceNumber(jsonBody1));
    }

    function CalculateOnchange(event, row, key) {  // Calculate Input box onChange Function


        let input = event.target.value
        let v1 = Number(row.BalanceAmount);
        let v2 = Number(input)
        if (!(v1 >= v2)) {
            event.target.value = v1;
        }
        row.Calculate = event.target.value
        let calSum = 0
        Data.forEach(element => {
            calSum = calSum + Number(element.Calculate)
        });
        setState((i) => {
            let a = { ...i }
            a.values.GrandTotal = calSum
            a.hasValid.GrandTotal.valid = true;
            return a
        })
    };



    function AmountPaid_onChange(event) {
        let input = event.target.value
        // let result = /^\d*(\.\d{0,2})?$/.test(input);
        let sum = 0
        Data.forEach(element => {
            sum = sum + Number(element.BalanceAmount)
        });

        let v1 = Number(sum);
        let v2 = Number(input)
        if (!(v1 >= v2)) {
            event.target.value = v1;
        }
        onChangeText({ event, state, setState })
        AmountPaidDistribution(event.target.value)

    }

    function AmountPaidDistribution(val1) {
        let value = Number(val1)
        let Amount = value
        Data.map((index) => {
            let amt = Number(index.BalanceAmount)
            if ((Amount > amt) && !(amt === 0)) {
                Amount = Amount - amt
                index.Calculate = amt.toFixed(2)
            }
            else if ((Amount <= amt) && (Amount > 0)) {
                index.Calculate = Amount.toFixed(2)
                Amount = 0
            }
            else {
                index.Calculate = 0;
            }
            try {
                document.getElementById(`Quantity${index.FullInvoiceNumber}`).value = index.Calculate
            } catch (e) { }
        })
    }

    const pagesListColumns = [
        {
            text: "InvoiceDate",
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
                    <CInput
                        key={`Quantity${row.FullInvoiceNumber}${key}`}
                        id={`Quantity${row.FullInvoiceNumber}`}
                        pattern={decimalRegx}
                        defaultValue={row.Calculate}
                        // disabled={page_Mode === mode.modeSTPsave ? true : false}
                        // value={row.Calculate}
                        // type="text"
                        autoComplete="off"
                        className="col col-sm text-center"
                        onChange={(e) => CalculateOnchange(e, row, key)}

                    />
                </span>)
            },
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            },
        },
    ];



    const CreditDebitTypeId = CreditDebitType.find((index) => {
        return index.Name === "Credit"
    })

    const saveHandeller = async (event) => {

        event.preventDefault();
        const btnId = event.target.id;


        if ((values.Amount === 0) || (values.Amount === "NaN")) {
            CustomAlert({
                Type: 3,
                Message: `Amount Paid value can not be ${values.Amount}`,
            })
            return btnIsDissablefunc({ btnId, state: false })
        }

        const ReceiptInvoices1 = Data.map((index) => ({
            Invoice: index.Invoice,
            GrandTotal: index.GrandTotal,
            PaidAmount: index.Calculate,
        }))

        const FilterReceiptInvoices = ReceiptInvoices1.filter((index) => {
            return index.PaidAmount > 0
        })

        try {

            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })
                const jsonBody = JSON.stringify({
                    NoteDate: values.NoteDate,
                    Customer: values.Customer.value,
                    NoteType: CreditDebitTypeId.id,
                    GrandTotal: values.GrandTotal,
                    Narration: values.Narration,
                    NoteReason: values.NoteReason.value,
                    CRDRNoteItems: [],
                    Party: loginPartyID(),
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    CRDRInvoices: FilterReceiptInvoices,

                })

                if (pageMode === mode.edit) {
                    // dispatch(updateCategoryID({ jsonBody, updateId: values.id, btnId }));
                }
                else {

                    dispatch(saveCredit({ jsonBody, btnId }));
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
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.NoteDate}</Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name='CreditDate'
                                                value={values.NoteDate}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="Select..."
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                }}
                                                onChange={DateOnchange}
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
                                                placeholder="Please Enter Comment"
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
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Customer} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="Customer"
                                                name="Customer"
                                                value={values.Customer}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={PartyOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                    CustomerOnChange(hasSelect)
                                                }}
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
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.NoteReason}</Label>
                                        <Col sm="7">
                                            <Select
                                                id="NoteReason "
                                                name="NoteReason"
                                                value={values.NoteReason}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ReceiptModeOptions}
                                                onChange={(hasSelect, evn) => { onChangeSelect({ hasSelect, evn, state, setState, }) }}
                                            />
                                            {isError.NoteReason.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.NoteReason}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.GrandTotal}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="GrandTotal"
                                                id="GrandTotal"
                                                value={values.GrandTotal}
                                                type="text"
                                                className={isError.GrandTotal.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Amount"
                                                autoComplete='off'
                                                autoFocus={true}
                                                // onChange={(event) => { onChangeText({ event, state, setState }) }}
                                                onChange={AmountPaid_onChange}
                                            />
                                            {isError.GrandTotal.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.GrandTotal}</small></span>

                                            )}
                                        </Col>


                                    </FormGroup>
                                </Col >
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.InvoiceNO}</Label>
                                        <Col sm="7">
                                            <Select
                                                id="InvoiceNO "
                                                name="InvoiceNO"
                                                value={values.InvoiceNO}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={InvoiceNo_Options}
                                                onChange={(hasSelect, evn) => { onChangeSelect({ hasSelect, evn, state, setState, }) }}
                                            />
                                            {isError.InvoiceNO.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.InvoiceNO}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>
                        </div>
                        <ToolkitProvider

                            keyField="id"
                            data={Data}
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

                                        />

                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>

                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider>

                        {Data.length > 0 ?
                            <FormGroup>
                                <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                    <SaveButton pageMode={pageMode}
                                        onClick={saveHandeller}
                                        userAcc={userPageAccessState}
                                        editCreatedBy={editCreatedBy}
                                        module={"Receipts"}
                                    />

                                </Col>
                            </FormGroup >
                            : null
                        }

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

export default Credit








