
import {
    SAVE_MRP_MASTER_SUCCESS,
    GET_MRP_LIST_SUCCESS,
    DELETE_MRP_LIST_SUCCESS,
    GO_BUTTON_FOR_MRP_MASTER_SUCCESS,
    DELETE_MRP_MASTER_ID_SUCCESS,
    GO_BUTTON_FOR_MRP_MASTER,
} from "./actionTypes";

const INIT_STATE = {
    MRPGoButton: [],
    postMsg: { Status: false },
    MRPList: [],
    deleteMsg: { Status: false },
    deleteIdForMRPMaster: { Status: false },
};

const MRPMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // post api
        case SAVE_MRP_MASTER_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            };

        case GO_BUTTON_FOR_MRP_MASTER:
            return {
                ...state,
                MRPGoButton: [],
            };

        // Go Button post api
        case GO_BUTTON_FOR_MRP_MASTER_SUCCESS:
            return {
                ...state,
                MRPGoButton: action.payload,
            };

        // GET api
        case GET_MRP_LIST_SUCCESS:
            return {
                ...state,
                MRPList: action.payload,
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
