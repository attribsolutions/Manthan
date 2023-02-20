import React, { useEffect, useState, } from "react";
import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import Flatpickr from "react-flatpickr"
import { commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeDate,

} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import Select from "react-select";
import { Change_Button, Go_Button, SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import {
    updateBOMListSuccess
} from "../../../store/Purchase/BOMRedux/action";
import { breadcrumbReturn, convertDatefunc, createdBy, currentDate, GoBtnDissable, saveDissable, userCompany, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"
// import { editInvoiceListSuccess, GoButton_post_For_Invoice, GoButton_post_For_Invoice_Success, postInvoiceMasterSuccess } from "../../../store/Sales/Invoice/action";
import { GetCustomer, GetVender, GetVenderSupplierCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
// import { postInvoiceMaster } from "../../../store/Sales/Invoice/action";
import { Amount, basicAmount, GstAmount } from "../../Purchase/Order/OrderPageCalulation";
import { challanitemdropdown, GoButtonForchallanAdd, GoButtonForchallanAddSuccess, Postchallan } from "../../../store/Inventory/ChallanRedux/actions";

// import "./css.css"

const Challan = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const subPageMode = history.location.pathname

    const goBtnId = `ADDGoBtn${subPageMode}`
    const saveBtnid = `saveBtn${subPageMode}`

    const fileds = {
        // id: "",
        InvoiceDate: currentDate,
        Customer: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [showAllStockState, setShowAllStockState] = useState(true);
    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        customer,
        GoButton = [],
        vender,
        vendorSupplierCustomer,
        gobutton_Add,
        challanitems
    } = useSelector((state) => ({
        challanitems: state.ChallanReducer.challanitems,
        GoButton: state.ChallanReducer.GoButton,
        vender: state.SupplierReducer.vender,
        postMsg: state.InvoiceReducer.postMsg,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        customer: state.SupplierReducer.customer,
        // GoButton: state.InvoiceReducer.GoButton,
        vendorSupplierCustomer: state.SupplierReducer.vendorSupplierCustomer,
    }));




    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {

        // dispatch(GetVenderSupplierCustomer(subPageMode))
        // dispatch(GetCustomer())
        // dispatch(commonPageFieldSuccess(null));
        // dispatch(commonPageField(pageId.INVOICE_1))
        // dispatch(GoButton_post_For_Invoice_Success([]))

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
            setUserPageAccessState(userAcc)
            breadcrumbReturn({ dispatch, userAcc });

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

                const { Customer, CustomerName, } = hasEditVal
                const { values, hasValid, } = { ...state }
                hasValid.Customer.valid = true;

                values.Customer = { label: CustomerName, value: Customer };

                //++++++++++++++++++++++++++**Dynamic go Button API Call method+++++++++++++++++
                const jsonBody = JSON.stringify({
                    FromDate: hasEditVal.InvoiceDate,
                    Customer: hasEditVal.Customer,
                    Party: userParty(),
                    OrderIDs: ""
                });
                // dispatch(GoButton_post_For_Invoice(jsonBody));
                // dispatch(editInvoiceListSuccess({ Status: false }))

            }
        }
    }, []);

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            // dispatch(postInvoiceMasterSuccess({ Status: false }))
            // dispatch(GoButton_post_For_Invoice_Success([]))
            // dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
            // dispatch(postBOMSuccess({ Status: false }))
            // setState(() => resetFunction(fileds, state))// Clear form values 
            // saveDissable(false);//save Button Is enable function

            // dispatch(AlertState({
            //     Type: 1,
            //     Status: true,
            //     Message: "Item is out of stock",
            //     RedirectPath: url.MATERIAL_ISSUE_LIST,
            // }))
            if (pageMode === mode.dropdownAdd) {
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
                    RedirectPath: url.INVOICE_LIST_1,
                }))
            }
        }
        else if (postMsg.Status === true) {

            // dispatch(postInvoiceMasterSuccess({ Status: false }))
            // dispatch(GoButton_post_For_Invoice_Success([]))

            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {

        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            // setState(() => resetFunction(fileds, state))// Clear form values 
            // saveDissable(false);//save Button Is enable function
            history.push({
                pathname: url.MATERIAL_ISSUE_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            // saveDissable(false);//Update Button Is enable function
            // dispatch(updateBOMListSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg, modalCss]);
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: userCompany()
        });
        dispatch(challanitemdropdown(jsonBody))
        dispatch(GetVender())
        dispatch(GoButtonForchallanAddSuccess([]))
    }, [])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField]);

    useEffect(() => {
        // showAllStockOnclick(showAllStockState)
    }, [showAllStockState]);

    const venderOptions = vender.map((i) => ({
        value: i.id,
        label: i.Name,
    }));


    const ItemsOption = challanitems.map((i) => ({
        value: i.id,
        label: i.Name,
    }));


    const pagesListColumns = [

        {//***************ItemName********************************************************************* */
            text: "Item Name",
            dataField: "ItemName",
            headerFormatter: (cell, index1 = [], k) => {
                return (
                    <div className="width-100">Item Name</div>)
            },
            formatter: (cellContent, index1) => {

                return (
                    <>
                        <div><samp id={`ItemName${index1.id}`}>{cellContent}</samp></div>
                        {(index1.StockInValid) ? <div><samp id={`StockInvalidMsg${index1.id}`} style={{ color: "red" }}> {index1.StockInvalidMsg}</samp></div>
                            : <></>}
                    </>
                )
            },

        },
        // {//***************Quantity********************************************************************* */
        //     text: "Quantity",
        //     dataField: "",
        //     headerFormatter: (cell, index1 = [], k) => {
        //         return (
        //             <div className="width-100">Quantity</div>)
        //     },
        //     formatter: (cellContent, user) => (
        //         <div >
        //             <Input type="text"
        //                 disabled={pageMode === 'edit' ? true : false}
        //                 id={`OrderQty${user.id}`}
        //                 style={{ textAlign: "right" }}
        //                 className=" width-100"
        //                 key={user.id}
        //                 autoComplete="off"
        //                 defaultValue={user.Quantity}
        //                 onChange={(event) => orderQtyOnChange(event, user)}
        //             ></Input>
        //             <samp className="mt-1">Order Qty:{user.OrderQty} {user.UnitName}</samp>
        //         </div>

        //     )
        // },
        // {//***************Unit Dropdown********************************************************************* */
        //     text: "Unit",
        //     dataField: "id",

        //     headerFormatter: (cell, index1 = [], k) => {
        //         return (
        //             <div className="width-100" >Unit</div>)
        //     },
        //     formatter: (value, row, key) => {

        //         return (
        //             <Select
        //                 classNamePrefix="select2-selection"
        //                 id={"ddlUnit"}
        //                 isDisabled={pageMode === 'edit' ? true : false}
        //                 defaultValue={row.UnitDrop}
        //                 // value={{value:row.Unit,label:row.UnitName}}
        //                 className=" width-100"
        //                 options={
        //                     row.UnitDetails.map(i => ({
        //                         label: i.UnitName,
        //                         value: i.Unit,
        //                         ConversionUnit: i.ConversionUnit,
        //                         Unitlabel: i.Unitlabel
        //                     }))
        //                 }
        //                 onChange={(event) => orderQtyUnit_SelectOnchange(event, row)}
        //             >
        //             </Select >
        //         )
        //     },
        // },
        {//***************StockDetails********************************************************************* */

            text: "Stock Details",
            dataField: "StockDetails",
            headerFormatter: (cell, index1 = [], k) => {

                return (
                    <div className="d-flex flex-content-start">
                        {GoButton.length > 0 ? <div>
                            <samp id="allplus-circle">
                                <i className=" mdi mdi-plus-circle-outline text-primary font-size-16 "
                                    style={{
                                        position: "",
                                        display: showAllStockState ? "none" : "block"
                                    }}
                                    onClick={(e) => {
                                        // setShowAllStockState(!showAllStockState)
                                        // showAllStockOnclick(true) 
                                    }}
                                >
                                </i>
                            </samp>
                            <samp id="allminus-circle"  >
                                <i className="mdi mdi-minus-circle-outline text-primary font-size-16"
                                    style={{
                                        position: "",
                                        // display: "none"
                                        display: showAllStockState ? "block" : "none"
                                    }}
                                    onClick={(e) => {
                                        // setShowAllStockState(!showAllStockState)
                                        // showAllStockOnclick(false)
                                    }}
                                ></i>
                            </samp>
                        </div>
                            : null
                        }

                        <div style={{ paddingLeft: "1px", paddingTop: "1px" }}>
                            <samp > Stock Details</samp>
                        </div>

                    </div>
                )
            },

            formatter: (cellContent, index1) => (


                <div>
                    <div key={`plus-circle-icon${index1.id}`}>
                        {
                            (index1.StockTotal > 0) ?
                                <>
                                    <samp key={`plus-circle${index1.id}`} id={`plus-circle${index1.id}`}
                                        style={{
                                            display: showAllStockState ? "none" : "block"
                                        }}
                                    >
                                        {/* <i className=" mdi mdi-plus-circle-outline text-primary font-size-16"
                                            style={{ position: "absolute", }}
                                            onClick={(e) => { showStockOnclick(index1, true) }}>
                                        </i> */}
                                        <samp style={{ fontWeight: "bold", textShadow: 1, marginLeft: "20px" }}>
                                            {`Total Stock:${index1.StockTotal}`}</samp>
                                    </samp>
                                </>
                                : <samp style={{ fontWeight: "bold", textShadow: 1, }}>{'Total Stock:0'}</samp>
                        }

                        <samp key={`minus-circle${index1.id}`} id={`minus-circle${index1.id}`}
                            style={{ display: showAllStockState ? "block" : "none" }}
                        >
                            <i className="mdi mdi-minus-circle-outline text-primary font-size-16"
                                style={{ position: "absolute", }}
                            // onClick={(e) => { showStockOnclick(index1, false) }}
                            ></i>
                        </samp>

                    </div >

                    {/* <div id={`view${index1.id}`}
                        style={{
                            backgroundColor: "#b9be511a",
                            display: showAllStockState ? "bolck" : "none"
                        }}
                    // style={{ display: showAllStockState ? "none" : "block" }}
                    > */}

                    <Table className="table table-bordered table-responsive mb-1" >
                        <Thead  >

                            <tr className="" style={{ zIndex: -3 }}>
                                <th className="">SystemBatchCode </th>
                                <th className="" >BatchCode</th>
                                <th className="" >Batch Date</th>
                                <th className="">
                                    <div>
                                        <samp >BaseUnitQuantity</samp>
                                    </div>
                                    {/* <samp >{`(${index1.StockTotal} ${index1.StockUnit})`} </samp> */}
                                    </th>
                                <th className="" >
                                    <div>
                                        <samp >Rate</samp>
                                    </div>
                                    {/* <samp id={`stocktotal${index1.id}`}>{`Total:${index1.InpStockQtyTotal} ${index1.StockUnit}`} </samp> */}
                                </th>
                                {/* <th className="" >Rate</th> */}

                            </tr>

                        </Thead>
                        <Tbody  >
                            {cellContent.map((index1) => {
                                return (
                                    < tr  >
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                {index1.SystemBatchCode}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                {index1.BatchCode}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "100px" }}>
                                                {convertDatefunc(index1.BatchDate)}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "120px", textAlign: "right" }}>
                                                {`${index1.BaseUnitQuantity} `}
                                            </div>
                                        </td>

                                        <td>
                                            <div style={{ width: "120px", textAlign: "right" }}>
                                                {`${index1.Rate} `}
                                            </div>
                                        </td>
                                        {/* <td> */}
                                        {/* <div style={{ width: "150px" }}> */}
                                        {/* <Input type="text"
                                                        disabled={pageMode === 'edit' ? true : false}
                                                        style={{ textAlign: "right" }}
                                                        key={`batchQty${index1.id}-${index2.id}`}
                                                        id={`batchQty${index1.id}-${index2.id}`}
                                                        defaultValue={index2.Qty}
                                                        onChange={(event) => StockQtyOnChange(event, index1, index2)}
                                                    ></Input> */}
                                        {/* </div> */}
                                        {/* </td> */}
                                    </tr>
                                )
                            })}
                        </Tbody>
                    </Table></div>
                // </div >
            ),

        },
        // {//***************Rate********************************************************************* */
        //     text: "Rate",
        //     dataField: "Rate",
        // }

    ];

    const pageOptions = {
        sizePerPage: 10,
        // totalSize: OrderItemDetails.length,
        custom: true,
    };

    //     function showAllStockOnclick(isplus = false) {
    //         try {
    //             if (isplus) {
    //                 document.getElementById("allplus-circle").style.display = "none";
    //                 document.getElementById("allminus-circle").style.display = "block";
    //             } else {
    //                 document.getElementById("allplus-circle").style.display = "block";
    //                 document.getElementById("allminus-circle").style.display = "none";
    //             }
    //         } catch (w) { }
    //         GoButton.forEach(index1 => {
    // debugger

    //             if (!index1.StockTotal > 0) {
    //                 return
    //             }
    //             try {
    //                 if (isplus) {
    //                     document.getElementById(`view${index1.id}`).style.display = "block";
    //                     document.getElementById(`plus-circle${index1.id}`).style.display = "none";
    //                     document.getElementById(`minus-circle${index1.id}`).style.display = "block";
    //                 } else {
    //                     document.getElementById(`view${index1.id}`).style.display = "none";
    //                     document.getElementById(`plus-circle${index1.id}`).style.display = "block";
    //                     document.getElementById(`minus-circle${index1.id}`).style.display = "none";
    //                 }
    //             } catch (w) { }
    //         })


    //     }
    //     function showStockOnclick(index1, isplus = false) {
    //         try {
    //             if (isplus) {
    //                 document.getElementById(`view${index1.id}`).style.display = "block";
    //                 document.getElementById(`plus-circle${index1.id}`).style.display = "none";
    //                 document.getElementById(`minus-circle${index1.id}`).style.display = "block";
    //             } else {
    //                 document.getElementById(`view${index1.id}`).style.display = "none";
    //                 document.getElementById(`plus-circle${index1.id}`).style.display = "block";
    //                 document.getElementById(`minus-circle${index1.id}`).style.display = "none";
    //             }
    //         } catch (w) { }
    //     }

    function ChallanDateOnchange(y, v, e) {
        // dispatch(GoButton_post_For_Invoice_Success([]))
        onChangeDate({ e, v, state, setState })
    };

    function PartyOnchange(hasSelect, evn) {
        debugger
        setState((i) => {
            const v1 = { ...i }
            v1.values.Item = hasSelect
            // v1.hasValid.Item.valid = true
            return v1
        })
        dispatch(GoButtonForchallanAddSuccess([]))
    };

    const StockQtyOnChange = (event, index1, index2) => {

        let input = event.target.value
        let result = /^\d*(\.\d{0,3})?$/.test(input);
        let val1 = 0;
        let v3 = index2.Qty
        if (result) {
            let v1 = Number(index2.BaseUnitQuantity);
            let v2 = Number(input)
            if (v1 >= v2) { val1 = input }
            else { val1 = v1 };

        } else if (((v3 >= 0) && (!(input === '')))) {
            val1 = v3
        } else {
            val1 = 0
        }

        event.target.value = val1;
        index2.Qty = val1

        let t1 = 0  //L1 Current StockDetails QTY Sum="t1"
        let t2 = index1.StockUnit//L2 Current StockDetails QTY Unit="t2"

        //C1 start* for loop for Stock Sum 
        index1.StockDetails.forEach(i2 => {
            t1 = Number(t1) + Number(i2.Qty);
        });
        //C1 end*

        index1.Quantity = (t1 / index1.ConversionUnit).toFixed(3)
        try {
            // C2 start ** Total stock Qty label
            document.getElementById(`stocktotal${index1.id}`).innerText = `Total:${t1} ${t2}`
            document.getElementById(`OrderQty${index1.id}`).value = index1.Quantity
            // C2 end
        } catch (e) { };
    };

    function stockDistributeFunc(index) {

        const v1 = index.Quantity;
        let orderqty = Number(v1) * Number(index.ConversionUnit);

        index.StockDetails = index.StockDetails.map(i2 => {

            let stockqty = Number(i2.BaseUnitQuantity);

            if ((orderqty > stockqty) && !(orderqty === 0)) {
                orderqty = orderqty - stockqty
                i2.Qty = stockqty.toFixed(3)
            } else if ((orderqty <= stockqty) && (orderqty > 0)) {
                i2.Qty = orderqty.toFixed(3)
                orderqty = 0
            }
            else {
                i2.Qty = 0;
            }
            try {
                document.getElementById(`batchQty${index.id}-${i2.id}`).value = i2.Qty
            } catch (e) { }
            return i2
        });

        const t1 = (v1 * index.ConversionUnit);
        const t2 = index.StockUnit;
        const t3 = index.StockTotal;

        if (t1 > t3) {
            try {
                document.getElementById(`OrderQty${index.id}`).value = t3.toFixed(3)
            } catch (e) { }
        };
        try {
            index.StockInValid = false
            index.StockInvalidMsg = null
            document.getElementById(`StockInvalidMsg${index.id}`).style.display = "none";
        } catch (e) { };
        try {
            document.getElementById(`stocktotal${index.id}`).innerText = `Total:${t1} ${t2}`
        } catch (e) { };

    };

    function orderQtyOnChange(event, index) {


        let input = event.target.value
        let result = /^\d*(\.\d{0,3})?$/.test(input);
        let val1 = 0;
        if (result) {
            let v1 = Number(index.StockTotal);
            let v2 = Number(input) * Number(index.ConversionUnit)
            if (v1 >= v2) { val1 = input }
            else { val1 = v1 / Number(index.ConversionUnit) };

        } else if (((index.Quantity >= 0) && (!(input === '')))) {
            val1 = index.Quantity
        } else {
            val1 = 0
        }

        event.target.value = val1;
        index.Quantity = val1

        stockDistributeFunc(index)
    };

    function orderQtyUnit_SelectOnchange(event, index) {
        debugger
        index.UnitDrop = event;
        index.ConversionUnit = event.ConversionUnit;
        // var n1 = Number(index.Quantity);
        // var n2 = Number(event.ConversionUnit);
        // const t1 = (n1 * n2).toFixed(2);
        // const t2 = index.StockUnit

        // try {
        //     document.getElementById(`stocktotal${index.id}`).innerText = `Total:${t1} ${t2}`
        // } catch (e) { }
        stockDistributeFunc(index)
    };

    function goButtonHandler(event) {


        const jsonBody = JSON.stringify({

            Party: userParty(),
            Item: values.Item.value
        });
        GoBtnDissable({ id: goBtnId, state: true })
        dispatch(GoButtonForchallanAdd(jsonBody));

        // }
    };

    const SaveHandler = (event) => {
        debugger
        event.preventDefault();

        const validMsg = []
        const invoiceItems = []
        let grand_total = 0;

        // GoButton.forEach((index) => {
        //     if (index.StockInValid) {
        //         validMsg.push(`${index.ItemName}:${index.StockInvalidMsg}`);
        //         return
        //     };

            // GoButton[0].StockDetails.forEach((ele) => {
            //     if (ele.Qty > 0) {
            //         var demo = {
            //             Rate: ele.Rate,
            //             GSTPercentage: ele.GST,
            //             Quantity: ele.Qty
            //         }
            //         const basicAmt = parseFloat(basicAmount(demo))
            //         const cgstAmt = (GstAmount(demo))
            //         const amount = Amount(demo)
            //         grand_total = grand_total + Number(amount)
debugger
                    const jsonBody = JSON.stringify({

                        GRN: "",
                        ChallanDate: values.InvoiceDate,
                        Party: userParty(),
                        GrandTotal: "240.00",
                        Customer: 28,
                        CreatedBy: 15,
                        UpdatedBy: 15,
                        RoundOffAmount: "",
                        ChallanItems: [
                            {
                                Item:values.Item.value,
                                Quantity: "20.000",
                                Unit: 817,
                                BaseUnitQuantity: "10.000",
                                MRP: null,
                                ReferenceRate: "100.00",
                                Rate: "100.00",
                                BasicAmount: "2000.00",
                                TaxType: "GST",
                                GST: 53,
                                GSTPercentage: "12.00",
                                HSNCode: "1208",
                                GSTAmount: "240.00",
                                Amount: "2240.00",
                                DiscountType: "0",
                                Discount: "0.00",
                                DiscountAmount: "0.00",
                                CGST: "120.00",
                                SGST: "120.00",
                                IGST: "0.00",
                                CGSTPercentage: "6.00",
                                SGSTPercentage: "6.00",
                                IGSTPercentage: "0.00",
                                BatchDate: "2023-02-17",
                                BatchCode: "0",
                                SystemBatchDate: "2023-02-17",
                                SystemBatchCode: "20230217_55_4_0"
                            }
                        ],
                        BatchWiseLiveStockGRNID: [
                            {
                                id: 727,
                                Item:values.Item.value,
                                Quantity: "20.000",
                                BaseUnitQuantity: "10.000",
                                LiveBatche: 146,
                                GRN: 526,
                                Party:userParty()
                            }
                        ]
                     
                    });

                    if (pageMode === mode.edit) {
                    }
            
                    else {
            
                        // saveDissable({ id: saveBtnid, state: true })
                        dispatch(Postchallan(jsonBody, saveBtnid));
                    }

                

                    // invoiceItems.push({
                    //     Item: index.Item,
                    //     Unit: index.UnitDrop.value,
                    //     BatchCode: ele.BatchCode,
                    //     Quantity: ele.Qty,
                    //     BatchDate: ele.BatchDate,
                    //     BatchID: ele.id,
                    //     BaseUnitQuantity: ele.BaseUnitQuantity,
                    //     LiveBatch: ele.LiveBatche,
                    //     MRP: ele.LiveBatcheMRPID,
                    //     Rate: ele.Rate,
                    //     BasicAmount: basicAmt.toFixed(2),
                    //     GSTAmount: cgstAmt.toFixed(2),
                    //     GST: ele.LiveBatcheGSTID,
                    //     CGST: (cgstAmt / 2).toFixed(2),
                    //     SGST: (cgstAmt / 2).toFixed(2),
                    //     IGST: 0,
                    //     GSTPercentage: ele.GST,
                    //     CGSTPercentage: (ele.GST / 2),
                    //     SGSTPercentage: (ele.GST / 2),
                    //     IGSTPercentage: 0,
                    //     Amount: amount,
                    //     TaxType: 'GST',
                    //     DiscountType: "",
                    //     Discount: "0",
                    //     DiscountAmount: "0",
                    // })
                }
            // })
        // })

        // if (formValid(state, setState)) {
        // if (validMsg.length > 0) {
        //     dispatch(AlertState({
        //         Type: 4,
        //         Status: true,
        //         Message: JSON.stringify(validMsg),
        //         RedirectPath: false,
        //         AfterResponseAction: false
        //     }));
        //     return
        // }



        // const forInvoice_1_json = () => ({  // Json Body Generate For Invoice_1  Start+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //     InvoiceDate: values.InvoiceDate,
        //     InvoiceItems: invoiceItems,
        //     // InvoicesReferences: OrderIDs.map(i => ({ Order: i }))
        // });

        // const forInvoice_2_json = () => ({    //   Json Body Generate For Invoice_2  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //     IBChallanDate: values.InvoiceDate,
        //     IBChallanItems: invoiceItems,
        //     // IBChallansReferences: OrderIDs.map(i => ({ Order: i }))
        // });

        // const for_common_json = () => ({     //   Json Body Generate Common for Both +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //     CustomerGSTTin: '41',
        //     GrandTotal: Math.round(grand_total),
        //     RoundOffAmount: (grand_total - Math.trunc(grand_total)).toFixed(2),
        //     Customer: values.Customer.value,
        //     Party: userParty(),
        //     CreatedBy: createdBy(),
        //     UpdatedBy: createdBy(),
        // });


       
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        // if (pageMode === mode.edit) {
        // }

        // else {

        //     saveDissable({ id: saveBtnid, state: true })
        //     dispatch(Postchallan(jsonBody, saveBtnid));
        // }

    // }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <div className="page-content" >

                    <form onSubmit={SaveHandler} noValidate>
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>
                            <Row>
                                <Col className=" mt-1 row " sm={12} >
                                    <Col sm={3}>
                                        <FormGroup className="row mt-2 mb-3  ">
                                            <Label className="mt-1" style={{ width: "110px" }}>Challan Date </Label>
                                            <Col sm={7}>
                                                <Flatpickr
                                                    name="InvoiceDate"
                                                    value={values.InvoiceDatere}
                                                    className="form-control d-block bg-white text-dark"
                                                    id="myInput11"
                                                    disabled={(GoButton.length > 0 || pageMode === "edit") ? true : false}

                                                    options={{
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    onChange={ChallanDateOnchange}
                                                />
                                                {isError.InvoiceDate.length > 0 && (
                                                    <span className="invalid-feedback">{isError.InvoiceDate}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm={3}>
                                        <FormGroup className="row mt-2 mb-3 ">
                                            <Label className="mt-2" style={{ width: "80px" }}> Party </Label>
                                            <Col sm={8}>
                                                <Select
                                                    name="Customer"
                                                    value={values.party}
                                                    isSearchable={true}
                                                    isDisabled={GoButton.length > 0 ? true : false}
                                                    id={'customerselect'}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={venderOptions}
                                                // onChange={PartyOnchange}
                                                />
                                                {isError.Customer.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >
                                    <Col sm={3}>
                                        <FormGroup className="row mt-2 mb-3 ">
                                            <Label className="mt-2" style={{ width: "80px" }}> Item </Label>
                                            <Col sm={8} >
                                                <Select
                                                    name="Customer"
                                                    value={values.Item}
                                                    isSearchable={true}
                                                    isDisabled={GoButton.length > 0 ? true : false}
                                                    id={'customerselect'}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={ItemsOption}
                                                    onChange={PartyOnchange}

                                                />
                                                {isError.Customer.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >
                                    <Col sm={2} className="mt-3">
                                        {pageMode === mode.defaultsave ?
                                            (GoButton.length === 0) ?
                                                < Go_Button onClick={(e) => goButtonHandler()} />
                                                :
                                                <Change_Button onClick={(e) => dispatch(GoButtonForchallanAddSuccess([]))} />
                                            : null
                                        }
                                    </Col>
                                </Col>
                            </Row>
                        </Col>
                        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider

                                    keyField={"id"}
                                    data={GoButton}
                                    columns={pagesListColumns}

                                    search
                                >
                                    {(toolkitProps) => (
                                        <React.Fragment>
                                            <Row>
                                                <Col xl="12">
                                                    <div className="table-responsive">
                                                        <BootstrapTable
                                                            keyField={"id"}
                                                            responsive
                                                            bordered={false}
                                                            striped={false}
                                                            classes={"table  table-bordered"}
                                                            noDataIndication={
                                                                <div className="text-danger text-center ">
                                                                    Items Not available
                                                                </div>
                                                            }
                                                            {...toolkitProps.baseProps}
                                                            {...paginationTableProps}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="align-items-md-center mt-30">
                                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                    <PaginationListStandalone {...paginationProps} />
                                                </Col>
                                            </Row>
                                        </React.Fragment>
                                    )}
                                </ToolkitProvider>
                            )}

                        </PaginationProvider>

                        {GoButton.length > 0 ? <FormGroup>
                            <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                <SaveButton pageMode={pageMode}
                                    //   onClick={onsave}
                                    id={saveBtnid}
                                    userAcc={userPageAccessState}
                                    module={"Material Issue"}
                                />
                            </Col>
                        </FormGroup > : null}
                    </form>
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

export default Challan;
