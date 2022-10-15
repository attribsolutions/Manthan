
import {
    POST_MRP_MASTER_DATA_SUCCESS,
    GET_MRP_LIST_PAGE_SUCCESS,
    DELETE_MRP_LIST_PAGE_SUCCESS,
    EDIT_MRP_LIST_PAGE_SUCCESS,
    UPDATE_MRP_LIST_PAGE_SUCCESS,
    POST_GO_BUTTON_FOR_MRP_MASTER_SUCCESS,
    DELETE_ID_IN_MASTERPAGE_SUCCESS,
    POST_GO_BUTTON_FOR_MRP_MASTER,

} from "./actionTypes";

const INIT_STATE = {
    MRPGoButton: [],
    postMsg: { Status: false },
    MRPList: [],
    deleteMsg: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
    deleteIdForMRPMaster: { Status: false },
};

const MRPMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // post api
        case POST_MRP_MASTER_DATA_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            };

            // case POST_GO_BUTTON_FOR_MRP_MASTER:
            // return {
            //     ...state,
            //     MRPGoButton: [],
            // };

        // Go Button post api
        case POST_GO_BUTTON_FOR_MRP_MASTER_SUCCESS:
            return {
                ...state,
                MRPGoButton: action.payload,
            };

        // GET api
        case GET_MRP_LIST_PAGE_SUCCESS:
            return {
                ...state,
                MRPList: action.payload,
            };

        // DELETE api
        case DELETE_MRP_LIST_PAGE_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
            };



        case EDIT_MRP_LIST_PAGE_SUCCESS:
            return {
                ...state,
                editData: action.payload,
            };


        case UPDATE_MRP_LIST_PAGE_SUCCESS:
            return {
                ...state,
                updateMessage: action.payload,
            };

        // delete api MRP Master Page
        case DELETE_ID_IN_MASTERPAGE_SUCCESS:
            return {
                ...state,
                deleteIdForMRPMaster: action.payload,
            };
        default:
            return state;
    }
};
export default MRPMasterReducer;
