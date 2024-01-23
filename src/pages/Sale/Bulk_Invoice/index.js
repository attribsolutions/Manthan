import React, { useCallback, useEffect, useState, } from "react";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as mode from "../../../routes/PageMode";
import * as url from "../../../routes/route_url"
import {
    Uploaded_EInvoiceAction,
} from "../../../store/Sales/Invoice/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as _cfunc from "../../../components/Common/CommonFunction";

// import bulkdata from './data2'
import BulkInvoce from "./allOrderTable";
import { BulkInvoiceProvider } from "./dataProvider";
import { useMemo } from "react";
import { itemAmounWithGst, settingBaseRoundOffOrderAmountFunc } from "./util/calculationFunc";
import { saveBulkInvoiceAction, saveBulkInvoiceActionSuccess } from "../../../store/Sales/bulkInvoice/action";

const Bulk_Invoice2 = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const {
        postMsg,
        saveBtnloading,
        userAccess,
        ordersBulkInvoiceData,
        commonPartyDropSelect,
    } = useSelector((state) => ({
        postMsg: state.BulkInvoiceReducer.postMsg,
        saveBtnloading: state.BulkInvoiceReducer.saveBtnloading,
        userAccess: state.Login.RoleAccessUpdateData,
        ordersBulkInvoiceData: state.BulkInvoiceReducer.ordersBulkInvoiceData,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect,
    }));


    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = history.location.pathname;

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess]);

    const bulkdata = useMemo(() => {
        if (ordersBulkInvoiceData.Data) {
            return ordersBulkInvoiceData.Data
        }
        return []
    }, ordersBulkInvoiceData)

    useEffect(async () => {
        if (postMsg.Status === true && postMsg.StatusCode === 200) {
            dispatch(saveBulkInvoiceActionSuccess({ Status: false })); // Reset the status to false
            // ***************** Upload E-Invoice if AutoEInvoice and EInvoiceApplicable are both "1"  *****/
            try {
                const systemSetting = _cfunc.loginSystemSetting();
                if (systemSetting.AutoEInvoice === "1" && systemSetting.EInvoiceApplicable === "1") {
                    for (const tranasactionId of postMsg.TransactionID) {//multiple  transcation ids (comma separate)
                        const config = {
                            RowId: tranasactionId,//for Invoice-Upload
                            UserID: _cfunc.loginUserID(),//for Invoice-Upload
                        };
                        dispatch(Uploaded_EInvoiceAction(config));
                    }
                }
            } catch (error) { }

            customAlert({
                Type: 1,
                Message: postMsg.Message,
            });

            history.push({
                pathname: url.INVOICE_LIST_1,
                updatedRowBlinkId: postMsg.TransactionID.join(', ')
            });

        } else if (postMsg.Status === true) {
            // Show error alert message with the JSON stringified postMsg.Message
            dispatch(saveBulkInvoiceActionSuccess({ Status: false })); // Reset the status to false
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            });
        }
    }, [postMsg]);

    const saveHandleCallBack = useCallback(
        (bulkData) => {
            const newBulkData = JSON.parse(JSON.stringify(bulkData));
            const loginPartyGstIn = _cfunc.loginUserGSTIN();
            const bulkInvoiceJsonBody = [];
            const validMsg = [];

            for (const orderInfo of newBulkData) {

                const orderId = orderInfo.OrderIDs;
                const orderNumber = orderInfo.OrderNumber;
                const customerId = orderInfo.CustomerID;
                const IsTCSParty = orderInfo.IsTCSParty;
                const IsCustomerPAN = orderInfo.IsTCSParty;
                const IsComparGstIn = { GSTIn_1: orderInfo.CustomerGSTIN, GSTIn_2: loginPartyGstIn };
                const orderIncoiceItems = [];
                let sumOfItemAmount = 0;

                for (const itemInfo of orderInfo.OrderItemDetails) {

                    let isSameMRPinStock = '';

                    if (itemInfo.lessStock) {//** */ if Short Short validation check  */
                        validMsg.push({ [itemInfo.ItemName]: `Short Short Quantity ${itemInfo.lessStock} ${itemInfo.UnitName?.split(" ")[0]}` })
                    };

                    for (const stockInfo of itemInfo.StockDetails) {

                        if (isSameMRPinStock === "" || isSameMRPinStock === parseFloat(stockInfo.MRP)) {
                            isSameMRPinStock = parseFloat(stockInfo.MRP);
                        } else {
                            validMsg.push({ [`Order Number ${orderNumber}  (${itemInfo.ItemName})`]: "Multiple MRP’S Invoice not allowed." });
                        }
                        if (!Number(stockInfo.Rate) > 0) {//** */ rate validation check  */
                            validMsg.push({ [itemInfo.ItemName]: " Rate not available." })
                        };

                        if (stockInfo.distribute > 0) {

                            const calculate = itemAmounWithGst({
                                Rate: stockInfo.Rate,
                                modifiedQuantity: stockInfo.distribute,
                                GSTPercentage: stockInfo.GST,
                                Discount: itemInfo.Discount,
                                DiscountType: itemInfo.DiscountType,
                                IsComparGstIn: IsComparGstIn
                            });

                            const orderInvoiceItems = {
                                "Item": itemInfo.Item,
                                "Unit": itemInfo.Unit,
                                "BatchCode": stockInfo.BatchCode,
                                "Quantity": Number(stockInfo.distribute.toFixed(3)),
                                "BatchDate": stockInfo.BatchDate,
                                "BatchID": stockInfo.id,
                                "BaseUnitQuantity": Number(stockInfo.BaseUnitQuantity).toFixed(3),
                                "PreviousInvoiceBaseUnitQuantity": Number(stockInfo.BaseUnitQuantity).toFixed(3),

                                "LiveBatch": stockInfo.LiveBatche,
                                "MRP": stockInfo.LiveBatcheMRPID,
                                "MRPValue": stockInfo.MRP,//changes
                                "Rate": Number(stockInfo.Rate).toFixed(2),

                                "GST": stockInfo.LiveBatcheGSTID,
                                "CGST": Number(calculate.CGST_Amount).toFixed(2),
                                "SGST": Number(calculate.SGST_Amount).toFixed(2),
                                "IGST": Number(calculate.IGST_Amount).toFixed(2),

                                "GSTPercentage": calculate.GST_Percentage,
                                "CGSTPercentage": calculate.CGST_Percentage,
                                "SGSTPercentage": calculate.SGST_Percentage,
                                "IGSTPercentage": calculate.IGST_Percentage,

                                "BasicAmount": Number(calculate.discountBaseAmt).toFixed(2),
                                "GSTAmount": Number(calculate.roundedGstAmount).toFixed(2),
                                "Amount": Number(calculate.roundedTotalAmount).toFixed(2),

                                "TaxType": 'GST',
                                "DiscountType": itemInfo.DiscountType.value,
                                "Discount": Number(itemInfo.Discount) || 0,
                                "DiscountAmount": Number(calculate.disCountAmt).toFixed(2),
                            };

                            sumOfItemAmount += calculate.roundedTotalAmount;
                            orderIncoiceItems.push(orderInvoiceItems)
                        }
                    }
                }

                const orderCalculate = settingBaseRoundOffOrderAmountFunc({ IsTCSParty, IsCustomerPAN, sumOfItemAmount, })

                const orderInvoiceJsonBody = {
                    InvoiceDate: _cfunc.date_ymd_func(),
                    InvoicesReferences: [{ Order: orderId }],
                    CustomerGSTTin: IsComparGstIn.GSTIn_2,
                    GrandTotal: orderCalculate.sumOfItemAmount,
                    RoundOffAmount: orderCalculate.RoundOffAmount,
                    TCSAmount: orderCalculate.TCS_Amount,
                    Customer: customerId,
                    Vehicle: '',
                    Party: commonPartyDropSelect.value,
                    CreatedBy: _cfunc.loginUserID(),
                    UpdatedBy: _cfunc.loginUserID(),
                    InvoiceItems: orderIncoiceItems//order items stock wise enterys
                };

                orderIncoiceItems.length > 0 && bulkInvoiceJsonBody.push(orderInvoiceJsonBody)
            }
            const jsonBody = JSON.stringify({ InvoiceData: bulkInvoiceJsonBody })

            if (validMsg.length > 0) {
                customAlert({
                    Type: 4,
                    Message: validMsg,
                })
                return
            }


            if (!(bulkInvoiceJsonBody.length > 0)) {
                customAlert({
                    Type: 4,
                    Message: "Please Enter One Item Quantity",
                })
                return
            }
            console.log(jsonBody)
            dispatch(saveBulkInvoiceAction({ jsonBody: jsonBody }))

        }, [])

    if (userPageAccessState === '') {
        return null //if roll access absent for this page then  not vissile 
    };
    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content" >
                <BulkInvoiceProvider data={bulkdata}>
                    <BulkInvoce
                        saveHandleCallBack={saveHandleCallBack}
                        saveBtnloading={saveBtnloading}
                        userPageAccessState={userPageAccessState}
                        pageMode={pageMode}
                    />
                </BulkInvoiceProvider>
            </div>

        </React.Fragment >
    );
};

export default Bulk_Invoice2