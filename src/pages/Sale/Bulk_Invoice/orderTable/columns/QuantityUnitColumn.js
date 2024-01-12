import React, { useState, useEffect, useMemo, useCallback, createContext } from 'react';
import { Input, Table } from 'reactstrap';
import * as _cfunc from "../../../../../components/Common/CommonFunction";
import { useBulkInvoiceContext } from '../../dataProvider/index';

const QuantityUnitColumn = React.memo(({
  index1,
  qtyOnChangeCallBack,
  unitChangeCallback
}) => {
  console.log("QuantityUnitColumn : ",index1);

  
  return (
    <div>
      <div>
        <Input
          type="text"
          id={`OrderQty-${index1.id}`}
          placeholder="Enter quantity"
          className="right-aligned-placeholder mb-1"
          style={{
            border: index1.StockInValid ? '2px solid red' : '1px solid #ced4da',
          }}
          autoComplete="off"
          defaultValue={index1.Quantity}
          onChange={(event) => {
            qtyOnChangeCallBack(event, index1)
          }}
        />
      </div>
      <div>
        <SelectUnit
          index1={index1}
          onSelectChange={unitChangeCallback}
          unitSelected={index1.default_UnitDropvalue}
          unitOptions={index1.UnitDetails}
        />
      </div>
      <div className="theme-font">
        <span className="text-muted">Order-Qty :</span>
        <samp>{index1.OrderQty}</samp>&nbsp;&nbsp;
        <samp>{index1.UnitName}</samp>
      </div>
      <div>
        <samp className="theme-font text-muted">Available stock :</samp>
        <label className="text-black">
          {_cfunc.roundToDecimalPlaces(index1.ItemTotalStock, 3)}
        </label>
      </div>
    </div>
  );
});

export default QuantityUnitColumn;
