import { POST_MRP_MASTER_DATA_SUCCESS } from "./actionTypes";

const INIT_STATE = {
    PostData: [],
};

const MRPMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // post api
        case POST_MRP_MASTER_DATA_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
            };
      

        default:
            return state;
    }
};
export default MRPMasterReducer;
