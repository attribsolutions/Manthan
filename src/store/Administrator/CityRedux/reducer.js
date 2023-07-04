import {
    CITY_API_ERROR_ACTION,
    GET_CITY_LIST,
    GET_CITY_LIST_SUCCESS,
    SAVE_CITY_MASTER,
    SAVE_CITY_MASTER_SUCCESS,
} from "./actionType";

const INIT_STATE = {
    loading: false,
    cityListData: [],
    PostData: { Status: false },
    saveBtnloading: false,
    listBtnLoading: false,
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

        case GET_CITY_LIST:
            return {
                ...state,
                cityListData:[],
                listBtnLoading: true,
            }

        case GET_CITY_LIST_SUCCESS:
            return {
                ...state,
                cityListData: action.payload,
                listBtnLoading: false,
            }

        case CITY_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default CityReducer  