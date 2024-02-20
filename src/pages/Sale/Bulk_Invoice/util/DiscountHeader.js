
import React from "react";
import { decimalRegx } from "../../../../CustomValidateForm";
import { discountDropOption } from "./constent";

const DiscountHeader = React.memo(({
  discount,
  discountType,
  orderId,
  handleDiscountChange,
  handleDiscountTypeChange
}) => {
  const containerStyle = {
    // marginBottom: '5px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  const combinedInputStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%', // Set the desired width
    height: '30px',
    fontSize: '14px',
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const selectStyle = {
    width: '50%', // Adjusted width
    height: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: "4px",


  };

  const inputStyle = {
    width: '50%', // Adjusted width
    height: '100%',
    border: 'none',
    paddingLeft: '8px',
    paddingRight: '5px',
    borderRadius: "5px",
    outline: "none"

  };

  return (
    <div style={containerStyle}>
      <div>
        <label htmlFor={`OrderDiscount_${orderId}`} style={labelStyle}>Order Discount:</label>
        <div style={combinedInputStyle}>
          <select
            defaultValue={discountType?.value}
            key={`OrderDiscountType_${orderId}`}
            style={selectStyle}
            onChange={(e) => handleDiscountTypeChange(orderId, e)}
          >
            {discountDropOption.map((option, index) => (
              <option key={index} value={option.value}>{option.label}</option>
            ))}
          </select>
          <input
            key={`OrderDiscount_${orderId}`}
            style={inputStyle}
            className="right-aligned-placeholder"
            placeholder="Enter discount value"
            defaultValue={discount}
            pattern={decimalRegx}
            onChange={(e) => handleDiscountChange(orderId, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
});

export default DiscountHeader;

