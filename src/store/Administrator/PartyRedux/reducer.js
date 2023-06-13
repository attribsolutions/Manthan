import {
    DELETE_PARTY_ID_SUCCESS,
    EDIT_PARTY_ID_SUCCESS,
    GET_COMPANY_BY_DIVISIONTYPES_ID_SUCCESS,
    GET_DISTRICT_ON_STATE_SUCCESS,
    GET_PARTTYPE_BY_DIVISIONTYPES_ID_SUCCESS,
    GET_ADDRESSTYPES_SUCCESS,
    GET_PARTY_LIST_API_SUCCESS,
    POST_PARTY_DATA_SUCCESS,
    UPDATE_PARTY_ID_SUCCESS,
    POST_PARTY_DATA,
    UPDATE_PARTY_ID,
    GET_PARTY_LIST_API,
    PARTY_API_ERROR_ACTION,
    PARTY_RESET_REDUX_ACTION
} from "./actionTypes";

const INIT_STATE = {
    partyList: [],
    postMsg: { Status: false },
    deleteMsg: { Status: false },
    editData: { Status: false },
    updateMsg: { Status: false },
    DistrictOnState: [],
    AddressTypes: [],
    saveBtnloading: false,
    listLoading: false
};

const PartyMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        // get api
        case GET_PARTY_LIST_API:
            return {
                ...state,
                listLoading: true,

            }

        case GET_PARTY_LIST_API_SUCCESS:
            return {
                ...state,
                partyList: action.payload,
                listLoading: false
            }

        // post api
        case POST_PARTY_DATA:
            return {
                ...state,
                saveBtnloading: true,
            };

        case POST_PARTY_DATA_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false,

            };

        // delete api
        case DELETE_PARTY_ID_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
            };

        // edit api
        case EDIT_PARTY_ID_SUCCESS:
            return {
                ...state,
                editData: action.payload,
            };

        // update api

        case UPDATE_PARTY_ID:
            return {
                ...state,
                saveBtnloading: true,
            };

        case UPDATE_PARTY_ID_SUCCESS:
            return {
                ...state,
                updateMsg: action.payload,
                saveBtnloading: false,
            };

        // GetDistrictOnState API
        case GET_DISTRICT_ON_STATE_SUCCESS:
            return {
                ...state,
                DistrictOnState: action.payload,
            };

        //get addresstypes
        case GET_ADDRESSTYPES_SUCCESS:
            return {
                ...state,
                AddressTypes: action.payload,
            };

        // GetPartyTypeByDivisionTypeID API dependent on DivisionTypes api
        case GET_PARTTYPE_BY_DIVISIONTYPES_ID_SUCCESS:
            return {
                ...state,
                PartyTypes: action.payload,
            };

        // GetCompanyByDivisionTypeID/1 API dependent on DivisionTypes api
        case GET_COMPANY_BY_DIVISIONTYPES_ID_SUCCESS:
            return {
                ...state,
                CompanyName: action.payload,
            };

        case PARTY_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listLoading: false
            };

        default:
            return state;
    }
};
export default PartyMasterReducer;
