import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../store/actions";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import GlobalCustomTable from "../../GlobalCustomTable";
import { changeCommonPartyDropDetailsAction } from "../../store/Utilites/PartyDrodown/action";
import { allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";
import { CodeRedemption_Report_Action, CodeRedemption_Report_Action_Success } from "../../store/Report/CodeRedemptionRedux/action";
import { GenralMasterSubType, Get_Scheme_List } from "../../helpers/backend_helper";

const CodeRedemtionReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const isSCMParty = !_cfunc.loginUserIsFranchisesRole();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');
    const [Scheme, setSchemeTypeSelect] = useState(allLabelWithZero);
    const [tableData, setTableData] = useState([]);
    const [PartyDropdown, setPartyDropdown] = useState(allLabelWithZero);
    const [Scheme_Option, setSchemeOption] = useState([]);


    const {
        goButtonData,
        pageField,
        userAccess,
        listBtnLoading,
        partyDropdownLoading,
        Party

    } = useSelector((state) => ({
        goButtonData: state.CodeRedemptionReportReducer.CodeRedemptionData,
        listBtnLoading: state.CodeRedemptionReportReducer.listBtnLoading,
        partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
        Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        Distributor: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));



    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.CODE_REDEMPTION_REPORT))
        dispatch(BreadcrumbShowCountlabel(`Count:${0} `));
        dispatch(changeCommonPartyDropDetailsAction({ isShow: false }))//change party drop-down show false
        if (_cfunc.CommonPartyDropValue().value > 0) {
            setPartyDropdown(_cfunc.CommonPartyDropValue());
        }
        return () => {
            dispatch(CodeRedemption_Report_Action_Success([]));
            setTableData([]);
            dispatch(changeCommonPartyDropDetailsAction({ isShow: true }))//change party drop-down restore show state
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


    const Party_Option = Party.map(i => ({
        value: i.id,
        label: i.Name,
        PartyType: i.PartyType
    }));
    Party_Option.unshift(allLabelWithZero);

    const [tableColumns] = DynamicColumnHook({ pageField, })




    useEffect(() => {
        const fetchSchemeList = async () => {
            const resp = await Get_Scheme_List();
            debugger;
            if (resp.StatusCode === 200) {
                const option = resp.Data.map((index) => ({
                    value: index.id,
                    label: index.SchemeName,
                }));
                option.unshift(allLabelWithZero);
                setSchemeOption(option);

            }
        };

        fetchSchemeList();
    }, []);

    useEffect(() => {

        try {
            if ((goButtonData.Status === true) && (goButtonData.StatusCode === 200)) {

                if (goButtonData.Mode === "Show") {
                    setTableData(goButtonData.Data);
                    dispatch(CodeRedemption_Report_Action_Success([]));
                }
                else {
                    ExcelReportComponent({      // Download CSV
                        pageField,
                        excelTableData: goButtonData.Data,
                        excelFileName: "Code Redemption Report ",

                    })
                    dispatch(CodeRedemption_Report_Action_Success([]));
                }
            }
            else if ((goButtonData.Status === true)) {
                setTableData([]);
            }
        }
        catch (e) { }

    }, [goButtonData]);

    function excel_And_GoBtnHandler(mode) {

        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Party: !isSCMParty ? _cfunc.loginPartyID() : PartyDropdown.value,
            SchemeID: Scheme.value
        });
        let config = { jsonBody, Mode: mode }
        dispatch(CodeRedemption_Report_Action(config));
    }

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
                        <Col sm={2} className="">
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

                        <Col sm={2} className="">
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



                        < Col sm={3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Party</Label>
                                <Col sm="8">
                                    <C_Select
                                        name="Party"
                                        value={PartyDropdown}
                                        isSearchable={true}
                                        isDisabled={_cfunc.loginUserIsFranchisesRole()}

                                        isLoading={partyDropdownLoading}
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
                        </Col>


                        {< Col sm={3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Scheme </Label>
                                <Col sm="8">
                                    <C_Select
                                        name="Scheme"
                                        value={Scheme}
                                        isSearchable={true}
                                        // isLoading={partyDropdownLoading}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={Scheme_Option}
                                        onChange={(e) => {
                                            setSchemeTypeSelect(e)
                                            setTableData([]);
                                        }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>}




                        <Col sm={2} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={listBtnLoading === "Show"}
                                className="btn btn-success m-3 mr"
                                onClick={(e) => excel_And_GoBtnHandler("Show")}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={listBtnLoading === "Excel"}
                                className="btn btn-primary m-3 mr "
                                onClick={(e) => excel_And_GoBtnHandler("Excel")}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div>
                <div className="mb-1">
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
                        onDataSizeChange={({ dataCount, filteredData }) => {
                            // dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} `));
                            dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} currency_symbol ${_cfunc.TotalAmount_Func(filteredData)}`));

                        }}
                    />
                </div>


            </div>

        </React.Fragment >
    )
}

export default CodeRedemtionReport;