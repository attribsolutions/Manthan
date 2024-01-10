// DiscountColumn.js
import React from 'react';
import { Input } from 'reactstrap';
import SelectDiscountType from '../../util/SelectDiscountType';
import * as _cfunc from "../../../../../components/Common/CommonFunction";
import { decimalRegx } from '../../../../../CustomValidateForm';

const DiscountColumn = React.memo(({ index1,key,discountTypeAll ,setChangeAllDiscount, setDiscountTypeAll }) => {
  return (
    <div className="mb-2">
      <SelectDiscountType
        discountTypeAll={discountTypeAll}
        setChangeAllDiscount={setChangeAllDiscount}
        setDiscountTypeAll={setDiscountTypeAll}
      />
      <div>
        <Input
          id={`Dicount_${key}-${index1.id}`}
          className="right-aligned-placeholder"
          type="text"
          placeholder="Enter discount value"
          value={index1.Discount}
          cpattern={decimalRegx}
          onChange={(e) => {
            // Your logic for handling discount value change
          }}
        />
      </div>
      <div className="bottom-div">
        <span className="theme-font text-muted">Amount:</span>
        <samp className="text-black" id={`item-TotalAmount-${index1.id}`}>
          {_cfunc.amountCommaSeparateFunc(index1.ItemTotalAmount)}
        </samp>
      </div>
    </div>
  );
});

export default DiscountColumn;
