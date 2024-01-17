import React, { Fragment } from 'react';
import { Input } from 'reactstrap';
import { C_Select, decimalRegx } from '../../../../../CustomValidateForm';
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

        <Input
          id={`Dicount_${orderId}-${itemId}`}
          className="right-aligned-placeholder"
          placeholder="Enter discount value"
          defaultValue={discount}
          cpattern={decimalRegx}
          onChange={handleDiscount}
        />

      </div>
      <div>
        Item Amount: {itemAmount}
      </div>
    </Fragment>
  );
});

export default DiscountColumn;