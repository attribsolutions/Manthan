import { DELETE_PRICE_LIST_SUCCESS, GET_PRICE_LIST_DATA_SUCCESS, POST_PRICE_LIST_DATA_SUCCESS,EDIT_PRICE_LIST_SUCCESS,UPDATE_PRICE_LIST_SUCCESS } from "./actionType";

const INIT_STATE = {
  postMsg: { Status : false },
    priceListByPartyType: [],
    deleteMsg: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
  }

const PriceListReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // post api
        case POST_PRICE_LIST_DATA_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            };
        // GET api
        case GET_PRICE_LIST_DATA_SUCCESS:
            return {
                ...state,
                priceListByPartyType: action.payload,
            };

            // DELETE api
        case DELETE_PRICE_LIST_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
            };



            case EDIT_PRICE_LIST_SUCCESS:
          return {
            ...state,
            editData: action.payload,
          };
    
        
        case UPDATE_PRICE_LIST_SUCCESS:
          return {
            ...state,
            updateMessage: action.payload,
          };

        default:
            return state;
    }
};
export default PriceListReducer;
