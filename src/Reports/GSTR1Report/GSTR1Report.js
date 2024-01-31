import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc, } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import C_Report from "../../components/Common/C_Report";
import { GST_R1_Report_API, GST_R1_Report_API_Success, GST_R3B_Report_API, GST_R3B_Report_API_Success } from "../../store/Report/GSTR1ReportRedux/action";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../components/Common/CommonErrorMsg/alertMsg";

const GSTR1Report = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Customer: { value: "", label: "All" },
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            GstR3BReportData: state.GSTR1ReportReducer.GstR3BReportData,
            GstR1ReportData: state.GSTR1ReportReducer.GstR1ReportData,
            GstR3BBtnLoading: state.GSTR1ReportReducer.GstR3BBtnLoading,
            GstR1BtnLoading: state.GSTR1ReportReducer.GstR1BtnLoading,

            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            CustomerLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, GstR3BReportData = [], GstR1ReportData = [], GstR1BtnLoading, GstR3BBtnLoading, } = reducers;

    const values = { ...state.values }

    // Featch Modules List data  First Rendering
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue);

    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    // Common Party select Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            // partySelectButtonHandler();
        } else {
            partySelectOnChangeHandler();
        }
    }, [commonPartyDropSelect]);

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;
        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        if ((GstR3BReportData.length !== 0)) {

            const blob = new Blob([GstR3BReportData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `GST_R3B_Report_From_(${values.FromDate})_To_(${values.ToDate}).xlsx`;
            link.click();
            dispatch(GST_R3B_Report_API_Success([]))
        } else if ((GstR1ReportData.length !== 0)) {
            const blob = new Blob([GstR1ReportData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `GST_R1_Report_From_(${values.FromDate})_To_(${values.ToDate}).xlsx`;
            link.click();
            dispatch(GST_R1_Report_API_Success([]))
        }

    }, [GstR3BReportData, GstR1ReportData])

    useEffect(() => {
        return () => {
            dispatch(GST_R3B_Report_API_Success([]))
            dispatch(GST_R1_Report_API_Success([]))
        }
    }, [])

    function goButtonHandler(Type) {

        if (commonPartyDropSelect.value === 0) {
            customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
            return;
        };

        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "Party": commonPartyDropSelect.value
        });

        let config = { jsonBody }
        if (Type === "GSTR1") {
            dispatch(GST_R1_Report_API(config))
        } else {
            dispatch(GST_R3B_Report_API(config))
        }
    }

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
    }

    function partySelectOnChangeHandler() {
        dispatch(GST_R3B_Report_API_Success([]))
        dispatch(GST_R1_Report_API_Success([]))
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">

                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3 mb-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={values.FromDate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3 mb-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name="ToDate"
                                        value={values.ToDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm={2} className="mt-3" >
                            <C_Button
                                type="button"
                                style={{ width: "90px" }}
                                spinnerColor="white"
                                loading={GstR1BtnLoading}
                                className="btn btn-primary"
                                onClick={() => goButtonHandler("GSTR1")}
                            >
                                GST R1
                            </C_Button>
                        </Col>

                        <Col sm={2} className="mt-3" >
                            <C_Button
                                type="button"
                                style={{ width: "90px" }}
                                spinnerColor="white"
                                loading={GstR3BBtnLoading}
                                className="btn btn-primary"
                                onClick={() => goButtonHandler("GSTR3B")}
                            >
                                GST R3B
                            </C_Button>
                        </Col>
                    </div>
                </div>
            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default GSTR1Report;