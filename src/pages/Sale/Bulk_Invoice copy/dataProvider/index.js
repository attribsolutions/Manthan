
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { roundToDecimalPlaces } from '../../../../components/Common/CommonFunction';

const BulkInvoiceContext = createContext();

export const BulkInvoiceProvider = ({ children, data }) => {

    const [globleStockDistribute, setGlobleStockDistribute] = useState({});
    const discountDropOption = [{ value: 1, label: "Rs" }, { value: 2, label: "%" }];

    const globleItemStock = useMemo(() => {
        const newGlobalStock = {};

        data.forEach(dataObject => {
            dataObject.OrderItemDetails.forEach(item => {

                const itemId = `itemId-${item.Item}`;

                let totalItemStock = 0;

                item.StockDetails.forEach(stockDetail => {
                    const stockId = `stockId-${stockDetail.id}`;
                    const stock = parseFloat(stockDetail.BaseUnitQuantity)
                    newGlobalStock[itemId] = newGlobalStock[itemId] || {};
                    newGlobalStock[itemId][stockId] = newGlobalStock[itemId][stockId] || { baseQty: 0, baseStock: 0 };
                    newGlobalStock[itemId][stockId].baseQty = stock;
                    newGlobalStock[itemId][stockId].baseStock = stock;
                    totalItemStock += stock
                });

                newGlobalStock[itemId] = newGlobalStock[itemId] || {};
                newGlobalStock[itemId].totalStock = newGlobalStock[itemId].totalStock || 0;
                newGlobalStock[itemId].totalStock = totalItemStock;

                item.modifiedQuantity = item.Quantity;
                item.DiscountType = item.DiscountType == 1 ? discountDropOption[0] : discountDropOption[1]

            });
        });

        // console.log("newGlobalStock=", JSON.stringify(newGlobalStock));
        return newGlobalStock;
    }, [data]);


    useEffect(() => {
        distributeItemStockGlobally()
    }, [globleItemStock])

    const distributeItemStockGlobally = useCallback(
        () => {
            let newGlobalStock = JSON.parse(JSON.stringify(globleItemStock))

            let orderDistribution = {};


            data.forEach(order => {

                const orderId = `orderId-${order.OrderIDs[0]}`;

                order.OrderItemDetails.forEach(orderItem => {
                    const itemId = `itemId-${orderItem.Item}`;
                    let orderQty = parseFloat(orderItem.modifiedQuantity);

                    orderDistribution[orderId] = orderDistribution[orderId] || {};
                    orderDistribution[orderId][itemId] = orderDistribution[orderId][itemId] || { lessStock: 0, orderQty: orderQty };
                    orderDistribution[orderId][itemId].discount = orderItem.Discount;
                    orderDistribution[orderId][itemId].discounttype = orderItem.DiscountType;
                    orderDistribution[orderId][itemId].rate = orderItem.Rate;
                    orderDistribution[orderId][itemId].unitid = orderItem.UnitId;
                    orderDistribution[orderId][itemId].unitname = orderItem.UnitName;
                    orderDistribution[orderId][itemId].quantity = orderQty;
                    orderDistribution[orderId][itemId].gstpercentage = orderItem.GST;

                    orderItem.StockDetails.forEach(stockDetail => {
                        const stockId = `stockId-${stockDetail.id}`;

                        let batchStock = newGlobalStock[itemId][stockId].baseStock;
                        let itemStock = newGlobalStock[itemId].totalStock;
                        let distribute = 0;
                        let remaining = 0;

                        // if (itemStock > 0) {
                        //     if (batchStock >= orderQty) {

                        //         distribute = orderQty;
                        //         remaining = batchStock - orderQty;
                        //         newGlobalStock[itemId].totalStock = itemStock - orderQty;
                        //         newGlobalStock[itemId][stockId].baseQty = batchStock - orderQty;
                        //         orderQty = 0;

                        //     } else if (batchStock > 0) {

                        //         distribute = batchStock;
                        //         remaining = 0;
                        //         newGlobalStock[itemId].totalStock = itemStock - batchStock;
                        //         newGlobalStock[itemId][stockId].baseQty = 0;
                        //         orderQty = orderQty - batchStock;
                        //     }
                        // }

                        if (itemStock > 0) {
                            if (batchStock >= orderQty) {
                                distribute = Math.min(orderQty, batchStock);
                                remaining = Math.max(0, batchStock - orderQty);
                                newGlobalStock[itemId].totalStock = Math.max(0, itemStock - distribute);
                                newGlobalStock[itemId][stockId].baseStock = Math.max(0, batchStock - distribute);
                                orderQty = Math.max(0, orderQty - distribute); // Subtract the distributed quantity from the original orderQty
                            } else if (batchStock > 0) {
                                distribute = batchStock;
                                remaining = 0;
                                newGlobalStock[itemId].totalStock = Math.max(0, itemStock - distribute);
                                newGlobalStock[itemId][stockId].baseStock = 0;
                                orderQty = Math.max(0, orderQty - distribute); // Subtract the distributed quantity from the original orderQty
                            }
                        }

                        orderDistribution[orderId][itemId][stockId] = {
                            "distribute": distribute,
                            "remaining": remaining,
                            "batchcode": '',
                            "batchdate": '',
                            "livebatch": '',
                            "mrp": '',
                            "rate": '',

                        };
                    });

                    if (orderQty > 0.0) {
                        orderDistribution[orderId][itemId].lessStock = roundToDecimalPlaces(orderQty);
                    }
                });
            });

            // Update global distribution after processing all orders
            setGlobleStockDistribute(orderDistribution);

            // console.log("orderDistribution", JSON.stringify(orderDistribution, null, 2));
        }, [globleItemStock]);


    const handleItemQuantityChange = useCallback(
        debounce((orderID, itemID, newQuantity) => {
            let found = false;

            for (let i = 0; i < data.length; i++) {
                const order = data[i];
                for (let j = 0; j < order.OrderItemDetails.length; j++) {
                    const item = order.OrderItemDetails[j];
                    if (order.OrderIDs[0] === orderID && item.Item === itemID) {
                        item.modifiedQuantity = roundToDecimalPlaces(newQuantity, 3, true);

                        found = true;
                        break; // This will break out of the inner loop
                    }
                }

                if (found) {
                    break; // This will break out of the outer loop
                }
            }
            distributeItemStockGlobally();
        }, 300), [data]);

    const handleDiscountTypeChange = useCallback(
        debounce((orderID, itemID, newDiscountType) => {
            let found = false;

            for (let i = 0; i < data.length; i++) {
                const order = data[i];
                for (let j = 0; j < order.OrderItemDetails.length; j++) {
                    const item = order.OrderItemDetails[j];
                    if (order.OrderIDs[0] === orderID && item.Item === itemID) {
                        item.DiscountType = newDiscountType;
                        found = true;
                        break; // This will break out of the inner loop
                    }
                }

                if (found) {
                    break; // This will break out of the outer loop
                }
            };

            distributeItemStockGlobally();
        }, 100), [data, distributeItemStockGlobally]);

    const handleDiscountChange = useCallback(
        debounce((orderID, itemID, newDiscount) => {
            let found = false;

            for (let i = 0; i < data.length; i++) {
                const order = data[i];
                for (let j = 0; j < order.OrderItemDetails.length; j++) {
                    const item = order.OrderItemDetails[j];
                    if (order.OrderIDs[0] === orderID && item.Item === itemID) {
                        item.Discount = newDiscount;
                        found = true;
                        break; // This will break out of the inner loop
                    }
                }

                if (found) {
                    break; // This will break out of the outer loop
                }
            };

            distributeItemStockGlobally();
        }, 100), [data, distributeItemStockGlobally]);

    const handleOrderDiscount = useCallback(
        debounce((orderID, newDiscount) => {

            for (let i = 0; i < data.length; i++) {
                const order = data[i];
                for (let j = 0; j < order.OrderItemDetails.length; j++) {
                    const item = order.OrderItemDetails[j];
                    item.Discount = newDiscount;
                }
                if (order.OrderIDs[0] === orderID) {

                    break; // This will break out of the outer loop
                }
            };
            distributeItemStockGlobally();
        }, 100), [data, distributeItemStockGlobally]);

    const handleOrderDiscountType = useCallback(
        debounce((orderID, newDiscountType) => {

            for (let i = 0; i < data.length; i++) {
                const order = data[i];
                for (let j = 0; j < order.OrderItemDetails.length; j++) {
                    const item = order.OrderItemDetails[j];
                    item.DiscountType = newDiscountType;
                }
                if (order.OrderIDs[0] === orderID) {

                    break; // This will break out of the outer loop
                }
            };

            distributeItemStockGlobally();
        }, 100), [data, distributeItemStockGlobally]);



    const contextValue = {//Memoize the context value to prevent unnecessary re-renders
        bulkData: data,
        globleItemStock,
        discountDropOption,
        setGlobleStockDistribute,
        globleStockDistribute,
        handleItemQuantityChange,
        handleDiscountChange,
        handleDiscountTypeChange,
        handleOrderDiscount,
        handleOrderDiscountType,
    }
    return (
        <BulkInvoiceContext.Provider value={contextValue}>
            {children}
        </BulkInvoiceContext.Provider>
    );
};

export const useBulkInvoiceContext = () => {
    const context = useContext(BulkInvoiceContext);
    if (!context) {
        throw new Error('useBulkInvoiceContext must be used within a BulkInvoiceProvider');
    }
    return context;
};
