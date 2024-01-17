import React from 'react';
import * as _cfunc from "../../../../../components/Common/CommonFunction";
import { CInput, C_Select, decimalRegx_3dit } from '../../../../../CustomValidateForm';

const QuantityUnitColumn = React.memo(({
  orderId,
  itemId,
  handleItemQuantityChange,
  itemQuantity,
  unitName,
  unitId,
  isLessStock,
}) => {
  // console.log("QuantityUnitColumn : ", itemQuantity);


  return (
    <div className='d-flex  flex-column  justify-content-start gap-2'>
      <CInput
        cpattern={decimalRegx_3dit}
        key={`order-input${itemId}`}
        style={{ borderColor: isLessStock ? "red" : '' }}
        defaultValue={itemQuantity}
        onInput={(e) => {
          handleItemQuantityChange(orderId, itemId, e.target.value)
        }
        }
      />
      <C_Select
        isDisabled
        value={{ label: unitName, value: unitId }}
      />
    </div>
  );
});

export default QuantityUnitColumn;
