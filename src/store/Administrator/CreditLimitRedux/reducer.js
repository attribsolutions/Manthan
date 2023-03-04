
import {
    //   UPDATE_ORDER_ID_FROM_ORDER_PAGE_SUCCESS,
    //   EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS,
    GO_BUTTON_FOR_CREDITLIMIT_PAGE_SUCCESS,
    POST_CREDITLIMIT_PAGE_SUCCESS,
    GET_ROUTESDROPDOWN_SUCCESS,
    //   GET_ORDER_LIST_PAGE_SUCCESS,
    //   ORDER_LIST_FILTERS,
} from "./actionTypes"

const INIT_STATE = {
     goBtnCreditLimitAdd:[],
     postMsg: { Status: false },
     Routes:[],
    // // editData: { Status: false },
    // // updateMsg: { Status: false },
}

const CreditLimitReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        // post
        case POST_CREDITLIMIT_PAGE_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }

        // get 
        case GET_ROUTESDROPDOWN_SUCCESS:
            return {
                ...state,
                Routes: action.payload,
            }
        //  del
        case GO_BUTTON_FOR_CREDITLIMIT_PAGE_SUCCESS:
            return {
                ...state,
                goBtnCreditLimitAdd: action.payload,
            };
        // edit
        //   case EDIT_GROUPMASTER_ID_SUCCESS :
        //     return {
        //       ...state,
        //       editData: action.payload,
        //     };

        //   // update api
        //   case UPDATE_GROUPMASTER_ID_SUCCESS:
        //     return {
        //       ...state,
        //       updateMsg: action.payload,
        //     };

        default:
            return state
    }
}

export default CreditLimitReducer