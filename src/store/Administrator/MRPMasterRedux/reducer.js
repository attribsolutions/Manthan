
import {
    SAVE_MRP_MASTER_SUCCESS,
    GET_MRP_LIST_SUCCESS,
    DELETE_MRP_LIST_SUCCESS,
    GO_BUTTON_FOR_MRP_MASTER_SUCCESS,
    DELETE_MRP_MASTER_ID_SUCCESS,
    GO_BUTTON_FOR_MRP_MASTER,
    SAVE_MRP_MASTER,
    GET_MRP_LIST,
} from "./actionTypes";

const INIT_STATE = {
    MRPGoButton: [],
    postMsg: { Status: false },
    MRPList: [],
    deleteMsg: { Status: false },
    deleteIdForMRPMaster: { Status: false },
    saveBtnloading: false,
    listLoading: false,
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
                listLoading: true,
            };

        // Go Button post api
        case GO_BUTTON_FOR_MRP_MASTER_SUCCESS:
            return {
                ...state,
                MRPGoButton: action.payload,
                listLoading: false,
            };

        // GET api

        case GET_MRP_LIST:
            return {
                ...state,
                listLoading: true,
            };


        case GET_MRP_LIST_SUCCESS:
            return {
                ...state,
                MRPList: action.payload,
                listLoading: false,
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

        default:
            return state;
    }
};
export default MRPMasterReducer;
