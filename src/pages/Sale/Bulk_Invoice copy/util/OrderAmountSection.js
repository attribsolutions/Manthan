import React from 'react'
import { settingBaseRoundOffOrderAmountFunc } from './calculationFunc'

const OrderAmountSection = ({ orderInfo }) => {
    console.log("OrderAmountSection", JSON.stringify(orderInfo));

    const { sumOfGrandTotal,TCS_Amount } = settingBaseRoundOffOrderAmountFunc({
        orderInfo: orderInfo, IsTCSParty: false, IsCustomerPAN: false,
    })
    return (
        <div className='p-2 d-flex gap-2'>
            <div><samp>Total:</samp><strong>₹{sumOfGrandTotal}</strong></div>
            <div><samp>TCS:</samp><strong>₹{TCS_Amount}</strong></div>

        </div>
    )
}

export default React.memo(OrderAmountSection)
