// import React, { useEffect, useState } from "react";
// import {
//     Col,
//     FormGroup,
//     Input,
//     Label,
//     Row,
// } from "reactstrap";
// import { MetaTags } from "react-meta-tags";
// import Flatpickr from "react-flatpickr";
// import {
//     BreadcrumbShowCountlabel,
//     commonPageFieldSuccess,
// } from "../../../store/actions";
// import { useDispatch, useSelector } from "react-redux";
// import { commonPageField } from "../../../store/actions";
// import { useHistory } from "react-router-dom";
// import {
//     initialFiledFunc,
// } from "../../../components/Common/validationFunction";

// import {
//     SaveButton,
// } from "../../../components/Common/CommonButton";
// import {
//     breadcrumbReturnFunc,
//     currentDate,
//     groupBy,
// } from "../../../components/Common/CommonFunction";

// import * as mode from "../../../routes/PageMode";
// import * as pageId from "../../../routes/allPageID";
// import * as url from "../../../routes/route_url";
// import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";
// import "./bulk.scss";
// import demoData from "./bulkRecipt";
// import CustomTable2 from "../../../CustomTable2/Table";
// import { bulkSearch } from "../../Sale/Invoice/invoiceCaculations";

// const BulkRecipt = (props) => {

//     const dispatch = useDispatch();
//     const history = useHistory();
//     const subPageMode = history.location.pathname;

//     const saveBtnid = `saveBtn${subPageMode}`;

//     const location = { ...history.location };
//     const hasShowloction = location.hasOwnProperty("editValue");
//     const hasShowModal = props.hasOwnProperty("editValue");

//     const fileds = {
//         // id: "",
//         InvoiceDate: currentDate,
//         Customer: "",
//     };

//     const [state, setState] = useState(() => initialFiledFunc(fileds));

//     const [modalCss, setModalCss] = useState(false);
//     const [pageMode, setPageMode] = useState(mode.defaultsave);
//     const [userPageAccessState, setUserAccState] = useState("");

//     const {
//         pageField,
//         userAccess,
//     } = useSelector((state) => ({
//         userAccess: state.Login.RoleAccessUpdateData,
//         pageField: state.CommonPageFieldReducer.pageField,
//     }));
//     useEffect(() => {
//         dispatch(commonPageFieldSuccess(null));
//         dispatch(commonPageField(pageId.BULK_RECIPT));
//     }, []);



//     // userAccess useEffect
//     useEffect(() => {
//         let userAcc = null;
//         let locationPath = location.pathname;

//         if (hasShowModal) {
//             locationPath = props.masterPath;
//         }
//         userAcc = userAccess.find((inx) => {
//             return `/${inx.ActualPagePath}` === locationPath;
//         });

//         if (userAcc) {
//             setUserAccState(userAcc);
//             breadcrumbReturnFunc({ dispatch, userAcc });
//         }
//     }, [userAccess]);

//     useEffect(() => {
//         totalAmtCalculateFunc(demoData)
//     }, [demoData])

//     const pagesListColumns = [
//         {
//             dataField: "PartyName",
//             text: "party",
//             hidden: true,
//         },

//         {
//             //***************ItemName********************************************************************* */
//             text: "Receipt Date",
//             dataField: "ReceiptDate",
//             classes: (cell, row) =>
//                 row.header === true ? "multiinvoice" : "invoice-item-row",
//             attrs: (cell, row, rowIndex, colIndex) =>
//                 row.header === true ? { colSpan: "6" } : {},
//             formatter: (cellContent, index1) => {
//                 if (index1.header) {
//                     return (
//                         <div className="_heder">
//                             <div className="div-1">
//                                 <div>
//                                     <Label className="text-primary">{index1.PartyName}</Label>
//                                 </div>
//                             </div>
//                             <div className="div-2">
//                                 <div>
//                                     <Label>Amount Paid :</Label>
//                                 </div>
//                                 <div>
//                                     <Label id={`paidAmt-${index1.id}-${index1.Party}`}>{index1.AmountPaid}</Label>
//                                 </div>
//                             </div>

//                             <div className="div-2">
//                                 <div>
//                                     <Label>Opening Balance :</Label>
//                                 </div>
//                                 <div>
//                                     <Label>{index1.OpBalance}</Label>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 }
//                 return (
//                     <>
//                         <samp id={`ItemName${index1.id}-${index1.ReceiptDate}`}>
//                             {index1.ReceiptDate}
//                         </samp>
//                     </>
//                 );
//             },
//         },

