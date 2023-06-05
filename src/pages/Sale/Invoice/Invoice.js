import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeDate,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { Change_Button, Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import {
    updateBOMListSuccess
} from "../../../store/Production/BOMRedux/action";

import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"
import {
    editInvoiceListSuccess,
    GoButtonForinvoiceAdd,
    GoButtonForinvoiceAddSuccess,
    invoiceSaveAction,
    invoiceSaveActionSuccess,
    makeIB_InvoiceActionSuccess
} from "../../../store/Sales/Invoice/action";
import { GetVenderSupplierCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { discountCalculate, innerStockCaculation, orderQtyOnChange, orderQtyUnit_SelectOnchange, showAllStockOnclick, showStockOnclick, stockDistributeFunc, stockQtyOnChange } from "./invoiceCaculations";
import "./invoice.scss"
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_DatePicker } from "../../../CustomValidateForm";

const Invoice = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const subPageMode = history.location.pathname

    const goBtnId = `ADDGoBtn${subPageMode}`
    const saveBtnid = `saveBtn${subPageMode}`

    const fileds = {
        InvoiceDate: currentDate_ymd,
        Customer: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [showAllStockState, setShowAllStockState] = useState(true);

    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        GoButton = '',
        vendorSupplierCustomer,
        makeIBInvoice
    } = useSelector((state) => ({
        postMsg: state.InvoiceReducer.postMsg,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        customer: state.CommonAPI_Reducer.customer,
        GoButton: state.InvoiceReducer.gobutton_Add,
        vendorSupplierCustomer: state.CommonAPI_Reducer.vendorSupplierCustomer,
        makeIBInvoice: state.InvoiceReducer.makeIBInvoice,
    }));

    const { OrderItemDetails = [], OrderIDs = [] } = GoButton;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {

        dispatch(GetVenderSupplierCustomer(subPageMode))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.INVOICE_1))
        dispatch(GoButtonForinvoiceAddSuccess([]))

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

        if ((hasShowloction || hasShowModal || (location.state))) {

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
            else if (location) {

                setPageMode(mode.defaultsave)

                let Customer = location.state.CustomerID
                let CustomerName = location.state.Customer

                hasEditVal = { Customer, CustomerName }

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
                    Party: _cfunc.loginPartyID(),
                    OrderIDs: ""
                });
                dispatch(GoButtonForinvoiceAdd({ jsonBody, }));
                dispatch(editInvoiceListSuccess({ Status: false }))

            }
        }
    }, []);

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(invoiceSaveActionSuccess({ Status: false }))
            dispatch(GoButtonForinvoiceAddSuccess([]))

            if (pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: JSON.stringify(postMsg.Message),
                })
            }
            else {
                const promise = await customAlert({
                    Type: 1,
                    Message: JSON.stringify(postMsg.Message),
                    RedirectPath: url.INVOICE_LIST_1,
                })
                if (promise) {
                    if (subPageMode === url.INVOICE_1) {
                        history.push({ pathname: url.INVOICE_LIST_1 })
                    }
                    else if (subPageMode === url.IB_INVOICE) {
                        history.push({ pathname: url.IB_INVOICE_LIST })
                    }
                }
            }
        }
        else if (postMsg.Status === true) {
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {

        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            history.push({
                pathname: url.MATERIAL_ISSUE_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateBOMListSuccess({ Status: false }));
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
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])


    useEffect(() => {
        showAllStockOnclick(OrderItemDetails, showAllStockState)
    }, [showAllStockState]);


    useEffect(() => {

        if (makeIBInvoice.Status === true && makeIBInvoice.StatusCode === 200) {
            setState((i) => {
                const obj = { ...i }
                obj.values.Customer = makeIBInvoice.customer;
                obj.hasValid.Customer.valid = true;
                return obj
            })
            goButtonHandler(makeIBInvoice);
            dispatch(makeIB_InvoiceActionSuccess({ Status: false }))
        }
    }, [makeIBInvoice]);


    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [OrderItemDetails]);


    const CustomerDropdown_Options = vendorSupplierCustomer.map((index) => ({
        value: index.id,
        label: index.Name,

    }));


    const pagesListColumns = [
        {//***************ItemName********************************************************************* */
            text: "Item Name",
            dataField: "ItemName",
            classes: () => ('invoice-item-row'),
            formatter: (cellContent, index1) => {
                return (
                    <>
                        <div className="invoice-item-row-div-1">
                            <samp id={`ItemName${index1.id}`}>{index1.ItemName}</samp>
                        </div>
                        {
                            (index1.StockInValid) ? <div><samp id={`StockInvalidMsg${index1.id}`} style={{ color: "red" }}> {index1.StockInvalidMsg}</samp></div>
                                : <></>
                        }
                    </>
                )
            },


        },
        {//***************Quantity********************************************************************* */
            text: "Quantity/Unit",
            dataField: "",
            classes: () => ('invoice-quantity-row'),
            formatter: (cellContent, index1) => (
                <>
                    <div className="div-1">
                        <label className="label">Qty</label>
                        <Input type="text"
                            disabled={pageMode === 'edit' ? true : false}
                            id={`OrderQty-${index1.id}`}
                            className="input"
                            style={{ textAlign: "right" }}
                            key={index1.id}
                            autoComplete="off"
                            defaultValue={index1.Quantity}
                            onChange={(event) => orderQtyOnChange(event, index1)}
                        />
                    </div>
                    <div className="div-1 ">
                        <label className="label">Unit</label>
                        <div id="select">
                            <Select
                                classNamePrefix="select2-selection"
                                id={"ddlUnit"}
                                isDisabled={pageMode === 'edit' ? true : false}
                                defaultValue={index1.default_UnitDropvalue}

                                options={
                                    index1.UnitDetails.map(i => ({
                                        "label": i.UnitName,
                                        "value": i.UnitID,
                                        "ConversionUnit": i.ConversionUnit,
                                        "Unitlabel": i.Unitlabel,
                                        "BaseUnitQuantity": i.BaseUnitQuantity,
                                        "BaseUnitQuantityNoUnit": i.BaseUnitQuantityNoUnit,
                                    }))
                                }
                                onChange={(event) => orderQtyUnit_SelectOnchange(event, index1)}
                            >
                            </Select >
                        </div>

                    </div>
                    <div className="bottom-div">
                        <span>Order-Qty :</span>
                        <samp >{index1.OrderQty}</samp>
                        <samp >{index1.UnitName}</samp></div>
                </>

            )
        },


        {//***************StockDetails********************************************************************* */
            text: "Stock Details",
            dataField: "StockDetails",
            headerFormatter: (cell, index1 = [], k) => {

                return (
                    <div className="d-flex flex-content-start">
                        {OrderItemDetails.length > 0 ? <div>
                            <samp id="allplus-circle">
                                <i className=" mdi mdi-plus-circle-outline text-primary font-size-16 "
                                    style={{
                                        position: "",
                                        display: showAllStockState ? "none" : "block"
                                    }}
                                    onClick={(e) => {
                                        setShowAllStockState(!showAllStockState)
                                    }}
                                >
                                </i>
                            </samp>
                            <samp id="allminus-circle"  >
                                <i className="mdi mdi-minus-circle-outline text-primary font-size-16"
                                    style={{
                                        position: "",
                                        display: showAllStockState ? "block" : "none"
                                    }}
                                    onClick={(e) => {
                                        setShowAllStockState(!showAllStockState)
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
                        <samp style={{ fontWeight: "bold", textShadow: 1, }}>{'Total Stock'}</samp>

                        <samp key={`minus-circle${index1.id}`} id={`minus-circle${index1.id}`}
                            style={{ display: showAllStockState ? "block" : "none" }}
                        >
                            <i className="mdi mdi-minus-circle-outline text-primary font-size-16"
                                style={{ position: "absolute", }}
                                onClick={(e) => { showStockOnclick(index1, false) }}
                            ></i>
                        </samp>

                    </div >

                    <div id={`view${index1.id}`}
                        style={{
                            backgroundColor: "#b9be511a",
                            display: showAllStockState ? "bolck" : "none"
                        }}

                    >
                        <Table className="table table-bordered table-responsive mb-1" >

                            <Thead  >

                                <tr style={{ zIndex: -3 }}>
                                    <th >Batch Code </th>
                                    <th  >Supplier BatchCode</th>
                                    <th  >Batch Date</th>
                                    <th >
                                        <div>
                                            <samp >Stock Quantity</samp>
                                        </div>
                                    </th>
                                    <th className="" >
                                        <div>
                                            <samp >Quantity</samp>
                                        </div>
                                    </th>
                                    <th  >Rate</th>
                                    <th  >MRP</th>
                                </tr>
                            </Thead>
                            <Tbody  >
                                {cellContent.map((index2) => {

                                    return (
                                        < tr key={index1.id} >
                                            <td>
                                                <div style={{ width: "120px" }}>
                                                    {index2.SystemBatchCode}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "120px" }}>
                                                    {index2.BatchCode}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "90px" }}>
                                                    {_cfunc.date_dmy_func(index2.BatchDate)}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "120px", textAlign: "right" }}>
                                                    <samp id={`ActualQuantity-${index1.id}-${index2.id}`}>{index2.ActualQuantity}</samp>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "150px" }}>
                                                    <Input type="text"
                                                        disabled={pageMode === 'edit' ? true : false}
                                                        style={{ textAlign: "right" }}
                                                        key={`batchQty${index1.id}-${index2.id}`}
                                                        id={`batchQty${index1.id}-${index2.id}`}
                                                        defaultValue={index2.Qty}
                                                        onChange={(event) => stockQtyOnChange(event, index1, index2)}
                                                    ></Input>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "50px" }}>
                                                    <span id={`stockItemRate-${index1.id}-${index2.id}`}> {index2.Rate}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "50px" }}>
                                                    {index1.MRPValue}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </Tbody>
                        </Table></div>
                </div >
            ),

        },
        {//***************Discount********************************************************************* */
            text: "Discount",
            dataField: "",
            classes: () => ('invoice-discount-row'),
            formatter: (Rate, index1, key) => {
                if (!index1.DiscountType) index1.DiscountType = 2
                if (!index1.Discount) index1.Discount = 0
                return (
                    <>
                        <div className="div-1">
                            <label className="label" >Type</label>
                            <div id="select">
                                <Select
                                    classNamePrefix="select2-selection"
                                    defaultValue={{ value: 2, label: " % " }}
                                    options={[{ value: 1, label: "Rs" },
                                    { value: 2, label: "%" }]}
                                    onChange={(e) => {
                                        index1.DiscountType = e.value
                                        innerStockCaculation(index1)
                                    }}
                                /></div>

                        </div>
                        <div className="div-1">
                            <label className="label">Value</label>
                            <Input
                                className="input"
                                style={{ textAlign: "right" }}
                                type="text" defaultValue={index1.Discount}
                                onChange={(e) => {
                                    if (e.target.value === '') {
                                        e.target.value = 0
                                    }
                                    index1.Discount = e.target.value
                                    innerStockCaculation(index1)
                                }}
                            />
                        </div>
                        <div className="bottom-div">
                            <span>Amount:</span>
                            <samp id={`tAmount-${index1.id}`}>{index1.tAmount}</samp>
                        </div>

                    </>
                )
            },
        },

    ];





    function InvoiceDateOnchange(y, v, e) {
        dispatch(GoButtonForinvoiceAddSuccess([]))
        onChangeDate({ e, v, state, setState })
    };

    function CustomerOnchange(hasSelect,) {

        setState((i) => {
            const v1 = { ...i }
            v1.values.Customer = hasSelect
            v1.hasValid.Customer.valid = true
            return v1
        })
    };










    function goButtonHandler(makeIBInvoice) {
        const btnId = goBtnId;
        _cfunc.btnIsDissablefunc({ btnId, state: true })

        try {
            const jsonBody = JSON.stringify({
                FromDate: values.InvoiceDate,
                Customer: makeIBInvoice ? makeIBInvoice.customer.value : values.Customer.value,
                Party: _cfunc.loginPartyID(),
                OrderIDs: ""
            });
            dispatch(GoButtonForinvoiceAdd({ subPageMode, jsonBody, btnId }));

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    const SaveHandler = async (event) => {

        event.preventDefault();

        const btnId = event.target.id
        _cfunc.btnIsDissablefunc({ btnId, state: true })

        function returnFunc() {
            _cfunc.btnIsDissablefunc({ btnId, state: false })
        }
        try {
            const validMsg = []
            const invoiceItems = []
            let grand_total = 0;

            OrderItemDetails.forEach((index) => {
                if (index.StockInValid) {
                    validMsg.push(`${index.ItemName}:${index.StockInvalidMsg}`);
                    return returnFunc()
                };

                index.StockDetails.forEach((ele) => {

                    if (ele.Qty > 0) {

                        const calculate = discountCalculate(ele, index)

                        grand_total = grand_total + Number(calculate.tAmount)

                        invoiceItems.push({
                            Item: index.Item,
                            Unit: index.default_UnitDropvalue.value,
                            BatchCode: ele.BatchCode,
                            Quantity: ele.Qty,
                            BatchDate: ele.BatchDate,
                            BatchID: ele.id,
                            BaseUnitQuantity: ele.BaseUnitQuantity,
                            LiveBatch: ele.LiveBatche,
                            MRP: ele.LiveBatcheMRPID,
                            MRPValue: ele.MRP,//changes
                            Rate: ele.Rate,
                            BasicAmount: (calculate.discountBaseAmt).toFixed(2),
                            GSTAmount: calculate.gstAmt,
                            GST: ele.LiveBatcheGSTID,
                            GSTPercentage: ele.GST,// changes
                            CGST: calculate.CGST,
                            SGST: calculate.SGST,
                            IGST: 0,
                            GSTPercentage: ele.GST,
                            CGSTPercentage: (ele.GST / 2),
                            SGSTPercentage: (ele.GST / 2),
                            IGSTPercentage: 0,
                            Amount: calculate.tAmount,
                            TaxType: 'GST',
                            DiscountType: index.DiscountType,
                            Discount: index.Discount,
                            DiscountAmount: calculate.disCountAmt,
                        })
                    }
                })
            })

            if (validMsg.length > 0) {
                customAlert({
                    Type: 4,
                    Message: JSON.stringify(validMsg),
                })
                return returnFunc()
            }

            if (!(invoiceItems.length > 0)) {
                customAlert({
                    Type: 4,
                    Message: "Please Enter One Item Quantity",
                })
                return returnFunc()
            }

            const forInvoice_1_json = () => ({  // Json Body Generate For Invoice_1  Start+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                InvoiceDate: values.InvoiceDate,
                InvoiceItems: invoiceItems,
                InvoicesReferences: OrderIDs.map(i => ({ Order: i }))
            });

            const forIB_Invoice_json = async () => ({    //   Json Body Generate For IB_Invoice  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                IBChallanDate: values.InvoiceDate,
                IBChallanItems: invoiceItems,
                IBChallansReferences: await OrderIDs.map(i => ({ Demand: i }))
            });

            const for_common_json = () => ({     //   Json Body Generate Common for Both +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                CustomerGSTTin: '41',
                GrandTotal: Math.round(grand_total),
                RoundOffAmount: (grand_total - Math.trunc(grand_total)).toFixed(2),
                Customer: values.Customer.value,
                Party: _cfunc.loginPartyID(),
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: _cfunc.loginUserID(),
            });


            let jsonBody;  //json body decleration 
            if (subPageMode === url.INVOICE_1) {
                jsonBody = JSON.stringify({ ...for_common_json(), ...forInvoice_1_json() });
            } else if (subPageMode === url.IB_INVOICE) {
                jsonBody = JSON.stringify({ ...for_common_json(), ...forIB_Invoice_json() });
            }
            // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            if (pageMode === mode.edit) {
                returnFunc()
            }

            else {
                dispatch(invoiceSaveAction({ subPageMode, jsonBody, btnId }));
            }
        } catch (e) { returnFunc() }

    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

                    <form noValidate>
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>
                            <Row>
                                <Col className=" mt-1 row  " sm={11} >
                                    <Col sm="6">
                                        <FormGroup className="row mt-2 mb-3  ">
                                            <Label className="mt-1" style={{ width: "150px" }}>{fieldLabel.InvoiceDate} </Label>
                                            <Col sm="7">
                                                <C_DatePicker
                                                    name="InvoiceDate"
                                                    value={values.InvoiceDate}
                                                    id="myInput11"
                                                    disabled={(OrderItemDetails.length > 0 || pageMode === "edit") ? true : false}
                                                    onChange={InvoiceDateOnchange}
                                                />
                                                {isError.InvoiceDate.length > 0 && (
                                                    <span className="invalid-feedback">{isError.InvoiceDate}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        <FormGroup className="row mt-2 mb-3 ">
                                            <Label className="mt-2" style={{ width: "100px" }}> {fieldLabel.Customer} </Label>
                                            <Col sm={7}>
                                                <Select

                                                    name="Customer"
                                                    value={values.Customer}
                                                    isSearchable={true}
                                                    isDisabled={OrderItemDetails.length > 0 ? true : false}
                                                    id={'customerselect'}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={CustomerDropdown_Options}
                                                    onChange={CustomerOnchange}

                                                />
                                                {isError.Customer.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >
                                </Col>

                                <Col sm={1} className="mt-3">
                                    {pageMode === mode.defaultsave ?
                                        (OrderItemDetails.length === 0) ?
                                            < Go_Button onClick={(e) => goButtonHandler()} />
                                            :
                                            <Change_Button onClick={(e) => dispatch(GoButtonForinvoiceAddSuccess([]))} />
                                        : null
                                    }
                                </Col>
                                <Col>
                                </Col>
                            </Row>
                        </Col>



                        <ToolkitProvider
                            keyField={"id"}
                            data={OrderItemDetails}
                            columns={pagesListColumns}

                            search
                        >
                            {(toolkitProps) => (
                                <React.Fragment>
                                    <Row>
                                        <Col xl="12">
                                            <div className="table-responsive">
                                                <BootstrapTable
                                                    id="table_Arrow"
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
                                                />
                                            </div>
                                        </Col>
                                    </Row>

                                </React.Fragment>
                            )}
                        </ToolkitProvider>


                        {OrderItemDetails.length > 0 ? <FormGroup>
                            <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                <SaveButton
                                    pageMode={pageMode}
                                    onClick={SaveHandler}
                                    id={saveBtnid}
                                    userAcc={userPageAccessState}
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

export default Invoice