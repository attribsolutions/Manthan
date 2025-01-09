import { DEMANDVSSUPPLY_REPORT_ACTION, DEMANDVSSUPPLY_REPORT_ACTION_SUCCESS, DEMANDVSSUPPLY_REPORT_ERROR_ACTION } from "./actionType";

export const DemandVSSupply_Report_Action = (config) => ({
    type: DEMANDVSSUPPLY_REPORT_ACTION,
    config
});

export const DemandVSSupply_Report_Action_Success = resp => ({
    type: DEMANDVSSUPPLY_REPORT_ACTION_SUCCESS,
    payload: resp,
})

export const DemandVSSupply_Report_ErrorAction = resp => ({
    type: DEMANDVSSUPPLY_REPORT_ERROR_ACTION,
    payload: resp,
})
