
import {
    GO_BUTTON_FOR_CREDITLIMIT_PAGE_SUCCESS,
    POST_CREDITLIMIT_PAGE,
    POST_CREDITLIMIT_PAGE_SUCCESS,
} from "./actionTypes"

const INIT_STATE = {
    goButtonCreditLimit: [],
    postMsg: { Status: false },
    saveBtnloading:false,
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

        case GO_BUTTON_FOR_CREDITLIMIT_PAGE_SUCCESS:
            return {
                ...state,
                goButtonCreditLimit: action.payload,
            };

        default:
            return state
    }
}

export default CreditLimitReducer