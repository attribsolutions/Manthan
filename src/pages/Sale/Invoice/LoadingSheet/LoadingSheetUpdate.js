
import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,
    Button
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
import { breadcrumbReturnFunc, loginPartyID, currentDate, btnIsDissablefunc, loginUserID } from "../../../../components/Common/CommonFunction";
import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import * as mode from "../../../../routes/PageMode";
import { GetRoutesList } from "../../../../store/Administrator/RoutesRedux/actions";
import { invoiceListGoBtnfilter } from "../../../../store/Sales/Invoice/action";
import { getVehicleList } from "../../../../store/Administrator/VehicleRedux/action";
import { LoadingSheetListAction, LoadingSheetListActionSuccess, LoadingSheet_GoBtn_API, LoadingSheet_GoBtn_API_Succcess, SaveLoadingSheetMaster, SaveLoadingSheetMasterSucccess } from "../../../../store/Sales/LoadingSheetRedux/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../../components/Common/SearchBox/MySearch";
import { countlabelFunc } from "../../../../components/Common/CommonPurchaseList";
import { getDriverList } from "../../../../store/Administrator/DriverRedux/action";
import data from "./data.json";
import { makeBtnCss } from "./../../../../components/Common/ListActionsButtons";
import { GetOpeningBalance, ReceiptGoButtonMaster, ReceiptGoButtonMaster_Success } from "../../../../store/Accounting/Receipt/action";
import { CustomAlert } from "../../../../CustomAlert/ConfirmDialog";



