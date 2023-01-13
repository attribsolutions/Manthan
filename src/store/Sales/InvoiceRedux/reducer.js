import { GO_BUTTON_POST_FOR_INVOICE_SUCCESS } from "./actionType"

const INIT_STATE = {
    GoButton: [],
   }

const InvoiceReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // GO Button 
        case GO_BUTTON_POST_FOR_INVOICE_SUCCESS:
            return {
                ...state,
                GoButton: action.payload,
            }
            default:
                return state
    }
    
}

export default InvoiceReducer