import React, { useEffect, useState } from 'react';
import MetaTags from 'react-meta-tags';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container, Label, Row, Spinner,
} from "reactstrap";
import { breadcrumbReturnFunc, loginSelectedPartyID } from '../../../components/Common/CommonFunction';
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import { commonPageField, commonPageFieldSuccess, getGRNListPage, getGRNListPageSuccess, getOrderListPage, invoiceListGoBtnfilter, invoiceListGoBtnfilterSucccess } from '../../../store/actions';
import * as mode from "../../../routes/PageMode"
import { Get_Dashboard_Grn_Data, Get_Dashboard_Invoice_Data, Get_Dashboard_Order_Data, getDashbordDetails } from '../../../store/Dashboard/Dashboard_1_Redux/action';
import PaymentEntryList from '../Dashboard_1/PaymentEntryList';
import InvoiceForGRN from '../Dashboard_1/GRNList';
import SalesReturnListForDashboard from '../Dashboard_1/SalesReturnListForDashboard';
import MobileRetailerApprove from '../Dashboard_1/MobileRetailerApprove';

import { DashboardLoader, PageLoadingSpinner } from '../../../components/Common/CommonButton';
import NewCommonPartyDropdown from "../../../components/Common/NewCommonPartyDropdown";
import LineBar from '../../../components/Common/DashboardChart/MixLineChart';
import TransactionLog from './TransactionLog';

