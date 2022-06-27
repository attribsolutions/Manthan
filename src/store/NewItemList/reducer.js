import * as type from "./actionType"

 const INIT_STATE={
   FranchiseName:[],
   ItemGroup:[],
   Items:[],
   TableData:[]
 }
const Pos_NewItemList_Reducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case type.GET_FRANCHISE_NAME_LIST_ACTION_ACTION_SUCCESS:
      return {
        ...state,
        FranchiseName: action.payload,
      }
      case type.GET_FRANCHISE_ITEMGROUP_ACTION_SUCCESS:
      return {
        ...state,
        ItemGroup: action.payload,
      }

      case type.GET_FRANCHISE_ITEMS_ACTION_SUCCESS:
        return {
          ...state,
          Items: action.payload,
        }
        case type.GET_FRANCHISE_TABLEDATA_ACTION_SUCCESS:
          return {
            ...state,
            TableData: action.payload,
          }
    default:
      return state
  }
}

export default Pos_NewItemList_Reducer;