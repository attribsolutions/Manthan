
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
import { commonPageFieldSuccess } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import { breadcrumbReturnFunc, loginPartyID, currentDate, metaTagLabel } from "../../../../components/Common/CommonFunction";
import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import * as mode from "../../../../routes/PageMode";
import { LoadingSheet_GoBtn_API_Succcess } from "../../../../store/Sales/LoadingSheetRedux/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../../components/Common/SearchBox/MySearch";
import { countlabelFunc } from "../../../../components/Common/CommonPurchaseList";
import { makeBtnCss } from "./../../../../components/Common/ListActionsButtons";
import { GetOpeningBalance, ReceiptGoButtonMaster } from "../../../../store/Accounting/Receipt/action";
import { CustomAlert } from "../../../../CustomAlert/ConfirmDialog";

const LoadingSheetUpdate = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [userPageAccessState, setUserAccState] = useState('');
    const [loadingDate, setLoadingDate] = useState(currentDate);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        userAccess,
        List,
    } = useSelector((state) => ({
        List: state.LoadingSheetReducer.LoadingSheetUpdate,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,

    }));
    const { InvoiceParent = [], PartyDetails = {} } = List

    useEffect(() => {
        dispatch(LoadingSheet_GoBtn_API_Succcess([]))
        const page_Id = pageId.LOADING_SHEET_LIST_UPDATE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
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
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    function makeBtnFunc(e, row) {

        var { CustomerID, id } = row

        try {

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
            dataField: "Checked",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center' }}>
                    <Input
                        id={`Checked${key}`}
                        defaultChecked={row.Checked}
                        type="checkbox"
                        className="col col-sm text-center"
                        onChange={(event) => { row.Checked = event.target.checked; }}
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

    function DateOnchange(e, date) {
        setLoadingDate(date)
    }

    function MakeReceiptForAll() {

        let result = InvoiceParent.map(a => {
            if (a.Checked === true) {
                return a.id
            }
        })
        const LoadingNumber = result.toString()

        const LoadingNumber_withoutcomma = LoadingNumber.replace(/,*$/, '');

        const jsonBody = JSON.stringify({
            PartyID: loginPartyID(),
            CustomerID: "",
            InvoiceID: LoadingNumber_withoutcomma
        });

        const body = { jsonBody }

        if (LoadingNumber_withoutcomma === "") {
            CustomAlert({
                Type: 3,
                Message: "Select At Least One Field",
            })
        }
        else {
            dispatch(ReceiptGoButtonMaster(body))
            history.push(url.BULK_RECIPT);
        }
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

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
                                                value={loadingDate}
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
                            InvoiceParent.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} className={"row save1"}>
                                        <button type="button" style={{ width: "120px" }} onClick={MakeReceiptForAll} className="btn btn-primary  waves-effect waves-light">Make Receipt</button>
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

export default LoadingSheetUpdate



