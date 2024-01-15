import React from 'react'
import { itemAmounWithGst } from "./calculationFunc"
import { useBulkInvoiceContext } from '../dataProvider';

const ItemAmountSection = (itemInfo) => {

    // const { globleStockDistribute } = useBulkInvoiceContext()
    // const item = globleStockDistribute?.[`orderId-${globleStockDistribute}`]?.[`itemId-${itemId}`]||''

    // const rowInfo =
    const { roundedTotalAmount } = itemAmounWithGst(itemInfo);
    console.log("roundedTotalAmount", itemInfo)

    return (
        <div>
            Item Amount: {roundedTotalAmount}
        </div>
    )
}

export default React.memo(ItemAmountSection
)