import React, { useCallback } from 'react';
import { Card, Table } from 'reactstrap';
import DiscountHeader from "../util/DiscountHeader";
import { useBulkInvoiceContext } from '../dataProvider';
import DiscountColumn from '../orderTable/columns/DiscountColumn';
import StockDetailsTable from '../orderTable/columns/StockDetailsColumn';
import OrderTableHeaderSection from './header';
import { discountDropOption } from '../util/constent';
import ItemNameColumn from './columns/ItemNameColumn';
import QuantityUnitColumn from './columns/QuantityUnitColumn';


const OrdersTable = React.memo(({ order }) => {

  const {
    handleItemQuantityChange,
    handleOrderDiscount,
    handleOrderDiscountType,
  } = useBulkInvoiceContext();

  const orderId = order.OrderIDs[0];
  const orderAmountWithGst = order.orderAmountWithGst || 0
  const orderDate = order?.OrderDate || "20-02-2024"
  const customerName = "Test Customer"

  const handleOrderDiscountChange = useCallback(
    (orderId, newDiscountType) => {
      handleOrderDiscount(orderId, newDiscountType)
    },
    [orderId]
  );
  
  const handleOrderDiscountTypeChange = useCallback(
    (orderId, event) => {
      const value = event.target.value;
      const newDiscount = discountDropOption.find((option) => option.value == value);

      handleOrderDiscountType(orderId, newDiscount)
    },
    [orderId]
  )



  return (
    <Card >
      <OrderTableHeaderSection
        orderId={orderId}
        orderAmountWithGst={orderAmountWithGst}
        orderDate={orderDate}
        customerName={customerName}
      />

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
            const itemInfo = item;
            const itemName = itemInfo?.ItemName;
            const itemQuantity = itemInfo?.modifiedQuantity;
            const isLessStock = itemInfo?.lessStock || 0;
            const unitName = itemInfo?.UnitName;
            const unitId = itemInfo?.Unit;
            const discount = itemInfo?.Discount;
            const discountType = itemInfo?.DiscountType;
            const itemAmount = item.itemAmountWithGst;


            return (
              <tr key={item.Item}>
                <td style={{ width: "35%" }}>
                  <ItemNameColumn
                    unitName={unitName}
                    itemName={itemName}
                    isLessStock={isLessStock}
                  />
                </td>
                <td style={{ width: "15%" }}>
                  <QuantityUnitColumn
                    orderId={orderId}
                    itemId={itemId}
                    handleItemQuantityChange={handleItemQuantityChange}
                    itemQuantity={itemQuantity}
                    unitName={unitName}
                    unitId={unitId}
                    isLessStock={isLessStock}
                  />
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
                    itemId={itemId}
                    orderId={orderId}
                    itemAmount={itemAmount}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </Card>
  );
});

export default OrdersTable;