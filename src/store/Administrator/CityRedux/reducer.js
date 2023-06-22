import {
    CITY_API_ERROR_ACTION,
    GET_CITY_LIST_SUCCESS,
    SAVE_CITY_MASTER,
    SAVE_CITY_MASTER_SUCCESS,
} from "./actionType";

const INIT_STATE = {
    cityListData: [],
    PostData: { Status: false },
    saveBtnloading: false
}

const CityReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case SAVE_CITY_MASTER:
            return {
                ...state,
                saveBtnloading: true
            }

        case SAVE_CITY_MASTER_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
                saveBtnloading: false
            }

        case GET_CITY_LIST_SUCCESS:
            return {
                ...state,
                cityListData: action.payload,
            }

        case CITY_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,

            };



        default:
            return state
    }
}

export default CityReducer  