//         {
//             //***************BillNo********************************************************************* */
//             text: "Bill No",
//             dataField: "BillNo",
//             style: (cell, row, rowIndex, colIndex) => {
//                 return row.header === true ? { display: "none" } : {}; //make sure other things are not displayed
//             },

//         },
//         {
//             //***************Bill Amount********************************************************************* */
//             text: "Bill Amount",
//             dataField: "BillAmount",
//             style: (cell, row, rowIndex, colIndex) => {
//                 return row.header === true ? { display: "none" } : {}; //make sure other things are not displayed
//             },

//         },
//         {
//             //***************Bill Amount********************************************************************* */
//             text: "Paid",
//             dataField: "Paid",
//             style: (cell, row, rowIndex, colIndex) => {
//                 return row.header === true ? { display: "none" } : {}; //make sure other things are not displayed
//             },
//         },
//         {
//             //***************Bill Amount********************************************************************* */
//             text: "Bal Amt",
//             dataField: "BalAmt",
//             style: (cell, row, rowIndex, colIndex) => {
//                 return row.header === true ? { display: "none" } : {}; //make sure other things are not displayed
//             },
//             formatter: (cellContent, index1) => {
//                 return <>
//                     <Input value={cellContent} disabled={true}></Input></>
//             }
//         },
//         {
//             //***************Bill Amount********************************************************************* */
//             text: "Calculate",
//             dataField: "Calculate",
//             style: (cell, row, rowIndex, colIndex) => {
//                 return row.header === true ? { display: "none" } : {}; //make sure other things are not displayed
//             },
//             formatter: (cell, row, r, c, data = []) => {
//                 return <>
//                     <Input defaultValue={row.Calculate} onChange={(e) => { calculateOnChange(e, row, data) }}></Input>
//                 </>
//             }
//         }


//     ];

//     function calculateOnChange(e, row, data = []) {

//         row.Calculate = e.target.value
//         const grouped = groupBy(data, p => p.Party)
//         const collection = grouped.get(row.Party)
//         let addition = 0
//         collection.forEach(index1 => {
//             addition = addition + Number(index1.Calculate)
//         })
//         totalAmtCalculateFunc(data, addition, row)

//     }
//     function totalAmtCalculateFunc(data = [], addition = 0, row = '') {
//         let totalAmt = 0
//         data.forEach(index1 => {
//             if (!(index1.header === true)) {
//                 totalAmt = Number(index1.Calculate) + totalAmt
//             }
//             if (row.Party === index1.Party && index1.header === true) {
//                 index1.AmountPaid = addition.toFixed(3)
//                 document.getElementById(`paidAmt-${index1.id}-${index1.Party}`).innerText = index1.AmountPaid
//             }
//         })
//         dispatch(BreadcrumbShowCountlabel(`ToTal Amount :${totalAmt}`))
//     }
//     function SaveHandler() {

//     }

//     if (!(userPageAccessState === "")) {
//         return (
//             <React.Fragment>
//                 <MetaTags>
//                     <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title>
//                 </MetaTags>

//                 <div className="page-content">
//                     <form noValidate>
//                         <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>
//                             <Row>
//                                 <Col className=" mt-1 row  " sm={11}>
//                                     <Col sm="3">
//                                         <FormGroup className="row mt-2 mb-3  ">
//                                             <Label className="mt-1" style={{ width: "100px" }}>
//                                                 {"Date"}
//                                             </Label>
//                                             <Col sm="7">
//                                                 <Flatpickr
//                                                     name="InvoiceDate"
//                                                     // value={values.InvoiceDate}
//                                                     className="form-control d-block bg-white text-dark"
//                                                     id="myInput11"
//                                                     // disabled={
//                                                     //     OrderItemDetails.length > 0 || pageMode === "edit"
//                                                     //         ? true
//                                                     //         : false
//                                                     // }
//                                                     options={{
//                                                         dateFormat: "Y-m-d",
//                                                     }}
//                                                 // onChange={InvoiceDateOnchange}
//                                                 />
//                                             </Col>
//                                         </FormGroup>
//                                     </Col>

