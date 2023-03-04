import {
    DELETE_SALESMAN_ID_SUCCESS,
    EDIT_SALESMAN_ID_SUCCESS,
    POST_SALESMAN_LIST_SUCCESS,
    POST_METHOD_HANDLER_FOR_SALESMAN_MASTER_API_SUCCESS,
    UPDATE_SALESMAN_ID_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
    PostData: { Status: false },
    SalesManList: [],
    deleteMessage: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false }
}

const SalesManReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_METHOD_HANDLER_FOR_SALESMAN_MASTER_API_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
            }

           // list api
           case POST_SALESMAN_LIST_SUCCESS:
            return {
              ...state,
              SalesManList: action.payload,
            }

          case DELETE_SALESMAN_ID_SUCCESS:
            return {
              ...state,
              deleteMessage: action.payload,
            };

          case EDIT_SALESMAN_ID_SUCCESS:
            return {
              ...state,
              editData: action.payload,
            };

          // update api
          case UPDATE_SALESMAN_ID_SUCCESS:
            return {
              ...state,
              updateMessage: action.payload,
            };

          default:
            return state
    }
}

export default SalesManReducer  