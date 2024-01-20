// TableHeaderSection.js
import React from 'react';
import './styles.scss'

const OrderTableHeaderSection = ({
  orderDate,
  orderId,
  orderAmountWithGst,
  customerName,
  orderItemCount
}) => {
  return (
    <div className='table-header '>
      <div className='order-details '>

        <div className='detail-item bg-light rounded pl-1 pr-2'>
          <div><span className='text-muted'>Date:</span></div>
          <div className='text-primary'><span>{orderDate}</span></div>
          <div className='pl-2 text-primary'><span>{customerName}</span></div>
        </div>
        <div className='detail-item text-muted'>
          <span className='text-muted1'>Order:&nbsp;</span><span>{orderId}</span>
        </div>
      </div>
      <div className='order-amount'>
        <div className='d-flex gap-2 '>
          <div className='p-1'>
            <samp className='text-muted'>Count:&nbsp;</samp><samp >#{orderItemCount}</samp>
          </div>
          <div className='bg-dark text-white p-1 rounded'>
            <samp className='text-muted'>Total:</samp><strong>₹{orderAmountWithGst}</strong>
          </div>
        </div>
      </div>
    </div>





  );
};

export default OrderTableHeaderSection;

// // TableHeaderSection.js
// import React from 'react';
// import './styles.scss'

// const OrderTableHeaderSection = ({
//   orderDate,
//   orderId,
//   orderAmountWithGst,
//   customerName,
//   orderItemCount
// }) => {
//   return (
//     <div className='table-header '>
//       <div className='order-details '>

//         <div className='detail-item bg-light rounded pl-1 pr-2'>
//           <div><span className='text-muted'>Date:</span></div>
//           <div className='text-primary'><span>{orderDate}</span></div>
//           <div className='pl-2 text-primary'><span>{customerName}</span></div>
//         </div>
//         <div className='detail-item text-muted'>
//           <span className='text-muted1'>Order:&nbsp;</span><span>{orderId}</span>
//         </div>
//       </div>
//       <div className='order-amount'>
//         <div className='d-flex gap-2 '>
//           <div className='p-1'>
//             <samp className='text-muted'>Count:&nbsp;</samp><samp >#{orderItemCount}</samp>
//           </div>
//           <div className=' text-white p-1 rounded' style={{ backgroundColor: "#2b2d2f4d" }}>
//             <samp className='text-muted' style={{ color: "#cdcfd9" }}>Total:</samp><strong>₹{orderAmountWithGst}</strong>
//           </div>
//         </div>
//       </div>
//     </div>





//   );
// };

// export default OrderTableHeaderSection;
