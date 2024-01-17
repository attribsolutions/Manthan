// TableHeaderSection.js
import React from 'react';
import './styles.scss'

const OrderTableHeaderSection = ({
  orderDate,
  orderId,
  orderAmountWithGst,
  customerName = "Test Customer"
}) => {
  return (
    <div className='table-header'>
      <div className='order-details'>
        <div className='detail-item'>
          <div><span>Order:</span></div>
          <div className=''><span>{orderId}</span></div>
        </div>
        <div className='detail-item'>
          <div><span>Date:</span></div>
          <div className=''><span>{orderDate}</span></div>
        </div>
        <div className='detail-item'>
          <div><span>Customer:</span></div>
          <div className=''><span>{customerName}</span></div>
        </div>
      </div>
      <div className='order-amount'>
        <div className='p-2 d-flex gap-2'>
          <div><samp>Total:</samp><strong>₹{orderAmountWithGst}</strong></div>
        </div>
      </div>
    </div>





  );
};

export default OrderTableHeaderSection;
