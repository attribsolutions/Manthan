import {
    ITEM_WISE_BULK_UPDATE_GO_BUTTON_ACTION,
    ITEM_WISE_BULK_UPDATE_API_ERROR_ACTION,
    ITEM_WISE_BULK_UPDATE_GO_BUTTON_SUCCESS,
    ITEM_WISE_BULK_UPDATE_SAVE_ACTION,
    ITEM_WISE_BULK_UPDATE_SAVE_SUCCESS
} from "./actionType";

const INIT_STATE = {
    postMsg: { Status: false },
    goButtonData: [],

    loading: false,
    saveBtnloading: false,
}

const ItemWiseUpdateReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case ITEM_WISE_BULK_UPDATE_GO_BUTTON_ACTION:
            return {
                ...state,
                loading: true,
            }

        case ITEM_WISE_BULK_UPDATE_GO_BUTTON_SUCCESS:
            return {
                ...state,
                goButtonData: action.payload,
                loading: false,
            }

        case ITEM_WISE_BULK_UPDATE_SAVE_ACTION:
            return {
                ...state,
                saveBtnloading: true,
            }

        case ITEM_WISE_BULK_UPDATE_SAVE_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false,
            }

        case ITEM_WISE_BULK_UPDATE_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                loading: false,
            };
        default:
            return state
    }
}

export default ItemWiseUpdateReducer