const Dashboard_Admin = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();
    const [userPageAccessState, setUserAccState] = useState('');

    const [OrderMonthCount, setOrderMonthCount] = useState({});
    const [InvoiceMonthCount, setInvoiceMonthCount] = useState({});
    const [GrnMonthCount, setGrnMonthCount] = useState({});

    const [ChartOpen, setChartOpen] = useState(false);
    const [OrderChartOpen, setOrderChartOpen] = useState(false);


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        getDashboard,
        userAccess,
        orderApprovalMsg,
        GRNListLoading,
        pageField,
        SalesReturnListloading,
        tableList,
        InvoiceData,
        GrnData,
        grnDataLoading,
        invoiceDataLoading,
        orderDataLoading,
        commonPartyDropSelect,
        PaymentEntryListloading } = useSelector((state) => ({
            getDashboard: state.DashboardReducer.getDashboard,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField,
            orderApprovalMsg: state.OrderReducer.orderApprovalMsg,
            GRNListLoading: state.OrderReducer.goBtnLoading,
            SalesReturnListloading: state.SalesReturnReducer.loading,
            PaymentEntryListloading: state.ReceiptReducer.loading,
            InvoiceData: state.DashboardReducer.invoiceData,
            tableList: state.DashboardReducer.orderData,
            GrnData: state.DashboardReducer.grnData,
            InvoiceChartLoading: state.InvoiceReducer.listBtnLoading,
            orderDataLoading: state.DashboardReducer.orderDataLoading,
            grnDataLoading: state.DashboardReducer.grnDataLoading,
            invoiceDataLoading: state.DashboardReducer.invoiceDataLoading,
            commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect


        }));

    const { OrderCount, InvoiceCount, GRNsCount, } = getDashboard

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)//changes

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

    function paymentEntry_onClick() {
        history.push(url.PAYMENT_ENTRY)
    }

    function InvoiceFoRGRN_onClick() {
        history.push(url.GRN_STP_3)
    }

    function salesReturn_onClick() {
        history.push(url.SALES_RETURN_LIST)
    }

    useEffect(() => {

        const page_Id = pageId.DASHBORD_1//changes
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getDashbordDetails({ loginPartyID: commonPartyDropSelect.value }))

        let filtersBody = ""
        let subPageMode = ""
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const { firstDate, lastDate } = getFirstAndLastDateOfYear(currentYear);
        const Invoice_Filter = {
            FromDate: firstDate,
            ToDate: lastDate,
            Customer: "",
            Party: commonPartyDropSelect.value,
            IBType: "",
            DashBoardMode: 1

        };

        filtersBody = JSON.stringify(Invoice_Filter);
        dispatch(Get_Dashboard_Invoice_Data({ subPageMode, filtersBody }));

        const Orders_Filter = {
            FromDate: firstDate,
            ToDate: lastDate,
            "Supplier": commonPartyDropSelect.value,//Suppiler swipe
            "Customer": "",//customer swipe
            "OrderType": "",
            "CustomerType": "",
            "IBType": "",
            "DashBoardMode": 1
        }
        subPageMode = url.ORDER_LIST_4
        filtersBody = JSON.stringify(Orders_Filter);
        dispatch(Get_Dashboard_Order_Data({ filtersBody, subPageMode }));

        const GRN_Filter = {
            FromDate: firstDate,
            ToDate: lastDate,
            Supplier: "",
            Party: commonPartyDropSelect.value,
            DashBoardMode: 1

        };

        filtersBody = JSON.stringify(GRN_Filter);
        dispatch(Get_Dashboard_Grn_Data({ filtersBody }));
        setChartOpen(true)
        setOrderChartOpen(true)

        return () => {
            dispatch(getGRNListPageSuccess([]));
            dispatch(invoiceListGoBtnfilterSucccess([]));
        }
    }, [commonPartyDropSelect])


    function getFirstAndLastDateOfYear(year) {
        // Create a date object for January 1st of the given year
        const firstDateOfYear = new Date(year, 0, 1);
        // Create a date object for December 31st of the given year
        const lastDateOfYear = new Date(year, 11, 31);
        // Format the dates as strings (e.g., "YYYY-MM-DD")
        const formattedFirstDate = `${firstDateOfYear.getFullYear()}-${(firstDateOfYear.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${firstDateOfYear.getDate().toString().padStart(2, '0')}`;
        const formattedLastDate = `${lastDateOfYear.getFullYear()}-${(lastDateOfYear.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${lastDateOfYear.getDate().toString().padStart(2, '0')}`;
        return {
            firstDate: formattedFirstDate,
            lastDate: formattedLastDate,
        };
    }

    useEffect(() => {
        if (tableList !== undefined) {
            const monthCounts = Array(12).fill(0); // Initialize with zeros for all months
            tableList.forEach(item => {
                const parts = item.OrderDate.split('-');
                const month = parseInt(parts[1]) - 1; // Subtract 1 to match array index
                if (month >= 0 && month < 12) {
                    monthCounts[month]++;
                }
            });
            const containsNonZeroNumber = monthCounts.some(item => item !== 0);
            setOrderMonthCount({ monthCounts, containsNonZeroNumber })

        }
    }, [tableList])


    useEffect(() => {
        if (InvoiceData !== undefined) {

            const monthCounts = Array(12).fill(0); // Initialize with zeros for all months
            InvoiceData.forEach(item => {
                const parts = item.InvoiceDate.split('-');
                const month = parseInt(parts[1]) - 1; // Subtract 1 to match array index

                if (month >= 0 && month < 12) {
                    monthCounts[month]++;
                }
            });
            const containsNonZeroNumber = monthCounts.some(item => item !== 0);
            setInvoiceMonthCount({ monthCounts, containsNonZeroNumber })

        }
    }, [InvoiceData])

    useEffect(() => {
        if (GrnData !== undefined) {
            const monthCounts = Array(12).fill(0); // Initialize with zeros for all months
            GrnData.forEach(item => {
                const parts = item.GRNDate.split('-');
                const month = parseInt(parts[1]) - 1; // Subtract 1 to match array index
                if (month >= 0 && month < 12) {
                    monthCounts[month]++;
                }
            });
            const containsNonZeroNumber = monthCounts.some(item => item !== 0);
            setGrnMonthCount({ monthCounts, containsNonZeroNumber })
        }
    }, [GrnData])

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={GRNListLoading || PaymentEntryListloading || SalesReturnListloading || !pageField} />
            <div className="page-content">
                <NewCommonPartyDropdown />
                <MetaTags>
                    <title>Dashboard | FoodERP 2.0 - React Admin & Dashboard Template</title>
                </MetaTags>
                <Container fluid>
                    <Row>
                        <Col xl={4}  >
                            <Card className="card-h-100" >
                                <CardBody>
                                    <Row className="align-items-center" >

                                        <Card className="card-h-100 ">

                                            <Row>
                                                <Col className='mt-1' sm={3}>
                                                    Annual Orders
                                                </Col>
                                                <Col sm={2}>
                                                    <span style={{ fontSize: "20px" }}>
                                                        {OrderMonthCount && OrderMonthCount.monthCounts ?
                                                            OrderMonthCount.monthCounts.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                                                            : 0
                                                        }
                                                    </span>

                                                </Col>
                                                <Col className='mt-1' sm={3}>
                                                    Todays Orders
                                                </Col>
                                                <Col sm={2}>
                                                    <span style={{ fontSize: "20px" }}> {OrderCount}</span>
                                                </Col>
                                                <Col sm={2}>
                                                    {orderDataLoading && <DashboardLoader />}
                                                </Col>
                                            </Row>

                                        </Card>
                                    </Row>

                                    <div id="mix-line-bar" className="e-chart">
                                        {OrderChartOpen && (OrderMonthCount.containsNonZeroNumber) &&
                                            <LineBar
                                                Data={OrderMonthCount.monthCounts}
                                                Name={"Order"}
                                                color={'#3c4ccf'}
                                            />}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={4}  >
                            <Card className="card-h-100" >
                                <CardBody>
                                    <Row className="align-items-center " >
                                        <Card className="card-h-100">
                                            <Row>
                                                <Col className='mt-1' sm={3}>
                                                    Annual Invoice
                                                </Col>
                                                <Col sm={2}>
                                                    <span style={{ fontSize: "20px" }}>
                                                        {InvoiceMonthCount && InvoiceMonthCount.monthCounts ?
                                                            InvoiceMonthCount.monthCounts.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                                                            : 0
                                                        }
                                                    </span>

                                                </Col>
                                                <Col className='mt-1' sm={3}>
                                                    <span >Total Invoice</span>
                                                </Col>
                                                <Col sm={2}>
                                                    <span style={{ fontSize: "20px" }}> {InvoiceCount}</span>
                                                </Col>
                                                <Col sm={2}>
                                                    {invoiceDataLoading && <DashboardLoader />}
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Row>
                                    <div id="mix-line-bar" className="e-chart">
                                        {ChartOpen && (InvoiceMonthCount.containsNonZeroNumber) &&
                                            <LineBar
                                                Data={InvoiceMonthCount.monthCounts}
                                                Name={"Invoice"}
                                                color={'#02a499'}
                                            />}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}  >
                            <Card className="card-h-100">
                                <CardBody>
                                    <Row className="align-items-center ">
                                        <Card className="card-h-100">
                                            <Row>
                                                <Col className='mt-1' sm={3}>
                                                    Annual GRNs
                                                </Col>
                                                <Col sm={2}>
                                                    <span style={{ fontSize: "20px" }}>
                                                        {GrnMonthCount && GrnMonthCount.monthCounts ?
                                                            GrnMonthCount.monthCounts.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                                                            : 0
                                                        }
                                                    </span>

                                                </Col>
                                                <Col className='mt-1' sm={3}>
                                                    <span >Total GRNs &nbsp;</span>
                                                </Col>
                                                <Col sm={2}>
                                                    <span style={{ fontSize: "20px" }}> {GRNsCount}</span>
                                                </Col>
                                                <Col sm={2}>
                                                    {grnDataLoading && <DashboardLoader />}
                                                </Col>
                                            </Row>
                                        </Card>

                                    </Row>
                                    <div id="mix-line-bar" className="e-chart">
                                        {ChartOpen && (GrnMonthCount.containsNonZeroNumber) &&
                                            <LineBar
                                                Data={GrnMonthCount.monthCounts}
                                                Name={"GRN"}
                                                color={'#38a4f8'}
                                            />}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={6}>
                            <Card className=''>
                                <CardHeader style={{ backgroundColor: "whitesmoke" }}
                                    className="card-header align-items-center d-flex text-center">

                                    <Label className="card-title mb-0 flex-grow-4 text-primary text-bold mb-n2 text-decoration-underline"
                                        onClick={paymentEntry_onClick}
                                        disabled={PaymentEntryListloading}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Todays Payment Entry</Label>&nbsp;&nbsp;&nbsp;
                                    {(PaymentEntryListloading) &&
                                        <DashboardLoader />
                                    }

                                </CardHeader>
                                <PaymentEntryList />
                            </Card>

                            <Col >
                                <Card >
                                    <CardHeader style={{ backgroundColor: "whitesmoke" }}
                                        className="card-header align-items-center d-flex text-center">
                                        <Label className="card-title mb-0 flex-grow-4 text-primary text-bold mb-n2 text-decoration-underline"
                                            onClick={salesReturn_onClick}
                                            disabled={SalesReturnListloading}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Sales Return List</Label>
                                        {(SalesReturnListloading) &&
                                            <DashboardLoader />
                                        }
                                    </CardHeader>
                                    <SalesReturnListForDashboard />
                                </Card>
                            </Col>
                        </Col>

                        <Col xl={6}>
                            <Card >
                                <CardHeader style={{ backgroundColor: "whitesmoke" }}
                                    className="card-header align-items-center d-flex">
                                    <Label
                                        className="card-title mb-0 flex-grow-4 text-primary text-bold mb-n2 text-decoration-underline"
                                        disabled={GRNListLoading}
                                        onClick={InvoiceFoRGRN_onClick}
                                        style={{ cursor: "pointer" }}

                                    >
                                        Invoices For GRN</Label>
                                    {(GRNListLoading) &&
                                        <DashboardLoader />
                                    }
                                </CardHeader>
                                <InvoiceForGRN />

                            </Card>
                            <Col >
                                <Card >
                                    <div className='mb-n6'>
                                        <CardHeader style={{ backgroundColor: "whitesmoke" }}
                                            className="card-header align-items-center d-flex text-center">
                                            <Label className="card-title mb-0 flex-grow-4 text-primary text-bold mb-n2 text-decoration-underline"
                                                // onClick={mobileRetailerApprove_onClick}
                                                disabled={SalesReturnListloading}
                                                style={{ cursor: "pointer" }}

                                            >
                                                Mobile Retailer Approve</Label>
                                            {(SalesReturnListloading) &&
                                                <DashboardLoader />
                                            }
                                        </CardHeader>
                                    </div>
                                    <MobileRetailerApprove />

                                </Card>
                            </Col>
                        </Col>

                    </Row>

                </Container>
            </div>
        </React.Fragment >
    );
}

export default Dashboard_Admin;