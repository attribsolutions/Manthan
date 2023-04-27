export const salesReturnCalculate = (row) => {
   
    let rate = 0
    let qty = 0
    let gstPercentage = 0
    let disCountAmt = 0

    // if(index.Discount===undefined||null){index.Discount=0}
    // if(index.DiscountType===undefined||null){index.DiscountType=2}


    if (!(row.Rate == '')) { rate = row.Rate; };
    if (!(row.Qty == '')) { qty = row.Qty; };

    let baseAmt = parseFloat(rate) * parseFloat(qty)
    if (!baseAmt) { baseAmt = 0 }

    // if (index.DiscountType === 2) {
    //     disCountAmt = (baseAmt * index.Discount) / 100
    // } else {
    //     disCountAmt = (parseFloat(qty) * index.Discount)
    // }

    if (!(row.gstPercentage == '')) {
        gstPercentage = row.gstPercentage;
    };


    const gstAmt = ((baseAmt * parseFloat(gstPercentage) / 100))
    const total = gstAmt + parseFloat(baseAmt)
    const CGST = (gstAmt / 2).toFixed(2);
    const SGST = (gstAmt / 2).toFixed(2);
    gstAmt.toFixed(2)
    // disCountAmt.toFixed(2)
    // discountBaseAmt.toFixed(2)
    const tAmount = total.toFixed(2)

    return { baseAmt, gstAmt, tAmount, CGST, SGST }
}