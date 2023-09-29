import { loginSelectedPartyID } from "../../../components/Common/CommonFunction";
import { getBatchCode_By_ItemID_api } from "../../../helpers/backend_helper";

export function stockQtyUnit_SelectOnchange(event, index1) {
    
    try {
        index1.default_UnitDropvalue = event;
        let totalQuantity = 0;

        index1.StockDetails.forEach(index2 => {
            
            const _hasActualQuantity = Number(index2.BaseUnitQuantity / event.BaseUnitQuantity);
            const _hasQuantity = Number(index2.Qty / event.BaseUnitQuantity);
            totalQuantity += _hasQuantity;

            document.getElementById(`ActualQuantity-${index1.id}-${index2.id}`).innerText = _hasActualQuantity.toFixed(2);
            document.getElementById(`batchQty${index1.id}-${index2.id}`).value = _hasQuantity.toFixed(2);
            document.getElementById(`OrderQty-${index1.id}`).value = totalQuantity.toFixed(2);
        })

    } catch (error) {
        console.error("An error occurred when Stock Unit change:", error);
    }
}

export const getItemDefaultUnitOption = (unitOptions) => {
    return unitOptions.find(option => option.UnitName.includes("No"));
};

const createStockDetail = (item) => ({
    id: item.id,
    Qty: item.BaseUnitQuantity,
    ...item, // Spread the rest of the properties
});

const createBatchCodeDetail = (item) => ({
    id: item.id,
    value: item.id,
    label: `${item.BatchCode} (${item.SystemBatchCode}) MRP:${item.MRP} Qty:${item.BaseUnitQuantity}`,
    Qty: item.BaseUnitQuantity,
    ...item, // Spread the rest of the properties
});

export const AddItemInTableFunc = async ({ itemNameSelect, TableArr }) => {

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

    const defaultUnitOption = getItemDefaultUnitOption(resp.Data[0].UnitOptions);
    const totalOriginalBaseUnitQuantity = resp.Data.reduce(
        (total, item) => total + parseFloat(item.BaseUnitQuantity),
        0
    );

    const stockDetails = resp.Data
        .filter((item) => parseFloat(item.BaseUnitQuantity) > 0)
        .map(createStockDetail);

    const batchCodeDetails = resp.Data
        .filter((item) => parseFloat(item.BaseUnitQuantity) === 0)
        .map(createBatchCodeDetail);

    data.push({
        id: resp.Data[0].id,
        Item: resp.Data[0].Item,
        ItemName: resp.Data[0].ItemName,
        defaultUnitOption: {
            value: defaultUnitOption.Unit,
            label: defaultUnitOption.UnitName,
            BaseUnitQuantity: defaultUnitOption.BaseUnitQuantity,
        },
        UnitDetails: resp.Data[0].UnitOptions.map((i) => ({
            value: i.Unit,
            label: i.UnitName,
            BaseUnitQuantity: i.BaseUnitQuantity,
        })),
        Quantity: totalOriginalBaseUnitQuantity,
        StockDetails: stockDetails,
        BatchCodeDetails: batchCodeDetails,
    });

    return { TableArr: data, message: "", type: 0 };
};
