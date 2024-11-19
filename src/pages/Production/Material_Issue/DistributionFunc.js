export function Qty_Distribution_Func(Data) {
    
    return Data.map(item => {
        let remainingQuantity = item.Quantity;

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
            // "OriginalWorkOrderQty": item.Quantity,
            BatchesData: updatedBatchesData
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
