import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index";
import { MetaTags } from "react-meta-tags";
import {
    BreadcrumbShowCountlabel,
    commonPageField,
    commonPageFieldSuccess,
} from "../../store/actions";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../components/Common/SearchBox/MySearch";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import {
    getCurrent_Month_And_Year,
} from "../../pages/Accounting/Claim Tracking Entry/ClaimRelatedFunc";
import {
    Target_VS_Achievement_Go_Button_API,
    Target_VS_Achievement_Go_Button_API_Success
} from "../../store/Report/TargetVSAchievementRedux/action";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import GlobalCustomTable from "../../GlobalCustomTable";

const TargetVSAchievement = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const isSCMParty = _cfunc.loginIsSCMParty();
    const [userPageAccessState, setUserAccState] = useState("");

    const [yearAndMonth, setYearAndMonth] = useState(getCurrent_Month_And_Year);
    const [btnMode, setBtnMode] = useState("");

    const {
        userAccess,
        pageField,
        goBtnLoading,
        tableData
    } = useSelector((state) => ({
        goBtnLoading: state.TargetVsAchievementReducer.listBtnLoading,
        tableData: state.TargetVsAchievementReducer.TargetVsAchievementGobtn,

        pageField: state.CommonPageFieldReducer.pageField,
        userAccess: state.Login.RoleAccessUpdateData,
    }));

    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    // Featch Modules List data  First Rendering
    const location = { ...history.location };
    const hasShowModal = props.hasOwnProperty(mode.editValue);

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;
        if (hasShowModal) {
            locationPath = props.masterPath;
        }
        userAcc = userAccess.find((inx) => {
            return `/${inx.ActualPagePath}` === locationPath;
        });
        if (userAcc) {
            setUserAccState(userAcc);
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        }
    }, [userAccess]);

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.TARGET_VS_ACHIEVEMENT));
        dispatch(BreadcrumbShowCountlabel(`Count:${tableData.length}`));
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(Target_VS_Achievement_Go_Button_API_Success([]));
        };
    }, []);

    // Common Party select Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            // goButtonHandler();
        } else {
            dispatch(Target_VS_Achievement_Go_Button_API_Success([]));
        }
    }, [commonPartyDropSelect]);

    //Max Month is current Month
    const maxMonthCurrent = useMemo(() => {
        const current = getCurrent_Month_And_Year();
        return `${current.Year}-${current.Month}`;
    }, []);

    const [tableColumns] = DynamicColumnHook({ pageField });

    async function MonthAndYearOnchange(e) {
        dispatch(Target_VS_Achievement_Go_Button_API_Success([]));
        const selectdMonth = getCurrent_Month_And_Year(e.target.value);
        setYearAndMonth(selectdMonth);
    }

    useEffect(() => {

        if (btnMode === "excel") {
            if (tableData.length > 0) {
                ExcelReportComponent({   // Download CSV
                    pageField,
                    excelTableData: tableData,
                    excelFileName: "Target Vs Achievement Report",
                })
                dispatch(Target_VS_Achievement_Go_Button_API_Success([]));
            }
        }
    }, [tableData]);

    function goButtonHandler(btnMode) {
        setBtnMode(btnMode)
        const jsonBody = JSON.stringify({
            "Month": yearAndMonth.Month,
            "Year": yearAndMonth.Year,
            "Party": (commonPartyDropSelect.value === 0) ? 0 : commonPartyDropSelect.value,
            "Employee": !(isSCMParty) ? 0 : _cfunc.loginEmployeeID(),
        })
        dispatch(Target_VS_Achievement_Go_Button_API(jsonBody));
    };

    const pageOptions = {
        page: 1,
        paginationSize: 5,
        pageStartIndex: 1,
        sizePerPage: 10,
        custom: true,
        totalSize: tableData.length,
        hidePageListOnlyOnePage: true,
    };

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black " >

                    <div className="row" >
                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3 mb-1 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>Select Month</Label>
                                <Col sm="7">
                                    <Input
                                        className="form-control"
                                        type="month"
                                        value={`${yearAndMonth.Year}-${yearAndMonth.Month}`}
                                        onChange={(e) => MonthAndYearOnchange(e)}
                                    // max={maxMonthCurrent}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={9} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(goBtnLoading && btnMode === "show") && true}
                                className="btn btn-success m-3 mr"
                                onClick={() => goButtonHandler("show")}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(goBtnLoading && btnMode === "excel") && true}
                                className="btn btn-primary m-3 mr "
                                onClick={() => goButtonHandler("excel")}
                            >
                                Excel
                            </C_Button>
                        </Col>

                    </div>
                </div>

                <div className="mt-1">
                    <ToolkitProvider
                        keyField="id"
                        data={tableData}
                        columns={tableColumns}
                        search
                    >
                        {(toolkitProps) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table" style={{ minHeight: "75vh" }}>
                                            <BootstrapTable
                                                keyField="id"
                                                classes={"table  table-bordered table-hover"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Record Not available
                                                    </div>
                                                }
                                                onDataSizeChange={({ dataSize }) => {
                                                    dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
                                                }}
                                                {...toolkitProps.baseProps}

                                            />
                                            {globalTableSearchProps(toolkitProps.searchProps)}
                                        </div>

                                    </Col>
                                </Row>
                            </React.Fragment>
                        )}
                    </ToolkitProvider>

                </div>
            </div>
        </React.Fragment>
    );
};

export default TargetVSAchievement;
