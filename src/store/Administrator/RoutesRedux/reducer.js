import {
    DELETE_ROUTES_ID_SUCCESS,
    EDIT_ROUTES_ID_SUCCESS,
    POST_ROUTES_LIST_SUCCESS,
    POST_METHOD_HANDLER_FOR_ROUTES_MASTER_API_SUCCESS,
    UPDATE_ROUTES_ID_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
    PostData: { Status: false },
    RoutesList: [],
    deleteMessage: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false }
}

const RoutesReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_METHOD_HANDLER_FOR_ROUTES_MASTER_API_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
            }

           // list api
           case POST_ROUTES_LIST_SUCCESS:
            return {
              ...state,
              RoutesList: action.payload,
            }

          case DELETE_ROUTES_ID_SUCCESS:
            return {
              ...state,
              deleteMessage: action.payload,
            };

          case EDIT_ROUTES_ID_SUCCESS:
            return {
              ...state,
              editData: action.payload,
            };

          // update api
          case UPDATE_ROUTES_ID_SUCCESS:
            return {
              ...state,
              updateMessage: action.payload,
            };

          default:
            return state
    }
}

export default RoutesReducer  