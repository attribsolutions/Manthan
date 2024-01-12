import React, { useState, useEffect, useMemo, useCallback, createContext } from 'react';
import { Input, Table } from 'reactstrap';
import DiscountHeader from "../util/DiscountHeader";
import { useBulkInvoiceContext } from '../dataProvider';
import DiscountColumn from '../orderTable/columns/DiscountColumn';
import StockDetailsTable from '../orderTable/columns/StockDetailsColumn';
import { C_Select } from '../../../../CustomValidateForm';
import ItemAmountSection from '../util/ItemAmountSection';
import OrderTableHeaderSection from './header';
import { discountDropOption } from '../util/constent';


const OrdersTable = React.memo(({ order }) => {

  const {
    globleStockDistribute,
    handleItemQuantityChange,
    handleDiscountChange,
    handleOrderDiscount,
    handleOrderDiscountType,
  } = useBulkInvoiceContext();

  const orderId = order.OrderIDs[0];
  const orderInfo = globleStockDistribute?.[`orderId-${orderId}`];

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
  const handleOrderDiscountChange = useCallback(
    (orderId, newDiscountType) => {
      handleOrderDiscount(orderId, newDiscountType)
    },
    [orderId]
  )
  const handleOrderDiscountTypeChange = useCallback(
    (orderId, event) => {
      const value = event.target.value;
      const newDiscount = discountDropOption.find((option) => option.value == value);

      debugger
      handleOrderDiscountType(orderId, newDiscount)
    },
    [orderId]
  )



  return (
    <div>
      <OrderTableHeaderSection orderId={orderId} orderInfo={orderInfo} />
      <Table className=" custom-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'left', verticalAlign: 'middle' }}>Item Name</th>
            <th style={{ textAlign: 'left', verticalAlign: 'middle' }}>Quantity/Unit</th>
            <th style={{ textAlign: 'left', verticalAlign: 'middle' }}>Stock Details</th>

            <th>
              <DiscountHeader
                discount={''}
                discountType={discountDropOption[1]}
                handleDiscountChange={handleOrderDiscountChange}
                handleDiscountTypeChange={handleOrderDiscountTypeChange}
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
            const rate = itemInfo?.rate || 0;
            const quantity = itemInfo?.quantity || 0;
            const discount = itemInfo?.discount;
            const discountType = itemInfo?.discountType;
            const gstPercentage = itemInfo?.gstPercentage;
            const IsComparGstIn = {};



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
                  <ItemAmountSection
                    rate={rate}
                    quantity={quantity}
                    gstPercentage={gstPercentage}
                    discount={discount}
                    discountType={discountType}
                    IsComparGstIn={IsComparGstIn}
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

export default OrdersTable;