import {
    GO_BUTTON_SERVICE_ITEM_ASSIGN,
    GO_BUTTON_SERVICE_ITEM_ASSIGN_SUCCESS,
    SAVE_SERVICE_ITEM_ASSIGN_ACTION,
    SAVE_SERVICE_ITEM_ASSIGN_SUCCESS,
    SERVICE_ITEM_ASSIGN_API_ERROR_ACTION
} from "./actionType"

const INIT_STATE = {

    postMsg: { Status: false },
    ServiceItemAssignList: [],

    ServiceItemListLoading: false,
    saveBtnloading: false
}

const ServiceItemAssignReducer = (state = INIT_STATE, action) => {

    switch (action.type) {

        case SAVE_SERVICE_ITEM_ASSIGN_ACTION:
            return {
                ...state,
                saveBtnloading: true
            }

        case SAVE_SERVICE_ITEM_ASSIGN_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false
            }

        case GO_BUTTON_SERVICE_ITEM_ASSIGN:
            return {
                ...state,
                ServiceItemListLoading: true,
            }

        case GO_BUTTON_SERVICE_ITEM_ASSIGN_SUCCESS:
            return {
                ...state,
                ServiceItemAssignList: action.payload,
                ServiceItemListLoading: false,
            }

        case SERVICE_ITEM_ASSIGN_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                ServiceItemListLoading: false,
            }

        default:
            return state
    }
}

export default ServiceItemAssignReducer