const LoadingSheetUpdate = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    // const [orderlistFilter, setorderlistFilter] = useState({ todate: currentDate, fromdate: currentDate, Date: currentDate });
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [array, setArray] = useState([]);

    const fileds = {
        id: "",
        Date: currentDate,
        FromDate: currentDate,
        ToDate: currentDate,
        RouteName: "",
        VehicleNumber: "",
        DriverName: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        // updateMsg,
        pageField,
        userAccess,
        List,
        makeReceipt,
        OpeningBalance
    } = useSelector((state) => ({
        postMsg: state.LoadingSheetReducer.postMsg,
        List: state.LoadingSheetReducer.LoadingSheetUpdate,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        makeReceipt: state.ReceiptReducer.ReceiptGoButton,
        OpeningBalance: state.ReceiptReducer.OpeningBalance,
    }));

    const location = { ...history.location }
    // const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;
    const { InvoiceParent = [], PartyDetails = {} } = List

    // const { fromdate, todate, Date } = orderlistFilter;

    useEffect(() => {
        dispatch(LoadingSheet_GoBtn_API_Succcess([]))
        const page_Id = pageId.LOADING_SHEET_LIST_UPDATE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
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
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    // useEffect(() => {
    //     if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
    //         setState(() => resetFunction(fileds, state))// Clear form values  
    //         // dispatch(Breadcrumb_inputName(''))

    //         if (pageMode === mode.dropdownAdd) {
    //             dispatch(AlertState({
    //                 Type: 1,
    //                 Status: true,
    //                 Message: postMsg.Message,
    //             }))
    //         }
    //         else {
    //             dispatch(AlertState({
    //                 Type: 1,
    //                 Status: true,
    //                 Message: postMsg.Message,
    //                 RedirectPath: url.LOADING_SHEET_LIST,
    //             }))
    //         }
    //     }
    //     else if (postMsg.Status === true) {

    //         dispatch(AlertState({
    //             Type: 4,
    //             Status: true,
    //             Message: JSON.stringify(postMessage.Message),
    //             RedirectPath: false,
    //             AfterResponseAction: false
    //         }));
    //     }
    // }, [postMsg])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => {

        if ((makeReceipt.Status === true) && (makeReceipt.StatusCode === 200) && !(OpeningBalance === '')) {
            dispatch(ReceiptGoButtonMaster_Success({ ...makeReceipt, Status: false }))

            history.push({
                pathname: makeReceipt.path,
                pageMode: makeReceipt.pageMode,
                editValue: makeReceipt.ListData,
            })
        }
    }, [makeReceipt, OpeningBalance])

    function makeBtnFunc(e, row) {

        var { CustomerID, id } = row

        try {
            debugger
            const jsonBody = JSON.stringify({
                PartyID: loginPartyID(),
                CustomerID: CustomerID,
                InvoiceID: (id).toString()
            });

            const jsonBody1 = JSON.stringify({
                PartyID: loginPartyID(),
                CustomerID: CustomerID,
                ReceiptDate: currentDate
            });
            const body = { jsonBody, pageMode: mode.modeSTPList, path: url.RECEIPTS, ListData: row }
            dispatch(ReceiptGoButtonMaster(body));
            dispatch(GetOpeningBalance(jsonBody1));

        } catch (e) { }
    }


    function checkLoading(e, row, key) {
        

        let checkedValue = e.target.checked
        row.idChecked = checkedValue
    }

    const pagesListColumns = [
        {
            text: "Bill Date",
            dataField: "InvoiceDate",
        },
        {
            text: "Bill NO",
            dataField: "FullInvoiceNumber",
        },
        {
            text: "Customer Name",
            dataField: "Customer",
        },
        {
            text: "Amount",
            dataField: "GrandTotal",
        },
        {
            text: "Select All",
            dataField: "Check",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center' }}>
                    <Input
                        id=""
                        key={row.id}
                        defaultChecked={row.Check}
                        type="checkbox"
                        className="col col-sm text-center"
                        onChange={e => { checkLoading(e, row, key) }}
                    />
                </span>)
            }
        },

        {
            text: "Action",
            dataField: "",
            formatter: (cellContent, row) => {

                return (<span style={{ justifyContent: 'center' }}>
                    <Button
                        type="button"
                        id={`btn-makeBtn-${row.id}`}
                        className={makeBtnCss}
                        onClick={(e) => {
                            makeBtnFunc(e, row)
                        }}
                    >
                        <span style={{ marginLeft: "6px", marginRight: "6px" }}
                            className=" fas fa-file-invoice" ></span> </Button></span>)
            }
        }

    ];

    const pageOptions = {
        sizePerPage: 10,
        // totalSize: Data.length,
        custom: true,
    };

    const saveHandeller = async (event) => {

        event.preventDefault();
        const btnId = event.target.id


        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })


                const jsonBody = JSON.stringify({

                });

                if (pageMode === mode.edit) {
                }
                else {
                    dispatch(SaveLoadingSheetMaster({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    function DateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.Date = date;
            a.hasValid.Date.valid = true
            return a
        })
    }

    function MakeReceiptForAll() {
        
        let result = InvoiceParent.map(a => {
            if (a.idChecked === true) {
                return a.id
            }
        })
        const LoadingNumber = result.toString()
        const jsonBody = JSON.stringify({
            PartyID: loginPartyID(),
            CustomerID: "",
            InvoiceID: LoadingNumber
        });
        const body = { jsonBody }

    
        if (LoadingNumber === "") {
            CustomAlert({
                Type: 3,
                Message: "Select At Least One Field",
            })
        } else {
            dispatch(ReceiptGoButtonMaster(body))
            history.push(url.BULK_RECIPT);
        }

       



    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>
                    <div id="id1"></div>


                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-2" >

                            <div className=" row ">
                                <Col sm="6">
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px" }}>Loading NO :</Label>
                                        <Col sm="7">
                                            <Label className=" mt-2">{PartyDetails.LoadingSheetNo}</Label>
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>Loading Date </Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name='Date'
                                                value={values.Date}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="Select..."
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                }}
                                                onChange={DateOnchange}
                                            />
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
                                    data={InvoiceParent}
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
                            // Data.length > 0 ?
                            <FormGroup>
                                <Col sm={2} className={"row save1"}>
                                    <button type="button" style={{ width: "120px" }} onClick={MakeReceiptForAll} className="btn btn-primary  waves-effect waves-light">Make Receipt</button>
                                </Col>
                            </FormGroup >
                            // : null
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

export default LoadingSheetUpdate



