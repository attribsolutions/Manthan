import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index";
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import {
    BreadcrumbShowCountlabel,
    EmployeeSubEmployee_List,
    Partyonclustersubcluster_List,
    SSDD_List_under_Company,
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
import { getClusterlist } from "../../store/Administrator/ClusterRedux/action";
import { Get_Subcluster_On_cluster_API } from "../../helpers/backend_helper";
import { allLabelWithBlank, allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";

const TargetVSAchievement = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const isSCMParty = _cfunc.loginIsSCMParty();
    const [userPageAccessState, setUserAccState] = useState("");

    const [yearAndMonth, setYearAndMonth] = useState(getCurrent_Month_And_Year);
    const [btnMode, setBtnMode] = useState("");

    const [isGropuWise, setisGropuWise] = useState(false);
    const [Tabledata, setTabledata] = useState([]);


    const [cluster, setCluster] = useState([allLabelWithBlank]);
    const [subCluster, setSubCluster] = useState([allLabelWithBlank]);
    const [SubEmployee, setSubEmployee] = useState({ value: 0, label: "Select..." });


    const [SubClusterOptions, setSubClusterOptions] = useState([]);
    const [partydropdown, setPartydropdown] = useState(allLabelWithZero);
    const {
        userAccess,
        pageField,
        goBtnLoading,
        tableData,
        tableDataGroupWise,
        clusterDropdown,
        partyList,
        partyLoading,
        SubEmployeeList,
        PartyOnClusterSubClusterList
    } = useSelector((state) => ({
        goBtnLoading: state.TargetVsAchievementReducer.listBtnLoading,
        SubEmployeeList: state.TargetVsAchievementReducer.SubEmployeeList,
        tableData: state.TargetVsAchievementReducer.TargetVsAchievementGobtn,
        clusterDropdown: state.ClusterReducer.ClusterListData,
        SubEmployeeList: state.CommonAPI_Reducer.SubEmployeeList,
        partyList: state.CommonAPI_Reducer.SSDD_List,
        PartyOnClusterSubClusterList: state.CommonAPI_Reducer.PartyOnClusterSubClusterList,
        tableDataGroupWise: state.TargetVsAchievementReducer.TargetVsAchievementGropuWiseGobtn,
        pageField: state.CommonPageFieldReducer.pageField,
        partyLoading: state.CommonAPI_Reducer.SSDD_ListLoading,
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
        dispatch(SSDD_List_under_Company());
        // dispatch(EmployeeSubEmployee_List(_cfunc.loginEmployeeID()));
        dispatch(getClusterlist());
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(Target_VS_Achievement_Go_Button_API_Success([]));
            dispatch(Target_VS_AchievementGroupWise_Go_Button_API_Success([]));

        };
    }, []);

    // Common Party select Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            // goButtonHandler();
        } else {
            dispatch(Target_VS_Achievement_Go_Button_API_Success([]));
            dispatch(Target_VS_AchievementGroupWise_Go_Button_API_Success([]));

        }
    }, [commonPartyDropSelect]);

    //Max Month is current Month
    const maxMonthCurrent = useMemo(() => {
        const current = getCurrent_Month_And_Year();
        return `${current.Year}-${current.Month}`;
    }, []);


    const [tableColumns] = DynamicColumnHook({ pageField });


    useEffect(() => {

        if (isGropuWise) {
            setTabledata(tableDataGroupWise)
            dispatch(BreadcrumbShowCountlabel(`Count:${tableDataGroupWise.length}`));
        } else {
            setTabledata(tableData)
            dispatch(BreadcrumbShowCountlabel(`Count:${tableData.length}`));

        }
    }, [isGropuWise, tableData, tableDataGroupWise,])

    useEffect(() => {

        const Cluster = cluster.filter(i => !(i.value === '')).map(obj => obj.value).join(',');
        const SubCluster = subCluster.filter(i => !(i.value === '')).map(obj => obj.value).join(',');
        const jsonBody = JSON.stringify({
            "ClusterID": Cluster,
            "SubClusterID": SubCluster,
            "EmployeeID": !(isSCMParty) ? 0 : _cfunc.loginEmployeeID(),
        });
        let config = { jsonBody }
        dispatch(Partyonclustersubcluster_List(config));
    }, [cluster, subCluster])

    useEffect(async () => {
        if (cluster[0].value !== "") {
            for (const item of cluster) {
                const response = await Get_Subcluster_On_cluster_API(item.value);
                if (response.StatusCode === 200) {
                    setSubClusterOptions(prevOptions => [
                        ...prevOptions,
                        response.Data.map(index => ({ value: index.id, label: index.Name }))
                    ]);
                }
            }
        }
        console.log(SubClusterOptions)

    }, [cluster])


    async function MonthAndYearOnchange(e) {
        dispatch(Target_VS_Achievement_Go_Button_API_Success([]));
        dispatch(Target_VS_AchievementGroupWise_Go_Button_API_Success([]));
        const selectdMonth = getCurrent_Month_And_Year(e.target.value);
        setYearAndMonth(selectdMonth);
    }


    const Cluster_Options = clusterDropdown.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const Party_Option = PartyOnClusterSubClusterList.map((i) => ({
        value: i.PartyID,
        label: i.PartyName,
    }));


    const SubEmployee_Option = SubEmployeeList.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    Party_Option.unshift(allLabelWithZero);

    function PartyDropdown_OnChange_Handler(e) {
        setPartydropdown(e);
        setTabledata([]);
    }


    const Columns = [
        {
            text: "Product Name",
            dataField: "ItemGroup",
            showing: true,
        },
        {
            text: "Primary Qty in kg",
            dataField: "AchQuantityInKG",
            showing: true,
            align: "right",

        },
        {
            text: "Primary value",
            dataField: "AchAmountWithGST",
            showing: true,
            align: "right",

        },
        {
            text: "CX Sale Qty in kg",
            dataField: "CXQuantityInKG",
            showing: true,
            align: "right",

        },
        {
            text: "CX Sale in value",
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
            text: "SR Qty in kg ",
            dataField: "CreditNoteQuantityInKG",
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

    const ExtraHeader = ["", "", "Primary", "", "CX Ach", "", "", "", "GT Achivement", "", "", "", "Sales Return", "", ""]


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
                    style: { ySplit: 2 }

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
            "Party": !(isSCMParty) ? _cfunc.loginPartyID() : partydropdown.value,
            "Employee": !(isSCMParty) ? 0 : _cfunc.loginEmployeeID(),
            "SubEmployee": SubEmployee.value,
            "Cluster": cluster.value,
            "SubCluster": subCluster.value

        })
        if (isGropuWise) {
            dispatch(Target_VS_AchievementGroupWise_Go_Button_API(jsonBody));
        } else {
            dispatch(Target_VS_Achievement_Go_Button_API(jsonBody));
        }
    };


    function ClusterOnChange(e = []) {
        debugger
        if (e.length === 0) {
            e = [allLabelWithBlank]
            setSubCluster(e)
        } else {
            e = e.filter(i => !(i.value === ''))
            setSubCluster([])
        }
        setCluster(e);
        setTabledata([]);
        setSubClusterOptions([])
    }


    function SubClusterOnChange(e = []) {
        if (e.length === 0) {
            e = [allLabelWithBlank]
        } else {
            e = e.filter(i => !(i.value === ''))
        }
        setSubCluster(e);
        setTabledata([]);
    }








    const rowStyle = (row, rowIndex) => {

        const style = {};
        if ((row.key) === (Tabledata.length)) {

            style.backgroundColor = 'rgb(239, 239, 239)';
            style.fontWeight = 'bold';
            style.fontSize = '4';
        }
        return style;
    };

    const removeDuplicates = (array) => {
        const idSet = new Set();
        return array.filter(item => {
            if (!idSet.has(item.value)) {
                idSet.add(item.value);
                return true;
            }
            return false;
        });
    };


    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black " >

                    <Row>
                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-2 mb-1 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "120px" }}>Select Month</Label>
                                <Col sm="8">
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
                        {isSCMParty && <Col sm={3} className="">
                            <FormGroup className=" row mt-1" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "120px" }}>Cluster</Label>
                                <Col sm="8">
                                    <Select
                                        name="Cluster"
                                        id="Cluster"
                                        isMulti={true}
                                        value={cluster}
                                        isSearchable={true}
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={Cluster_Options}
                                        onChange={ClusterOnChange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>}

                        {isSCMParty && <Col sm={3} className="">
                            <FormGroup className=" row mt-1" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "120px" }}>Sub Cluster</Label>
                                <Col sm="8">
                                    <Select
                                        name="SubCluster"
                                        id="SubCluster"
                                        isMulti={true}
                                        value={subCluster}
                                        isSearchable={true}
                                        classNamePrefix="dropdown"
                                        options={removeDuplicates(SubClusterOptions.flat())}
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        onChange={SubClusterOnChange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        }
                        {!isSCMParty && <Col sm={6}></Col>}
                        <Col sm={3} className=" d-flex justify-content-end" >
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

                    </Row>
                    <Row>

                        {/* 
                    <Col sm={3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "120px" }}>Sub Employee</Label>
                                <Col sm="8">
                                    <Select
                                        name="SubEmployee"
                                        value={SubEmployee}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={SubEmployee_Option}
                                        onChange={(e) => {
                                            setSubEmployee({
                                                value: e.value,
                                                label: e.label
                                            })
                                        }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col> */}



                        {isSCMParty && <Col sm={3} className="">
                            <FormGroup className=" row mt-1" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "120px" }}>Party</Label>
                                <Col sm="8">
                                    <Select
                                        name="party"
                                        value={partydropdown}
                                        isSearchable={true}
                                        isLoading={partyLoading}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: (provided) => ({ ...provided, zIndex: 2 }),
                                        }}
                                        options={Party_Option}
                                        onChange={(e) => {
                                            PartyDropdown_OnChange_Handler(e);
                                        }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        }

                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-1 mb-1 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "120px" }}>Group wise</Label>
                                <Col sm="7">
                                    <div className="form-check form-switch form-switch-md " dir="ltr">
                                        <Input type="checkbox" className="form-check-input mt-2"
                                            checked={isGropuWise}
                                            name="toggle"
                                            onChange={(event) => {
                                                setisGropuWise(event.target.checked)
                                                dispatch(Target_VS_Achievement_Go_Button_API_Success([]));
                                                dispatch(Target_VS_AchievementGroupWise_Go_Button_API_Success([]));
                                                setTabledata([])

                                            }}
                                        />
                                        <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                    </div>
                                </Col>
                            </FormGroup>
                        </Col>


                    </Row>
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
