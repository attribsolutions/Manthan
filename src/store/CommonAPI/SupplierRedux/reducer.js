import {
  GET_SUPPLIER_SUCCESS,
  GET_SUPPLIER_ADDRESS_SUCCESS,
  GET_ORDER_TYPE_SUCCESS,
  GET_VENDER_SUCCESS,
  GET_CUSTOMER_SUCCESS,
  GET_VENDER_SUPPLIER_CUSTOMER_SUCCESS,
  SSDD_LIST_UNDER_COMPANY_SUCCESS,
  RETAILER_LIST_SUCCESS,
  PARTY_DROPDOWN_LIST_SUCCESS,
  COMMON_API_REDUCER_ERROR_ACTION,
  GET_SUPPLIER_ADDRESS,
  GET_VENDER,
  GET_ORDER_TYPE,
  GET_CUSTOMER,
  GET_VENDER_SUPPLIER_CUSTOMER,
  GET_SUPPLIER,
  RETAILER_LIST,
  PARTY_DROPDOWN_LIST,
  SSDD_LIST_UNDER_COMPANY,
} from "./actionType"

const INIT_STATE = {
  supplier: [],
  supplierAddress: [],
  orderType: [],
  vender: [],
  customer: [],
  vendorSupplierCustomer: [],
  SSDD_List: [],
  RetailerList: [],
  partyList: [],
  vendorSupplierCustomerLoading: false,
  retailerDropLoading: false,
  partyDropLoading: false,
  SSDD_ListLoading: false,
  supilerADDLoading: false,
  orderTypeLoading: false
}

const CommonAPI_Reducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_SUPPLIER:
      return {
        ...state,
        vendorSupplierCustomerLoading: true,
      }
    case GET_SUPPLIER_SUCCESS:
      return {
        ...state,
        vendorSupplierCustomerLoading: false,
        supplier: action.payload,
      }
    //******************************** */
    case GET_SUPPLIER_ADDRESS:
      return {
        ...state,
        supilerADDLoading: true,
      }
    case GET_SUPPLIER_ADDRESS_SUCCESS:
      return {
        ...state,
        supilerADDLoading: false,
        supplierAddress: action.payload,
      }
    //******************************** */
    case GET_ORDER_TYPE:
      return {
        ...state,
        orderTypeLoading: true,
      }
    case GET_ORDER_TYPE_SUCCESS:
      return {
        ...state,
        orderTypeLoading: false,
        orderType: action.payload,
      }
    //******************************** */
    case GET_VENDER:
      return {
        ...state,
        vendorSupplierCustomerLoading: true,
      }
    case GET_VENDER_SUCCESS:
      return {
        ...state,
        vendorSupplierCustomerLoading: false,
        vender: action.payload,
      }

    //******************************** */
    case GET_CUSTOMER:
      return {
        ...state,
        vendorSupplierCustomerLoading: true,
      }

    case GET_CUSTOMER_SUCCESS:
      return {
        ...state,
        vendorSupplierCustomerLoading: false,
        customer: action.payload,
      }
    //******************************** */
    case GET_VENDER_SUPPLIER_CUSTOMER:
      return {
        ...state,
        vendorSupplierCustomerLoading: true,
      }
    case GET_VENDER_SUPPLIER_CUSTOMER_SUCCESS:
      return {
        ...state,
        vendorSupplierCustomerLoading: false,
        vendorSupplierCustomer: action.payload,
      }
    //******************************** */
    case SSDD_LIST_UNDER_COMPANY:
      return {
        ...state,
        SSDD_ListLoading: true,
      }
    case SSDD_LIST_UNDER_COMPANY_SUCCESS:
      return {
        ...state,
        SSDD_ListLoading: false,
        SSDD_List: action.payload,
      }
    //******************************** */
    case RETAILER_LIST:
      return {
        ...state,
        retailerDropLoading: true,
      }
    case RETAILER_LIST_SUCCESS:
      return {
        ...state,
        retailerDropLoading: false,
        RetailerList: action.payload,
      }
    //******************************** */
    case PARTY_DROPDOWN_LIST:
      return {
        ...state,
        pattyDropLoading: true,
      }
    case PARTY_DROPDOWN_LIST_SUCCESS:
      return {
        ...state,
        partyDropLoading: false,
        partyList: action.payload,
      }

    //******************************** */

    case COMMON_API_REDUCER_ERROR_ACTION:
      return {
        ...state,
        vendorSupplierCustomerLoading: false,
        retailerDropLoading: false,
        pattyDropLoading: false,
        SSDD_ListLoading: false,
        supilerADDLoading: false
      }

    default:
      return state;
  }
}

export default CommonAPI_Reducer;