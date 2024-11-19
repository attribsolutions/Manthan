import React from 'react';

const ItemNameColumn = React.memo(({ unitName, itemName, isLessStock }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
      <div>
        <strong>{itemName}</strong>
      </div>
      <div style={{ display: isLessStock ? "block" : "none", color: "red" }}>
        {`Short Stock Quantity ${isLessStock} ${unitName?.split(" ")[0]}`}
      </div>
    </div>
  );
});

export default ItemNameColumn;
