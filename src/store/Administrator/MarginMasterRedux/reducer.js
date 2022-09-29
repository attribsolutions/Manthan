import { DELETE_MARGIN_LIST_PAGE_SUCCESS, 
       EDIT_MARGIN_LIST_PAGE_SUCCESS,
      GET_MARGIN_LIST_PAGE_SUCCESS,
      POST_MARGIN_MASTER_DATA_SUCCESS,
       UPDATE_MARGIN_LIST_PAGE_SUCCESS 
    } from "./actionType";

const INIT_STATE = {
    PostData: [],
    MarginList: [],
    deleteMsg: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
};

const MarginMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // post api
        case POST_MARGIN_MASTER_DATA_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
            };
      
 // GET api
 case GET_MARGIN_LIST_PAGE_SUCCESS:
    return {
        ...state,
        MarginList: action.payload,
    };

// DELETE api
case DELETE_MARGIN_LIST_PAGE_SUCCESS:
    return {
        ...state,
        deleteMsg: action.payload,
    };



case EDIT_MARGIN_LIST_PAGE_SUCCESS:
    return {
        ...state,
        editData: action.payload,
    };


case UPDATE_MARGIN_LIST_PAGE_SUCCESS:
    return {
        ...state,
        updateMessage: action.payload,
    };


        default:
            return state;
    }
};
export default MarginMasterReducer;
