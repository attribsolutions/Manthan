import { hasDecimalCheckFunc, roundToDecimalPlaces } from "../../../../components/Common/CommonFunction";
import { invoice_discountCalculate_Func } from "../../Invoice/invoiceCaculations";

function hasCheckUnitIs_NOFunc(index1) {
    return index1.default_UnitDropvalue?.Unitlabel === "No";
}


// ************************************************************************
 function stockDistributeFunc(index1) {
    let totalAmount = 0;
    let remainingOrderQty = parseFloat(index1.Quantity); // Convert to a number
    let totalStockQty = 0;



    index1.StockDetails = index1.StockDetails.map(index2 => {
        const stockQty = parseFloat(index2.ActualQuantity); // Convert to a number
        totalStockQty += stockQty;

        const qtyToDeduct = Math.min(remainingOrderQty, stockQty);
        index2.Qty = roundToDecimalPlaces(qtyToDeduct, 3); // Round to three decimal places
        remainingOrderQty = roundToDecimalPlaces((remainingOrderQty - qtyToDeduct), 3); // Round the remaining order quantity

        if (qtyToDeduct > 0) {
            const calculatedItem = invoice_discountCalculate_Func(index2, index1);
            totalAmount += parseFloat(calculatedItem.roundedTotalAmount); // Convert to a number
        }

        try {
            const batchQtyElement = document.getElementById(`batchQty${index1.id}-${index2.id}`);
            batchQtyElement.value = index2.Qty; // Display with three decimal places
        } catch (error) {
            CommonConsole('stockDistributeFunc', error);
        }

        return index2;
    });



    index1.ItemTotalStock = parseFloat(totalStockQty.toFixed(3)); // Convert to a number with three decimal places
    index1.ItemTotalAmount = parseFloat(totalAmount.toFixed(2)); // Convert to a number with two decimal places

    const isUnitIs_NO = hasCheckUnitIs_NOFunc(index1);
    const isQuantityDecimal = hasDecimalCheckFunc(index1.Quantity)



    if (remainingOrderQty > 0) {

        const difference = Math.abs(index1.Quantity - index1.ItemTotalStock);//calculate short stock quantity
        index1.StockInValid = true;
        index1.StockInvalidMsg = `Short Stock Quantity ${difference.toFixed(3)}`;
        stockValidation_DOM_MsgShowFunc(index1)
    }
    else if (isUnitIs_NO && isQuantityDecimal) {

        index1.StockInValid = true;
        index1.StockInvalidMsg = "Stock quantity decimal not allowed.";
        stockValidation_DOM_MsgShowFunc(index1)

    }
    else {

        index1.StockInValid = false;
        index1.StockInvalidMsg = null;
        stockValidation_DOM_MsgShowFunc(index1)


    }

}

 function orderQtyOnChange(event, index1) {

    const hasUnit_NO = hasCheckUnitIs_NOFunc(index1);
    const totalStock = parseFloat(index1.ItemTotalStock); // Convert to a number
    const priviosValue = index1.Quantity;

    let inputValue = event.target.value;
    if (inputValue === '') { }
    else if (hasUnit_NO) {
        if (onlyNumberRegx.test(inputValue)) {
            if (totalStock < inputValue) {
                inputValue = Math.floor(totalStock).toString(); // Show stock quantity without decimals
            }
        } else {
            inputValue = Number(priviosValue).toFixed(0) || ''
        }
    } else {
        if (decimalRegx_3dit.test(inputValue)) {
            if (totalStock < inputValue) {
                inputValue = roundToDecimalPlaces(totalStock, 3); // Show stock quantity with up to 3 decimals
            }
        } else {
            inputValue = priviosValue
        }
    }

    event.target.value = inputValue;
    index1.Quantity = inputValue
    // stockDistributeFunc(index1)
}
// ************************************************************************

export default {
    orderQtyOnChange ,
    stockDistributeFunc,
}
