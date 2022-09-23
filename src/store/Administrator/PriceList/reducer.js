import { DELETE_PRICE_LIST_SUCCESS, GET_PRICE_LIST_DATA_SUCCESS, POST_PRICE_LIST_DATA_SUCCESS } from "./actionType";

const INIT_STATE = {
    PostData: [],
    priceListByPartyType: [],
    deletePriceMsg:[]
};

const PriceListReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // post api
        case POST_PRICE_LIST_DATA_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
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
                deletePriceMsg: action.payload,
            };



        default:
            return state;
    }
};
export default PriceListReducer;
