import { groupBy } from "../../../components/Common/CommonFunction"

export const discountCalculate = (row, index) => {

    let rate = 0
    let qty = 0
    let gstPercentage = 0
    let disCountAmt = 0
    if (index.Discount === undefined || null) { index.Discount = 0 }
    if (index.DiscountType === undefined || null) { index.DiscountType = 2 }


    if (!(row.Rate == '')) { rate = row.Rate; };
    if (!(row.Qty == '')) { qty = row.Qty; };

    let baseAmt = parseFloat(rate) * parseFloat(qty)
    if (!baseAmt) { baseAmt = 0 }

    if (index.DiscountType === 2) {
        disCountAmt = (baseAmt * index.Discount) / 100
    } else {
        disCountAmt = (parseFloat(qty) * index.Discount)
    }

    if (!(row.GST == '')) {
        gstPercentage = row.GST;
    };

    let discountBaseAmt = (baseAmt - disCountAmt)
    const gstAmt1 = ((discountBaseAmt * parseFloat(gstPercentage) / 100))
    const total = gstAmt1 + parseFloat(discountBaseAmt)
    const CGST = (gstAmt1 / 2).toFixed(2);
    const SGST = (gstAmt1 / 2).toFixed(2);
    let gstAmt = gstAmt1.toFixed(2)
    disCountAmt.toFixed(2)
    discountBaseAmt.toFixed(2)
    const tAmount = total.toFixed(2)

    return { discountBaseAmt, disCountAmt, gstAmt, tAmount, CGST, SGST }
}

export function bulkSearch(text, data, columns) {

    let search = text.toLowerCase()

    const filter = data.filter((item) => {
        let found = false

        if (item.header) { return true }

        for (let i = 0; i < columns.length; i++) {

            let isCell = item[columns[i].dataField]
            if (!(isCell === null)
                && !(isCell === undefined)
                && typeof isCell !== 'object'
                && !Array.isArray(isCell)
            ) {
                if (!found) {
                    isCell = JSON.stringify(isCell)
                    isCell = isCell.toLowerCase(isCell)
                    found = isCell.includes(search)
                }
            }
        }
        return found

    })
    let hasHedRow1 = []
    const grouped = groupBy(filter, pet => pet.Party);
    grouped.forEach(i => {
        if (i.length > 1) {
            i.forEach(k => {
                hasHedRow1.push(k)
            })
        }
    })
    return hasHedRow1
}


export function stockDistributeFunc(index) {

    const v1 = index.Quantity;
    let tAmount = 0
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


        if (i2.Qty > 0) {
            const calculate = discountCalculate(i2, index)
            tAmount = tAmount + Number(calculate.tAmount)
        }


        return i2
    });


    const t1 = (v1 * index.ConversionUnit);
    const t2 = index.StockUnit;
    const t3 = index.StockTotal;
    const tA4 = tAmount.toFixed(2)
    index.tAmount = tA4

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
        document.getElementById(`tAmount${index.id}`).innerText = tA4;
    } catch (e) { };

};
