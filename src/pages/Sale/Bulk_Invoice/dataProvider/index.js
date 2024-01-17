
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { roundToDecimalPlaces } from '../../../../components/Common/CommonFunction';
import { itemAmounWithGst, settingBaseRoundOffOrderAmountFunc } from '../util/calculationFunc';

const BulkInvoiceContext = createContext();

export const BulkInvoiceProvider = ({ children, data }) => {

    const [globleStockDistribute, setGlobleStockDistribute] = useState({});
    const [globlebulkInvoiceData, setGloblebulkInvoiceData] = useState(data);
    const discountDropOption = [{ value: 1, label: "Rs" }, { value: 2, label: "%" }];
    debugger
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
debugger
            });
        });

        // console.log("newGlobalStock=", JSON.stringify(newGlobalStock));
        return newGlobalStock;
    }, [data]);


    useEffect(() => {
        distributeItemStockGlobally(globlebulkInvoiceData)
    }, [globleItemStock])

    const distributeItemStockGlobally = useCallback(
        (oldData) => {
            const newGlobalStock = JSON.parse(JSON.stringify(globleItemStock))
            const newGlobalData = JSON.parse(JSON.stringify(oldData))

            newGlobalData.forEach(order => {
                let orderAmountWithGst = 0

                order.OrderItemDetails.forEach(orderItem => {
                    const itemId = `itemId-${orderItem.Item}`;
                    let orderQty = parseFloat(orderItem.modifiedQuantity);
                    let itemAmountWithGst = 0;

                    orderItem.StockDetails.forEach(stockDetail => {
                        const stockId = `stockId-${stockDetail.id}`;

                        let batchStock = newGlobalStock[itemId][stockId].baseStock;
                        let itemStock = newGlobalStock[itemId].totalStock;
                        let distribute = 0;
                        let remaining = 0;


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
                        if (distribute > 0.0) {

                            const calculatedBachAmount = itemAmounWithGst({
                                Rate: stockDetail.Rate,
                                modifiedQuantity: distribute,
                                GSTPercentage: orderItem.GSTPercentage,
                                Discount: orderItem.Discount,
                                DiscountType: orderItem.DiscountType?.value,
                                IsComparGstIn: true
                            });
                            itemAmountWithGst += calculatedBachAmount?.roundedTotalAmount || 0
                            stockDetail.calculatedBachAmount = calculatedBachAmount;
                        }

                        stockDetail.distribute = distribute;
                        stockDetail.remaining = remaining;
                    });

                    if (orderQty > 0.0) {
                        orderItem.lessStock = roundToDecimalPlaces(orderQty);
                    }
                    const orderAmountCalculation = settingBaseRoundOffOrderAmountFunc({
                        IsTCSParty: false,
                        IsCustomerPAN: false,
                        sumOfItemAmount: itemAmountWithGst
                    });
                    orderItem.orderAmountCalculation = orderAmountCalculation;
                    orderItem.itemAmountWithGst = orderAmountCalculation?.sumOfItemAmount;
                    orderAmountWithGst += itemAmountWithGst;

                });
                order.orderAmountWithGst = roundToDecimalPlaces(orderAmountWithGst, 2);
            });

debugger
            setGloblebulkInvoiceData(newGlobalData)
        }, []);


    const handleItemQuantityChange = useCallback(
        debounce((orderID, itemID, newQuantity) => {
            const oldData = JSON.parse(JSON.stringify(globlebulkInvoiceData));
            let found = false;

            for (let i = 0; i < oldData.length; i++) {
                const order = oldData[i];
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
            distributeItemStockGlobally(oldData);
        }, 300), [globlebulkInvoiceData]);

    const handleDiscountTypeChange = useCallback(
        debounce((orderID, itemID, newDiscountType) => {

            const oldData = JSON.parse(JSON.stringify(globlebulkInvoiceData ));
            let found = false;
debugger
            for (let i = 0; i < oldData.length; i++) {
                const order = oldData[i];
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

            distributeItemStockGlobally(oldData);
        }, 100), [globlebulkInvoiceData]);

    const handleDiscountChange = useCallback(
        debounce((orderID, itemID, newDiscount) => {
            const oldData = JSON.parse(JSON.stringify(globlebulkInvoiceData));
            let found = false;
            for (let i = 0; i < oldData.length; i++) {
                const order = oldData[i];
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

            distributeItemStockGlobally(oldData);
        }, 100), [globlebulkInvoiceData]);


    const handleOrderDiscount = useCallback(
        debounce((orderID, newDiscount) => {
            const oldData = JSON.parse(JSON.stringify(globlebulkInvoiceData));
            debugger
            for (let i = 0; i < oldData.length; i++) {
                const order = oldData[i];
                for (let j = 0; j < order.OrderItemDetails.length; j++) {
                    const item = order.OrderItemDetails[j];
                    item.Discount = newDiscount;
                }
                if (order.OrderIDs[0] === orderID) {

                    break; // This will break out of the outer loop
                }
            };
            distributeItemStockGlobally(oldData);
        }, 100), [globlebulkInvoiceData]);

    const handleOrderDiscountType = useCallback(
        debounce((orderID, newDiscountType) => {
            const oldData = JSON.parse(JSON.stringify(globlebulkInvoiceData));

            for (let i = 0; i < oldData.length; i++) {
                const order = oldData[i];
                for (let j = 0; j < order.OrderItemDetails.length; j++) {
                    const item = order.OrderItemDetails[j];
                    item.DiscountType = newDiscountType;
                }
                if (order.OrderIDs[0] === orderID) {

                    break; // This will break out of the outer loop
                }
            };

            distributeItemStockGlobally(oldData);
        }, 100), [globlebulkInvoiceData]);



    const contextValue = {//Memoize the context value to prevent unnecessary re-renders
        bulkData: globlebulkInvoiceData,
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