//                                     <Col sm="6">
//                                         {/* <FormGroup className="row mt-2 mb-3 ">
//                                             <Label className="mt-2" style={{ width: "100px" }}>
//                                                 {" "}
//                                                 {fieldLabel.Customer}{" "}
//                                             </Label>
//                                             <Col sm={7}>
//                                                 <Select
//                                                     name="Customer"
//                                                     value={values.Customer}
//                                                     isSearchable={true}
//                                                     isDisabled={
//                                                         OrderItemDetails.length > 0 ? true : false
//                                                     }
//                                                     id={"customerselect"}
//                                                     className="react-dropdown"
//                                                     classNamePrefix="dropdown"
//                                                     options={CustomerDropdown_Options}
//                                                     onChange={CustomerOnchange}
//                                                 />
//                                                 {isError.Customer.length > 0 && (
//                                                     <span className="text-danger f-8">
//                                                         <small>{isError.Customer}</small>
//                                                     </span>
//                                                 )}
//                                             </Col>
//                                         </FormGroup> */}
//                                     </Col>
//                                 </Col>

//                                 {/* <Col sm={1} className="mt-3">
//                       {pageMode === mode.defaultsave ? (
//                         OrderItemDetails.length === 0 ? (
//                           <Go_Button onClick={(e) => goButtonHandler()} />
//                         ) : (
//                           <Change_Button
//                             onClick={(e) =>
//                               dispatch(GoButtonForinvoiceAddSuccess([]))
//                             }
//                           />
//                         )
//                       ) : null}
//                     </Col> */}
//                                 <Col></Col>
//                             </Row>
//                         </Col>
//                         <CustomTable2
//                             data={demoData}
//                             columns={pagesListColumns}
//                             customSearch={bulkSearch}
//                             classes={" table table-responsive  table-bordered table-hover"}
//                             noDataIndication={
//                                 <div className="text-danger text-center ">
//                                     Items Not available
//                                 </div>
//                             }
//                         >
//                         </CustomTable2>


//                         {demoData.length > 0 && (
//                             <div className={"invoice-savebtn"}>
//                                 <div className="div-1">
//                                     <SaveButton
//                                         pageMode={pageMode}
//                                         onClick={SaveHandler}
//                                         id={saveBtnid}
//                                         userAcc={userPageAccessState}
//                                         module={userAccess.PageHeading}
//                                     />
//                                 </div>
//                             </div>
//                         )}
//                     </form>
//                 </div>
//             </React.Fragment>
//         );
//     } else {
//         return <React.Fragment></React.Fragment>;
//     }
// }
// export default BulkRecipt



import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import Flatpickr from "react-flatpickr"
import { MetaTags } from "react-meta-tags";
import { AlertState, BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction,
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, btnIsDissablefunc, currentDate, loginCompanyID, loginPartyID, loginUserID, metaTagLabel, } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import { BankListAPI, GetOpeningBalance, GetOpeningBalance_Success, ReceiptGoButtonMaster, ReceiptGoButtonMaster_Success, ReceiptTypeAPI, saveReceiptMaster, saveReceiptMaster_Success } from "../../../store/Accounting/Receipt/action";
import { postSelect_Field_for_dropdown } from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { setISODay } from "date-fns";
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";

