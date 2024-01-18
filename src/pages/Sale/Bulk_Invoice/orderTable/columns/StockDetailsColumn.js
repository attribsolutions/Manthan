import React from 'react';
import { Input, Table } from 'reactstrap';

const StockDetailsTable = React.memo(({ stockDetails, itemInfo, orderId, itemId }) => {
  // console.log('StockDetailsTable', orderId, itemId)
  return (
    <div>
      {/* <div>Remaining Stock: {globlestokDetail[itemId]?.totalItemStock}</div> */}

      <Table style={{ borderCollapse: 'collapse', border: '1px solid black', width: '100%' }}>
        <thead>
          <tr>
            <th>BatchCode</th>
            <th>Stock</th>
            <th>Distribute</th>
            <th>Rate</th>
            <th>MRP</th>
          </tr>
        </thead>
        <tbody>
          {stockDetails.map((stock) => {
            
            const distributeStock = stock?.distribute;
            if (distributeStock > 0) {
              return (
                <tr key={stock.id}>
                  <td>{stock.BatchCode}</td>
                  <td>{stock.BaseUnitQuantity}</td>
                  <td style={{ width: "20%" }}>
                    <Input
                      value={distributeStock}
                      readOnly
                    />
                  </td>
                  <td>{stock.Rate}</td>
                  <td>{stock.MRP}</td>
                </tr>
              )
            }
              return null
          })}
        </tbody>
      </Table>

    </div>
  );
});

export default StockDetailsTable