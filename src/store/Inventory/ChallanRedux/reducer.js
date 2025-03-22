import {
  CHALLAN_POST_API_SUCCESS,
  DELETE_CHALLAN_FOR_CHALLAN_PAGE_SUCCESS,
  CHALLAN_LIST_FOR_LIST_PAGE_SUCCESS,
  GO_BUTTON_CHALLAN_POST_API_SUCCESS,
  GO_BUTTON_FOR_CHALLAN_ADD_SUCCESS,
  ITEM_DROPDOWN_CHALLAN_SUCCESS,
  MAKE_CHALLAN_ACTION_SUCCESS,
  CHALLAN_LIST_FOR_LIST_PAGE,
  VDC_ITEM,
  VDC_ITEM_SUCCESS,
  VDC_ITEM_DETAILS,
  VDC_ITEM_DETAILS_SUCCESS,
  IB_INVOICE_API_ERROR_ACTION,

} from "./actionType"


const INIT_STATE = {
  deleteMsg: { Status: false },
  ChallanList: [],
  gobutton_Add: [],
  GoButton: [],
  challanitems: [],
  postMsg: { Status: false },
  makeChallan: { Status: false },
  goBtnLoading: false,
  VDCItemData: [],
  VDCItemDetailsData: []

}

const ChallanReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GO_BUTTON_CHALLAN_POST_API_SUCCESS:
      return {
        ...state,
        GoButton: action.payload,
      }
    case GO_BUTTON_FOR_CHALLAN_ADD_SUCCESS:
      return {
        ...state,
        gobutton_Add: action.payload,
      }

    case ITEM_DROPDOWN_CHALLAN_SUCCESS:
      return {
        ...state,
        challanitems: action.payload,
      }
    //********************************************************** */
    case CHALLAN_LIST_FOR_LIST_PAGE: // challan List  by filters
      return {
        ...state,
        goBtnLoading: true,
      }
    case CHALLAN_LIST_FOR_LIST_PAGE_SUCCESS: // challan List  by filters
      return {
        ...state,
        goBtnLoading: false,
        ChallanList: action.payload,
      }
    //********************************************************** */
    case DELETE_CHALLAN_FOR_CHALLAN_PAGE_SUCCESS://Delete challan
      return {
        ...state,
        deleteMsg: action.payload,
      }
    case CHALLAN_POST_API_SUCCESS://SAVE challan
      return {
        ...state,
        postMsg: action.payload,
      }
    case MAKE_CHALLAN_ACTION_SUCCESS: //Make  challan
      return {
        ...state,
        makeChallan: action.payload,
      }



    case VDC_ITEM:
      return {
        ...state,
        listBtnLoading: true,
      }

    case VDC_ITEM_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        VDCItemData: action.payload,
      }


    case VDC_ITEM_DETAILS:
      return {
        ...state,
        listBtnLoading: true,
      }

    case VDC_ITEM_DETAILS_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        VDCItemDetailsData: action.payload,
      }


    case IB_INVOICE_API_ERROR_ACTION:
      return {
        ...state,

      };

    default:
      return state
  }

}
export default ChallanReducer