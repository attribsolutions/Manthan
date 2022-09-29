import { POST_MARGIN_MASTER_DATA_SUCCESS } from "./actionType";

const INIT_STATE = {
    PostData: [],
};

const MarginMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // post api
        case POST_MARGIN_MASTER_DATA_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
            };
      

        default:
            return state;
    }
};
export default MarginMasterReducer;
