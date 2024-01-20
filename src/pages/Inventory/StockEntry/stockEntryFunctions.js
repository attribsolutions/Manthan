import * as _cfunc from "../../../components/Common/CommonFunction";

export async function ItemAPIResponseFunc(apiResponse, tableData) {

    const currentDate_ymd = _cfunc.date_ymd_func();
    
    try {
        // Convert API response to desired format
        const convert_ApiResponse = apiResponse.Data.InvoiceItems.map((i) => {
            const UnitDroupDownOptions = i.ItemUnitDetails.map((unit) => ({
                label: unit.UnitName,
                value: unit.Unit,
                IsBase: unit.IsBase,
                BaseUnitQuantity: unit.BaseUnitQuantity,
            }));

            const Default_Unit = UnitDroupDownOptions.find(unit => unit.IsBase);

            const MRP_DropdownOptions = i.ItemMRPDetails.map((mrp) => ({
                label: mrp.MRPValue,
                value: mrp.MRP,
            }));

            const Highest_MRP = MRP_DropdownOptions.reduce((prev, current) => {
                return prev.value > current.value ? prev : current;
            });

            const GST_DropdownOptions = i.ItemGSTDetails.map((gst) => ({
                label: gst.GSTPercentage,
                value: gst.GST,
            }));

            const Highest_GST = GST_DropdownOptions.reduce((prev, current) => {
                return prev.value > current.value ? prev : current;
            });

            return {
                UnitDroupDownOptions,
                MRP_DropdownOptions,
                GST_DropdownOptions,
                Default_Unit,
                Highest_MRP,
                Highest_GST,
                ItemName: i.ItemName,
                ItemId: i.Item,
                Quantity: i.Quantity,
            };
        });

        const dateString = currentDate_ymd.replace(/-/g, ""); // Convert date To DateString 

        const existingBatchCodes = {}; // Existing Batch Codes for comparison in table 

        convert_ApiResponse.forEach((index) => {
            const itemId = index.ItemId;

            let batchCodeCounter = 0;
            tableData.forEach((tableItem) => {
                if (tableItem.ItemId === itemId) {
                    const existingBatchCode = tableItem.BatchCode.split('_').pop(); // Extract the batchCode from existing BatchCode
                    batchCodeCounter = Math.max(batchCodeCounter, parseInt(existingBatchCode, 10) + 1);
                }
            });

            let newBatchCode = `${dateString}_${itemId}_${_cfunc.loginSelectedPartyID()}_${batchCodeCounter}`;

            while (existingBatchCodes[newBatchCode]) {
                batchCodeCounter++;
                newBatchCode = `${dateString}_${itemId}_${_cfunc.loginSelectedPartyID()}_${batchCodeCounter}`;
            }

            existingBatchCodes[newBatchCode] = true; // Record the new batch code as existing

            tableData.push({
                id: tableData.length + 1, // Use tableData length+1 as the ID
                Unit_DropdownOptions: index.UnitDroupDownOptions,
                MRP_DropdownOptions: index.MRP_DropdownOptions,
                ItemGSTHSNDetails: index.GST_DropdownOptions,
                ItemName: index.ItemName,
                ItemId: itemId,
                Quantity: index.Quantity,
                BatchDate: currentDate_ymd,
                BatchCode: newBatchCode,
                defaultUnit: index.Default_Unit,
                defaultMRP: index.Highest_MRP,
                defaultGST: index.Highest_GST,
            });
        });

        tableData.sort((a, b) => b.id - a.id);
        return tableData;

    } catch (error) {
        // Handle errors if needed
        console.error('Error in ItemAPIResponseFunc:', error);
        return null;
    }
}