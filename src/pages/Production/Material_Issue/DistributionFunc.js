export function Qty_Distribution_Func(Data) {
    debugger
    return Data.map(item => {
        let remainingQuantity = item.Quantity;
        let TotalStock = 0;
        const updatedBatchesData = item.BatchesData.map(batch => {
            const quantity = Number((batch.ObatchwiseQuantity).toFixed(2));
            const distributedQuantity = Math.min(remainingQuantity, quantity);
            TotalStock += quantity;
            remainingQuantity -= distributedQuantity;
            return {
                ...batch,
                Qty: distributedQuantity.toString()
            };
        });

        return {
            ...item,
            // "OriginalWorkOrderQty": item.Quantity,
            BatchesData: updatedBatchesData,
            TotalStock: TotalStock
        };
    });
}

export function updateWorkOrderQuantity_By_Lot(Data, NumberOfLot, noOfLotForDistribution, originalQty) {

    return Data.map(item => {
        let remainingQuantity = ((parseFloat(item.OriginalWorkOrderQty) / noOfLotForDistribution) * parseFloat(NumberOfLot)).toFixed(2)

        const updatedBatchesData = item.BatchesData.map(batch => {

            const quantity = parseFloat(batch.ObatchwiseQuantity);
            const distributedQuantity = Math.min(remainingQuantity, quantity);
            remainingQuantity -= distributedQuantity;
            return {
                ...batch,
                Qty: distributedQuantity.toString()
            };
        });

        return {
            ...item,
            Quantity: ((parseFloat(item.OriginalWorkOrderQty) / noOfLotForDistribution) * parseFloat(NumberOfLot)).toFixed(2),
            // "OriginalWorkOrderQty": ((parseFloat(originalQty) / noOfLotForDistribution) * parseFloat(NumberOfLot)).toFixed(2),
            BatchesData: updatedBatchesData
        };
    });
}
