import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { postOrderSummary_API, postOrderSummary_API_Success } from "../../store/Report/OrderSummaryRedux/action";

import { customAlert } from "../../CustomAlert/ConfirmDialog";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../store/actions";

import { func } from "prop-types";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";

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
    const [groupBySupplier, setGroupBySupplier] = useState(false);
    const [groupByCustomer, setGroupByCustomer] = useState(false);
    const [showTableData, setShowTableData] = useState([]);
    const [orderSummaryApiData, setOrderSummaryApiData] = useState([]);
    const [btnMode, setBtnMode] = useState(0);
    const [orderTypeSelect, setOrderTypeSelect] = useState({
        value: 2,
        label: "Sales Order"
    });

    const { userAccess, goButtonData, SSDD_List, partyLoading, goBtnLoading, pageField } = useSelector(
        (state) => ({
            goButtonData: state.OrderSummaryReducer.orderSummaryGobtn,
            goBtnLoading: state.OrderSummaryReducer.goBtnLoading,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
            partyLoading: state.CommonAPI_Reducer.SSDD_ListLoading,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );

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
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.ORDER_SUMMARY_REPORT));
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(postOrderSummary_API_Success({ Status: false }));
        }
    }, [])

    useEffect(() => {

        try {

            if ((goButtonData.Status === true) && (goButtonData.StatusCode === 200)) {
                dispatch(postOrderSummary_API_Success({ Status: false }));
                const { Data } = goButtonData
                if ((btnMode === 2)) {
                    setBtnMode(0);
                    downloadExcelFunction(Data)
                } else {
                    setOrderSummaryApiData(Data);
                }
            }
            else if ((goButtonData.Status === true) && (goButtonData.StatusCode === 204)) {
                dispatch(postOrderSummary_API_Success({ Status: false }));
                setBtnMode(0);
                customAlert({
                    Type: 3,
                    Message: goButtonData.Message,
                })
            }
        }
        catch (e) { _cfunc.CommonConsole(e) }

    }, [goButtonData]);

    useEffect(() => {

        if (orderSummaryApiData.length > 0) {
            if (btnMode === 1) {
                setBtnMode(0)
                const groupData = groupByColumnsWithSumFunc(orderSummaryApiData);
                const updatedTableData = groupData.map((item, index) => {
                    let initaial = {
                        ...item, keyId: index + 1,
                    }
                    if (item.OrderDate) {
                        initaial.OrderDate = _cfunc.date_dmy_func(item.OrderDate)
                    }
                    return initaial
                });
                setShowTableData(updatedTableData);
            }
        }
    }, [orderSummaryApiData, btnMode])

    useEffect(() => {
        if (showTableData.length === 0) {
            setBtnMode(0);
            dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        }
        else {
            dispatch(BreadcrumbShowCountlabel(`Count:${showTableData.length}`));
        }
    }, [showTableData]);

    const downloadExcelFunction = (excelTableData) => {
        if ((btnMode === 2)) {
            const { Data } = goButtonData
            if (Data.length > 0) {
                ExcelReportComponent({      // Download CSV
                    pageField,
                    excelTableData: excelTableData,
                    excelFileName: "Order Summary Report"
                })
            }
            // const groupData = groupByColumnsWithSumFunc(excelTableData);
            // _cfunc.CommonConsole(JSON.stringify("groupData", excelTableData))
            // const worksheet = XLSX.utils.json_to_sheet(groupData);
            // const workbook = XLSX.utils.book_new();
            // XLSX.utils.book_append_sheet(workbook, worksheet, "Order Summary Report");
            // XLSX.writeFile(workbook, `From ${values.FromDate} To ${values.ToDate} ${isSCMParty ? values.PartyName.label : _cfunc.loginUserDetails().PartyName}.XLSX`);
        }
    }

    const groupByColumnsWithSumFunc = (jsonData) => {
        let dynamicColumn = []
        if (groupByDate) {
            dynamicColumn.push('OrderDate')
        }
        if (groupBySupplier) {
            dynamicColumn.push('SupplierName')
        }
        if (groupByCustomer) {
            dynamicColumn.push('CustomerName')
        }

        let currentColumnName = [...dynamicColumn, ...['OrderNo', 'GroupName', 'SubGroup', 'MaterialName']]
        const columnSumsByGroup = jsonData.reduce((result, item) => {
            const groupKey = currentColumnName.map(columnName => item[columnName]).join('|');

            if (!result[groupKey]) {
                result[groupKey] = {
                    sums: {},
                    data: []
                };

                currentColumnName.forEach((key) => {
                    result[groupKey].sums[key] = item[key];
                })
            }

            const group = result[groupKey];
            group.data.push(item);

            Object.entries(item).forEach(([key, value]) => {
                // if (((typeof value === 'number') && !(key === "id"))) {
                //     group.sums[key] = (group.sums[key] || 0) + value;
                // }
                if (key === "QtyInBox") {
                    group.sums[key] = (group.sums[key] || 0) + Number(value);
                    group.sums[key] = + Number((group.sums[key]).toFixed());
                }
                if (key === "QtyInKg") {
                    group.sums[key] = (group.sums[key] || 0) + Number(value);
                    group.sums[key] = + Number((group.sums[key]).toFixed());
                }
                if (key === "QtyInNo") {
                    group.sums[key] = (group.sums[key] || 0) + Number(value);
                    group.sums[key] = + Number((group.sums[key]).toFixed());
                }
                if (key === "Amount") {
                    group.sums[key] = (group.sums[key] || 0) + Number(value);
                    group.sums[key] = + Number((group.sums[key]).toFixed());
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

    const orderType_Option = [{
        value: 1,
        label: "Purchase Order"
    },
    {
        value: 2,
        label: "Sales Order"
    }]

    const partySlectHandler = (e) => {

        setState((i) => {
            const a = { ...i }
            a.values.PartyName = e;
            a.hasValid.PartyName.valid = true
            return a
        })
        setOrderSummaryApiData([]);
        setShowTableData([]);
    }

    const orderTypeSelectHandler = (e) => {
        setOrderTypeSelect(e);
        setShowTableData([]);
        setOrderSummaryApiData([]);
    }

    function excel_And_GoBtnHandler(e, Btnmode) {
        setBtnMode(Btnmode);
        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "CompanyID": _cfunc.loginCompanyID(),
            "PartyID": isSCMParty ? values.PartyName.value : _cfunc.loginPartyID(),
            "Employee": !isSCMParty ? 0 : _cfunc.loginEmployeeID(),
            "OrderType": orderTypeSelect.value
        });
        dispatch(postOrderSummary_API({ jsonBody }));
    }

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        });
        setShowTableData([]);
        setOrderSummaryApiData([]);
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        });
        setShowTableData([]);
        setOrderSummaryApiData([]);
    }

    function groupByDateHandler(e) {
        setGroupByDate(e.target.checked)
        setBtnMode(1)
    }
    function groupBySupplierHamdler(e) {
        setGroupBySupplier(e.target.checked)
        setBtnMode(1)
    }
    function groupByCustomerHamdler(e) {
        setGroupByCustomer(e.target.checked)
        setBtnMode(1)
    }
    const pagesListColumns = useMemo(() => {
        let internalColumn = [{}];
        if (showTableData.length > 0) {
            internalColumn = [];

            const objectAtIndex0 = showTableData[0];
            for (const key in objectAtIndex0) {
                if (!(key === "keyId")) {
                    const column = {
                        text: key,
                        dataField: key,
                        sort: true,
                        classes: "table-cursor-pointer",
                    };
                    internalColumn.push(column);
                }
            }
        }
        return internalColumn

    }, [showTableData]);

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black" >

                    <div className="row">
                        <Col sm={isSCMParty ? 2 : 3} >
                            <FormGroup className="mb- row mt-3 mb-2">
                                <Label className="col-sm-4 p-2" style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                        }}
                                        name='FromDate'
                                        value={values.FromDate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={isSCMParty ? 2 : 3} >
                            <FormGroup className="mb- row mt-3 mb-2">
                                <Label className="col-sm-4 p-2" style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                        }}
                                        name="ToDate"
                                        value={values.ToDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        {isSCMParty &&
                            <Col sm={3} >
                                <FormGroup className="mb- row mt-3">
                                    <Label className="col-sm-6 p-2" style={{ width: "65px" }}>Ordering Party</Label>
                                    <Col sm="6">
                                        <C_Select
                                            name="PartyName"
                                            value={values.PartyName}
                                            isSearchable={true}
                                            isLoading={partyLoading}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={Party_Option}
                                            onChange={partySlectHandler}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        }
                        <Col sm={3} >
                            <FormGroup className="mb- row mt-3 mb-2">
                                <Label className="col-sm-4 p-2" style={{ width: "83px" }}>Order Type</Label>
                                <Col sm="6">
                                    <C_Select
                                        name="orderTypeSelect"
                                        value={orderTypeSelect}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={orderType_Option}
                                        onChange={orderTypeSelectHandler}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={1} className=" mt-3 mb-2">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 1 && goBtnLoading}
                                className="btn btn-success"
                                onClick={(e) => excel_And_GoBtnHandler(e, 1)}
                            >
                                Show
                            </C_Button>
                        </Col>

                        <Col sm="1" className="mt-3 mb-2">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 2 && goBtnLoading}
                                className="btn btn-primary"
                                onClick={(e) => excel_And_GoBtnHandler(e, 2)}
                            >
                                Excel
                            </C_Button>
                        </Col>


                    </div>

                </div>

                <Card className="mt-1">
                    <CardBody className="c_card_body text-black">
                        <Row>
                            <Col sm={4} >
                                <FormGroup className="row mt-n3 mb-n4">
                                    <Label className="col-4 p-2" >By Date Group</Label>
                                    <Col sm="4" style={{ marginTop: '9px', }}>
                                        <Input type="checkbox"
                                            checked={groupByDate}
                                            onChange={groupByDateHandler} />
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col sm={4} >
                                <FormGroup className="row mt-n3 mb-n4">
                                    <Label className="col-4 p-2" >By Supplier Name</Label>
                                    <Col sm="4" style={{ marginTop: '9px', }}>
                                        <Input type="checkbox"
                                            checked={groupBySupplier}
                                            onChange={groupBySupplierHamdler}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm={4} >
                                <FormGroup className="row mt-n3 mb-n4">
                                    <Label className="col-4 p-2" >By Customer Name</Label>
                                    <Col sm="4" style={{ marginTop: '9px', }}>
                                        <Input type="checkbox"
                                            checked={groupByCustomer}
                                            onChange={groupByCustomerHamdler}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <div >
                    <ToolkitProvider
                        keyField={"keyId"}
                        data={showTableData}
                        columns={pagesListColumns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table">
                                            <BootstrapTable
                                                keyField={"keyId"}
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