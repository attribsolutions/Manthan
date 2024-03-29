import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { Change_Button, Go_Button } from "../../components/Common/CommonButton";
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
import { alertMessages } from "../../components/Common/CommonErrorMsg/alertMsg";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import ReportTableFunc from "../TCSAmountReport/tableShowCommonFunc";

const TargetVSAchievement = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const isSCMParty = _cfunc.loginIsSCMParty();
    const [userPageAccessState, setUserAccState] = useState("");

    const [yearAndMonth, setYearAndMonth] = useState(getCurrent_Month_And_Year);

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
        const selectdMonth = getCurrent_Month_And_Year(e.target.value);
        setYearAndMonth(selectdMonth);
    }

    function goButtonHandler(e) {
        if (commonPartyDropSelect.value === 0) {
            customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
            return;
        };
        const jsonBody = JSON.stringify({
            "Month": yearAndMonth.Month,
            "Year": yearAndMonth.Year,
            "Party": commonPartyDropSelect.value,
            "Employee": !(isSCMParty) ? 0 : _cfunc.loginEmployeeID(),
        })
        dispatch(Target_VS_Achievement_Go_Button_API(jsonBody));
    };

    const pageOptions = {
        sizePerPage: 10,
        totalSize: tableData.length,
        custom: true,
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
                                        disabled={(tableData.length > 0) && true}
                                    // max={maxMonthCurrent}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={8} className="">

                        </Col>
                        <Col sm={1} className="mt-3 mb-1  ">
                            {tableData.length === 0 ?
                                <Go_Button
                                    onClick={goButtonHandler}
                                    loading={goBtnLoading}
                                />
                                :
                                <Change_Button onClick={(e) => {
                                    dispatch(Target_VS_Achievement_Go_Button_API_Success([]));
                                }} />
                            }
                        </Col>
                    </div>
                </div>

                <div className="mt-1">
                    <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                    >
                        {({ paginationProps, paginationTableProps }) => (
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
                                                        keyField="PartyID"
                                                        classes={"table  table-bordered table-hover"}
                                                        noDataIndication={
                                                            <div className="text-danger text-center ">
                                                                Record Not available
                                                            </div>
                                                        }
                                                        onDataSizeChange={({ dataSize }) => {
                                                            dispatch(
                                                                BreadcrumbShowCountlabel(`Count:${dataSize}`)
                                                            );
                                                        }}
                                                        {...toolkitProps.baseProps}
                                                        {...paginationTableProps}
                                                    />
                                                    {globalTableSearchProps(toolkitProps.searchProps)}
                                                </div>
                                                <Row className="align-items-md-center mt-30">
                                                    <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                        <PaginationListStandalone
                                                            {...paginationProps}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                                )}
                            </ToolkitProvider>
                        )
                        }
                    </PaginationProvider>

                </div>
            </div>
        </React.Fragment>
    );
};

export default TargetVSAchievement;
