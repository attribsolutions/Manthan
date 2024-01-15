// TableHeaderSection.js
import React from 'react';
import OrderAmountSection from '../../util/OrderAmountSection';
import './styles.scss'

const OrderTableHeaderSection = ({
  key,
  orderDate = "12-03-2024",
  customerName = "Test Customer",
  orderId,
  orderInfo
}) => {

  return (
    <div key={key} className='table-header'>
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
      <OrderAmountSection orderInfo={orderInfo} />
    </div>
  </div>
  

  


  );
};

export default OrderTableHeaderSection;
