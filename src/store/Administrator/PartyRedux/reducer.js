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
    PARTY_ADDRESS_DELETE_ID_SUCCESS,
    DELETE_PARTY_ID,
    EDIT_PARTY_ID,
    GET_DISTRICT_ON_STATE,
    PARTY_LIST_FOR_APPROVAL_ACTION,
    PARTY_LIST_FOR_APPROVAL_SUCCESS,
    GET_PARTY_LIST_FOR_APPROVAL_ACTION,
    GET_PARTY_LIST_FOR_APPROVAL_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
    goBtnLoading: false,
    partyList: [],
    PartyListForApproval: [],
    PartyListForApproval_ID:{ Status: false },
    postMsg: { Status: false },
    deleteMsg: { Status: false },
    editData: { Status: false },
    updateMsg: { Status: false },
    DistrictOnState: [],
    AddressTypes: [],
    saveBtnloading: false,
    listBtnLoading: false,
    PartyAddressDelete: { Status: false },
    districtDropDownLoading: false
};

const PartyMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        // get api
        case GET_PARTY_LIST_API:
            return {
                ...state,
                goBtnLoading: true,
            }

        case GET_PARTY_LIST_API_SUCCESS:
            return {
                ...state,
                partyList: action.payload,
                goBtnLoading: false
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

        case DELETE_PARTY_ID:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }

        // delete api
        case DELETE_PARTY_ID_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                deleteMsg: action.payload,
            };

        case EDIT_PARTY_ID:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }

        // edit api
        case EDIT_PARTY_ID_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
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
        case GET_DISTRICT_ON_STATE:
            return {
                ...state,
                districtDropDownLoading: true
            };


        case GET_DISTRICT_ON_STATE_SUCCESS:
            return {
                ...state,
                DistrictOnState: action.payload,
                districtDropDownLoading: false
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

        case PARTY_ADDRESS_DELETE_ID_SUCCESS:
            return {
                ...state,
                PartyAddressDelete: action.payload,
            };

        case PARTY_LIST_FOR_APPROVAL_ACTION:
            return {
                ...state,
                goBtnLoading: true,
            }

        case PARTY_LIST_FOR_APPROVAL_SUCCESS:
            return {
                ...state,
                PartyListForApproval: action.payload,
                goBtnLoading: false
            }

        case GET_PARTY_LIST_FOR_APPROVAL_ACTION:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }

        // edit api
        case GET_PARTY_LIST_FOR_APPROVAL_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                PartyListForApproval_ID: action.payload,
            };

        case PARTY_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listBtnLoading: false,
                goBtnLoading: false,
                districtDropDownLoading: false
            };

        default:
            return state;
    }
};
export default PartyMasterReducer;
