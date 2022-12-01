import { GET_ITEM_UNITS_DROPDOWN_API_SUCCESS,
     POST_BOM_SUCCESS } from "./actionTypes"

const INIT_STATE = {
    PostData: { Status: false },
    GetItemUnits:[]
}

const BOMReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_BOM_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
            }

        // GetItemUnits API
        case GET_ITEM_UNITS_DROPDOWN_API_SUCCESS:
            return {
                ...state,
                GetItemUnits: action.payload,
            };

        default:
            return state
    }
}

export default BOMReducer