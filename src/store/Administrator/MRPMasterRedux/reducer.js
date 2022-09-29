import { POST_GO_BUTTON_DATA_SUCCESS, POST_MRP_MASTER_DATA_SUCCESS } from "./actionTypes";

const INIT_STATE = {
    PostData: [],
    GoButtonPostData:[]
};

const MRPMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // post api
        case POST_MRP_MASTER_DATA_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
            };
      
             // Go Button post api
        case POST_GO_BUTTON_DATA_SUCCESS:
            return {
                ...state,
                GoButtonPostData: action.payload,
            };

        default:
            return state;
    }
};
export default MRPMasterReducer;
