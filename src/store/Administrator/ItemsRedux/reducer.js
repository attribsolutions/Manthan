import {
    DELETE_ITEM_ID_SUCCESS,
    EDIT_ITEM_ID_SUCCESS,
    GET_BASEUNIT_FOR_DROPDOWN_SUCCESS,
    GET_BRANDTAG_API_SUCCESS,
    GET_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS,
    GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_API_SUCCESS,
    GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS,
    GET_DIVISION_FOR_DROPDOWN_SUCCESS,
    GET_GROUP_BY_GROUPTYPE_FOR_DROPDOWN_SUCCESS,
    GET_IMAGETYPE_FOR_DROPDOWN_SUCCESS,
    GET_ITEMTAG_API_SUCCESS,
    GET_ITEM_GROUP_FOR_DROPDOWN_SUCCESS,
    GET_ITEM_LIST_API_SUCCESS,
    GET_MRPTYPE_FOR_DROPDOWN_SUCCESS,
    GET_PARTY_FOR_DROPDOWN_SUCCESS,
    GET_PRICE_LIST_FOR_DROPDOWN_SUCCESS,
    GET_SUB_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS,
    GET_SUB_GROUP_BY_GROUP_FOR_DROPDOWN_SUCCESS,
    POST_ITEM_DATA_SUCCESS,
    UPDATE_ITEM_ID_SUCCESS
} from "./actionType";


const INIT_STATE = {
    pages: [],
    postMsg: { Status: false },
    deleteRoleID: [],
    deleteMsg: { Status: false },
    editData: { Status: false },
    updateMsg: { Status: false },
    ItemGroupList: [],
    BaseUnit: [],
    CategoryType: [],
    CategoryByCategoryType: [],
    SubCategoryByCategoryType: { Data: [], key: null },
    ImageType: [],
    MRPType: [],
    Division: [],
    Party: [],
    PriceList: [],
    GroupList: [],
    SubGroupList: [],
    Category: [],
    ItemTagList: [],
    BrandTagList: []

};

const ItemMastersReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        // get api
        case GET_ITEM_LIST_API_SUCCESS:
            return {
                ...state,
                pages: action.payload,
            }

        case GET_BASEUNIT_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                BaseUnit: action.payload,
            }

        // get group itms
        case GET_ITEM_GROUP_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                ItemGroupList: action.payload,
            }
        // get itemTag success
        case GET_ITEMTAG_API_SUCCESS:
            return {
                ...state,
                ItemTagList: action.payload,
            }
        // get Brand tag
        case GET_BRANDTAG_API_SUCCESS:
            return {
                ...state,
                BrandTagList: action.payload,
            }

        case POST_ITEM_DATA_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            };

        // delete api
        case DELETE_ITEM_ID_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
            };

        // edit api
        case EDIT_ITEM_ID_SUCCESS:
            return {
                ...state,
                editData: action.payload,
            };

        // update api
        case UPDATE_ITEM_ID_SUCCESS:
            return {
                ...state,
                updateMsg: action.payload,
            };

        case GET_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                CategoryType: action.payload,
            }

        case GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                CategoryByCategoryType: action.payload,
            }

        case GET_SUB_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                SubCategoryByCategoryType: action.payload,
            }

        case GET_IMAGETYPE_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                ImageType: action.payload,
            }

        case GET_MRPTYPE_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                MRPType: action.payload,
            }
        case GET_DIVISION_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                Division: action.payload,
            }
        case GET_PARTY_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                Party: action.payload,
            }
        case GET_PRICE_LIST_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                PriceList: action.payload,
            }
        case GET_GROUP_BY_GROUPTYPE_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                GroupList: action.payload,
            }

        case GET_SUB_GROUP_BY_GROUP_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                SubGroupList: action.payload,
            }
        case GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_API_SUCCESS:
            return {
                ...state,
                Category: action.payload,
            }

        case "RESET_ALL":
            return state = INIT_STATE;
        default:
            return state;
    }
};
export default ItemMastersReducer;
