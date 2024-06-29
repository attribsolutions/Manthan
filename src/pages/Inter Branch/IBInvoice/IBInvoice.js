
import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, GoButtonForChallanAddSuccess, commonPageFieldSuccess, getpdfReportdata, makeGRN_Mode_1ActionSuccess, saveChallan_ChallanAdd, saveChallan_ChallanAddSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeDate,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { SaveButton } from "../../../components/Common/CommonButton";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"

import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import {
    invoice_discountCalculate_Func,
    orderQtyOnChange,
    orderQtyUnit_SelectOnchange,
    stockQtyOnChange,
    settingBaseRoundOffAmountFunc,
    ChallanCalculateFunc
} from "./IBInvoiceCalculation";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_DatePicker } from "../../../CustomValidateForm";

import GlobalCustomTable from "../../../GlobalCustomTable";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { CheckStockEntryForFirstTransaction, CheckStockEntryForFirstTransactionSuccess, CheckStockEntryforBackDatedTransaction, CheckStockEntryforBackDatedTransactionSuccess } from "../../../store/Inventory/StockEntryRedux/action";

const IBInvoice = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const subPageMode = history.location.pathname

    const saveBtnid = `saveBtn${subPageMode}`

    const fileds = {
        ChallanDate: currentDate_ymd,
        Customer: "",
        VehicleNo: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [orderItemDetails, setOrderItemDetails] = useState([])
    const [customerID, setCustomerID] = useState([]);

    const [Demand_ID, setDemandID] = useState({ Demand_ID: "" });

    const [tableData, setTableData] = useState([]);

    // for invoice page heder discount functionality useSate ************************************


    // ****************************************************************************

    const [modalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const {
        postMsg,
        pageField,
        userAccess,
        saveBtnloading,
        saveAndPdfBtnLoading,
        commonPartyDropSelect,
        StockEnteryForFirstYear,
        GRNitem,
    } = useSelector((state) => ({
        postMsg: state.ChallanReducer.postMsg,


        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        customer: state.CommonAPI_Reducer.customer,

        saveBtnloading: state.InvoiceReducer.saveBtnloading,
        saveAndPdfBtnLoading: state.InvoiceReducer.saveAndPdfBtnLoading,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect,
        StockEnteryForFirstYear: state.StockEntryReducer.StockEnteryForFirstYear,
        GRNitem: state.GRNReducer.GRNitem,
    }));

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty("editValue")

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;




    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.CHALLAN))
        dispatch(GoButtonForChallanAddSuccess([]))
        dispatch(makeGRN_Mode_1ActionSuccess({ Status: false }))
        dispatch(saveChallan_ChallanAddSuccess({ Status: false }))
    }, [])



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
        if (GRNitem.Status === true && GRNitem.StatusCode === 200) {
            debugger
            const { DemandItemDetails } = GRNitem.Data
            setCustomerID({ value: GRNitem.Demand_Reference[0].CustomerID, label: GRNitem.Demand_Reference[0].CustomerName })
            setDemandID({ Demand_ID: Number(GRNitem.Data.DemandIDs) })

            const Updated_DemandDetails = DemandItemDetails.map((inx_1, key_1) => {

                const isUnitIDPresent = inx_1.UnitDetails.find(findEle => findEle.UnitID === inx_1.Unit);
                const isMCunitID = inx_1.UnitDetails.find(findEle => findEle.DeletedMCUnitsUnitID === inx_1.DeletedMCUnitsUnitID);
                const defaultunit = isUnitIDPresent !== undefined ? isUnitIDPresent : isMCunitID;

                let totalStockQty = 0;
                let remainingOrderQty = parseFloat(inx_1.Quantity); // Convert to a number
                let totalAmount = 0;
                inx_1.StockInValid = false;
                inx_1.StockInvalidMsg = '';


                inx_1.default_UnitDropvalue = {//initialize
                    value: inx_1.Unit,
                    label: inx_1.UnitName,
                    ConversionUnit: '1',
                    Unitlabel: inx_1.UnitName,
                    BaseUnitQuantity: defaultunit.BaseUnitQuantity,
                    BaseUnitQuantityNoUnit: defaultunit.BaseUnitQuantityNoUnit,
                };

                inx_1.InpStockQtyTotal = `${Number(inx_1.Quantity) * Number(inx_1.ConversionUnit)}`;

                inx_1.StockDetails = inx_1.StockDetails.map((inx_2, key_2) => {
                    inx_2.initialRate = inx_2.Rate;

                    const _hasRate = ((defaultunit.BaseUnitQuantity / defaultunit.BaseUnitQuantityNoUnit) * inx_2.initialRate);
                    const _hasActualQuantity = (inx_2.BaseUnitQuantity / defaultunit.BaseUnitQuantity);


                    inx_2.Rate = _cfunc.roundToDecimalPlaces(_hasRate, 2);//max 2 decimal  //initialize
                    inx_2.ActualQuantity = _cfunc.roundToDecimalPlaces(_hasActualQuantity, 3);//max 3 decimal  //initialize

                    const stockQty = parseFloat(inx_2.ActualQuantity); // Convert to a number
                    totalStockQty += stockQty
                    const qtyToDeduct = Math.min(remainingOrderQty, stockQty);
                    inx_2.Qty = _cfunc.roundToDecimalPlaces(qtyToDeduct, 3); // Round to three decimal places
                    remainingOrderQty = _cfunc.roundToDecimalPlaces(remainingOrderQty - qtyToDeduct, 3); // Round the remaining order quantity



                    if (qtyToDeduct > 0) {// Calculate total amount if quantity is greater than 0
                        const calculatedItem = invoice_discountCalculate_Func(inx_2, inx_1);
                        totalAmount += parseFloat(calculatedItem.roundedTotalAmount); // Convert to a number
                    }
                    inx_2.id = key_2;
                    return inx_2;
                })
                inx_1.ItemTotalStock = _cfunc.roundToDecimalPlaces(totalStockQty, 3); //max 3 decimal
                inx_1.ItemTotalAmount = _cfunc.roundToDecimalPlaces(totalAmount, 2); //max 2 decimal
                inx_1.id = key_1; //max 2 decimal


                if (inx_1.ItemTotalStock < inx_1.Quantity) {
                    inx_1.StockInValid = true;
                    const diffrence = Math.abs(inx_1.ItemTotalStock - inx_1.Quantity);
                    const msg1 = `Short Stock Quantity ${inx_1.Quantity}`;
                    const msg2 = `Short Stock Quantity ${diffrence}`;
                    inx_1.StockInvalidMsg = inx_1.ItemTotalStock === 0 ? msg1 : msg2;
                }

                return inx_1;
            })

            totalAmountCalcuationFunc(Updated_DemandDetails)
            setTableData(Updated_DemandDetails)

        }
    }, [GRNitem])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveChallan_ChallanAddSuccess({ Status: false }))
            setTableData([]);
            if (pageMode === mode.dropdownAdd) {
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
                    history.push({ pathname: url.CHALLAN_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveChallan_ChallanAddSuccess({ Status: false }))
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

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [orderItemDetails]);


    const pagesListColumns = [
        {//***************ItemName********************************************************************* */
            text: "Item Name",
            dataField: "ItemName",
            attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "ItemName", "sticky-col": "true" }),
            // headerClasses: 'd-none d-sm-table-cell', // Hide on mobile
            formatter: (cellContent, index1) => {

                return (
                    <>
                        <div>
                            <samp className="theme-font"
                                id={`ItemName${index1.id}`}>{index1.ItemName}</samp>
                        </div>
                        <div style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            width: "100%", // Set the width to the desired container width
                        }}>
                            <samp id={`StockInvalidMsg-${index1.id}`}
                                style={{
                                    display: index1.StockInValid ? "block" : "none",
                                    color: "red",
                                    animation: "scrollRightToLeft 15s linear infinite",
                                }}>
                                {index1.StockInvalidMsg}
                            </samp>
                        </div>
                    </>
                )
            },
        },
        {//***************Quantity********************************************************************* */
            text: "Quantity/Unit",
            dataField: "",
            formatExtraData: { tableList: tableData },
            attrs: () => ({ 'data-label': "Quantity/Unit" }),
            formatter: (cellContent, index1, keys_, { tableList = [] }) => {
                debugger
                return (<>
                    <div>
                        <Input
                            type="text"

                            id={`OrderQty-${index1.id}`}
                            placeholder="Enter quantity"
                            className="right-aligned-placeholder mb-1"
                            style={{
                                border: index1.StockInValid ? '2px solid red' : "1px solid #ced4da"
                            }}
                            key={`OrderQty-${index1.id}`}
                            autoComplete="off"
                            defaultValue={index1.Quantity}
                            onChange={(event) => {
                                orderQtyOnChange(event, index1,);
                                totalAmountCalcuationFunc(tableList);
                            }}
                        />
                    </div>
                    <div>
                        <div id="select">
                            <Select
                                classNamePrefix="select2-selection"
                                id={"ddlUnit"}
                                isDisabled={pageMode === mode.edit && true}
                                defaultValue={index1.default_UnitDropvalue}
                                options={index1.UnitDetails.map(i => ({
                                    "label": i.UnitName,
                                    "value": i.UnitID,
                                    "ConversionUnit": i.ConversionUnit,
                                    "Unitlabel": i.UnitName,
                                    "BaseUnitQuantity": i.BaseUnitQuantity,
                                    "BaseUnitQuantityNoUnit": i.BaseUnitQuantityNoUnit,
                                }))}
                                onChange={(event) => {
                                    orderQtyUnit_SelectOnchange(event, index1);
                                    totalAmountCalcuationFunc(tableList);
                                }}
                            ></Select>
                        </div>
                    </div>
                    <div className="theme-font">
                        <span className="text-muted">PO-Qty :</span>
                        <samp>{index1.BaseUnitQuantity}</samp>&nbsp;&nbsp;
                        <samp>{index1.UnitName}</samp>
                    </div>
                    <div>
                        <samp className="theme-font text-muted" >Available stock :</samp>
                        <label className="text-black">{_cfunc.roundToDecimalPlaces(index1.ItemTotalStock, 3)}</label>
                    </div>
                </>
                )
            },
        },
        {//***************StockDetails********************************************************************* */
            text: "Stock Details",
            dataField: "StockDetails",
            attrs: () => ({ 'data-label1': "Stock Details", "stock-header": "true" }),
            headerStyle: { zIndex: "2" },
            formatExtraData: { tableList: tableData },
            formatter: (cellContent, index1, keys_, { tableList = [] }) => {

                return (
                    <div className="table-responsive">
                        <table className="custom-table ">
                            <thead >
                                <tr>
                                    <th>BatchCode</th>
                                    <th>Stock </th>
                                    <th>Quantity</th>
                                    <th>Basic Rate</th>
                                    <th>MRP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cellContent.map((index2) => (
                                    <tr key={index1.id}>
                                        <td data-label="BatchCode">{index2.BatchCode}</td>
                                        <td data-label="Stock Quantity" style={{ textAlign: "right" }} >
                                            <samp id={`ActualQuantity-${index1.id}-${index2.id}`}>{index2.BaseUnitQuantity}</samp>
                                        </td>
                                        <td data-label='Quantity'>
                                            <Input
                                                type="text"
                                                placeholder="Manually enter quantity"
                                                className="right-aligned-placeholder"
                                                key={`batchQty${index1.id}-${index2.id}`}
                                                id={`batchQty${index1.id}-${index2.id}`}
                                                value={index2.Qty}
                                                onChange={(event) => {
                                                    stockQtyOnChange(event, index1, index2);
                                                    totalAmountCalcuationFunc(tableList);
                                                }}
                                            />
                                        </td>
                                        <td data-label='Basic Rate' style={{ textAlign: "right" }}>
                                            <span id={`stockItemRate-${index1.id}-${index2.id}`}>{_cfunc.amountCommaSeparateFunc(index2.Rate)}</span>
                                        </td>
                                        <td data-label='MRP' style={{ textAlign: "right" }}>{_cfunc.amountCommaSeparateFunc(_cfunc.roundToDecimalPlaces(index1.MRP, 2))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            },
        },
        ,
    ];

    const totalAmountCalcuationFunc = (tableList = []) => {

        const calcalateGrandTotal = settingBaseRoundOffAmountFunc(tableList)
        const dataCount = tableList.length;
        const commaSeparateAmount = _cfunc.amountCommaSeparateFunc(Number(calcalateGrandTotal.sumOfGrandTotal));

        dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} ₹ ${commaSeparateAmount}`))

    }

    useEffect(() => {
        const jsonBody = JSON.stringify({
            "FromDate": values.ChallanDate,
            "PartyID": commonPartyDropSelect.value
        });

        const jsonBodyForBackdatedTransaction = JSON.stringify({
            "TransactionDate": values.ChallanDate,
            "PartyID": commonPartyDropSelect.value,

        });

        if (commonPartyDropSelect.value > 0) {
            dispatch(CheckStockEntryForFirstTransaction({ jsonBody }))
            dispatch(CheckStockEntryforBackDatedTransaction({ jsonBody: jsonBodyForBackdatedTransaction }))

        }
    }, [values.ChallanDate, commonPartyDropSelect.value])



    useEffect(() => {
        if (StockEnteryForFirstYear.Status === true && StockEnteryForFirstYear.StatusCode === 400) {
            dispatch(CheckStockEntryForFirstTransactionSuccess({ status: false }))
            customAlert({
                Type: 3,
                Message: JSON.stringify(StockEnteryForFirstYear.Message),
            })
        }
    }, [StockEnteryForFirstYear])




    function ChallanDateOnchange(y, v, e) {
        onChangeDate({ e, v, state, setState })
    };



    const saveHandeller = (e,) => {
        const itemArr = []
        let grand_total = 0;

        tableData.forEach(tableIndex => {

            tableIndex.StockDetails.forEach(stockIndex => {
                if ((Number(stockIndex.Qty) > 0)) {


                    const calculate = ChallanCalculateFunc(stockIndex); // amount calculation function

                    grand_total += Number(calculate.roundedTotalAmount);
                    const arr = {
                        Item: tableIndex.Item,
                        Quantity: stockIndex.Qty,
                        Unit: tableIndex.default_UnitDropvalue.value, // Updated to correctly access unit
                        BaseUnitQuantity: stockIndex.BaseUnitQuantity,
                        Rate: stockIndex.Rate,
                        BasicAmount: calculate.basicAmount,
                        TaxType: "GST",
                        GST: tableIndex.GST,
                        GSTPercentage: stockIndex.GSTPercentage,
                        HSNCode: stockIndex.HSNCode,
                        GSTAmount: calculate.roundedGstAmount,
                        Amount: calculate.roundedTotalAmount,
                        DiscountType: "0",
                        Discount: "0.00",
                        DiscountAmount: "0.00",
                        CGST: calculate.CGST_Amount,
                        SGST: calculate.SGST_Amount,
                        IGST: "0.00",
                        CGSTPercentage: (tableIndex.CGSTPercentage / 2).toFixed(2),
                        SGSTPercentage: (tableIndex.SGSTPercentage / 2).toFixed(2),
                        IGSTPercentage: "0.00",
                        BatchDate: stockIndex.BatchDate,
                        BatchCode: stockIndex.BatchCode,
                        SystemBatchDate: stockIndex.SystemBatchDate,
                        SystemBatchCode: stockIndex.SystemBatchCode,
                        BatchID: stockIndex.LiveBatche_id
                    };
                    if (parseFloat(tableIndex.Quantity) > 0) {
                        itemArr.push(arr);
                    }
                }
            });

        });

        if (itemArr.length === 0) {
            customAlert({
                Type: 3,
                Message: alertMessages.itemQtyIsRequired
            })
            return;
        }
        else {
            const jsonBody = JSON.stringify({
                ChallansReferences: [{ Demands: Demand_ID.Demand_ID }],
                Demand_ID: Demand_ID.Demand_ID,
                ChallanDate: values.ChallanDate,
                Party: _cfunc.loginSelectedPartyID(),
                GrandTotal: grand_total,
                Customer: customerID.value,
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: _cfunc.loginUserID(),
                RoundOffAmount: Math.round(grand_total),
                ChallanItems: itemArr,

            });

            dispatch(saveChallan_ChallanAdd(jsonBody))
        }
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

                    <form noValidate>
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>

                            <div className="row" >
                                <Col sm="4" className="">
                                    <FormGroup className="mb- row mt-2 " >
                                        <Label className="col-sm-8 p-2" style={{ width: "130px" }}>IB Invoice Date</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name="ChallanDate"
                                                value={values.ChallanDate}
                                                id="myInput11"
                                                disabled={(orderItemDetails.length > 0 || pageMode === "edit") ? true : false}
                                                onChange={ChallanDateOnchange}
                                            />
                                            {isError.ChallanDate.length > 0 && (
                                                <span className="invalid-feedback">{isError.ChallanDate}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>




                            </div>
                        </Col>
                        <div className="mb-1">
                            <GlobalCustomTable
                                keyField={"id"}
                                data={tableData}
                                columns={pagesListColumns}
                                id="table_Arrow"
                                noDataIndication={
                                    <div className="text-danger text-center ">
                                        Items Not available
                                    </div>
                                }
                                onDataSizeChange={(e) => {
                                    _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                }}
                            />
                        </div>
                        {(tableData.length > 0) &&
                            <SaveButtonDraggable>
                                <SaveButton
                                    loading={saveBtnloading}
                                    id={saveBtnid}
                                    pageMode={pageMode}
                                    userAcc={userPageAccessState}
                                    onClick={saveHandeller}
                                    forceDisabled={saveAndPdfBtnLoading || !StockEnteryForFirstYear.Data}
                                />

                            </SaveButtonDraggable>
                        }
                    </form>
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

export default IBInvoice

































