import { groupBy } from "../../../components/Common/CommonFunction"

export const discountCalculate = (row, index1) => {

    let rate = 0
    let qty = 0
    let gstPercentage = 0
    let disCountAmt = 0
    if (index1.Discount === undefined || null) { index1.Discount = 0 }
    if (index1.DiscountType === undefined || null) { index1.DiscountType = 2 }


    if (!(row.Rate == '')) { rate = row.Rate; };
    if (!(row.Qty == '')) { qty = row.Qty; };

    let baseAmt = parseFloat(rate) * parseFloat(qty)
    if (!baseAmt) { baseAmt = 0 }

    if (index1.DiscountType === 2) {
        disCountAmt = (baseAmt * index1.Discount) / 100
    } else {
        disCountAmt = (parseFloat(qty) * index1.Discount)
    }

    if (!(row.GST == '')) {
        gstPercentage = row.GST;
    };

    let discountBaseAmt = (baseAmt - disCountAmt)
    const gstAmt1 = ((discountBaseAmt * parseFloat(gstPercentage) / 100))
    const total = gstAmt1 + parseFloat(discountBaseAmt)
    const CGST = (gstAmt1 / 2).toFixed(2);
    const SGST = (gstAmt1 / 2).toFixed(2);
    let gstAmt = gstAmt1.toFixed(2);
    disCountAmt.toFixed(2);
    discountBaseAmt.toFixed(2);
    const tAmount = total.toFixed(2);

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
                    isCell = JSON.stringify(isCell);
                    isCell = isCell.toLowerCase(isCell)
                    found = isCell.includes(search);
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


export function stockDistributeFunc(index1) {

    let tAmount = 0
    let orderqty = Number(index1.Quantity);
    let _ItemTotalStock = 0

    index1.StockDetails = index1.StockDetails.map(index2 => {

        let stockqty = Number(index2.ActualQuantity);

        _ItemTotalStock = _ItemTotalStock + Number(index2.ActualQuantity)// addition of total index2.ActualQuantity

        if ((orderqty > stockqty) && !(orderqty === 0)) {
            orderqty = orderqty - stockqty
            index2.Qty = stockqty.toFixed(2)
        } else if ((orderqty <= stockqty) && (orderqty > 0)) {
            index2.Qty = orderqty.toFixed(2)
            orderqty = 0
        }
        else {
            index2.Qty = 0;
        }

        if (index2.Qty > 0) {
            const calculate = discountCalculate(index2, index1)
            tAmount = tAmount + Number(calculate.tAmount)
        }

        try {
            document.getElementById(`batchQty${index1.id}-${index2.id}`).value = index2.Qty
        } catch (e) { }



        return index2
    });

    index1.ItemTotalStock = _ItemTotalStock;
    const t2 = index1.ItemTotalStock;
    const tA4 = tAmount.toFixed(2)
    index1.tAmount = tA4

    if (orderqty > t2) {
        try {
            document.getElementById(`OrderQty${index1.id}`).value = t2.toFixed(2)
        } catch (e) { }
    };
    try {
        index1.StockInValid = false
        index1.StockInvalidMsg = null
        document.getElementById(`StockInvalidMsg${index1.id}`).style.display = "none";
    } catch (e) { };

    try {
        document.getElementById(`tAmount${index1.id}`).innerText = tA4;
    } catch (e) { };

};


export function orderQtyOnChange(event, index) {

    let input = Number(event.target.value)
    let ItemTotalStock = Number(index.ItemTotalStock)
    let result = /^\d*(\.\d{0,3})?$/.test(input);

    if (result) {
        if (!(ItemTotalStock >= input)) {
            input = ItemTotalStock
        };

    } else if (((index.Quantity >= 0) && (!(input === '')))) {
        input = index.Quantity
    } else {
        input = 0
    }

    event.target.value = input;
    index.Quantity = input

    stockDistributeFunc(index)
};


export function orderQtyUnit_SelectOnchange(event, index1) {

    index1.default_UnitDropvalue = event;
    index1.ConversionUnit = event.ConversionUnit;

    index1.StockDetails.forEach(index2 => {
        index2["Rate"] = ((event.BaseUnitQuantity / event.BaseUnitQuantityNoUnit) * index2.initialRate).toFixed(2);
        index2["ActualQuantity"] = (index2.BaseUnitQuantity / event.BaseUnitQuantity).toFixed(2);

        document.getElementById(`stockItemRate-${index1.id}-${index2.id}`).innerText = index2.Rate;
        document.getElementById(`ActualQuantity-${index1.id}-${index2.id}`).innerText = index2.ActualQuantity;

    })

    stockDistributeFunc(index1)
};


export function stockQtyOnChange(event, index1, index2) {

    let input = Number(event.target.value)
    let result = /^\d*(\.\d{0,3})?$/.test(input);
    let actualQuantity = Number(index2.ActualQuantity)

    if (result) {
        if (!(actualQuantity >= input)) {
            input = actualQuantity
        };

    } else if (((index2.Qty >= 0) && (!(input === '')))) {
        input = index2.Qty
    } else {
        input = 0
    }

    event.target.value = input;
    index2.Qty = input

    innerStockCaculation(index1)

};


export const innerStockCaculation = (index1) => {

    let QuantityTatal = 0
    let tAmount = 0;

    index1.StockDetails.forEach(index2 => {
        const calculate = discountCalculate(index2, index1)
        tAmount = tAmount + Number(calculate.tAmount)
        QuantityTatal = Number(QuantityTatal) + Number(index2.Qty);
    });

    index1.tAmount = tAmount.toFixed(2)
    index1.Quantity = QuantityTatal.toFixed(2);

    try {
        document.getElementById(`OrderQty-${index1.id}`).value = index1.Quantity
    } catch (e) { };

    try {
        document.getElementById(`tAmount-${index1.id}`).innerText = index1.tAmount;
    } catch (e) { };

}


export function showAllStockOnclick(OrderItemDetails = [], isplus = false,) {
    try {
        if (isplus) {
            document.getElementById("allplus-circle").style.display = "none";
            document.getElementById("allminus-circle").style.display = "block";
        } else {
            document.getElementById("allplus-circle").style.display = "block";
            document.getElementById("allminus-circle").style.display = "none";
        }
    } catch (w) { }

    OrderItemDetails.forEach(index1 => {
        if (!index1.ItemTotalStock > 0) {
            return
        }
        try {
            if (isplus) {
                document.getElementById(`view${index1.id}`).style.display = "block";
                document.getElementById(`plus-circle${index1.id}`).style.display = "none";
                document.getElementById(`minus-circle${index1.id}`).style.display = "block";
            } else {
                document.getElementById(`view${index1.id}`).style.display = "none";
                document.getElementById(`plus-circle${index1.id}`).style.display = "block";
                document.getElementById(`minus-circle${index1.id}`).style.display = "none";
            }
        } catch (w) { }
    })


}

export function showStockOnclick(index1, isplus = false) {
    try {
        if (isplus) {
            document.getElementById(`view${index1.id}`).style.display = "block";
            document.getElementById(`plus-circle${index1.id}`).style.display = "none";
            document.getElementById(`minus-circle${index1.id}`).style.display = "block";
        } else {
            document.getElementById(`view${index1.id}`).style.display = "none";
            document.getElementById(`plus-circle${index1.id}`).style.display = "block";
            document.getElementById(`minus-circle${index1.id}`).style.display = "none";
        }
    } catch (w) { }
}