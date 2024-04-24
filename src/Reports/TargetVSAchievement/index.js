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
    Target_VS_AchievementGroupWise_Go_Button_API,
    Target_VS_AchievementGroupWise_Go_Button_API_Success,
    Target_VS_Achievement_Go_Button_API,
    Target_VS_Achievement_Go_Button_API_Success
} from "../../store/Report/TargetVSAchievementRedux/action";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";

const TargetVSAchievement = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const isSCMParty = _cfunc.loginIsSCMParty();
    const [userPageAccessState, setUserAccState] = useState("");

    const [yearAndMonth, setYearAndMonth] = useState(getCurrent_Month_And_Year);
    const [btnMode, setBtnMode] = useState("");

    const [isGropuWise, setisGropuWise] = useState(true);
    const [Tabledata, setTabledata] = useState([]);















    const {
        userAccess,
        pageField,
        goBtnLoading,
        tableData,
        tableDataGroupWise
    } = useSelector((state) => ({
        goBtnLoading: state.TargetVsAchievementReducer.listBtnLoading,
        tableData: state.TargetVsAchievementReducer.TargetVsAchievementGobtn,
        tableDataGroupWise: state.TargetVsAchievementReducer.TargetVsAchievementGropuWiseGobtn,
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
        dispatch(BreadcrumbShowCountlabel(`Count:${Tabledata.length + 1}`));
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
    const TargetVSAchievementGroupwise = ["AchAmount%", "ContriAmount%", "ContriQty%", "GTAchAmountWithGST", "GTAchQuantityInKG", "AchQty%"]
    const TargetVSAchievement = ["Cluster", "Fy", "ItemName", "ItemSubGroup", "PartyID", "PartyName", "SAPPartyCode", "SubCluster", "Year"]



    useEffect(() => {

        if (isGropuWise) {
            setTabledata(tableDataGroupWise)
        } else {
            setTabledata(tableData)
        }

    }, [isGropuWise, tableData, tableDataGroupWise,])

    async function MonthAndYearOnchange(e) {
        dispatch(Target_VS_Achievement_Go_Button_API_Success([]));
        const selectdMonth = getCurrent_Month_And_Year(e.target.value);
        setYearAndMonth(selectdMonth);
    }



    const Columns = [
        {
            text: "Product Name",
            dataField: "ItemGroup",
            showing: true,
        },
        {
            text: "Qty in kg",
            dataField: "AchQuantityInKG",
            showing: true,
            align: "right",

        },
        {
            text: "Ach in value",
            dataField: "AchAmountWithGST",
            showing: true,
            align: "right",

        },
        {
            text: "Qty in kg",
            dataField: "CXQuantityInKG",
            showing: true,
            align: "right",

        },
        {
            text: "Ach in value",
            dataField: "CXAmountWithGST",
            showing: true,
            align: "right",

        },
        {
            text: "Target in KG",
            dataField: "TargetQuantityInKG",
            showing: true,
            align: "right",

        },
        {
            text: "Ach in KG",
            dataField: "GTAchQuantityInKG",
            align: "right",
            showing: true,
        },
        {
            text: "Ach %",
            dataField: "AchQty%",
            align: "right",
            showing: true,
        },
        {
            text: "Contri",
            dataField: "ContriQty%",
            showing: true,
            align: "right",

        },
        {
            text: "Target in Value",
            dataField: "TargetAmountWithGST",
            showing: true,
            align: "right",

        }, {
            text: "Ach in Value",
            dataField: "GTAchAmountWithGST",
            showing: true,
            align: "right",

        }, {
            text: "Ach %",
            dataField: "AchAmount%",
            showing: true,
            align: "right",

        },
        {
            text: "Contri",
            dataField: "ContriAmount%",
            showing: true,
            align: "right",

        },
        {
            text: "SR in Value",
            dataField: "CreditNoteAmountWithGST",
            showing: true,
            align: "right",
        },

    ];

    const ExtraHeader = ["", "", "Primary", "", "CX Ach", "", "", "", "GT Achivement", "", "", "", "Sales Return", ""]


    useEffect(() => {

        if (btnMode === "excel") {
            if (Tabledata.length > 0 && !isGropuWise) {
                ExcelReportComponent({   // Download CSV
                    pageField,
                    excelTableData: Tabledata,
                    excelFileName: "Target Vs Achievement Report",
                })
                dispatch(Target_VS_Achievement_Go_Button_API_Success([]));
            } else if (Tabledata.length > 0 && isGropuWise) {
                ExcelReportComponent({   // Download CSV
                    excelTableData: Tabledata,
                    excelFileName: 'Target Vs Achievement Report Group Wise',
                    customKeyColumns: { tableData: Columns, isButton: true },
                    ExtraHeader: ExtraHeader,
                    lastRowStyle: true,
                    style : { ySplit: 2 }

                })
                dispatch(Target_VS_AchievementGroupWise_Go_Button_API_Success([]));
            }


        }
    }, [Tabledata]);

    function goButtonHandler(btnMode) {
        setBtnMode(btnMode)
        const jsonBody = JSON.stringify({
            "Month": yearAndMonth.Month,
            "Year": yearAndMonth.Year,
            "Party": (commonPartyDropSelect.value === 0) ? 0 : commonPartyDropSelect.value,
            "Employee": !(isSCMParty) ? 0 : _cfunc.loginEmployeeID(),
        })
        if (isGropuWise) {
            dispatch(Target_VS_AchievementGroupWise_Go_Button_API(jsonBody));
        } else {
            dispatch(Target_VS_Achievement_Go_Button_API(jsonBody));
        }
    };



    const rowStyle = (row, rowIndex) => {
        const style = {};
        if ((row.key) === (Tabledata.length)) {
            debugger
            style.backgroundColor = 'rgb(239, 239, 239)';
            style.fontWeight = 'bold';
            style.fontSize = '4';
        }
        return style;
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
                                    style={{ width: "120px" }}>Select Month</Label>
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

                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3 mb-1 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "120px" }}>Group wise</Label>
                                <Col sm="7">
                                    <div className="form-check form-switch form-switch-md " dir="ltr">
                                        <Input type="checkbox" className="form-check-input mt-2"
                                            checked={isGropuWise}
                                            defaultChecked={true}
                                            name="toggle"
                                            onChange={(event) => {
                                                setisGropuWise(event.target.checked)
                                                dispatch(Target_VS_Achievement_Go_Button_API_Success([]));
                                                dispatch(Target_VS_AchievementGroupWise_Go_Button_API_Success([]));
                                            }}
                                        />
                                        <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                    </div>
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={6} className=" d-flex justify-content-end" >
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

                {!isGropuWise && <div className="mt-1">
                    <ToolkitProvider
                        keyField="key"
                        data={Tabledata}
                        columns={tableColumns}
                        search
                    >
                        {(toolkitProps) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table" style={{ minHeight: "75vh" }}>
                                            <BootstrapTable
                                                keyField="key"
                                                rowStyle={rowStyle}
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
                }

                {isGropuWise && <div className="mt-1">


                    <ToolkitProvider
                        keyField="key"
                        data={tableDataGroupWise}
                        columns={Columns}
                        search
                    >
                        {(toolkitProps) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table" style={{ minHeight: "75vh" }}>
                                            <BootstrapTable
                                                keyField="key"
                                                rowStyle={rowStyle}
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

                </div>}









            </div>
        </React.Fragment>
    );
};

export default TargetVSAchievement;
