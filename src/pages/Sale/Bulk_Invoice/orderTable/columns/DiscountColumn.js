import React, { Fragment } from 'react';
import { Input } from 'reactstrap';
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

  console.log("***********", discount,
    discountType,
    orderId,
    itemId,
    itemAmount)
  const handleDiscount = (event) => {
    const newDiscount = event.target.value
    handleDiscountChange(orderId, itemId, newDiscount)
  };

  const handleDiscountType = (newDiscountType) => {
    handleDiscountTypeChange(orderId, itemId, newDiscountType)
  };

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
          key={`Dicount_${orderId}-${itemId}-${discount}`}
          className="right-aligned-placeholder"
          placeholder="Enter discount value"
          defaultValue={discount}
          cpattern={decimalRegx}
          onChange={handleDiscount}
        />

      </div>
      <div className='bg-warning text-dark rounded'>
        <samp className='text-muted p-2'>Amount:</samp><strong>₹{itemAmount}</strong>
      </div>

    </Fragment>
  );
});

export default DiscountColumn;