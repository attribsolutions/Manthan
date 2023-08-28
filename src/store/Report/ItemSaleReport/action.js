import {
    ITEMS_ON_GROUP_AND_SUBGROUP_API,
    ITEMS_ON_GROUP_AND_SUBGROUP_API_SUCCESS,
    ITEM_SALE_GO_BUTTON_API,
    ITEM_SALE_GO_BUTTON_API_SUCCESS,
    ITEM_SALE_REPORT_API_ERROR_ACTION,
    SUPPLIER_ON_PARTYTYPE_API,
    SUPPLIER_ON_PARTYTYPE_API_SUCCESS
} from "./actionType";

// Item Sale Report Go Button API
export const ItemSaleGoButton_API = (config = {}) => ({
    type: ITEM_SALE_GO_BUTTON_API,
    config,
});

export const ItemSaleGoButton_API_Success = (resp) => ({
    type: ITEM_SALE_GO_BUTTON_API_SUCCESS,
    payload: resp,
});

// Supplier API depends on Channel From(Party Type)
export const SupplierOnPartyType_API = (config = {}) => ({
    type: SUPPLIER_ON_PARTYTYPE_API,
    config,
});

export const SupplierOnPartyType_API_Success = (resp) => ({
    type: SUPPLIER_ON_PARTYTYPE_API_SUCCESS,
    payload: resp,
});

// Item dropdown API depends on Group and Sub-Group
export const Items_On_Group_And_Subgroup_API = (config = {}) => ({
    type: ITEMS_ON_GROUP_AND_SUBGROUP_API,
    config,
});

export const Items_On_Group_And_Subgroup_API_Success = (resp) => ({
    type: ITEMS_ON_GROUP_AND_SUBGROUP_API_SUCCESS,
    payload: resp,
});

// Item Sale Report API Error Action
export const ItemSaleReportApiErrorAction = () => ({
    type: ITEM_SALE_REPORT_API_ERROR_ACTION,
})