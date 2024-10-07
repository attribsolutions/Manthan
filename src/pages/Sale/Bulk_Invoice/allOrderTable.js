import React from 'react';
import { useBulkInvoiceContext } from './dataProvider';
import OrderTable from "./orderTable/index"
import { useEffect } from 'react';
import { BreadcrumbShowCountlabel } from '../../../store/actions';
import { useDispatch } from 'react-redux';
import { roundToDecimalPlaces } from '../../../components/Common/CommonFunction';
import { SaveButton } from '../../../components/Common/CommonButton';
import SaveButtonDraggable from '../../../components/Common/saveButtonDraggable';


const Invoice = ({
  saveHandleCallBack,
  saveBtnloading,
  userPageAccessState,
  pageMode
}) => {

  const dispatch = useDispatch();
  const { bulkData = [] } = useBulkInvoiceContext();

  useEffect(() => {
    let sumofOrdersAmount = 0
    let ordersCount = 0

    for (const orderInfo of bulkData) {
      sumofOrdersAmount += orderInfo.orderAmountWithGst || 0
      ordersCount++
    }
    dispatch(BreadcrumbShowCountlabel(`Count:${ordersCount} currency_symbol ${roundToDecimalPlaces(sumofOrdersAmount, 2, true)}`))

  }, [, bulkData]);


  const onClickSavehandle = () => {
    saveHandleCallBack(bulkData)
  }
  return (
    <div>
      {bulkData.map((order, index) => (
        <OrderTable
          key={index}
          order={order}
        />
      ))}
      {
        (bulkData.length > 0) &&
        <SaveButtonDraggable>
          <SaveButton
            loading={saveBtnloading}
            pageMode={pageMode}
            userAcc={userPageAccessState}
            onClick={onClickSavehandle}
            forceDisabled={saveBtnloading}
          />
       </SaveButtonDraggable>
      }
    </div>
  );
};


export default React.memo(Invoice);
