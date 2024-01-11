import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';


const Invoice = ({ data }) => {
  const [globlestokDetail, setGloblestokDetail] = useState({});
  const [globlestokDistrubution, setGloblestokDistrubution] = useState({});






  const calculateRemainingStock = () => {
    const newGlobalStock = {  };

    data.forEach((order) => {


      order.OrderItemDetails.forEach((item) => {

        const itemId = item.Item;
        const stockDetails = item.StockDetails || [];

        let totalItemStock = 0


        stockDetails.forEach((stock) => {
          const bachStock = parseFloat(stock.BaseUnitQuantity) || 0;
          totalItemStock += bachStock;
        });

        if (newGlobalStock[itemId] === undefined) {
          newGlobalStock[itemId] = itemId
        }

        newGlobalStock[itemId] = {
          ...newGlobalStock[itemId],
          totalItemStock: totalItemStock,
        };


      });
    });

    setGloblestokDetail(newGlobalStock);
    calculateRemainingStock1(newGlobalStock)
  };


  const calculateRemainingStock1 = (globle) => {
    const globlestokDetail = globle;

    const newGlobalDistrubution = { ...globlestokDistrubution };
    debugger
    data.forEach((order) => {

      const orderId = `orderId-${order.OrderIDs[0]}`;

      if (newGlobalDistrubution[orderId] === undefined) {
        newGlobalDistrubution[orderId] = {
          qty: '',
          unitId: '',
          unitName: "",
          stock: '',
        };
      }





      order.OrderItemDetails.forEach((item) => {
        const itemId = item.Item;
        const stockDetails = item.StockDetails || [];


        let remainingItemStock = parseFloat(globlestokDetail[itemId].totalItemStock);

        let itemDitrubutQty = parseFloat(item.Quantity);
        let lessItemQty = 0

        stockDetails.forEach((stock) => {

          const stockID = stock.id;
          const bachStock = parseFloat(stock.BaseUnitQuantity) || 0;

          if (newGlobalDistrubution[orderId][itemId] == undefined) {
            newGlobalDistrubution[orderId] = {
              ...newGlobalDistrubution[orderId],
              [itemId]: itemId
            }
          }
          if (newGlobalDistrubution[orderId][itemId][stockID] == undefined) {
            newGlobalDistrubution[orderId][itemId] = {
              ...newGlobalDistrubution[orderId][itemId],
              [stockID]: stockID
            }
          }

          if (remainingItemStock > itemDitrubutQty) {
            // remainingItemStock -= itemDitrubutQty;

            if (itemDitrubutQty > bachStock) {

              remainingItemStock -= bachStock;


              newGlobalDistrubution[orderId][itemId][stockID] = {
                baseQty: bachStock,
                remainingQty: 0,
                distributQty: bachStock,
              };
            } else {
              remainingItemStock -= itemDitrubutQty;
              newGlobalDistrubution[orderId][itemId][stockID] = {
                baseQty: bachStock,
                remainingQty: bachStock - itemDitrubutQty,
                distributQty: itemDitrubutQty,
              };
              itemDitrubutQty = 0;
            }
          } else {
            remainingItemStock -= itemDitrubutQty;
            newGlobalDistrubution[orderId][itemId][stockID] = {
              baseQty: bachStock,
              remainingQty: 0,
              distributQty: remainingItemStock,
            };
            itemDitrubutQty = itemDitrubutQty - remainingItemStock;
            remainingItemStock = 0
            lessItemQty = remainingItemStock - itemDitrubutQty
          }

        })


        newGlobalDistrubution[orderId] = {
          ...newGlobalDistrubution[orderId],
          totalItemStock: globlestokDetail[itemId].totalItemStock,
          remainingItemStock: remainingItemStock,
          lessItemQty: lessItemQty
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
         
          globleDistrubution={globlestokDistrubution}
          onQuantityChange={handleQuantityChange}
        />
      ))}
    </div>
  );
};

const OrderTable = ({ order, globleDistrubution, onQuantityChange }) => {
  console.log("OrderTable",order, globleDistrubution,  onQuantityChange)
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
                    globleDistrubution={globleDistrubution}
                    itemId={item.Item}
                    orderId={order.OrderIDs?.[0]}
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

const StockDetailsTable = ({ stockDetails, globleDistrubution, orderId, itemId }) => {
  console.log('StockDetailsTable', orderId, itemId)
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
                  value={globleDistrubution[`orderId-${orderId}`]?.[itemId]?.[stock.id]?.distributQty}

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
