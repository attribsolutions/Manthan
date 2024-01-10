import React, { useState } from 'react'
import ItemNameColumn from '../columns/ItemNameColumn'
import QuantityUnitColumn from '../columns/QuantityUnitColumn'
import StockDetailsColumn from '../columns/StockDetailsColumn'
import DiscountColumn from '../columns/DiscountColumn'
import * as _invoiceUtils from '../../../Invoice/invoiceCaculations';
import { useCallback } from 'react'

function TBody({
    rowIndex,
    index1
}) {

    const [refreshShock, setRefreshShock] = useState(false);

    const _qtyChangeCallback = useCallback((event, __index1) => {

        _invoiceUtils.orderQtyOnChange(event, index1);

        setRefreshShock(state => !state)

    }, [index1]);


    const _unitChangeCallback = useCallback((event, __index1) => {

        _invoiceUtils.orderQtyUnit_SelectOnchange(event, index1);
        setRefreshShock(state => !state)
    }, [index1]);


    const _stockQtyChangeCallback = useCallback((event, _index1_, index2) => {
        setRefreshShock(state => !state)
        _invoiceUtils.stockQtyOnChange(event, index1, index2);

    }, [index1]);


    return (
        <tr key={rowIndex}>
            <td>
                <ItemNameColumn index1={index1} />
            </td>
            <td>
                <QuantityUnitColumn
                    index1={index1}
                    qtyOnChangeCallBack={_qtyChangeCallback}
                    unitChangeCallback={_unitChangeCallback} />
            </td>
            <td>
                <StockDetailsColumn
                    index1={index1}
                    stockDetails={index1.StockDetails}
                    refreshShock={refreshShock}
                    stockQtyOnChangeCallBack={_stockQtyChangeCallback} />
            </td>
            <td>
                <DiscountColumn index1={index1} />
            </td>
        </tr>
    )
}

export default TBody