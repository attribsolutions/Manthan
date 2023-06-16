import { Fade } from "reactstrap";
import {
  DELETE_ROUTES_ID_SUCCESS,
  EDIT_ROUTES_ID_SUCCESS,
  GET_ROUTES_LIST,
  GET_ROUTES_LIST_SUCCESS,
  ROUTES_API_ERROR_ACTION,
  SAVE_ROUTES_MASTER,
  SAVE_ROUTES_MASTER_API_SUCCESS,
  UPDATE_ROUTES_ID,
  UPDATE_ROUTES_ID_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  PostData: { Status: false },
  RoutesList: [],
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  saveBtnloading: false,
  listLoading: false,
}

const RoutesReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_ROUTES_MASTER:
      return {
        ...state,
        saveBtnloading: true,

      }
    case SAVE_ROUTES_MASTER_API_SUCCESS:
      return {
        ...state,
        PostData: action.payload,
        saveBtnloading: false,

      }

    // list api

    case GET_ROUTES_LIST:
      return {
        ...state,
        listLoading: true,
      }


    case GET_ROUTES_LIST_SUCCESS:
      return {
        ...state,
        RoutesList: action.payload,
        listLoading: false,

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
    case UPDATE_ROUTES_ID:
      return {
        ...state,
        saveBtnloading: true,
      };

    case UPDATE_ROUTES_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false,
      };

    case ROUTES_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listLoading: false,
      };


    default:
      return state
  }
}

export default RoutesReducer  