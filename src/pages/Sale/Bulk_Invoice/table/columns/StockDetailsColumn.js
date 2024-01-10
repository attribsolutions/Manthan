// StockDetailsColumn.js
import React from 'react';
import { Input } from 'reactstrap';
import * as _cfunc from "../../../../../components/Common/CommonFunction";

const StockDetailsColumn = React.memo(({
    index1,
    itemId,
    stockDetails,
    stockQtyOnChangeCallBack,
 }) => {
    console.log("StockDetailsColumn",index1.StockDetails);

    return (
        <div className="table-responsive">
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>BatchCode</th>
                        <th>Stock</th>
                        <th>Quantity</th>
                        <th>Basic Rate</th>
                        <th>MRP</th>
                    </tr>
                </thead>
                <tbody>
                    {stockDetails.map((index2) => (
                        <tr key={index2.id}>
                            <td data-label="BatchCode">{index2.BatchCode}</td>
                            <td data-label="Stock Quantity" style={{ textAlign: 'right' }}>
                                <samp id={`ActualQuantity-${index1.id}-${index2.id}`}>
                                    {index2.ActualQuantity}
                                </samp>
                            </td>
                            <td data-label="Quantity">
                                <Input
                                    type="text"
                                    placeholder="Manually enter quantity"
                                    className="right-aligned-placeholder"
                                    id={`batchQty${index1.id}-${index2.id}`}
                                    defaultValue={index2.Qty}
                                    onChange={(event) => {
                                        stockQtyOnChangeCallBack(event, index1, index2)
                                        // Your logic for handling stock quantity change
                                    }}
                                />
                            </td>
                            <td data-label="Basic Rate" style={{ textAlign: 'right' }}>
                                <span id={`stockItemRate-${index1.id}-${index2.id}`}>
                                    {_cfunc.amountCommaSeparateFunc(index2.Rate)}
                                </span>
                            </td>
                            <td data-label="MRP" style={{ textAlign: 'right' }}>
                                {_cfunc.amountCommaSeparateFunc(
                                    _cfunc.roundToDecimalPlaces(index2.MRP, 2)
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export default StockDetailsColumn;
