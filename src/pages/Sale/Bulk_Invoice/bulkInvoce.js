import React from 'react';
import { useBulkInvoiceContext } from './dataProvider';
import OrderTable from "./orderTable/index"


const Invoice = ({ }) => {
  const { bulkData=[] } = useBulkInvoiceContext()
  return (
    <div>
      {bulkData.map((order, index) => (
        <OrderTable
          key={index}
          order={order}
        />
      ))}
    </div>
  );
};


export default React.memo(Invoice);
