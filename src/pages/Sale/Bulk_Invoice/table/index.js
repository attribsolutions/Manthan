// BulkTableComponent.js
import React from 'react';
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { Table } from 'reactstrap';
import ItemNameColumn from '../table/columns/ItemNameColumn';
import QuantityUnitColumn from '../table/columns/QuantityUnitColumn';
import StockDetailsColumn from '../table/columns/StockDetailsColumn';
import DiscountColumn from '../table/columns/DiscountColumn';
import TableHeaderSection from './header';
import { useCallback } from 'react';
import * as _invoiceUtils from '../../Invoice/invoiceCaculations';
import { BreadcrumbShowCountlabel } from '../../../../store/actions';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import TableBody from "./tBody/index";

const BulkTableComponent = ({ parentKey, singleInvoiceData }) => {
  const dispatch = useDispatch();


  const totalAmountCalcuationFunc = (tableList = []) => {

    const calcalateGrandTotal = _invoiceUtils.settingBaseRoundOffAmountFunc(tableList)
    const dataCount = tableList.length;
    const commaSeparateAmount = _cfunc.amountCommaSeparateFunc(Number(calcalateGrandTotal.sumOfGrandTotal));

    dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} ₹ ${commaSeparateAmount}`))

  }

  return (
    <React.Fragment>
      <TableHeaderSection key={parentKey} />

      <Table className="custom-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity/Unit</th>
            <th>Stock Details</th>
            <th>Discount/unit</th>
          </tr>
        </thead>


        <tbody>
          {singleInvoiceData.map((index1, rowIndex) => (
            <TableBody index1={index1} rowIndex={rowIndex} />
          ))}
        </tbody>
      </Table>
    </React.Fragment>
  );
};

export default BulkTableComponent;
