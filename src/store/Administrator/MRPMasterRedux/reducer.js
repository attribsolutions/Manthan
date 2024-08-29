
import {
    SAVE_MRP_MASTER_SUCCESS,
    GET_MRP_LIST_SUCCESS,
    DELETE_MRP_LIST_SUCCESS,
    GO_BUTTON_FOR_MRP_MASTER_SUCCESS,
    DELETE_MRP_MASTER_ID_SUCCESS,
    GO_BUTTON_FOR_MRP_MASTER,
    SAVE_MRP_MASTER,
    GET_MRP_LIST,
    MRP_API_ERROR_ACTION,
    POST_VIEW_MRP,
    POST_VIEW_MRP_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
    MRPGoButton: [],
    postMsg: { Status: false },
    MRPList: [],
    deleteMsg: { Status: false },
    deleteIdForMRPMaster: { Status: false },
    saveBtnloading: false,
    listBtnLoading: false,
    MRPView: []
};

const MRPMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // post api
        case SAVE_MRP_MASTER:
            return {
                ...state,
                saveBtnloading: true,
            };

        case SAVE_MRP_MASTER_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false,
            };

        case GO_BUTTON_FOR_MRP_MASTER:
            return {
                ...state,
                MRPGoButton: [],
                listBtnLoading: true,
            };

        // Go Button post api
        case GO_BUTTON_FOR_MRP_MASTER_SUCCESS:
            return {
                ...state,
                MRPGoButton: action.payload,
                listBtnLoading: false,
            };



        case POST_VIEW_MRP:
            return {
                ...state,
                MRPView: [],
                listBtnLoading: action.config.btnId,
            };

        // Go Button post api
        case POST_VIEW_MRP_SUCCESS:
            return {
                ...state,
                MRPView: action.payload,
                listBtnLoading: false,
            };



        // GET api

        case GET_MRP_LIST:
            return {
                ...state,
                listBtnLoading: true,
            };


        case GET_MRP_LIST_SUCCESS:
            return {
                ...state,
                MRPList: action.payload,
                listBtnLoading: false,
            };

        // DELETE api
        case DELETE_MRP_LIST_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
            };

        // delete api MRP Master Page
        case DELETE_MRP_MASTER_ID_SUCCESS:
            return {
                ...state,
                deleteIdForMRPMaster: action.payload,
            };

        case MRP_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listBtnLoading: false,
            };

        default:
            return state;
    }
};
export default MRPMasterReducer;
