import {
  DELETE_PRODUCTION_RE_ISSUE_SUCCESS,
  EDIT_PRODUCTION_RE_ISSUE_SUCCESS,
  GET_PRODUCTION_RE_ISSUE_LIST_PAGE_SUCCESS,
  MAKE_BTN_FOR_PRODUNCTION_RE_ISSUE_STP_ACTION_SUCCESS,
  ITEM_FOR_PRODUNCTION_RE_ISSUE_SUCCESS,
  SAVE_PRODUCTION_RE_ISSUE_ADD_PAGE_SUCCESS,
  UPDATE_PRODUCTION_RE_ISSUE_SUCCESS,
} from "./actionType"


const INIT_STATE = {
  postMsg: { Status: false },
  editData: { Status: false, },
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
  productionReIssueList: [],
  grnItemList: [],
  produtionMake: { Status: false, },
  productionReIssueItem: [],
  makeProductionReIssue: { Status: false, }
}

const ProductionReIssueReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_PRODUCTION_RE_ISSUE_LIST_PAGE_SUCCESS:
      return {
        ...state,
        productionReIssueList: action.payload,
      }
    case SAVE_PRODUCTION_RE_ISSUE_ADD_PAGE_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }
    case EDIT_PRODUCTION_RE_ISSUE_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }
    case UPDATE_PRODUCTION_RE_ISSUE_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      }
    case DELETE_PRODUCTION_RE_ISSUE_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      }
    case ITEM_FOR_PRODUNCTION_RE_ISSUE_SUCCESS:
      return {
        ...state,
        productionReIssueItem: action.payload,
      }

    case MAKE_BTN_FOR_PRODUNCTION_RE_ISSUE_STP_ACTION_SUCCESS:
      return {
        ...state,
        makeProductionReIssue: action.payload,
      }

    default:
      return state
  }
}

export default ProductionReIssueReducer