import {
    DELETE_ITEM_ID,
    DELETE_ITEM_ID_SUCCESS,
    EDIT_ITEM_ID,
    EDIT_ITEM_ID_SUCCESS,
    GET_BASEUNIT_FOR_DROPDOWN_SUCCESS,
    GET_BRANDTAG_API_SUCCESS,
    GET_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS,
    GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_API,
    GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_API_SUCCESS,
    GET_DIVISION_FOR_DROPDOWN_SUCCESS,
    GET_GROUP_BY_GROUPTYPE_FOR_DROPDOWN,
    GET_GROUP_BY_GROUPTYPE_FOR_DROPDOWN_SUCCESS,
    GET_IMAGETYPE_FOR_DROPDOWN_SUCCESS,
    GET_ITEMTAG_API_SUCCESS,
    GET_ITEM_GROUP_FOR_DROPDOWN_SUCCESS,
    GET_ITEM_LIST_API,
    GET_ITEM_LIST_API_SUCCESS,
    GET_MRPTYPE_FOR_DROPDOWN_SUCCESS,
    GET_PARTY_FOR_DROPDOWN,
    GET_PARTY_FOR_DROPDOWN_SUCCESS,
    GET_PRICE_LIST_FOR_DROPDOWN_SUCCESS,
    GET_SUB_GROUP_BY_GROUP_FOR_DROPDOWN,
    GET_SUB_GROUP_BY_GROUP_FOR_DROPDOWN_SUCCESS,
    ITEMS_API_ERROR_ACTION,
    SAVE_ITEM_MASTER,
    SAVE_ITEM_MASTER_SUCCESS,
    UPDATE_ITEM_ID,
    UPDATE_ITEM_ID_SUCCESS
} from "./actionType";


const INIT_STATE = {
    ItemList: [],
    postMsg: { Status: false },
    deleteRoleID: [],
    deleteMsg: { Status: false },
    editData: { Status: false },
    updateMsg: { Status: false },
    ItemGroupList: [],
    BaseUnit: [],
    ImageType: [],
    MRPType: [],
    Division: [],
    Party: [],
    partyApiLoading: false,
    GroupList: [],
    CategoryType: [],
    Category: [],
    SubGroupList: [],
    ItemTagList: [],
    BrandTagList: [],
    saveBtnloading: false,
    listBtnLoading: false,
    loading: false,
    categotyDropDownLoading: false,
    subgroupDropDownLoading: false,
    groupDropDownLoading: false

};

const ItemMastersReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        // get api

        case GET_ITEM_LIST_API:
            return {
                ...state,
                loading: true,
            }

        case GET_ITEM_LIST_API_SUCCESS:
            return {
                ...state,
                ItemList: action.payload,
                loading: false,

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

        case SAVE_ITEM_MASTER:
            return {
                ...state,
                saveBtnloading: true,

            };

        case SAVE_ITEM_MASTER_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false,

            };

        // delete api

        case DELETE_ITEM_ID:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            };

        case DELETE_ITEM_ID_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
                listBtnLoading: false
            };


        // edit api
        case EDIT_ITEM_ID:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            };

        case EDIT_ITEM_ID_SUCCESS:
            return {
                ...state,
                editData: action.payload,
                listBtnLoading: false
            };

        // update api
        case UPDATE_ITEM_ID:
            return {
                ...state,
                saveBtnloading: true,

            };

        case UPDATE_ITEM_ID_SUCCESS:
            return {
                ...state,
                updateMsg: action.payload,
                saveBtnloading: false,

            };

        case GET_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                CategoryType: action.payload,
                Category: []
            }

        // case GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS:
        //     return {
        //         ...state,
        //         CategoryByCategoryType: action.payload,
        //     }


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
        case GET_PARTY_FOR_DROPDOWN:
            return {
                ...state,
                partyApiLoading: true,
            }

        case GET_PARTY_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                partyApiLoading: false,
                Party: action.payload,
            }

        case GET_GROUP_BY_GROUPTYPE_FOR_DROPDOWN:
            return {
                ...state,
                groupDropDownLoading: true
            }

        case GET_GROUP_BY_GROUPTYPE_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                GroupList: action.payload,
                groupDropDownLoading: false

            }


        case GET_SUB_GROUP_BY_GROUP_FOR_DROPDOWN:
            return {
                ...state,
                subgroupDropDownLoading: true
            }

        case GET_SUB_GROUP_BY_GROUP_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                SubGroupList: action.payload,
                subgroupDropDownLoading: false
            }


        case GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_API:
            return {
                ...state,
                categotyDropDownLoading: true
            }

        case GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_API_SUCCESS:
            return {
                ...state,
                Category: action.payload,
                categotyDropDownLoading: false
            }

        case ITEMS_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listBtnLoading: false,
                loading: false,
                partyApiLoading: false,
                categotyDropDownLoading: false,
                subgroupDropDownLoading: false,
                groupDropDownLoading: false
            };

        case "RESET_ALL":
            return state = INIT_STATE;
        default:
            return state;
    }
};
export default ItemMastersReducer;
