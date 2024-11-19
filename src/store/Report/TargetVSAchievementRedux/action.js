import {
    TARGET_VS_ACHIEVEMENT_API_ERRORACTION,
    TARGET_VS_ACHIEVEMENT_GO_BUTTON_API,
    TARGET_VS_ACHIEVEMENT_GO_BUTTON_API_SUCCESS,
    TARGET_VS_ACHIEVEMENT_GROUP_GO_BUTTON_API,
    TARGET_VS_ACHIEVEMENT_GROUP_GO_BUTTON_API_SUCCESS
} from "./actionType";

export const Target_VS_Achievement_Go_Button_API = (jsonBody) => ({ // save Action
    type: TARGET_VS_ACHIEVEMENT_GO_BUTTON_API,
    jsonBody,
});

export const Target_VS_Achievement_Go_Button_API_Success = (resp) => ({ // Save  success
    type: TARGET_VS_ACHIEVEMENT_GO_BUTTON_API_SUCCESS,
    payload: resp,
});



export const Target_VS_AchievementGroupWise_Go_Button_API = (jsonBody) => ({ // save Action
    type: TARGET_VS_ACHIEVEMENT_GROUP_GO_BUTTON_API,
    jsonBody,
});

export const Target_VS_AchievementGroupWise_Go_Button_API_Success = (resp) => ({ // Save  success
    type: TARGET_VS_ACHIEVEMENT_GROUP_GO_BUTTON_API_SUCCESS,
    payload: resp,
});


export const Target_VS_Achievement_Api_ErrorAction = () => ({
    type: TARGET_VS_ACHIEVEMENT_API_ERRORACTION,
})
