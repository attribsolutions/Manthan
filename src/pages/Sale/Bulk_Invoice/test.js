import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';

const GlobalStock = {}; // Define your initial stock quantities for each item here
const GlobalDistrubution = {}; // Define your initial stock quantities for each item here

const Invoice = ({ data }) => {
  const [globlestokDetail, setGloblestokDetail] = useState(GlobalStock);
  const [globlestokDistrubution, setGloblestokDistrubution] = useState(GlobalDistrubution);






  const calculateRemainingStock = () => {
    const newGlobalStock = { ...GlobalStock };

    data.forEach((order) => {


      order.OrderItemDetails.forEach((item) => {

        const itemId = item.Item;
        const stockDetails = item.StockDetails || [];

        let totalItemStock = 0
        const batchWiseStock = {}

        stockDetails.forEach((stock) => {

          const stockID = stock.id;
          const bachStock = parseFloat(stock.BaseUnitQuantity) || 0;
          totalItemStock += bachStock;

          if (batchWiseStock[stockID] === undefined) {
            batchWiseStock[stockID] = bachStock
          }

        });

        if (newGlobalStock[itemId] === undefined) {
          newGlobalStock[itemId] = {
            totalItemStock: totalItemStock,
            batchWiseStock: batchWiseStock,
            // remainingItemStock: remainingItemStock,
          };
        }
      });
    });


    // data.forEach((order) => {

    //   order.OrderItemDetails.forEach((item) => {
    //     const itemId = item.Item;
    //     const stockDetails = item.StockDetails || [];


    //     let remainingItemStock = parseFloat(newGlobalStock[itemId].totalItemStock);

    //     const batchWiseStock = {}


    //     stockDetails.forEach((stock) => {

    //       const stockID = stock.id;
    //       const bachStock = parseFloat(stock.BaseUnitQuantity) || 0;
    //       if (totalItemStock > bachStock) {

    //         totalItemStock -= bachStock;
    //         newGlobalStock[itemId].batchWiseStock[stockID] = {
    //           baseQty: bachStock,
    //           remainingQty: 0,
    //           distributQty: bachStock,
    //         };
    //       } else {
    //         newGlobalStock[itemId].batchWiseStock[stockID] = {
    //           baseQty: bachStock,
    //           remainingQty: 0,
    //           distributQty: totalItemStock,
    //         };
    //         totalItemStock = 0;
    //       }
    //     });


    //     newGlobalStock[itemId] = {
    //       totalItemStock: totalItemStock,
    //       batchWiseStock: batchWiseStock,
    //       remainingItemStock: remainingItemStock,
    //     };

    //   });
    // });

    setGloblestokDetail(newGlobalStock);
    calculateRemainingStock1(newGlobalStock)
  };


  const calculateRemainingStock1 = (globlestokDistrubution) => {
    const newGlobalDistrubution = { ...globlestokDistrubution };
debugger
    data.forEach((order) => {

      const orderId = order.id;

      if (newGlobalDistrubution[orderId] === undefined) {
        newGlobalDistrubution[orderId] = {
          qty: '',
          unitId: '',
          unitName: "",
        };
      }

      let a = {
        1: {
          qty: '',
          unitId: '',
          unitName: "",
          1: {
            baseQty: "",
            remainingQty: '',
            distributedQty: ''
          }
        }
      }



      order.OrderItemDetails.forEach((item) => {
        const itemId = item.Item;
        const stockDetails = item.StockDetails || [];


        let remainingItemStock = parseFloat(globlestokDetail[itemId].totalItemStock);




        stockDetails.forEach((stock) => {

          const stockID = stock.id;
          const bachStock = parseFloat(stock.BaseUnitQuantity) || 0;

          if (remainingItemStock > bachStock) {

            remainingItemStock -= bachStock;


            newGlobalDistrubution[orderId][itemId][stockID] = {
              baseQty: bachStock,
              remainingQty: 0,
              distributQty: bachStock,
            };
          } else {
            newGlobalDistrubution[orderId][itemId][stockID] = {
              baseQty: bachStock,
              remainingQty: 0,
              distributQty: remainingItemStock,
            };
            remainingItemStock = 0;
          }
        })


        newGlobalDistrubution[orderId] = {
          totalItemStock: globlestokDetail[itemId].totalItemStock,
          remainingItemStock: remainingItemStock,
        };

      });
    });
debugger
    setGloblestokDistrubution(newGlobalDistrubution);
  };



  useEffect(() => {
    calculateRemainingStock();
  }, [data]);

  const handleQuantityChange = (orderID, itemID, newQuantity) => {
    data.forEach((order) => {
      order.OrderItemDetails.forEach((item) => {
        const stockDetails = item.StockDetails || [];
        stockDetails.forEach((stock) => {
          if (stock.Item === itemID) {
            item.DistributedQuantity = parseFloat(newQuantity);
          }
        });
      });
    });

    // calculateRemainingStock();
  };
  //debugger
  return (
    <div>
      {data.map((order, index) => (
        <OrderTable
          key={index}
          order={order}
          globlestokDetail={globlestokDetail}
          onQuantityChange={handleQuantityChange}
        />
      ))}
    </div>
  );
};

const OrderTable = ({ order, globlestokDetail, onQuantityChange }) => {
  //debugger
  return (
    <div>
      <h3>Order {order.OrderIDs[0]}</h3>
      <Table style={{ borderCollapse: 'collapse', border: '1px solid black', width: '100%' }}>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity/Unit</th>
            <th>Stock Details</th>
            <th>Discount/Unit</th>
          </tr>
        </thead>
        <tbody>
          {order.OrderItemDetails.map((item) => {
            //debugger
            return (
              <tr key={item.id}>
                <td>{item.ItemName}</td>
                <td>
                  <input
                    type="number"
                    value={item.DistributedQuantity || 0}
                    onChange={(e) =>
                      onQuantityChange(order.OrderIDs[0], item.Item, e.target.value)
                    }
                  />
                  <select>
                    {item.UnitDetails.map((unit) => (
                      <option key={unit.UnitID} value={unit.UnitID}>
                        {unit.UnitName}
                      </option>
                    ))}
                  </select>
                  <label>{item.Quantity}</label>
                </td>
                <td>
                  <StockDetailsTable
                    stockDetails={item.StockDetails}
                    globlestokDetail={globlestokDetail}
                    itemId={item.Item}
                  />
                </td>
                <td>{/* Discount input box */}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  );
};

const StockDetailsTable = ({ stockDetails, globlestokDetail, itemId }) => {
  return (
    <div>
      {/* <div>Remaining Stock: {globlestokDetail[itemId]?.totalItemStock}</div> */}

      <Table style={{ borderCollapse: 'collapse', border: '1px solid black', width: '100%' }}>
        <thead>
          <tr>
            <th>BatchCode</th>
            <th>Stock</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>MRP</th>
          </tr>
        </thead>
        <tbody>
          {stockDetails.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.BatchCode}</td>
              <td>{stock.BaseUnitQuantity}</td>
              <td>
                <input
                  type="text"
                  value={globlestokDetail[itemId]?.batchWiseStock[stock.id]}

                />
              </td>
              <td>{stock.Rate}</td>
              <td>{stock.MRP}</td>
            </tr>
          ))}
        </tbody>
      </Table>

    </div>
  );
};

export default Invoice;
