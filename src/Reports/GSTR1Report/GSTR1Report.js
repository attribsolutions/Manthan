import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc, } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, url, } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import C_Report from "../../components/Common/C_Report";
import { GST_R1_Report_API, GST_R1_Report_API_Success, GST_R3B_Report_API, GST_R3B_Report_API_Success } from "../../store/Report/GSTR1ReportRedux/action";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../components/Common/CommonErrorMsg/alertMsg";
import { allLabelWithBlank, allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";
import GST_ExcelDownloadFun from "./GST_ExcelDownloadFun";
import { divisionDropdownSelectAction, divisionDropdownSelectSuccess, RoleAccessUpdateSuccess, roleAceessActionSuccess } from "../../store/actions";
import { afterloginOneTimeAPI } from "../../components/Common/AfterLoginApiFunc";






const GSTR1Report = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Customer: allLabelWithBlank,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');

    const [divisionDropdowSelect, setDivisionDropdowSelect] = useState();





    const { userAccess, GstR3BReportData = [], GstR1ReportData = [], GstR1BtnLoading, GstR3BBtnLoading, divisionDropdown_redux, divisionOptionLoading } = useSelector(
        (state) => ({
            GstR3BReportData: state.GSTR1ReportReducer.GstR3BReportData,
            GstR1ReportData: state.GSTR1ReportReducer.GstR1ReportData,
            GstR3BBtnLoading: state.GSTR1ReportReducer.GstR3BBtnLoading,
            GstR1BtnLoading: state.GSTR1ReportReducer.GstR1BtnLoading,
            divisionDropdown_redux: state.Login.divisionDropdown,
            divisionOptionLoading: state.Login.divisionOptionLoading,

            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            CustomerLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const values = { ...state.values }

    // Featch Modules List data  First Rendering
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue);

    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);



    useLayoutEffect(() => {
        const employeeId = localStorage.getItem("EmployeeID");
        if (!divisionDropdown_redux.length && employeeId) {
            dispatch(divisionDropdownSelectAction(employeeId));
        }

    }, []);


    const divisionDropdown_DropdownOption = divisionDropdown_redux.map((d, key) => ({
        value: d.Party_id,
        label: d.PartyName,
    }))


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
        if ((GstR3BReportData.StatusCode === 200 && GstR3BReportData.Status)) {
            GST_ExcelDownloadFun({      // Download multi tab excel
                excelTableData: GstR3BReportData.Data,
                excelFileName: `GST-R3B Report (${values.FromDate}) To (${values.ToDate})`,
                pageName: "GST-R3B"
            })
            dispatch(GST_R3B_Report_API_Success({ Status: false }))
        }
    }, [GstR3BReportData]);

    useEffect(() => {
        if ((GstR1ReportData.StatusCode === 200 && GstR1ReportData.Status)) {

            GST_ExcelDownloadFun({      // Download multi tab excel
                excelTableData: GstR1ReportData.Data,
                excelFileName: `GST-R1 Report (${values.FromDate}) To (${values.ToDate})`,
                pageName: "GST-R1"
            })

            dispatch(GST_R1_Report_API_Success({ Status: false }))
        }

    }, [GstR1ReportData])

    useEffect(() => {
        return () => {
            dispatch(GST_R3B_Report_API_Success([]))
            dispatch(GST_R1_Report_API_Success([]))
        }
    }, [])

    function goButtonHandler(Type) {
        debugger
        if (commonPartyDropSelect.value === 0) {
            customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
            return;
        };

        if (_cfunc.IsSweetAndSnacksCompany() && !divisionDropdowSelect) {
            customAlert({ Type: 3, Message: alertMessages.divisionSelectionIsRequired });
            return;
        }
        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "Party": _cfunc.IsSweetAndSnacksCompany() ? divisionDropdowSelect.map(row => row.value).join(',') : String(commonPartyDropSelect.value),
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

    function DivisionOnChange(e = []) {
        setDivisionDropdowSelect(e);
    }



    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black " >
                    <Row>
                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2  " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={values.FromDate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name="ToDate"
                                        value={values.ToDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        {_cfunc.IsSweetAndSnacksCompany() && (
                            <Col sm={3} className="">
                                <FormGroup className=" row mt-2">
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "65px", marginRight: "20px" }}>Division</Label>
                                    <Col sm="8">
                                        <C_Select
                                            name="Division"

                                            value={divisionDropdowSelect}
                                            options={divisionDropdown_DropdownOption}
                                            isLoading={divisionOptionLoading}
                                            isMulti={true}
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            onChange={(e) => {
                                                DivisionOnChange(e);
                                            }}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        )}

                        <Col sm={3} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                // style={{ width: "90px" }}
                                spinnerColor="white"
                                loading={GstR1BtnLoading}
                                className="btn btn-primary m-3 mr "
                                onClick={() => goButtonHandler("GSTR1")}
                            >
                                GST R1
                            </C_Button>
                            <C_Button
                                type="button"
                                // style={{ width: "90px" }}
                                spinnerColor="white"
                                loading={GstR3BBtnLoading}
                                className="btn btn-primary m-3 mr "
                                onClick={() => goButtonHandler("GSTR3B")}
                            >
                                GST R3B
                            </C_Button>
                        </Col>
                    </Row>
                </div>

            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default GSTR1Report;