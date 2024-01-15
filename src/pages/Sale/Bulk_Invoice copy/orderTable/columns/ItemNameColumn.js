import React from 'react';

const ItemNameColumn = React.memo(({ index1 }) => {
  return (
    <div>
      <div className="theme-font" id={`ItemName${index1.id}`}>
        {index1.ItemName}
      </div>
      <div
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          width: '100%',
        }}
      >
        <samp
          id={`StockInvalidMsg-${index1.id}`}
          style={{
            display: index1.StockInValid ? 'block' : 'none',
            color: 'red',
            animation: 'scrollRightToLeft 15s linear infinite',
          }}
        >
          {index1.StockInValid ? index1.StockInvalidMsg : ''}
        </samp>
      </div>
    </div>
  );
});

export default ItemNameColumn;
