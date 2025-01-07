
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
import { globalTableSearchProps } from "../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../store/actions";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { changeCommonPartyDropDetailsAction } from "../../store/Utilites/PartyDrodown/action";
import { allLabelWithBlank } from "../../components/Common/CommonErrorMsg/HarderCodeData";

const OrderSummary = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        PartyName: allLabelWithBlank,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');
    const [groupByDate, setGroupByDate] = useState(false);
    const [groupBySupplier, setGroupBySupplier] = useState(false);
    const [groupByCustomer, setGroupByCustomer] = useState(false);
    const [showTableData, setShowTableData] = useState([]);
    const [orderSummaryApiData, setOrderSummaryApiData] = useState([]);
    const [btnMode, setBtnMode] = useState(0);

    const [PivotMode, setPivotMode] = useState(false);

    const [qtyType, setQtyType] = useState("QtyInNo"); // Default to "Qty In No"

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
        dispatch(changeCommonPartyDropDetailsAction({ isShow: false }))//change party drop-down show false
        if (_cfunc.CommonPartyDropValue().value > 0) {
            setState((i) => {
                const a = { ...i }
                a.values.PartyName = _cfunc.CommonPartyDropValue();
                a.hasValid.PartyName.valid = true
                return a
            })
        }
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(postOrderSummary_API_Success({ Status: false }));
            dispatch(changeCommonPartyDropDetailsAction({ isShow: true }))//change party drop-down restore show state


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
        if ((btnMode === 2) && (!PivotMode)) {
            const { Data } = goButtonData
            if (Data.length > 0) {
                ExcelReportComponent({      // Download CSV
                    pageField,
                    excelTableData: excelTableData,
                    excelFileName: "Order Summary Report"
                })
            }

        } else if ((btnMode === 2) && (PivotMode)) {
            const { Data } = goButtonData
            if (Data.length > 0) {
                ExcelReportComponent({      // Download CSV
                    extraColumn: columns,
                    excelTableData: pivotedData,
                    excelFileName: "Order Summary Report"
                })
            }


        }

    }

    const groupByColumnsWithSumFunc = (jsonData) => {
        let dynamicColumn = []
        if (groupByDate) {
            dynamicColumn.push('OrderDate')
        }
        if (groupBySupplier) {
            dynamicColumn.push('SupplierID')
            dynamicColumn.push('SupplierName')
        }
        if (groupByCustomer) {
            dynamicColumn.push('CustomerID')
            dynamicColumn.push('CustomerName')
        }

        let currentColumnName = [...dynamicColumn, ...['OrderNo', 'Product', 'SubProduct', 'ItemID', 'SKUName']]
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
        setPivotMode(false)
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
        setPivotMode(false)
        setOrderSummaryApiData([]);
    }

    function groupByDateHandler(e) {
        setGroupByDate(e.target.checked)
        setBtnMode(1)
    }
    function groupBySupplierHandler(e) {
        setGroupBySupplier(e.target.checked)
        setBtnMode(1)
    }
    function groupByCustomerHandler(e) {
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

    function addTotalField(obj) {

        const total = Object.keys(obj)
            .filter((key) => typeof obj[key] === "number") // Only include numeric fields
            .reduce((sum, key) => sum + obj[key], 0); // Calculate the sum of numeric values

        return { ...obj, Total: total }; // Add the total field
    }

    const supplierNames = [...new Set(orderSummaryApiData.map((item) => item.SupplierName))];
    const skuNames = [...new Set(orderSummaryApiData.map((item) => item.SKUName))];

    // Step 2: Pivot the data and aggregate dynamically based on qtyType
    const pivotedData = skuNames.map((sku) => {
        const row = { SKUName: sku };
        supplierNames.forEach((supplier) => {
            // Sum dynamically based on selected qtyType
            const totalQty = orderSummaryApiData
                .filter((item) => item.SKUName === sku && item.SupplierName === supplier)
                .reduce((sum, item) => sum + (item[qtyType] || 0), 0);
            row[supplier] = Number(totalQty) > 0 ? Math.round(Number(totalQty)) : 0;

        });
        debugger
        return addTotalField(row);
    });

    // Step 3: Define columns dynamically
    const columns = [
        { dataField: "SKUName", text: "SKU Name", sort: true },
        {
            dataField: 'Total',
            text: 'Total',
            sort: true, // Optional: Enable sorting
            formatter: (cell) => <strong>{cell}</strong>, // Render the text in bold
        },
        ...supplierNames.map((supplier) => ({
            dataField: supplier,
            text: supplier,
            sort: true,
        })),
    ];


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
                                    <Label className="col-sm-6 p-2" style={{ width: "130px" }}>Ordering Party</Label>
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
                                <Label className="col-sm-4 p-2" style={{ width: "100px" }}>Order Type</Label>
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

                        {/* <Col sm={1} className=" mt-3 mb-2"> */}
                        <Col sm={2} className=" d-flex justify-content-end mt-2" >

                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 1 && goBtnLoading}
                                className="btn btn-success m-3 mr"
                                onClick={(e) => excel_And_GoBtnHandler(e, 1)}
                            >
                                Show
                            </C_Button>
                            {/* </Col> */}

                            {/* <Col sm="1" className="mt-3 mb-2"> */}
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 2 && goBtnLoading}
                                className="btn btn-primary m-3 mr"
                                onClick={(e) => excel_And_GoBtnHandler(e, 2)}
                            >
                                Excel
                            </C_Button>

                            {(orderSummaryApiData.length > 0 && !PivotMode) && <C_Button
                                type="button"
                                className="btn btn-info m-3 mr"
                                onClick={(e) => setPivotMode(true)}
                            >
                                Pivot
                            </C_Button>}
                            {(orderSummaryApiData.length > 0 && PivotMode) && <C_Button
                                type="button"
                                className="btn btn-info m-3 mr"
                                onClick={(e) => setPivotMode(false)

                                }
                            >
                                Change
                            </C_Button>}
                        </Col>
                    </div>
                </div>

                <Card className="mt-1 mb-1  c_card_filter-2 ">

                    {!PivotMode && <div className="d-flex gap-5">
                        <div className="d-flex gap-2  justify-content-center">
                            <div>By Date Group</div>
                            <Input
                                type="checkbox"
                                checked={groupByDate}
                                onChange={groupByDateHandler}
                            />
                        </div>

                        <div className="d-flex gap-2 justify-content-center">
                            <div>By Supplier Name</div>
                            <Input
                                type="checkbox"
                                checked={groupBySupplier}
                                onChange={groupBySupplierHandler}
                            />
                        </div>

                        <div className="d-flex gap-2 justify-content-center">
                            <div>By Customer Name</div>
                            <Input
                                type="checkbox"
                                checked={groupByCustomer}
                                onChange={groupByCustomerHandler}
                            />
                        </div>
                    </div>
                    }
                    {PivotMode && (
                        <div className="d-flex gap-5">


                            <div className="d-flex gap-2 justify-content-center">
                                <div>Qty In No</div>
                                <Input
                                    type="radio"
                                    name="qtyType"
                                    checked={qtyType === "QtyInNo"}
                                    onChange={() => setQtyType("QtyInNo")}
                                />
                            </div>
                            <div className="d-flex gap-2 justify-content-center">
                                <div>Qty In Kg</div>
                                <Input
                                    type="radio"
                                    name="qtyType"
                                    checked={qtyType === "QtyInKg"}
                                    onChange={() => setQtyType("QtyInKg")}
                                />
                            </div>

                            <div className="d-flex gap-2 justify-content-center">
                                <div>Qty In Box</div>
                                <Input
                                    type="radio"
                                    name="qtyType"
                                    checked={qtyType === "QtyInBox"}
                                    onChange={() => setQtyType("QtyInBox")}
                                />
                            </div>

                        </div>
                    )}
                </Card>

                {!PivotMode && < div >
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
                                        <div>
                                            <BootstrapTable
                                                keyField={"keyId"}
                                                classes={"custom-table"}
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

                {PivotMode && <div >
                    <ToolkitProvider
                        keyField={"keyId"}
                        data={pivotedData}
                        columns={columns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div>
                                            <BootstrapTable
                                                keyField={"keyId"}
                                                classes={"custom-table"}
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
        </React.Fragment >
    )
}

export default OrderSummary;







































