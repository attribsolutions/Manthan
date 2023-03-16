import React, { useEffect, useMemo, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import Flatpickr from "react-flatpickr"
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    resetFunction,
} from "../../../../components/Common/validationFunction";
import Select from "react-select";
import { Go_Button, SaveButton } from "../../../../components/Common/CommonButton";
import { breadcrumbReturn, loginPartyID, currentDate, btnIsDissablefunc, loginUserID } from "../../../../components/Common/CommonFunction";
import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import * as mode from "../../../../routes/PageMode";
import { GetRoutesList } from "../../../../store/Administrator/RoutesRedux/actions";
import { invoiceListGoBtnfilter } from "../../../../store/Sales/Invoice/action";
import { getVehicleList } from "../../../../store/Administrator/VehicleRedux/action";
import { LoadingSheet_GoBtn_API, LoadingSheet_GoBtn_API_Succcess, SaveLoadingSheetMaster, SaveLoadingSheetMasterSucccess } from "../../../../store/Sales/LoadingSheetRedux/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../../components/Common/SearchBox/MySearch";
import { countlabelFunc } from "../../../../components/Common/CommonPurchaseList";
import { getDriverList } from "../../../../store/Administrator/DriverRedux/action";

const LoadingSheet = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [orderlistFilter, setorderlistFilter] = useState({ todate: currentDate, fromdate: currentDate, Date: currentDate });
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [array, setArray] = useState([]);

    const fileds = {
        id: "",
        Date: "",
        FromDate: "",
        ToDate: "",
        RouteName: "",
        VehicleNumber: "",
        DriverName: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        VehicleNumber,
        RoutesList,
        GoButton,
        Driver
    } = useSelector((state) => ({
        postMsg: state.LoadingSheetReducer.postMsg,
        GoButton: state.LoadingSheetReducer.goBtnLoadingSheet,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        VehicleNumber: state.VehicleReducer.VehicleList,
        RoutesList: state.RoutesReducer.RoutesList,
        Driver: state.DriverReducer.DriverList,
    }));

    const { fromdate, todate, Date } = orderlistFilter;
    const { Data = [] } = GoButton;
    // const Data = [
    //     {
    //         id: 7,
    //         InvoiceDate: "2023-03-15",
    //         FullInvoiceNumber: "1",
    //         Customer: "Krupa Traders",
    //         CustomerID: 4,
    //         PartyID: 5,
    //         GrandTotal: "2000.2400",
    //         CreatedOn: "2023-03-15 15:08:53.388361",
    //         Check: false
    //     },
    //     {
    //         id: 8,
    //         InvoiceDate: "2023-03-15",
    //         FullInvoiceNumber: "2",
    //         Customer: "Katraj Division",
    //         CustomerID: 4,
    //         PartyID: 5,
    //         GrandTotal: "3000.2080",
    //         CreatedOn: "2023-03-15 15:08:53.388361",
    //         Check: false
    //     },
    //     {
    //         id: 9,
    //         InvoiceDate: "2023-03-15",
    //         FullInvoiceNumber: "3",
    //         Customer: "Ranade",
    //         CustomerID: 4,
    //         PartyID: 5,
    //         GrandTotal: "4000.10",
    //         CreatedOn: "2023-03-15 15:08:53.388361",
    //         Check: false
    //     }
    // ]
    useEffect(() => {
        dispatch(LoadingSheet_GoBtn_API_Succcess([]))
        const page_Id = pageId.LOADING_SHEET
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(GetRoutesList());
        dispatch(getVehicleList())
        dispatch(invoiceListGoBtnfilter())
        dispatch(getDriverList())
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

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
            setUserPageAccessState(userAcc)
            breadcrumbReturn({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(SaveLoadingSheetMasterSucccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values  
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === mode.dropdownAdd) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: url.LOADING_SHEET_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(SaveLoadingSheetMasterSucccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const RoutesListOptions = RoutesList.map((index) => ({
        value: index.id,
        label: index.Name,
        IsActive: index.IsActive
    }));

    const RouteName_Options = RoutesListOptions.filter((index) => {
        return index.IsActive === true
    });

    const VehicleNumber_Options = VehicleNumber.map((index) => ({
        value: index.id,
        label: index.VehicleNumber,
    }));

    const Driver_Options = Driver.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    function goButtonHandler() {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Party: 5,
            Route: ""
        });
        dispatch(LoadingSheet_GoBtn_API(jsonBody));
    }

    function SelectAll(event, row, key) {

        const arr = []
        Data.forEach(ele => {
            if (ele.id === row.id) {
                ele.Check = event
            }
            arr.push(ele)
        })
        setArray(arr)

    }

    const pagesListColumns = [
        {
            text: "Invoice Date",
            dataField: "InvoiceDate",
        },
        {
            text: "Invoice Number",
            dataField: "FullInvoiceNumber",
        },
        {
            text: "Customer",
            dataField: "Customer",
        },
        {
            text: "GrandTotal",
            dataField: "GrandTotal",
        },
        {
            text: "Select AlL",
            dataField: "Check",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center' }}>
                    <Input
                        id=""
                        key={row.id}
                        defaultChecked={row.Check}
                        type="checkbox"
                        className="col col-sm text-center"
                        onChange={e => { SelectAll(e.target.checked, row, key) }}
                    />
                </span>)
            }
        }


    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: Data.length,
        custom: true,
    };

    const saveHandeller = async (event) => {
        debugger
        event.preventDefault();
        const btnId = event.target.id

        const CheckArray = array.filter((index) => {
            return (index.Check === true)
        })

        const trueValues = array.map((index) => {
            return (index.Check === true)
        })

        const totalInvoices = trueValues.reduce((count, value) => {
            if (value === true) {
                count++
            }
            return count
        }, 0)

        const GrandTotal = CheckArray.reduce((a, v) => a = a + parseFloat(v.GrandTotal), 0)

        const LoadingSheetDetails = CheckArray.map((index) => ({
            Invoice: index.FullInvoiceNumber
        }))

        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })
                if (LoadingSheetDetails.length === 0) {
                    dispatch(
                        AlertState({
                            Type: 4,
                            Status: true,
                            Message: "Minimum one Invoice is Select",
                        })
                    );
                    return btnIsDissablefunc({ btnId, state: false })
                }

                const jsonBody = JSON.stringify({
                    Date: Date,
                    Party: loginPartyID(),
                    Route: values.RouteName.value,
                    Vehicle: values.VehicleNumber.value,
                    Driver: values.DriverName.value,
                    TotalAmount: GrandTotal.toFixed(2),
                    InvoiceCount: totalInvoices,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    LoadingSheetDetails: LoadingSheetDetails
                });

                if (pageMode === mode.edit) {
                    // dispatch(updateCategoryID({ jsonBody, updateId: values.id, btnId }));
                }

                else {
                    dispatch(SaveLoadingSheetMaster({ jsonBody, btnId }));
                }

            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-2" >

                            <div className=" mt-1 row ">
                                <Col sm="6">
                                    <FormGroup className="mb-1 row mt-3 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Date}  </Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name="Date"
                                                value={Date}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="YYYY-MM-DD"
                                                autoComplete="0,''"
                                                disabled={pageMode === mode.edit ? true : false}
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                    defaultDate: (pageMode === mode.edit) ? values.Date : "today"
                                                }}
                                                onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                onReady={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                            />
                                            {isError.Date.length > 0 && (
                                                <span className="invalid-feedback">{isError.Date}</span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">{/*Supplier Name */}
                                    <FormGroup className="mb-1 row mt-3 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.DriverName}</Label>
                                        <Col sm="7">
                                            <Select
                                                name="DriverName"
                                                value={values.DriverName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={Driver_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }
                                            />
                                            {/* {isError.RouteName.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.RouteName}</small></span>
                                                )} */}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </div>

                            <div className=" mt-1 row ">
                                <Col sm="6">
                                    <FormGroup className="mb-1 row mt-3 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.FromDate} </Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name="FromDate"
                                                value={fromdate}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="YYYY-MM-DD"
                                                autoComplete="0,''"
                                                disabled={pageMode === mode.edit ? true : false}
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                    defaultDate: (pageMode === mode.edit) ? values.FromDate : "today"
                                                }}
                                                onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                onReady={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                            />
                                            {isError.FromDate.length > 0 && (
                                                <span className="invalid-feedback">{isError.FromDate}</span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">{/*Supplier Name */}
                                    <FormGroup className="mb-1 row mt-3 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}> {fieldLabel.ToDate}</Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name="FromDate"
                                                value={fromdate}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="YYYY-MM-DD"
                                                autoComplete="0,''"
                                                disabled={pageMode === mode.edit ? true : false}
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                    defaultDate: (pageMode === mode.edit) ? values.FromDate : "today"
                                                }}
                                                onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                onReady={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                            />
                                            {isError.FromDate.length > 0 && (
                                                <span className="invalid-feedback">{isError.FromDate}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >

                            </div>

                            <div className=" mt-1 row ">
                                <Col sm="6">
                                    <FormGroup className="mb-1 row mt-3 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.RouteName} </Label>
                                        <Col sm="7">
                                            <Select
                                                name="RouteName"
                                                value={values.RouteName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={RouteName_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }
                                            />
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">{/*Supplier Name */}
                                    <FormGroup className="mb-1 row mt-3 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}> {fieldLabel.VehicleNumber}</Label>
                                        <Col sm="7">
                                            <Select
                                                name="VehicleNumber"
                                                value={values.VehicleNumber}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={VehicleNumber_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }
                                            />
                                        </Col>
                                        <Col sm="1" className="mx-4 ">{/*Go_Button  */}
                                            {/* {pageMode === mode.defaultsave ?
                                            (orderItemTable.length === 0) ? */}
                                            < Go_Button onClick={(e) => goButtonHandler()} />
                                            {/* : */}
                                            {/* <Change_Button onClick={(e) => dispatch(GoButton_For_Order_AddSuccess([]))} />
                                            : null
                                        } */}
                                        </Col>
                                    </FormGroup>
                                </Col >

                            </div>

                        </div>

                        <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                        >
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider

                                    keyField="id"
                                    data={Data}
                                    columns={pagesListColumns}

                                    search
                                >
                                    {toolkitProps => (
                                        <React.Fragment>
                                            <div className="table">
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    bordered={true}
                                                    striped={false}
                                                    noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                                    classes={"table align-middle table-nowrap table-hover"}
                                                    headerWrapperClasses={"thead-light"}

                                                    {...toolkitProps.baseProps}
                                                    {...paginationTableProps}
                                                />
                                                {countlabelFunc(toolkitProps, paginationProps, dispatch, "MRP")}
                                                {mySearchProps(toolkitProps.searchProps)}
                                            </div>

                                            <Row className="align-items-md-center mt-30">
                                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                    <PaginationListStandalone
                                                        {...paginationProps}
                                                    />
                                                </Col>
                                            </Row>
                                        </React.Fragment>
                                    )
                                    }
                                </ToolkitProvider>
                            )
                            }

                        </PaginationProvider>
                        {
                            Data.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                        <SaveButton pageMode={pageMode}
                                            onClick={saveHandeller}
                                            userAcc={userPageAccessState}
                                            editCreatedBy={editCreatedBy}
                                            module={"LoadingSheet"}
                                        />

                                    </Col>
                                </FormGroup >
                                : null
                        }

                    </form >
                </div >
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default LoadingSheet
