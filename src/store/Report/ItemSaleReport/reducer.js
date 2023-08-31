import { ITEMS_ON_GROUP_AND_SUBGROUP_API, ITEMS_ON_GROUP_AND_SUBGROUP_API_SUCCESS, ITEM_SALE_GO_BUTTON_API, ITEM_SALE_GO_BUTTON_API_SUCCESS, ITEM_SALE_REPORT_API_ERROR_ACTION, SUPPLIER_ON_PARTYTYPE_API, SUPPLIER_ON_PARTYTYPE_API_SUCCESS } from "./actionType";

const INIT_STATE = {
    ItemSaleReportGobtn: [],
    supplierList: [],
    itemList: [],

    goBtnLoading: false,
    itemListLoading: false,
    supplierListLoading: false
}

const ItemSaleReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case ITEM_SALE_GO_BUTTON_API:
            return {
                ...state,
                goBtnLoading: action.config.btnId
            }

        case ITEM_SALE_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                ItemSaleReportGobtn: action.payload,
                goBtnLoading: false
            }

        case SUPPLIER_ON_PARTYTYPE_API:
            return {
                ...state,
                supplierListLoading: action.config.btnId
            }

        case SUPPLIER_ON_PARTYTYPE_API_SUCCESS:
            return {
                ...state,
                supplierList: action.payload,
                supplierListLoading: false
            }

        case ITEMS_ON_GROUP_AND_SUBGROUP_API:
            return {
                ...state,
                itemListLoading: action.config.btnId
            }

        case ITEMS_ON_GROUP_AND_SUBGROUP_API_SUCCESS:
            return {
                ...state,
                itemList: action.payload,
                itemListLoading: false
            }

        case ITEM_SALE_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                goBtnLoading: false,
                itemListLoading: false,
                supplierListLoading: false
            };

        default:
            return state
    }
}

export default ItemSaleReportReducer  