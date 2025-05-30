import {

    DELETE_SCHEME_TYPE_ID,
    DELETE_SCHEME_TYPE_ID_SUCCESS,

    EDIT_SCHEME_TYPE_ID,
    EDIT_SCHEME_TYPE_ID_SUCCESS,

    GET_SCHEME_TYPE_LIST,
    GET_SCHEME_TYPE_LIST_SUCCESS,

    SAVE_SCHEME_TYPE_MASTER,
    SAVE_SCHEME_TYPE_SUCCESS,

    UPDATE_SCHEME_TYPE_ID,
    UPDATE_SCHEME_TYPE_ID_SUCCESS,

    VALIDE_SCHEME_TYPE_ID,
    VALIDE_SCHEME_TYPE_ID_SUCCESS,

    SCHEME_TYPE_ERROR_ACTION
} from "./actionType"

const INIT_STATE = {
    GroupType: [],
    PostData: { Status: false },
    deleteMessage: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
    saveBtnloading: false,
    listBtnLoading: false,
    goBtnLoading: false,
    VoucherValidityData: { Status: false },
    VoucherLoading: false,
}

const SchemeTypeReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GET_SCHEME_TYPE_LIST:
            return {
                ...state,
                goBtnLoading: true,

            }

        case   GET_SCHEME_TYPE_LIST_SUCCESS:
            return {
                ...state,
                GroupType: action.payload,
                goBtnLoading: false,

            }

        case  SAVE_SCHEME_TYPE_MASTER:
            return {
                ...state,
                saveBtnloading: true

            }

        case SAVE_SCHEME_TYPE_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
                saveBtnloading: false

            }


        case EDIT_SCHEME_TYPE_ID:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }



        case EDIT_SCHEME_TYPE_ID_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                editData: action.payload,
            }


        case  VALIDE_SCHEME_TYPE_ID:
            return {
                ...state,
                VoucherLoading: true,
            }



        case VALIDE_SCHEME_TYPE_ID_SUCCESS:
            return {
                ...state,
                VoucherLoading: false,
                VoucherValidityData: action.payload,
            }

        case UPDATE_SCHEME_TYPE_ID:
            return {
                ...state,
                saveBtnloading: true

            }

        case UPDATE_SCHEME_TYPE_ID_SUCCESS:
            return {
                ...state,
                updateMessage: action.payload,
                saveBtnloading: false

            }

        case DELETE_SCHEME_TYPE_ID:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }

        case DELETE_SCHEME_TYPE_ID_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                deleteMessage: action.payload,
            }

        case SCHEME_TYPE_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listBtnLoading: false,
                goBtnLoading: false
            };


        default:
            return state
    }
}

export default SchemeTypeReducer