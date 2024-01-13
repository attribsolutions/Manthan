import React from 'react';
import { useBulkInvoiceContext } from './dataProvider';
import OrderTable from "./orderTable/index"
import { balkInvoiceAllOrderAmountFunc } from './util/calculationFunc';
import { useEffect } from 'react';
import { BreadcrumbShowCountlabel } from '../../../store/actions';
import { useDispatch } from 'react-redux';


const Invoice = ({ }) => {

  const dispatch = useDispatch();
  const { bulkData = [], globleStockDistribute } = useBulkInvoiceContext();

  useEffect(() => {
    const { sumOfInvoiceTotal } = balkInvoiceAllOrderAmountFunc({
      IsTCSParty: false,
      IsCustomerPAN: false,
      bulkInvoceInfo: globleStockDistribute
    });
    const dataCount = bulkData.length;

    dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} ₹ ${sumOfInvoiceTotal}`))

  }, [globleStockDistribute, bulkData])



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
