import React from 'react';
import { Input } from 'reactstrap';
import * as _cfunc from "../../../../../components/Common/CommonFunction";
import { C_Select, decimalRegx } from '../../../../../CustomValidateForm';
import { discountDropOption } from "../../util/constent"
import ItemAmountSection from '../../util/ItemAmountSection';

const DiscountColumn = React.memo(({
  discount,
  discountType,
  orderId,
  itemId,
  handleDiscountChange,
  handleDiscountTypeChange
}) => {

  //render
  return (
    <div className="mb-2">
      <div>
        <C_Select
          value={discountType}
          options={discountDropOption}
          onChange={(newDiscountType) => handleDiscountTypeChange(orderId, itemId, newDiscountType)}
        />
      </div>

      <Input
        id={`Dicount_${orderId}-${itemId}`}
        className="right-aligned-placeholder"
        placeholder="Enter discount value"
        defaultValue={discount}
        cpattern={decimalRegx}
        onChange={(e) => handleDiscountChange(orderId, itemId, e.target.value)}
      />
      
    </div>
  );
});

export default DiscountColumn;