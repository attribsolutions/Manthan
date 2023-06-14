import {
    DELETE_ID_FOR_MARGIN_MASTER_SUCCESS,
    DELETE_MARGIN_LIST_ID_SUCCESS,
    GET_MARGIN_LIST,
    GET_MARGIN_LIST_SUCCESS,
    GO_BUTTON_FOR_MARGIN_MASTER,
    GO_BUTTON_FOR_MARGIN_MASTER_SUCCESS,
    MARGIN_API_ERROR_ACTION,
    SAVE_MARGIN_MASTER,
    SAVE_MARGIN_MASTER_SUCCESS,
} from "./actionType";

const INIT_STATE = {
    postMsg: { Status: false },
    MarginList: [],
    deleteMsg: { Status: false },
    MarginGoButton: { Status: false },
    deleteId_For_MarginMaster: { Status: false },
    saveBtnloading: false,
    listLoading: false,
};

const MarginMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // post api
        case SAVE_MARGIN_MASTER:
            return {
                ...state,
                saveBtnloading: true,
            };

        case SAVE_MARGIN_MASTER_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false,
            };

        // GET api

        case GET_MARGIN_LIST:
            return {
                ...state,
                listLoading: true
            };

        case GET_MARGIN_LIST_SUCCESS:
            return {
                ...state,
                MarginList: action.payload,
                listLoading: false

            };

        // DELETE api
        case DELETE_MARGIN_LIST_ID_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
            };

        case GO_BUTTON_FOR_MARGIN_MASTER:
            return {
                ...state,
                MarginGoButton: [],
                listLoading: true,

            };

        // Go Button post api
        case GO_BUTTON_FOR_MARGIN_MASTER_SUCCESS:
            return {
                ...state,
                MarginGoButton: action.payload,
                listLoading: false,

            };

        // delete api Margin Master Page
        case DELETE_ID_FOR_MARGIN_MASTER_SUCCESS:
            return {
                ...state,
                deleteId_For_MarginMaster: action.payload,
            };

        case MARGIN_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listLoading: false,
            };



        default:
            return state;
    }
};
export default MarginMasterReducer;
