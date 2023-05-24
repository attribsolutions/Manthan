import {
    DELETE_ID_FOR_MARGIN_MASTER_SUCCESS,
    DELETE_MARGIN_LIST_ID_SUCCESS,
    GET_MARGIN_LIST_SUCCESS,
    GO_BUTTON_FOR_MARGIN_MASTER,
    GO_BUTTON_FOR_MARGIN_MASTER_SUCCESS,
    SAVE_MARGIN_MASTER_SUCCESS,
} from "./actionType";

const INIT_STATE = {
    postMsg: { Status: false },
    MarginList: [],
    deleteMsg: { Status: false },
    MarginGoButton: { Status: false },
    deleteId_For_MarginMaster: { Status: false },
};

const MarginMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // post api
        case SAVE_MARGIN_MASTER_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            };

        // GET api
        case GET_MARGIN_LIST_SUCCESS:
            return {
                ...state,
                MarginList: action.payload,
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
            };

        // Go Button post api
        case GO_BUTTON_FOR_MARGIN_MASTER_SUCCESS:
            return {
                ...state,
                MarginGoButton: action.payload,
            };

        // delete api Margin Master Page
        case DELETE_ID_FOR_MARGIN_MASTER_SUCCESS:
            return {
                ...state,
                deleteId_For_MarginMaster: action.payload,
            };

        default:
            return state;
    }
};
export default MarginMasterReducer;
