import {
    DEMANDVSSUPPLY_REPORT_ACTION,
    DEMANDVSSUPPLY_REPORT_ACTION_SUCCESS,
    DEMANDVSSUPPLY_REPORT_ERROR_ACTION,


} from "./actionType"

const INIT_STATE = {
    DemandVsSupplyReportData: [],
    listBtnLoading: false

}

const DemandVsSupplyReportReducer = (state = INIT_STATE, action) => {

    switch (action.type) {

        case DEMANDVSSUPPLY_REPORT_ACTION:

            return {
                ...state,
                listBtnLoading: action?.config?.Mode
            }

        case DEMANDVSSUPPLY_REPORT_ACTION_SUCCESS:
            
            return {
                ...state,
                DemandVsSupplyReportData: action.payload,
                listBtnLoading: false
            }


        case DEMANDVSSUPPLY_REPORT_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default DemandVsSupplyReportReducer;