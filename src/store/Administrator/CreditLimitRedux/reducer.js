
import {
    GO_BUTTON_FOR_CREDITLIMIT_PAGE,
    GO_BUTTON_FOR_CREDITLIMIT_PAGE_SUCCESS,
    POST_CREDITLIMIT_PAGE,
    POST_CREDITLIMIT_PAGE_SUCCESS,
} from "./actionTypes"

const INIT_STATE = {
    goButtonCreditLimit: [],
    postMsg: { Status: false },
    saveBtnloading: false,
    listBtnLoading: false,
}

const CreditLimitReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_CREDITLIMIT_PAGE:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: true
            }

        case POST_CREDITLIMIT_PAGE_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false
            }

        case GO_BUTTON_FOR_CREDITLIMIT_PAGE:
            return {
                ...state,
                listBtnLoading: true,
            };

        case GO_BUTTON_FOR_CREDITLIMIT_PAGE_SUCCESS:
            return {
                ...state,
                goButtonCreditLimit: action.payload,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default CreditLimitReducer