const BulkRecipt = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        CurrentDate: currentDate,
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [modalCss, setModalCss] = useState(false);
    const [ID, setID] = useState("");
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        ReceiptGoButton,
        pageField,
        userAccess } = useSelector((state) => ({
            postMsg: state.ReceiptReducer.postMsg,
            ReceiptGoButton: state.ReceiptReducer.ReceiptGoButton,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const page_Mode = location.pageMode
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const { Data = [] } = ReceiptGoButton

    useEffect(() => {
        const page_Id = pageId.RECEIPTS
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(BankListAPI())
    }, []);

    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`BulkReceipt Count :${Data.length}`))
    }, [ReceiptGoButton]);


    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])


    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveReceiptMaster_Success({ Status: false }))
            dispatch(ReceiptGoButtonMaster_Success([]))
            setState(() => resetFunction(fileds, state))//Clear form values


            if (pageMode === "other") {
                CustomAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                const promise = await CustomAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (promise) {
                    history.push({
                        pathname: url.LOADING_SHEET_LIST,
                    })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveReceiptMaster_Success({ Status: false }))
            CustomAlert({
                Type: 4,
                Message: JSON.stringify(postMessage.Message),
            })
        }
    }, [postMsg])


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



    function CalculateOnchange(e, row, key) {
        
        let Calculate = e.target.value
        if (Calculate <= 0) {
            row.Calculate = row.BalanceAmount

        } else {
            row.Calculate = Calculate
        }
    }


    const pagesListColumns = [
        {
            text: "Party",
            dataField: "CustomerName",
        },
        {
            text: "Invoice Date",
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

                return (<span style={{ justifyContent: 'center' }}>
                    <Input
                        id=""
                        key={row.Invoice}
                        defaultValue={row.BalanceAmount}
                        className="col col-sm"
                        onChange={e => { CalculateOnchange(e, row, key) }}
                    />
                </span>)
            }
        }

    ];


    const SaveHandler = (event) => {
        
        const arr1 = []
        event.preventDefault();
        const btnId = event.target.id
        try {
            // if (formValid(state)) {
            btnIsDissablefunc({ btnId, state: true })

            Data.forEach(i => {
                const arr =
                {
                    ReceiptDate: i.InvoiceDate,
                    Description: "",
                    AmountPaid: i.GrandTotal,
                    BalanceAmount: i.BalanceAmount,
                    OpeningBalanceAdjusted: "",
                    DocumentNo: "",
                    AdvancedAmountAjusted: "",
                    Customer: i.Customer,
                    ChequeDate: "",
                    Party: loginPartyID(),
                    ReceiptMode: 31,
                    ReceiptType: 29,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    ReceiptInvoices: [
                        {
                            Invoice: i.Invoice,
                            GrandTotal: i.GrandTotal,
                            PaidAmount: i.Calculate <= 0 ? i.GrandTotal : i.Calculate.toFixed(2),
                        }],
                    PaymentReceipt: []
                }
                arr1.push(arr)
            })

            const jsonBody = JSON.stringify({
                BulkData: arr1
            })

            if (pageMode === mode.edit) {
                // dispatch(updatePartyMasterBulkID({ jsonBody, updateId: values.id, btnId }));
            }
            else {

                dispatch(saveReceiptMaster({ jsonBody, btnId }));

            }
            // }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };









    // const saveHandeller = async (event) => {
    //     const arr1 = []

    //     event.preventDefault();
    //     const btnId = event.target.id;
    //     try {
    //         btnIsDissablefunc({ btnId, state: true })
    //         Data.forEach(i => {
    //             
    //             const arr = {
    //                 Customer: i.CustomerName,
    //                 ReceiptDate: i.InvoiceDate,
    //                 BillNo: i.FullInvoiceNumber,
    //                 BalanceAmount: "",
    //                 Grandtotal: i.Grandtotal,
    //                 DocumentNo: i.ChequeNo,
    //                 AdvancedAmountAjusted: "",
    //                 Bank: i.BankName.value,
    //                 // ChequeDate: i.ReceiptModeName.label === "Cheque" ? i.ChequeDate : "",
    //                 DepositorBank: i.DepositorBankName.value,
    //                 Party: loginPartyID(),
    //                 ReceiptMode: i.ReceiptModeName.value,
    //                 CreatedBy: loginUserID(),
    //                 UpdatedBy: loginUserID(),
    //                 // "ReceiptInvoices": FilterReceiptInvoices,
    //                 // "PaymentReceipt": page_Mode === mode.modeSTPsave ? PaymentReceipt : []
    //             }
    //             arr1.push(arr)
    //         })
    //         const jsonBody = JSON.stringify({
    //             BulkData: arr1
    //         })

    //         if (pageMode === mode.edit) {
    //             // dispatch(updateCategoryID({ jsonBody, updateId: values.id, btnId }));
    //         }
    //         else {
    //             dispatch(saveReceiptMaster({ jsonBody, btnId }));
    //         }

    //     } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    // };
    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                 <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-2" >
                            <div className=" row ">
                                <Col sm="6">
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>Receipt Date</Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name='Date'
                                                value={values.CurrentDate}
                                                disabled={true}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >
                                <Col sm="3" className="">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "120px" }}>Recepiet Mode :</Label>
                                        <Col sm="3">
                                            <Label className=" mt-2">Cash</Label>
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </div>
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
                                        onClick={SaveHandler}
                                        userAcc={userPageAccessState}
                                        editCreatedBy={editCreatedBy}
                                        module={"Receipts"}
                                    />

                                </Col>
                            </FormGroup >
                            : null
                        }

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

export default BulkRecipt

