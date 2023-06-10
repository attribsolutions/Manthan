import {
    GET_CITY_LIST_SUCCESS,
    SAVE_CITY_MASTER_SUCCESS,
} from "./actionType";

const INIT_STATE = {
    cityListData:[],
    PostData: { Status: false },
}

const CityReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case SAVE_CITY_MASTER_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
            }

        case GET_CITY_LIST_SUCCESS:
            return {
                ...state,
                cityListData: action.payload,
            }

        default:
            return state
    }
}

export default CityReducer  