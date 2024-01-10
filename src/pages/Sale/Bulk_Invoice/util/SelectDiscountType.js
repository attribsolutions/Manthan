// SelectDiscountType.js
import React from 'react';
import Select from 'react-select';

const SelectDiscountType = React.memo(({index, key, discountDropOption, discountTypeAll, setChangeAllDiscount, setDiscountTypeAll }) => {
  return (
    <div className="parent">
      <div className="child">
        <label className="label">Type&nbsp;&nbsp;&nbsp;</label>
      </div>
      <div className="child">
        <Select
          id={`DicountType_${key}`}
          className="select2-selection"
          value={discountTypeAll}
          options={discountDropOption}
          onChange={(e) => {
            setChangeAllDiscount(false);
            setDiscountTypeAll(e.value);
          }}
        />
      </div>
    </div>
  );
});

export default SelectDiscountType;
