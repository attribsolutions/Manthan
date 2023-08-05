import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { C_Button, Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { url, mode, } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { postOrderSummary_API, postOrderSummary_API_Success } from "../../store/Report/OrderSummaryRedux/action";
import * as XLSX from 'xlsx';
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";

const OrderSummary = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();


    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        PartyName: { value: "", label: "All" },
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');
    const [groupByDate, setGroupByDate] = useState(false);
    const [groupByParty, setGroupByParty] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [columns, setColumns] = useState([{}]);
    const [columnsCreated, setColumnsCreated] = useState(false)

    const reducers = useSelector(
        (state) => ({
            GoBtnLoading: state.OrderSummaryReducer.GoBtnLoading,
            ExcelBtnLoading: state.OrderSummaryReducer.ExcelBtnLoading,
            goButtonData: state.OrderSummaryReducer.orderSummaryGobtn,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonPartyDropdownReducer.commonPartyDropdown,
            partyLoading: state.CommonAPI_Reducer.SSDD_ListLoading,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, goButtonData, SSDD_List, partyLoading, GoBtnLoading, ExcelBtnLoading } = reducers;
    const { Data = [] } = goButtonData;
    const values = { ...state.values }

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
        if ((goButtonData.Status === true) && (goButtonData.StatusCode === 204)) {
            dispatch(postOrderSummary_API_Success([]))
            customAlert({
                Type: 3,
                Message: goButtonData.Message,
            })
            return
        }
    }, [goButtonData])

    useEffect(() => {

        try {

            if (Data.length > 0) {
                if (goButtonData.btnId === "excel_btnId") {
                    var arr = []
                    if (groupByDate) {
                        arr.push('OrderDate')
                    }
                    if (groupByParty) {
                        arr.push('CustomerName')
                    }

                    const groupData = groupByColumnsWithSumFunc(Data, [...arr, ...['Group', 'SubGroup', 'MaterialName']]);
                    _cfunc.CommonConsole(JSON.stringify("groupData", Data))
                    const worksheet = XLSX.utils.json_to_sheet(groupData);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "Order Summary Report");
                    XLSX.writeFile(workbook, `From ${values.FromDate} To ${values.ToDate} ${isSCMParty ? values.PartyName.label : _cfunc.loginUserDetails().PartyName}.XLSX`);
                    dispatch(postOrderSummary_API_Success([]));
                }
                else {
                    const UpdatedTableData = Data.map((item, index) => {

                        return {
                            ...item, id: index + 1,
                        };
                    });
                    setTableData(UpdatedTableData);
                    dispatch(postOrderSummary_API_Success([]));
                }

            }

        }
        catch (e) { console.log(e) }

    }, [Data]);


    const groupByColumnsWithSumFunc = (jsonData, columnNames) => {
        const columnSumsByGroup = jsonData.reduce((result, item) => {
            const groupKey = columnNames.map(columnName => item[columnName]).join('|');
            if (!result[groupKey]) {
                result[groupKey] = {
                    sums: {},
                    data: []
                };

                columnNames.forEach((key) => {
                    result[groupKey].sums[key] = item[key];
                })
            }

            const group = result[groupKey];
            group.data.push(item);

            Object.entries(item).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    group.sums[key] = (group.sums[key] || 0) + value;
                }
            });

            return result;
        }, {});
        let arr = []
        Object.keys(columnSumsByGroup).forEach(i => {
            delete columnSumsByGroup[i].sums.Orderid
            arr.push(columnSumsByGroup[i].sums)
        })

        return arr
    };

    const Party_Option = SSDD_List.map(i => ({
        value: i.id,
        label: i.Name
    }));

    Party_Option.unshift({
        value: "",
        label: " All"
    });

    const onselecthandel = (e) => {

        setState((i) => {
            const a = { ...i }
            a.values.PartyName = e;
            a.hasValid.PartyName.valid = true
            return a
        })
        setTableData([])
    }

    function goButtonHandler() {

        const btnId = `gobtn-${url.ORDER_SUMMARY_REPORT}`
        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "CompanyID": _cfunc.loginCompanyID(),
            "PartyID": isSCMParty ? values.PartyName.value : _cfunc.loginPartyID()

        });
        dispatch(postOrderSummary_API({ jsonBody, btnId }));
    }

    function excelhandler() {

        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "CompanyID": _cfunc.loginCompanyID(),
            "PartyID": isSCMParty ? values.PartyName.value : _cfunc.loginPartyID()

        });
        dispatch(postOrderSummary_API({ jsonBody, btnId: "excel_btnId" }));
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

    const pagesListColumns = () => {
        if (tableData.length > 0) {
            const objectAtIndex0 = tableData[0];
            const internalColumn = []
            for (const key in objectAtIndex0) {
                const column = {
                    text: key,
                    dataField: key,
                    sort: true,
                    classes: "table-cursor-pointer",
                };
                internalColumn.push(column);
            }

            setColumns(internalColumn)
            setColumnsCreated(true)
        }
    }

    if (!columnsCreated) {
        pagesListColumns();
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3 mb-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={values.FromDate}
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
                                        value={values.ToDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        {isSCMParty &&
                            <Col sm={3} className="">
                                <FormGroup className="mb- row mt-3" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "65px" }}>Party</Label>
                                    <Col sm="7">
                                        <C_Select
                                            name="DistrictName"
                                            value={values.PartyName}
                                            isSearchable={true}
                                            isLoading={partyLoading}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={Party_Option}
                                            onChange={(e) => { onselecthandel(e) }}

                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        }

                        <Col sm={1} className="mt-3" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={GoBtnLoading === `gobtn-${url.ORDER_SUMMARY_REPORT}`}
                                className="btn btn-success"
                                onClick={goButtonHandler}
                            >
                                Show
                            </C_Button>

                        </Col>

                        <Col sm="2" className="mt-3 ">

                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={ExcelBtnLoading === `excel_btnId`}
                                className="btn btn-primary"
                                onClick={excelhandler}
                            >
                                Excel Download
                            </C_Button>
                        </Col>
                    </div>
                </div>

                <Card className="mt-1">
                    <CardBody className="c_card_body text-black">
                        <Row>
                            <Col sm={4} >
                                <FormGroup className="row">
                                    <Label className="col-4 p-2" >By Date Group</Label>
                                    <Col sm="4">
                                        <Input type="checkbox"
                                            checked={groupByDate}
                                            onChange={(e) => setGroupByDate(e.target.checked)} />
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col sm={4} >
                                <FormGroup className="row">
                                    <Label className="col-4 p-2" >By Party Name</Label>
                                    <Col sm="4" style={{ marginTop: '9px', }}>
                                        <Input type="checkbox"
                                            checked={groupByParty}
                                            onChange={(e) => setGroupByParty(e.target.checked)}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <div className="">
                    <ToolkitProvider
                        keyField={"id"}
                        // data={tableData}
                        // columns={pagesListColumns}
                        data={goButtonData.btnId !== "excel_btnId" ? tableData : [{}]}
                        columns={goButtonData.btnId !== "excel_btnId" ? columns : [{}]}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table">
                                            <BootstrapTable
                                                keyField={"id"}
                                                classes={"table  table-bordered table-hover"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Record Not available
                                                    </div>
                                                }
                                                {...toolkitProps.baseProps}
                                            />
                                            {mySearchProps(toolkitProps.searchProps)}
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

export default OrderSummary;