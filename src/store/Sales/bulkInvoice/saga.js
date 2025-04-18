import { call, put, takeLatest } from "redux-saga/effects";

import { Invoice_1_GoButton_API, Invoice_1_Save_API, } from "../../../helpers/backend_helper";
import { getOrdersMakeInvoiceDataActionSuccess, bulkInvoiceApiErrorAction, saveBulkInvoiceActionSuccess, } from "./action";
import { GET_ORDERS_MAKE_INVICE_DATA_ACTION, SAVE_BULK_INVOICE_ACTION, } from "./actionType";
import { url } from "../../../routes";
import { GoButtonForinvoiceAddSuccess } from "../Invoice/action";
import { getFixedNumber } from "../../../components/Common/CommonFunction";
import { invoice_GoButton_dataConversion_Func } from "../Invoice/saga";




function* makeBulKInvoice_button_genFunc({ config }) {
  try {


    let response = yield call(Invoice_1_GoButton_API, config); // GO-Botton SO-invoice Add Page API
    response["subPageMode"] = config.subPageMode;
    response["path"] = config.path;
    if (config.subPageMode === url.ORDER_LIST_4) {

      const CustomerDetails = {
        OrderIDs: response.Data.map(inx => inx.OrderIDs).join(','),
        OrderDate: response.Data[0]?.OrderDate,
        label: response.Data[0]?.CustomerName,
        IsTCSParty: response.Data[0]?.IsTCSParty,
        CustomerPAN: response.Data[0]?.CustomerPAN,
        CustomerGSTIN: response.Data[0]?.CustomerGSTIN,
        value: response.Data[0]?.CustomerID,
        OrderNumber: response.Data[0]?.OrderNumber,
        AdvanceAmount: response.Data.reduce((sum, obj) => sum + getFixedNumber(obj.AdvanceAmount, 3), 0),
      }



      const Item_Details = response.Data.flatMap(obj => obj.OrderItemDetails)



      const groupedItems = Item_Details.reduce((accumulator, currentItem) => {

        const { Amount, BaseUnitQuantity, BasicAmount,
          CGST, CGSTPercentage, ConversionUnit, DeletedMCUnitsUnitID, Discount,
          DiscountType, GST, GSTAmount, GSTPercentage, HSNCode, IGST, IGSTPercentage,
          Item, ItemName, MRP, MRPValue, MUnitID, Margin, MarginValue, Quantity, Rate,
          SGST, SGSTPercentage, StockDetails, Unit, UnitDetails, UnitName, Weightage, id
        } = currentItem;
        debugger

        const key = ItemName;
        if (accumulator[key]) {
          accumulator[key].Discount += Number(Discount);
          accumulator[key].BaseUnitQuantity += Number(BaseUnitQuantity);
          accumulator[key].Quantity += Number(Quantity);
          accumulator[key].BasicAmount += Number(BasicAmount);
          accumulator[key].CGST += Number(CGST);
          accumulator[key].IGST += Number(IGST);
          accumulator[key].SGST += Number(SGST);
          accumulator[key].Amount += Number(Amount);

        } else {
          accumulator[key] = {
            ...currentItem,
            Discount: Number(Discount),
            CGST: Number(CGST), SGST: Number(SGST),
            IGST: Number(IGST),
            Amount: Number(Amount),
            BasicAmount: Number(BasicAmount), Quantity: Number(Quantity),
            BaseUnitQuantity: Number(BaseUnitQuantity),
          };
        }
        return accumulator;
      }, {});
      const OrderItem_Details = Object.values(groupedItems);


      debugger














      const NewResponse = {
        ...CustomerDetails,
        OrderItemDetails: OrderItem_Details


      };

      response["customer"] = CustomerDetails;
      response["Data"] = NewResponse;

      response = invoice_GoButton_dataConversion_Func(response, CustomerDetails)

      yield put(GoButtonForinvoiceAddSuccess(response));


    } else {

      yield put(getOrdersMakeInvoiceDataActionSuccess(response));

    }


  } catch (error) {
    yield put(bulkInvoiceApiErrorAction())
  }
}
function* saveBulKInvoice_genFunc({ config }) {
  try {
    const response = yield call(Invoice_1_Save_API, config);
    yield put(saveBulkInvoiceActionSuccess(response));

  } catch (error) {
    yield put(bulkInvoiceApiErrorAction())
  }
}

function* BulkInvoiceSaga() {
  yield takeLatest(GET_ORDERS_MAKE_INVICE_DATA_ACTION, makeBulKInvoice_button_genFunc);
  yield takeLatest(SAVE_BULK_INVOICE_ACTION, saveBulKInvoice_genFunc);

}

export default BulkInvoiceSaga;




