import {
    DELETE_PARTY_ID_SUCCESS,
    EDIT_PARTY_ID_SUCCESS,
    GET_DISTRICT_ON_STATE_SUCCESS,
    GET_DIVISION_TYPES_ID_SUCCESS,
    GET_PARTTYPE_BY_DIVISIONTYPES_ID_SUCCESS,
    GET_PARTY_LIST_API_SUCCESS,
    POST_PARTY_DATA_SUCCESS,
    UPDATE_PARTY_ID_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
    partyList: [],
    PartySaveSuccess: { Status: false },
    deleteMessage: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
    DistrictOnState:[],
    DivisionTypes:[],
    PartyTypes:[]
};

const PartyMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        // get api
        case GET_PARTY_LIST_API_SUCCESS:
            return {
                ...state,
                partyList: action.payload,
            }

        // post api
     
        case POST_PARTY_DATA_SUCCESS:
            return {
                ...state,
                PartySaveSuccess: action.payload,
            };

        // delete api
        case DELETE_PARTY_ID_SUCCESS:
            return {
                ...state,
                deleteMessage: action.payload,
            };

        // edit api
        case EDIT_PARTY_ID_SUCCESS:
            return {
                ...state,
                editData: action.payload,
            };

        // update api
        case UPDATE_PARTY_ID_SUCCESS:
            return {
                ...state,
                updateMessage: action.payload,
            };

       // GetDistrictOnState API
        case GET_DISTRICT_ON_STATE_SUCCESS:
            return {
              ...state,
              DistrictOnState: action.payload,
            };
  

         //DivisionTypes  dropdown api
        case GET_DIVISION_TYPES_ID_SUCCESS:
          return {
            ...state,
            DivisionTypes: action.payload,
          };

          // GetPartyTypeByDivisionTypeID API dependent on DivisionTypes api
        case GET_PARTTYPE_BY_DIVISIONTYPES_ID_SUCCESS:
            return {
              ...state,
              PartyTypes: action.payload,
            };
        default:
            return state;
    }
};
export default PartyMasterReducer;
