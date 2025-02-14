import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../../../components/Common/CommonButton";

import * as _cfunc from "../../../../components/Common/CommonFunction";
import { mode, pageId } from "../../../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../../../store/actions";
import DynamicColumnHook, { GroupSubgroupDisplay, ModifyTableData_func } from "../../../../components/Common/TableCommonFunc";
import { ExcelReportComponent } from "../../../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../../../components/Common/SearchBox/MySearch";
import { GoButton_For_StockOut_Action, GoButton_For_StockOut_Success } from "../../../../store/SweetPOSStore/Report/StockOutReportRedux/action";
import Flatpickr from "react-flatpickr";
import { C_Select } from "../../../../CustomValidateForm";
import { allLabelWithZero } from "../../../../components/Common/CommonErrorMsg/HarderCodeData";
import { getCommonPartyDrodownOptionAction } from "../../../../store/Utilites/PartyDrodown/action";

const StockOutReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const current_Date_and_Time = _cfunc.getCurrentFormattedDate();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');
    const [PartyDropdown, setPartyDropdown] = useState(allLabelWithZero);
    const [tableData, setTableData] = useState([]);
    const [btnMode, setBtnMode] = useState(0);

    const {
        goButtonData,
        pageField,
        userAccess,
        Party,
        partyDropdownLoading
    } = useSelector((state) => ({
        partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
        goButtonData: state.StockOutReportReducer.stockOutListData,
        Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    })
    );

    const { date = current_Date_and_Time.Date_and_time, time = current_Date_and_Time.Time } = headerFilters;

    // Featch Modules List data  First Rendering
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.STOCK_OUT_REPORT))
        dispatch(getCommonPartyDrodownOptionAction())
        if (_cfunc.CommonPartyDropValue().value > 0) {
            setPartyDropdown(_cfunc.CommonPartyDropValue());
        }
        return () => {
            setTableData([]);
            dispatch(GoButton_For_StockOut_Success([]));
        }
    }, [])

    useEffect(() => {
        if (tableData.length === 0) {
            setBtnMode(0)
        }
    }, [tableData]);

    const [tableColumns] = DynamicColumnHook({ pageField, })

    const rowStyle = (row, rowIndex) => {
        if (row.GroupRow) {
            return { backgroundColor: 'white', fontWeight: 'bold', fontSize: '18px' };
        } else if (row.SubGroupRow) {
            return { backgroundColor: '#f2f2f2', fontWeight: 'bold', fontSize: '15px' };
        }
        return {};
    };

    const rowClasses = (row) => {
        if (row.GroupRow || row.SubGroupRow) {
            return 'group-row hide-border';
        }
        return '';
    };

    const processedData = useMemo(() => ModifyTableData_func(tableData), [tableData]);

    const modifiedTableColumns = useMemo(() => {
        const updatedArr = tableColumns.filter(item => item.dataField !== 'GroupName' && item.dataField !== 'SubGroupName');
        return updatedArr.map(item => {
            debugger;  // This will pause execution here when running in developer tools.
            console.log(item);  // Logs the entire item object for inspection.

            return {
                ...item,
                formatter: (value, row, k) => {
                    const Column = item;

                    if ((row.GroupRow || row.SubGroupRow) && Column.dataField !== "ItemName") {
                        return null;
                    }

                    if (Column.dataField === "ItemName") {
                        if (row.SubGroupRow) {
                            const [Group, SubGroup] = row.Group_Subgroup.split('-');
                            return <GroupSubgroupDisplay group={Group} subgroup={SubGroup} />;
                        } else {
                            const [itemName] = row.ItemName.split('-');
                            return <div>{itemName}</div>;
                        }
                    } else {

                        if (Column.dataField === "StockoutTime") {
                            return <div>{_cfunc.DateTime(value)}</div>;
                        } else {
                            return <div>{value}</div>;
                        }
                    }
                }
            };
        });

    }, [tableColumns, processedData]);





    useEffect(() => {

        try {
            if ((goButtonData.Status === true) && (goButtonData.StatusCode === 200)) {

                setBtnMode(0);
                const { Data } = goButtonData
                setTableData(Data);
                if (btnMode === 2) {
                    ExcelReportComponent({      // Download CSV
                        pageField,
                        excelTableData: Data,
                        excelFileName: "Stock Out Report"
                    })
                    dispatch(GoButton_For_StockOut_Success([]));
                    setPartyDropdown([allLabelWithZero])
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

        const jsonBody = JSON.stringify({
            "Date": _cfunc.getDate_Time_ymd(date),
            "Time": time,
            "Party": _cfunc.loginUserIsFranchisesRole() ? _cfunc.loginPartyID().toString() : (PartyDropdown.value).toString()
        });

        let config = { jsonBody }
        dispatch(GoButton_For_StockOut_Action(config));
    }

    function dateOnchange(e, date) {


        const Date = `${date}`;
        const time = Date.split(' ')[1];
        let newObj = { ...headerFilters }
        newObj.date = Date
        newObj.time = time

        setHeaderFilters(newObj)
        setTableData([]);
        dispatch(GoButton_For_StockOut_Success([]));
    }


    function PartyDrodownOnChange(e) {
        setPartyDropdown(e);
        setTableData([]);
    }

    const Party_Option = Party.map(i => ({
        value: i.id,
        label: i.Name,
        PartyType: i.PartyType
    })).filter(index => index.PartyType === "Franchises");

    let elements = document?.getElementsByClassName('numInput flatpickr-minute');
    if (elements.length > 0) {
        elements[0].disabled = true;
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
                                    style={{ width: "60px" }}>Date</Label>
                                <Col sm="7">
                                    <Flatpickr
                                        id="todate"
                                        name="todate"
                                        placeholder="Select ToDate"
                                        value={date}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        data-enable-input={false}  // Disables Flatpickr's input
                                        options={{
                                            altInput: true,
                                            altFormat: 'd-m-Y H:00:00', // Display hours only, minutes set to 00
                                            dateFormat: 'd-m-Y H:00:00', // Format for hours only
                                            enableTime: true,         // Enable time picker
                                            noCalendar: false,        // Keep the calendar enabled
                                            minuteIncrement: 60,      // Prevent minute adjustments
                                            allowInput: false,        // Disables manual input in the text field
                                        }}
                                        onChange={dateOnchange}

                                    />


                                </Col>
                            </FormGroup>
                        </Col>

                        {!_cfunc.loginUserIsFranchisesRole() && < Col sm={3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Party</Label>
                                <Col sm="8">
                                    <C_Select
                                        name="Party"
                                        value={PartyDropdown}
                                        isSearchable={true}

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
                        </Col>}


                        <Col sm={_cfunc.loginUserIsFranchisesRole() ? 9 : 6} className=" d-flex justify-content-end" >
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
                                className="btn btn-primary m-3 mr"
                                onClick={(e) => excel_And_GoBtnHandler(e, 2)}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div>

                <div className="mt-1">
                    <ToolkitProvider
                        keyField="id"
                        data={processedData}
                        columns={modifiedTableColumns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table" style={{ maxHeight: "77vh" }}>
                                            <BootstrapTable
                                                keyField="id"
                                                classes={"custom-table"}
                                                rowStyle={rowStyle}
                                                rowClasses={rowClasses}
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

        </React.Fragment >
    )
}

export default StockOutReport;