import { amountCommaSeparateFunc, CommonConsole, loginUserName, roundToDecimalPlaces } from "../../../components/Common/CommonFunction";
import SERVER_HOST_PATH from "../../../helpers/_serverPath";

export const postWithBasicAuth = async ({
    jsonBody,
    btnId = null,
    OrderID,
    APIName
}) => {
    // Get username and password for basic authentication
    const username = loginUserName();
    const password = localStorage.getItem("Password");
    const authHeader = 'Basic ' + window.btoa(`${username}:${password}`);

    // Configure headers
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", authHeader);

    // Set up request options
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: typeof jsonBody === "string" ? jsonBody : JSON.stringify(jsonBody), // Convert body to string if necessary
        redirect: "follow",
    };

    try {
        // Make the POST request
        const response = await fetch(`${SERVER_HOST_PATH}${APIName}`, requestOptions);
        const jsonData = await response.json();

        // Add additional processing for specific cases
        if (btnId === "print") {
            jsonData["saveAndDownloadPdfMode"] = true;
        }
        if (jsonData.TransactionID && Array.isArray(jsonData.TransactionID)) {
            jsonData["TransactionID"] = jsonData.TransactionID[0];
            jsonData["OrderID"] = OrderID
        }

        return jsonData;
    } catch (error) {
        console.error("Error in POST request:", error);
        throw error;
    }
};

export function orderQtyOnChange(event, index1) {

    let inputValue = event.target.value;

    event.target.value = inputValue;
    index1.Quantity = inputValue
    index1.StockDetails.forEach(index2 => {
        index2.Qty = inputValue
        Franchies_invoice_Calculate_Func(index2, index1);
    })
}

export function orderQtyUnit_SelectOnchange(event, index1) {

    index1.default_UnitDropvalue = event;
    index1.ConversionUnit = event.ConversionUnit;

    index1.StockDetails.forEach(index2 => {

        const _hasRate = ((event.BaseUnitQuantity / event.BaseUnitQuantityNoUnit) * index1.Rate);
        index2.Rate = roundToDecimalPlaces(_hasRate, 2);//max 2 decimal 
        document.getElementById(`stockItemRate-${index1.id}`).innerText = amountCommaSeparateFunc(index2.Rate);
        Franchies_invoice_Calculate_Func(index2, index1);
    })
};


export function RoundCalculationFunc(data) {

    const NetAmount = data.reduce((sum, item) => sum + item.Amount, 0); // Ensure 2 decimal places
    const DiscountTotalAmount = data.reduce((sum, item) => sum + parseFloat(item.DiscountAmount || 0), 0); // Convert string to number and sum
    const totalAmount = (NetAmount + DiscountTotalAmount); // Subtract and ensure 2 decimal places
    const RoundedAmount = Math.round(NetAmount); // Nearest integer
    const RoundOffAmount = (NetAmount - RoundedAmount); // Difference rounded to 2 decimal places
    debugger
    return {
        "DiscountAmount": Number(Number(DiscountTotalAmount).toFixed(2)),
        "TotalAmount": Number(Number(totalAmount).toFixed(2)),
        "NetAmount": Number(Number(NetAmount).toFixed(2)),
        "RoundedAmount": Number(Number(RoundedAmount).toFixed(2)),
        "RoundOffAmount": Number(Number(RoundOffAmount).toFixed(2)),
    }
}

export const DiscountCaculationForFranchies = (index1) => {

    let totalAmount = 0;

    index1.StockDetails.forEach(index2 => {
        if (Number(index2.Qty) > 0) {
            const calculate = Franchies_invoice_Calculate_Func(index2, index1);
            totalAmount += Number(calculate.ItemTotalAmount);
        }
    });

    index1.ItemTotalAmount = roundToDecimalPlaces(totalAmount, 2); //max 2 decimal

    try {
        document.getElementById(`item-TotalAmount-${index1.id}`).innerText = amountCommaSeparateFunc(index1.ItemTotalAmount);
    } catch (e) { CommonConsole('inner-Stock-Caculation', e) };
}

export function Franchies_invoice_Calculate_Func(row, index1, IsComparGstIn,) {
    const discountBasedOnRate = true

    const qty = Number(row.Qty) || 0;
    const initialRate = Number(row.MRP) || 0;
    let rate = Number(row.MRP) || 0;
    const gstPercentage = Number(index1.GSTPercentage) || 0;
    const discountValue = Number(index1.Discount) || 0;
    const discountType = Number(index1.DiscountType) || 2;

    let discountAmount = 0;

    // Calculate the discount before Taxable calculation
    if (discountValue > 0 && discountBasedOnRate) {
        if (discountType === 1) {//'Rs'
            rate -= discountValue;
            discountAmount = parseFloat((discountValue * qty).toFixed(2));
        } else {
            discountAmount = parseFloat(((rate * discountValue / 100) * qty).toFixed(2));
            rate = parseFloat((rate - (rate * discountValue / 100)).toFixed(2));
        }
    }

    const grossAmount = qty * rate;

    // Handle case where quantity is zero
    let taxableAmount = 0;
    let taxableRate = 0;

    if (qty !== 0) {
        taxableAmount = parseFloat((grossAmount * 100 / (100 + gstPercentage)).toFixed(2));
        taxableRate = parseFloat((rate * 100 / (100 + gstPercentage)).toFixed(2));
    }

    const cgst = parseFloat((taxableAmount * (gstPercentage / 2) / 100).toFixed(2));
    const sgst = cgst;
    const igst = 0; // Assuming local billing, hence IGST is 0
    const gstAmount = cgst + sgst;

    // Final amount after applying GST
    let itemFinalAmount = taxableAmount + gstAmount;

    // Adjust Taxable Amount and Item Final Amount to handle 1 paisa differences
    if (discountValue === 0) {
        taxableAmount = (qty * rate) - gstAmount;
        itemFinalAmount = taxableAmount + gstAmount;
    } else {
        if (discountType === 1) {//'Rs'
            taxableAmount = (qty * rate) - gstAmount;
            itemFinalAmount = taxableAmount + gstAmount;
        } else {
            taxableAmount = (qty * initialRate) - discountAmount - gstAmount;
            itemFinalAmount = taxableAmount + gstAmount;
        }
    }

    index1.ItemTotalAmount = itemFinalAmount;

    return {
        // discountBaseAmt: Number(discountBaseAmt.toFixed(2)),
        disCountAmt: discountAmount,
        ItemTotalAmount: itemFinalAmount,

        taxableAmount: taxableAmount,
        CGST_Amount: cgst,
        SGST_Amount: sgst,
        IGST_Amount: igst,
        GST_Amount: gstAmount,
        IGST_Amount: gstAmount,
        CGST_Percentage: gstPercentage / 2,
        SGST_Percentage: gstPercentage / 2,
        IGST_Percentage: igst,

    };
}
