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
import CustomTable from "../../CustomTable2";
import { changeCommonPartyDropDetailsAction } from "../../store/Utilites/PartyDrodown/action";

const ReturnReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');
    const [distributorDropdown, setDistributorDropdown] = useState([{ value: "", label: "All" }]);
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
        dispatch(BreadcrumbShowCountlabel(`Count:${0} ₹ ${0.00}`));
        dispatch(changeCommonPartyDropDetailsAction({ isShow: false }))//change party drop-down  hide
        return () => {
            dispatch(Return_Report_Action_Success([]));
            setTableData([]);
            dispatch(changeCommonPartyDropDetailsAction({ isShow: true }))//change party drop-down restore state
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
                    setDistributorDropdown([{ value: "", label: "All" }])
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
        catch (e) { console.log(e) }

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
            e = [{ value: "", label: "All" }]
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

                <div className="px-2   c_card_filter text-black mb-1" >
                    <div className="row" >
                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3 mb-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={fromdate}
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
                                        value={todate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        {isSCMParty &&
                            <Col sm={3} className="">
                                <FormGroup className="mb- row mt-3" >
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

                        <Col sm={1} className="mt-3" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 1 && true}
                                className="btn btn-success"
                                onClick={(e) => excel_And_GoBtnHandler(e, 1)}
                            >
                                Show
                            </C_Button>

                        </Col>

                        <Col sm={2} className="mt-3 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 2 && true}
                                className="btn btn-primary"
                                onClick={(e) => excel_And_GoBtnHandler(e, 2)}
                            >
                                Excel Download
                            </C_Button>
                        </Col>
                    </div>
                </div>

                <div className="mb-1">
                    <CustomTable
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
                            let totalAmount = filteredData.reduce((total, item) => {
                                return total + Number(item.recordsAmountTotal) || 0;

                            }, 0);
                            let commaSeparateAmount = _cfunc.amountCommaSeparateFunc(Number(totalAmount).toFixed(2));

                            dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} ₹ ${commaSeparateAmount}`));
                        }}
                    />
                </div>

            </div>

        </React.Fragment >
    )
}

export default ReturnReport;