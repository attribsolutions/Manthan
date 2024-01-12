import React, { useState, useEffect, useMemo, useCallback, createContext } from 'react';
import { Input, Table } from 'reactstrap';
import { C_Select, decimalRegx } from '../../../CustomValidateForm';
import debounce from 'lodash/debounce';
import * as _cfunc from "../../../components/Common/CommonFunction";
import { useBulkInvoiceContext } from './contex';

// ==============================================================================================================

const discountDropOption = [{ value: 1, label: "Rs" }, { value: 2, label: "%" }];

const Invoice = ({ }) => {
  const { bulkData } = useBulkInvoiceContext()
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
// ==============================================================================================================






const OrderTable = React.memo(({ order }) => {

  const {
    globleStockDistribute,
    handleItemQuantityChange,
    handleDiscountChange,
    handleDiscountTypeChange } = useBulkInvoiceContext();

  const orderId = order.OrderIDs[0];
  const handleItemDiscountChange = useCallback(
    (orderId, itemId, newDiscountType) => {
      handleDiscountChange(orderId, itemId, newDiscountType)
    },
    [orderId]
  )
  const handleItemDiscountTypeChange = useCallback(
    (orderId, itemId, newDiscount) => {
      handleDiscountChange(orderId, itemId, newDiscount)
    },
    [orderId]
  )



  return (
    <div>
      <h3>Order {order.OrderIDs[0]}</h3>
      <Table className=" custom-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity/Unit</th>
            <th>Stock Details</th>
            <th>
              <DiscountColumnHeader
                discount={3}
                discountType={""}
                handleDiscountChange={handleItemDiscountChange}
                handleDiscountTypeChange={handleItemDiscountTypeChange}
                itemId={''}
                orderId={orderId}
              /></th>
          </tr>
        </thead>
        <tbody>
          {order.OrderItemDetails.map((item, _key) => {
            const itemId = item.Item;
            const itemInfo = globleStockDistribute?.[`orderId-${orderId}`]?.[`itemId-${itemId}`]
            const itemQuantity = itemInfo?.orderQty;
            const isLessStock = itemInfo?.lessStock || 0;
            const discount = itemInfo?.discount;
            const discountType = itemInfo?.discountType;

            return (
              <tr key={item.id}>
                <td style={{ width: "35%" }}>{item.ItemName}
                  <samp
                    style={{
                      display: isLessStock ? "block" : "none",
                      color: "red",
                      // animation: "scrollRightToLeft 15s linear infinite",
                    }}>
                    {`Short Stock Quantity ${isLessStock}`}
                  </samp>
                </td>
                <td style={{ width: "15%" }}>
                  <div className='d-flex  flex-column  justify-content-start gap-2'>
                    <Input
                      type="text"
                      style={{ borderColor: isLessStock ? "red" : '' }}
                      defaultValue={itemQuantity}
                      onChange={(e) => {
                        handleItemQuantityChange(orderId, item.Item, e.target.value)
                      }
                      }
                    />
                    <C_Select
                      isDisabled
                      value={{ label: item.UnitName, value: item.UnitID }}
                    />
                  </div>
                </td>
                <td>
                  <StockDetailsTable
                    stockDetails={item.StockDetails}
                    itemId={itemId}
                    itemInfo={itemInfo}
                    orderId={orderId}
                  />
                </td>
                <td style={{ width: "12%" }}>
                  <DiscountColumn
                    discount={discount}
                    discountType={discountType}
                    handleDiscountChange={handleItemDiscountChange}
                    handleDiscountTypeChange={handleItemDiscountTypeChange}
                    itemId={itemId}
                    orderId={orderId}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  );
});
// ==============================================================================================================

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
            const stockInfo = itemInfo?.[`stockId-${stock.id}`];
            const distributeStock = stockInfo?.distribute;

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
          })}
        </tbody>
      </Table>

    </div>
  );
});

//=========================================================================================

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

const DiscountColumnHeader = React.memo(({
  discount,
  discountType,
  orderId,
  itemId,
  handleDiscountChange,
  handleDiscountTypeChange
}) => {


  const selectStyle = {
    width: 'auto', // Set the desired width
    height: '20px', // Set the desired height
    fontSize: '16px', // Set the desired font size
    pending: 20,
    border: "1px solid black",
    borderRadius: "3px",
    // Add any additional styles you want
  };
  return (
    <div className="mb-2">
      <div>
        <label htmlFor="Orderdistcount">Order Distcount:</label>
        <select style={selectStyle}
          onChange={handleDiscountTypeChange}>
          {discountDropOption.map((i, k) => (
            <option key={k} value={i.value}>{i.label}</option>))}
        </select>
      </div>

      <input
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



export default React.memo(Invoice);
