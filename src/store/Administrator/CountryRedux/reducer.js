import {
    COUNTRY_API_ERROR_ACTION,
    DELETE_COUNTRY_ID_ACTION,
    DELETE_COUNTRY_ID_SUCCESS,
    EDIT_COUNTRY_ID_ACTION,
    EDIT_COUNTRY_ID_SUCCESS,
    GET_COUNTRY_LIST_ACTION,
    GET_COUNTRY_LIST_SUCCESS,
    SAVE_COUNTRY_MASTER_ACTION,
    SAVE_COUNTRY_MASTER_SUCCESS,
    UPDATE_COUNTRY_ID_ACTION,
    UPDATE_COUNTRY_ID_SUCCESS
} from "./actionType"


const INIT_STATE = {
    loading: false,
    CountryList: [],
    postMsg: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
    deleteMessage: { Status: false },
    saveBtnloading: false,
    listBtnLoading: false,
}

const CountryReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case SAVE_COUNTRY_MASTER_ACTION:
            return {
                ...state,
                saveBtnloading: true,
            }

        case SAVE_COUNTRY_MASTER_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false,
            }

        case GET_COUNTRY_LIST_ACTION:
            return {
                ...state,
                loading: true,
            }

        case GET_COUNTRY_LIST_SUCCESS:
            return {
                ...state,
                CountryList: action.payload,
                loading: false
            }

        case DELETE_COUNTRY_ID_ACTION:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
                deleteMsg: action.payload,
            }

        case DELETE_COUNTRY_ID_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                deleteMsg: action.payload,
            };

        case EDIT_COUNTRY_ID_ACTION:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }

        case EDIT_COUNTRY_ID_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                editData: action.payload,
            };

        case UPDATE_COUNTRY_ID_ACTION:
            return {
                ...state,
                saveBtnloading: true,

            };

        case UPDATE_COUNTRY_ID_SUCCESS:
            return {
                ...state,
                updateMessage: action.payload,
                saveBtnloading: false,
            };

        case COUNTRY_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listBtnLoading: false,
                loading: false
            };

        default:
            return state
    }
}

export default CountryReducer