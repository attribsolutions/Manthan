import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../store/actions";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { Return_Report_Action_Success } from "../../store/Report/ReturnReportRedux/action";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import GlobalCustomTable from "../../GlobalCustomTable";
import { allLabelWithBlank, allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";
import { DemandVSSupply_Report_Action, DemandVSSupply_Report_Action_Success } from "../../store/Report/DemandVsSupply/action";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import { getCommonPartyDrodownOptionAction } from "../../store/Utilites/PartyDrodown/action";

const DemandVSSupply = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const IsMannagementParty = !_cfunc.loginUserIsFranchisesRole() && _cfunc.loginIsSCMParty();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');
    const [tableData, setTableData] = useState([]);
    const [PartyDropdown, setPartyDropdown] = useState(allLabelWithZero);


    const {
        goButtonData,
        pageField,
        userAccess,
        listBtnLoading,
        Party,
        partyDropdownLoadings
    } = useSelector((state) => ({
        goButtonData: state.DemandVsSupplyReportReducer.DemandVsSupplyReportData,
        listBtnLoading: state.DemandVsSupplyReportReducer.listBtnLoading,
        partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
        Distributor: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    })
    );

    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.DEMAND_VS_SUPPLY));
        dispatch(getCommonPartyDrodownOptionAction())

        dispatch(BreadcrumbShowCountlabel(`Count:${0} currency_symbol ${0.00}`));


        return () => {
            dispatch(DemandVSSupply_Report_Action_Success([]));
            setTableData([]);

        }
    }, []);

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



    const [tableColumns] = DynamicColumnHook({ pageField, })

    useEffect(() => {

        try {
            if ((goButtonData.Status === true) && (goButtonData.StatusCode === 200)) {
                if (goButtonData.Mode === "Show") {
                    setTableData(goButtonData.Data);

                } else {
                    ExcelReportComponent({      // Download CSV
                        pageField,
                        excelTableData: goButtonData.Data,
                        excelFileName: "Demand Vs Supply",
                    })
                }

                dispatch(DemandVSSupply_Report_Action_Success([]));
            }
            else if ((goButtonData.Status === true)) {
                setTableData([]);
            }
        }
        catch (e) { }

    }, [goButtonData]);

    function excel_And_GoBtnHandler(e, mode) {

        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            "Party": !IsMannagementParty ? _cfunc.loginPartyID() : PartyDropdown.value,
        });
        let config = { jsonBody, Mode: mode }
        dispatch(DemandVSSupply_Report_Action(config));
    }

    const Party_Option = Party.map(i => ({
        value: i.id,
        label: i.Name,
        PartyType: i.PartyType
    })).filter(index => index.PartyType === "Franchises");
    Party_Option.unshift(allLabelWithZero);

    function fromdateOnchange(e, date) {

        let newObj = { ...headerFilters }
        newObj.fromdate = date
        setHeaderFilters(newObj)
        setTableData([]);
    }

    function todateOnchange(e, date) {

        let newObj = { ...headerFilters }
        newObj.todate = date
        setHeaderFilters(newObj);
        setTableData([]);
    }
    function PartyDrodownOnChange(e) {
        setPartyDropdown(e);
        setTableData([]);
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
                                        value={fromdate}
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
                                        value={todate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        {IsMannagementParty && < Col sm={3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Party</Label>
                                <Col sm="8">
                                    <C_Select
                                        name="Party"
                                        value={PartyDropdown}
                                        isSearchable={true}
                                        isLoading={partyDropdownLoadings}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={Party_Option}
                                        onChange={PartyDrodownOnChange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>}


                        <Col sm={IsMannagementParty ? 3 : 6} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={listBtnLoading === "Show"}
                                className="btn btn-success m-3 mr"
                                onClick={(e) => excel_And_GoBtnHandler(e, "Show")}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={listBtnLoading === "Excel"}
                                className="btn btn-primary m-3 mr "
                                onClick={(e) => excel_And_GoBtnHandler(e, "Excel")}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div>
                <div className="mb-1 ">
                    <GlobalCustomTable
                        keyField={"id"}
                        data={tableData}
                        columns={tableColumns}
                        id="table_Arrow"
                        noDataIndication={
                            <div className="text-danger text-center ">
                                Items Not available
                            </div>
                        }
                        onDataSizeChange={({ dataCount, filteredData = [] }) => {
                            dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} currency_symbol ${_cfunc.TotalAmount_Func(filteredData)}`));
                        }}
                    />
                </div>


            </div>

        </React.Fragment >
    )
}

export default DemandVSSupply;