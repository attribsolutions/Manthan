import { GO_BUTTON_POST_FOR_INVOICE_SUCCESS, POST_INVOICE_MASTER_SUCCESS } from "./actionType"

const INIT_STATE = {
    GoButton: [],
    postMsg:{ Status: false },
}

const InvoiceReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // GO Button 
        case GO_BUTTON_POST_FOR_INVOICE_SUCCESS:
            return {
                ...state,
                GoButton: action.payload,
            }

        case POST_INVOICE_MASTER_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }
        default:
            return state
    }

}

export default InvoiceReducer