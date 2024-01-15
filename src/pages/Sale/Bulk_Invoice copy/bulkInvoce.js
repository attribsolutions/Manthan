import React from 'react';
import { useBulkInvoiceContext } from './dataProvider';
import OrderTable from "./orderTable/index"
import { balkInvoiceAllOrderAmountFunc, itemAmounWithGst, settingBaseRoundOffOrderAmountFunc } from './util/calculationFunc';
import { useEffect } from 'react';
import { BreadcrumbShowCountlabel } from '../../../store/actions';
import { useDispatch } from 'react-redux';


const Invoice = ({ }) => {

  const dispatch = useDispatch();
  const { bulkData = [], globleStockDistribute, globleItemStock } = useBulkInvoiceContext();

  useEffect(() => {
    const { sumOfInvoiceTotal } = balkInvoiceAllOrderAmountFunc({
      IsTCSParty: false,
      IsCustomerPAN: false,
      bulkInvoceInfo: globleStockDistribute
    });
    const dataCount = bulkData.length;

    dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} ₹ ${sumOfInvoiceTotal}`))

  }, [globleStockDistribute, bulkData]);

  const savehandle = () => {
    const newGlobleItemStock = JSON.parse(JSON.stringify(globleItemStock));
    const newGlobleStockDistribute = JSON.parse(JSON.stringify(globleStockDistribute));
    const bulkInvoiceJsonBody = []

    for (const [orderId, orderInfo] of Object.entries(newGlobleStockDistribute)) {

      // const { sumOfGrandTotal, RoundOffAmount, TCS_Amount, orderItemsCalculations } = settingBaseRoundOffOrderAmountFunc({
      //   IsTCSParty: false,
      //   IsCustomerPAN: false,
      //   orderInfo
      // })

      for (const [itemId, itemInfo] of Object.entries(orderInfo)) {

        for (const [sockId, stockInfo] of Object.entries(itemInfo)) {
          const calculate = itemAmounWithGst({});

          const orderInvoiceItems = {
            "Item": itemInfo.Item,
            "Unit": itemInfo.unitid,
            "BatchCode": stockInfo.BatchCode,
            "Quantity": stockInfo.distribute.toFixed(3),
            "BatchDate": '',
            "BatchID": sockId,
            "BaseUnitQuantity": "Number(ele.BaseUnitQuantity).toFixed(3)",
            "PreviousInvoiceBaseUnitQuantity": "Number(ele.BaseUnitQuantity).toFixed(3)",

            "LiveBatch": "ele.LiveBatche",
            "MRP": "ele.LiveBatcheMRPID",
            "MRPValue": "ele.MRP",//changes
            "Rate": itemInfo.rate.toFixed(2),

            "GST": "ele.LiveBatcheGSTID",
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
            "DiscountType": itemId.DiscountType,
            "Discount": Number(itemId.Discount) || 0,
            "DiscountAmount": Number(calculate.disCountAmt).toFixed(2),
          };
          orderJsonBody.InvoiceItems.push(orderInvoiceItems)
        }

      }




    }
    const orderJsonBody = {
      CustomerGSTTin: "values.Customer.GSTIN",
      GrandTotal: '',//sumOfGrandTotal,
      RoundOffAmount:'',// RoundOffAmount,
      TCSAmount:'',// TCS_Amount,
      Customer: "values.Customer.value",
      Vehicle: '', //values.VehicleNo.value ? values.VehicleNo.value : "",
      Party: 1,// commonPartyDropSelect.value,
      CreatedBy: 1,// _cfunc.loginUserID(),
      UpdatedBy: 1,// _cfunc.loginUserID(),
      InvoiceItems: []
    };

  }



  return (
    <div>
      {bulkData.map((order, index) => (
        <OrderTable
          key={index}
          order={order}
        />
      ))}
    </div>
  );
};


export default React.memo(Invoice);
