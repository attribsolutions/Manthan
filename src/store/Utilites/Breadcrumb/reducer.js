import {
  COMMON_BREADCRUMB_ALL_DETAIL,
  BREADCRUMB_ITEM_NAME,
  BREADCRUMB_SHOW_COUNT_LABLE,
  BREADCRUMB_DOWN_BTN_DATA,
  BREADCRUMB_REST,
  BREADCRUMB_RADIO_BUTTON_VIEW,
  BREADCRUMB_NON_DELETE_BUTTON,
  BREADCRUMB_DELETE_BUTTON
} from "./actionType"


const INIT_STATE = {
  bredcrumbItemName: "",
  showCountlabel: '',
  IsRadioButtonView: false,
  radioButtonNonDelete: true,
  radioButtonDelete: false,
  breadcrumbDetail: {
    breadShow: false,
    newBtnView: false,
    excelBtnView: false,
    pageHeading: '',
    CountLabel: false,
    masterPage: "",
    pageMode: "",
    downBtnData: [],
    // showCountlabel: ''
  },
  downBtnData: []
}
const BreadcrumbReducer = (state = INIT_STATE, action) => {

  switch (action.type) {

    case BREADCRUMB_ITEM_NAME:
      return {
        ...state,
        bredcrumbItemName: action.payload,
      }
    case BREADCRUMB_SHOW_COUNT_LABLE:
      return {
        ...state,
        showCountlabel: action.payload,
      }
    case COMMON_BREADCRUMB_ALL_DETAIL:
      let payload = Object.assign({ ...state.breadcrumbDetail }, { ...action.payload });
      return {
        ...state,
        breadcrumbDetail: payload,
      }
    case BREADCRUMB_DOWN_BTN_DATA:
      return {
        ...state,
        downBtnData: action.payload,
      }

    case BREADCRUMB_NON_DELETE_BUTTON:
      return {
        ...state,
        radioButtonNonDelete: action.config,
      }

    case BREADCRUMB_DELETE_BUTTON:
      return {
        ...state,
        radioButtonDelete: action.config,
      }





    case BREADCRUMB_RADIO_BUTTON_VIEW:
      return {
        ...state,
        IsRadioButtonView: action.IsView,
      }

    case BREADCRUMB_REST:
      return {
        ...INIT_STATE,
      }

    default:
      return state
  }
}

export default BreadcrumbReducer;
