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
import { Return_Report_Action, Return_Report_Action_Success } from "../../store/Report/ReturnReportRedux/action";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import GlobalCustomTable from "../../GlobalCustomTable";
import { changeCommonPartyDropDetailsAction } from "../../store/Utilites/PartyDrodown/action";
import { allLabelWithBlank } from "../../components/Common/CommonErrorMsg/HarderCodeData";

const ReturnReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');
    const [distributorDropdown, setDistributorDropdown] = useState([allLabelWithBlank]);
    const [tableData, setTableData] = useState([]);
    const [btnMode, setBtnMode] = useState(0);

    const {
        goButtonData,
        pageField,
        userAccess,
        Distributor,
        partyDropdownLoading
    } = useSelector((state) => ({
        goButtonData: state.ReturnReportReducer.returnReportData,
        partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
        Distributor: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    })
    );

    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.RETURN_REPORT))
        dispatch(BreadcrumbShowCountlabel(`Count:${0} currency_symbol ${0.00}`));
        dispatch(changeCommonPartyDropDetailsAction({ isShow: false }))//change party drop-down show false
        if (_cfunc.CommonPartyDropValue().value > 0) {
            setDistributorDropdown([_cfunc.CommonPartyDropValue()]);
        }
        return () => {
            dispatch(Return_Report_Action_Success([]));
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

    useEffect(() => {
        if (tableData.length === 0) {
            setBtnMode(0)
        }
    }, [tableData]);

    const Party_Option = Distributor.map(i => ({
        value: i.id,
        label: i.Name
    }));

    const [tableColumns] = DynamicColumnHook({ pageField, })

    useEffect(() => {

        try {
            if ((goButtonData.Status === true) && (goButtonData.StatusCode === 200)) {
                setBtnMode(0);

                if (btnMode === 2) {
                    ExcelReportComponent({      // Download CSV
                        pageField,
                        excelTableData: goButtonData.Data,
                        excelFileName: "ReturnReport"
                    })
                    dispatch(Return_Report_Action_Success([]));
                    setDistributorDropdown([allLabelWithBlank])
                }
                else {
                    const UpdatedTableData = goButtonData.Data.map((item, index) => {
                        return {
                            ...item, id: index + 1,
                        };
                    });
                    setTableData(UpdatedTableData);
                    dispatch(Return_Report_Action_Success([]));
                }
            }
            else if ((goButtonData.Status === true)) {
                setTableData([]);
            }
            setBtnMode(0);
        }
        catch (e) { }

    }, [goButtonData]);

    function excel_And_GoBtnHandler(e, Btnmode) {

        setBtnMode(Btnmode);

        var isDistributorDropdown = ''
        if (distributorDropdown[0].value === "") {
            isDistributorDropdown = Party_Option.filter(i => !(i.value === '')).map(obj => obj.value).join(',');
        }
        else {
            isDistributorDropdown = distributorDropdown.filter(i => !(i.value === '')).map(obj => obj.value).join(',');
        }

        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            "Party": !(isSCMParty) ? _cfunc.loginPartyID().toString() : isDistributorDropdown,
        });
        let config = { jsonBody }
        dispatch(Return_Report_Action(config));
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

    function PartyDrodownOnChange(e = []) {

        if (e.length === 0) {
            e = [allLabelWithBlank]
        } else {
            e = e.filter(i => !(i.value === ''))
        }
        setDistributorDropdown(e);
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

                        {isSCMParty &&
                            <Col sm={4} className="">
                                <FormGroup className=" row mt-2" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "65px", marginRight: "20px" }}>Party</Label>
                                    <Col sm="8">
                                        <C_Select
                                            name="Distributor"
                                            value={distributorDropdown}
                                            isSearchable={true}
                                            isMulti={true}
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
                        }
                        <Col sm={isSCMParty ? 2 : 6} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 1 && true}
                                className="btn btn-success m-3 mr"
                                onClick={(e) => excel_And_GoBtnHandler(e, 1)}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 2 && true}
                                className="btn btn-primary m-3 mr "
                                onClick={(e) => excel_And_GoBtnHandler(e, 2)}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div>
                <div className="mb-1 table-responsive table">
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

export default ReturnReport;