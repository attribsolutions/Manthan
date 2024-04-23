import {
    TARGET_VS_ACHIEVEMENT_API_ERRORACTION,
    TARGET_VS_ACHIEVEMENT_GO_BUTTON_API,
    TARGET_VS_ACHIEVEMENT_GO_BUTTON_API_SUCCESS,
    TARGET_VS_ACHIEVEMENT_GROUP_GO_BUTTON_API,
    TARGET_VS_ACHIEVEMENT_GROUP_GO_BUTTON_API_SUCCESS
} from "./actionType";

const INIT_STATE = {
    TargetVsAchievementGobtn: [],
    TargetVsAchievementGropuWiseGobtn:[],
    listBtnLoading: false
}

const TargetVsAchievementReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case TARGET_VS_ACHIEVEMENT_GO_BUTTON_API:
            return {
                ...state,
                listBtnLoading: true
            }

        case TARGET_VS_ACHIEVEMENT_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                TargetVsAchievementGobtn: action.payload,
                listBtnLoading: false
            }

        case TARGET_VS_ACHIEVEMENT_GROUP_GO_BUTTON_API:
            return {
                ...state,
                listBtnLoading: true
            }

        case TARGET_VS_ACHIEVEMENT_GROUP_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                TargetVsAchievementGropuWiseGobtn: action.payload,
                listBtnLoading: false
            }

        case TARGET_VS_ACHIEVEMENT_API_ERRORACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default TargetVsAchievementReducer  