export const salesReturnCalculate = (row) => {

    let rate = 0
    let qty = 0
    let gstPercentage = 0

    if (!(row.Rate == '')) { rate = row.Rate; };
    if (!(row.Qty == '')) { qty = row.Qty; };

    let baseAmt = parseFloat(rate) * parseFloat(qty)
    if (!baseAmt) { baseAmt = 0 }


    if (!(row.gstPercentage == '')) {
        gstPercentage = row.gstPercentage;
    };

    const gstAmt = ((baseAmt * parseFloat(gstPercentage) / 100))
    const total = gstAmt + parseFloat(baseAmt)
    const CGST = (gstAmt / 2).toFixed(2);
    const SGST = (gstAmt / 2).toFixed(2);
    gstAmt.toFixed(2)
    const tAmount = total.toFixed(2)

    return { baseAmt, gstAmt, tAmount, CGST, SGST }
}