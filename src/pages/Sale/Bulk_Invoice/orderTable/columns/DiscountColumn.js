import React, { Fragment } from 'react';
import { CInput, C_Select, decimalRegx } from '../../../../../CustomValidateForm';
import { useBulkInvoiceContext } from '../../dataProvider';
import { discountDropOption } from "../../util/constent"

const DiscountColumn = React.memo(({
  discount,
  discountType,
  orderId,
  itemId,
  itemAmount,
}) => {
  const { handleDiscountChange, handleDiscountTypeChange, } = useBulkInvoiceContext();

  const handleDiscount = (event) => {
    const newDiscount = event.target.value
    handleDiscountChange(orderId, itemId, newDiscount)
  };

  const handleDiscountType = (newDiscountType) => {
    handleDiscountTypeChange(orderId, itemId, newDiscountType)
  };
  const amountBagroundColor = Number(itemAmount) > 0 ? "#df92077a" : "#db2f2f52";// light-yello and light-red color 
  //render
  return (
    <Fragment>
      <div className="mb-2">
        <div>
          <C_Select
            value={discountType}
            options={discountDropOption}
            onChange={handleDiscountType}
          />
        </div>

        <CInput
          // key={`Dicount_${orderId}-${itemId}-${discount}`}
          className="right-aligned-placeholder"
          placeholder="Enter discount value"
          defaultValue={discount}
          cpattern={decimalRegx}
          onChange={handleDiscount}
        />

      </div>
      <div className='text-dark rounded ' style={{backgroundColor:amountBagroundColor}}>
        <samp className='text-muted pl-1'>Amt:</samp><strong>₹{itemAmount}</strong>
      </div>

    </Fragment>
  );
});

export default DiscountColumn;