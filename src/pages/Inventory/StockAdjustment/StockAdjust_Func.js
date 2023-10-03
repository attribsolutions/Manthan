import { loginSelectedPartyID, roundToDecimalPlaces } from "../../../components/Common/CommonFunction";
import { getBatchCode_By_ItemID_api } from "../../../helpers/backend_helper";



export function stockQtyUnit_SelectOnchange(event, index1) {

    try {
        index1.defaultUnitSelect = event
        index1.UnitID = event.value

        let totalQuantity = 0;

        index1.StockDetails.forEach(index2 => {

            const _hasActualQuantity = Number(index2.BaseUnitQuantity / event.BaseUnitQuantity);
            totalQuantity += _hasActualQuantity;

            index2.ActualQuantity = roundToDecimalPlaces(_hasActualQuantity, 3);//max 3 decimal 
            index2.Qty = index2.ActualQuantity


            document.getElementById(`ActualQuantity-${index1.id}-${index2.id}`).innerText = index2.ActualQuantity
            document.getElementById(`batchQty${index1.id}-${index2.id}`).value = index2.Qty;
        })
        document.getElementById(`OrderQty-${index1.id}`).value = roundToDecimalPlaces(totalQuantity, 3);//max 3 decimal 

    } catch (error) {
        console.error("An error occurred when Stock Unit change:", error);
    }
}



export const getItemDefaultUnitOption = (unitOptions) => {
    return unitOptions.find(option => option.UnitName.includes("No"));
};

const createStockDetail = (item) => ({
    id: item.id,
    ActualQuantity: roundToDecimalPlaces(item.BaseUnitQuantity, 3),
    Qty: roundToDecimalPlaces(item.BaseUnitQuantity, 3),
    ...item, // Spread the rest of the properties
});

const createBatchCodeDetail = (item) => ({
    id: item.id,
    value: item.id,
    // label: `${item.BatchCode} (${item.SystemBatchCode}) MRP:${item.MRP} Qty:${item.BaseUnitQuantity}`,
    label: item.SystemBatchCode,
    ActualQuantity: item.BaseUnitQuantity,
    Qty: item.BaseUnitQuantity,
    ...item, // Spread the rest of the properties
});





export const AddItemInTableFunc = async ({ itemNameSelect, TableArr }) => {
    debugger
    let isfound = TableArr.find(i => i.Item === itemNameSelect.value);
    if (!itemNameSelect) {
        return { TableArr, data: [], message: "Please Select ItemName", type: 4 };
    }
    else if (!(isfound === undefined)) {
        return { TableArr, data: [], message: "This ItemName Already Exist", type: 3 };
    }

    const data = [...TableArr];

    // click on Item Add button then API call
    const resp = await getBatchCode_By_ItemID_api({
        itemId: itemNameSelect.value,
        partyId: loginSelectedPartyID(),
    });

    if (resp.Data.length === 0) {
        return {
            TableArr,
            data: [],
            message: resp.Message,
            type: 3,
        };
    }
    const respData = resp.Data;
    const zeroIndexObject = resp.Data[0];

    const hasBaseUnit = zeroIndexObject.UnitOptions.find(i => i.IsBase === true);
    debugger
    if (hasBaseUnit === undefined) {
        return {
            TableArr,
            data: [],
            message: "base Unit Not find",
            type: 3,
        };
    }
    //************************************************************//
    zeroIndexObject.UnitID = hasBaseUnit.Unit
    zeroIndexObject.UnitName = hasBaseUnit.UnitName;
    // zeroIndexObject.BaseUnitQuantity = hasBaseUnit.BaseUnitQuantity

    //**************************************************************//

    const totalOriginalBaseUnitQuantity = respData.reduce(
        (total, item) => total + parseFloat(item.BaseUnitQuantity),
        0
    );

    const stockDetails = respData
        .filter((item) => parseFloat(item.BaseUnitQuantity) > 0)
        .map(createStockDetail);

    const batchCodeDetails = respData
        .filter((item) => parseFloat(item.BaseUnitQuantity) === 0)
        .map(createBatchCodeDetail);


    data.push({
        id: zeroIndexObject.id,
        Item: zeroIndexObject.Item,

        ItemName: zeroIndexObject.ItemName,
        UnitID: zeroIndexObject.UnitID,
        BaseUnitQuantity: zeroIndexObject.BaseUnitQuantity,

        defaultUnitSelect: {
            value: zeroIndexObject.UnitID,
            label: zeroIndexObject.UnitName,
            BaseUnitQuantity: zeroIndexObject.BaseUnitQuantity
        },

        unitDetailsOptions: zeroIndexObject.UnitOptions.map((i) => ({
            value: i.Unit,
            label: i.UnitName,
            BaseUnitQuantity: i.BaseUnitQuantity,
        })),

        Quantity: totalOriginalBaseUnitQuantity,
        StockDetails: stockDetails,
        BatchCodeDetailsOptions: batchCodeDetails,
    });

    return { TableArr: data, message: "", type: 0 };
};
