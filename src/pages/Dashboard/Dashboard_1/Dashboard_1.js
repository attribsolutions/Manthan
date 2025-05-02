import React, { useEffect, useState } from 'react';
import MetaTags from 'react-meta-tags';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container, Label, Row,
} from "reactstrap";
import { IsCBMManagment, IsSweetAndSnacksCompany, amountCommaSeparateFunc, breadcrumbReturnFunc, currentDate_dmy, currentDate_ymd, loginIsSCMParty, loginPartyID, loginSelectedPartyID, loginUserIsFranchisesRole } from '../../../components/Common/CommonFunction';
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import { commonPageField, commonPageFieldSuccess } from '../../../store/actions';
import * as mode from "../../../routes/PageMode"
import { getDashbordDetails, getDashbordDetails_Success } from '../../../store/Dashboard/Dashboard_1_Redux/action';
import PaymentEntryList from './PaymentEntryList';
import InvoiceForGRN from './GRNList';
import SalesReturnListForDashboard from './SalesReturnListForDashboard';
import { DashboardLoader, PageLoadingSpinner } from '../../../components/Common/CommonButton';
import MobileRetailerApprove from './MobileRetailerApprove';
import DemandListForDashboard from './demand';
import WorkOrderForDashboard from './WorkOrder';
import DailyItemSaleView from '../FrenchiesesDashboard/DailyItemSaleView';
import Pie from '../FrenchiesesDashboard/pie';
import SERVER_HOST_PATH, { ERP_LINK } from '../../../helpers/_serverPath';
import { encodeToHash, formatDate, GetDailySaleData } from '../FrenchiesesDashboard/Function';
import DatePicker from 'react-flatpickr';
import { C_DatePicker } from '../../../CustomValidateForm';
import PosExeVersionDetails from '../FrenchiesesDashboard/PosExeVersionDetails';

const Dashboard_1 = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();
    const IsCompanySweetAndSnacks = IsSweetAndSnacksCompany()
    const [userPageAccessState, setUserAccState] = useState('');
    const [selectedOption, setSelectedOption] = useState('TODAYS');
    const [data, setData] = useState([]);


    const isFrenchises = loginUserIsFranchisesRole()
    const IsMannagementParty = IsCBMManagment();

    const [dateRange, setDateRange] = useState({
        fromDate: currentDate_ymd,
        toDate: currentDate_ymd,
    });

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        getDashboard,
        userAccess,
        orderApprovalMsg,
        GRNListLoading,
        pageField,
        SalesReturnListloading,
        PaymentEntryListloading,
        commonPartyDropSelect } = useSelector((state) => ({
            getDashboard: state.DashboardReducer.getDashboard,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField,
            orderApprovalMsg: state.OrderReducer.orderApprovalMsg,
            GRNListLoading: state.OrderReducer.goBtnLoading,
            SalesReturnListloading: state.SalesReturnReducer.loading,
            PaymentEntryListloading: state.ReceiptReducer.loading,
            commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
        }));

    const { OrderCount, InvoiceCount, GRNsCount, MobileAppOrderCount } = getDashboard

    useEffect(() => {
        const page_Id = pageId.DASHBORD_1//changes
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))

        
    }, []);

    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            dispatch(getDashbordDetails({ loginPartyID: loginSelectedPartyID() }));
        }
        return () => {
            dispatch(getDashbordDetails_Success([]));
        }
    }, [commonPartyDropSelect]);

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
        history.push(url.PAYMENT_ENTRY_LIST)
    }

    function InvoiceFoRGRN_onClick() {
        if (IsCompanySweetAndSnacks) {
            history.push(url.IB_GRN_LIST)
        } else {
            history.push(url.GRN_STP_3)
        }
    }

    function salesReturn_onClick() {
        history.push(url.SALES_RETURN_LIST)
    }

    function mobileRetailerAprproveLinkHandler() {
        history.push(url.RETAILER_APPROVAL)
    }

    function demandListLinkHandler() {
        history.push(url.IB_ORDER_SO_LIST)
    }

    const handleChange = (event) => {

        const value = event.target.value;
        setSelectedOption(value);

        const today = new Date();
        let fromDate;
        let toDate;

        if (value === 'TODAYS') {
            fromDate = toDate = formatDate(today);
        } else if (value === 'YESTERDAY') {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            fromDate = toDate = formatDate(yesterday);
        } else if (value === 'MONTH') {
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            fromDate = formatDate(firstDayOfMonth);
            toDate = formatDate(today);
        } else if (value === 'SIX_MONTH') {
            const sixMonthsAgo = new Date(today);
            sixMonthsAgo.setMonth(today.getMonth() - 6);
            fromDate = formatDate(sixMonthsAgo);
            toDate = formatDate(today);
        } else if (value === 'CUSTOM') {
            fromDate = dateRange.fromDate;
            toDate = dateRange.toDate;
        }

        setDateRange({ fromDate, toDate });
    };



    const RedirectHandler = (Type) => {
        if (Type === 1) {
            history.push(url.ORDER_LIST_4)

        } else if (Type === 2) {
            history.push(url.INVOICE_LIST_1)
        }
        else if (Type === 3) {
            history.push(url.APP_ORDER_LIST)
        } else {
            history.push(url.GRN_LIST_3)
        }
    }

    useEffect(async () => {

        const jsonData = await GetDailySaleData({ fromDate: dateRange.fromDate, toDate: dateRange.toDate, Party_Id: loginPartyID(), })
        setData(jsonData.Data)
    }, [dateRange])



    const encodeId = (id) => {
        return btoa(id.toString()); // Converts ID to Base64 encoded string
    };


    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={GRNListLoading || PaymentEntryListloading || SalesReturnListloading || !pageField} />
            <div className="page-content">
                <MetaTags>
                    <title>Dashboard | FoodERP 2.0 - React Admin & Dashboard Template</title>
                </MetaTags>
                <Container fluid>


                    <Row>
                        <Col xl={3} md={3} >
                            <Card className="card-h-100">
                                <CardBody>
                                    <Row className="align-items-center">
                                        <Col >
                                            <span style={{ cursor: "pointer", fontWeight: "bold" }} onClick={() => RedirectHandler(1)} className="text-primary mb-3 lh-1 d-block  text-decoration-underline">Total Orders</span>
                                            <h4 className="mb-3">
                                                <span className="counter-value">
                                                    {OrderCount}
                                                </span>
                                            </h4>
                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>
                        </Col>

                        {!IsCompanySweetAndSnacks && <Col xl={3} md={3} >
                            <Card className="card-h-100">
                                <CardBody>
                                    <Row className="align-items-center">
                                        <Col >
                                            <span style={{ cursor: "pointer", fontWeight: "bold" }} onClick={() => RedirectHandler(3)} className="text-primary mb-3 lh-1  d-block text-decoration-underline "> MobileApp Orders</span>
                                            <h4 className="mb-3">
                                                <span className="counter-value">
                                                    {MobileAppOrderCount}
                                                </span>
                                            </h4>
                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>
                        </Col>}

                        {<Col xl={3} md={3} >
                            <Card className="card-h-100">
                                <CardBody>
                                    <Row className="align-items-center">
                                        <Col >
                                            <span style={{ cursor: "pointer", fontWeight: "bold" }}
                                                onClick={() => RedirectHandler(2)}
                                                className="text-primary mb-3 lh-1 d-block text-decoration-underline">Total Invoices</span>
                                            <h4 className="mb-3">
                                                <span className="counter-value">
                                                    {InvoiceCount}
                                                </span>
                                            </h4>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>}

                        {<Col xl={3} md={3} >
                            <Card className="card-h-100">
                                <CardBody>
                                    <Row className="align-items-center">
                                        <Col>
                                            <span style={{ cursor: "pointer", fontWeight: "bold" }}
                                                onClick={() => RedirectHandler()}
                                                className="text-primary text-bold mb-3 lh-1 d-block text-decoration-underline">Total GRN's</span>
                                            <h4 className="mb-3">
                                                <span className="counter-value">
                                                    {GRNsCount}
                                                </span>
                                            </h4>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>}
                    </Row>

                    <Row>
                        {(!IsCompanySweetAndSnacks) && (!loginUserIsFranchisesRole()) && <Col lg={6}>
                            <Card className=''>
                                <CardHeader style={{ backgroundColor: "whitesmoke" }}
                                    className="card-header align-items-center d-flex text-center">

                                    <Label className="card-title mb-0 flex-grow-4 text-primary text-bold mb-n2 text-decoration-underline"
                                        onClick={paymentEntry_onClick}
                                        disabled={PaymentEntryListloading}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Today's Payment Entry</Label>&nbsp;&nbsp;&nbsp;
                                    {(PaymentEntryListloading) &&
                                        <DashboardLoader />
                                    }
                                </CardHeader>
                                <PaymentEntryList />
                            </Card>
                        </Col>}


                        {isFrenchises && (
                            <Col lg={6}>
                                <Card>
                                    <CardHeader style={{ backgroundColor: "whitesmoke" }} className="card-header align-items-center d-flex justify-content-between">
                                        <Label
                                            className="card-title mb-0 flex-grow-4 text-primary text-bold mb-n2 text-decoration-underline"

                                            style={{ cursor: "pointer" }}
                                        >
                                            Daily Top 5 Selling Items
                                        </Label>

                                        <Label
                                            className="card-title mb-0 flex-grow-4 text-primary text-bold mb-n2 text-decoration-underline ml-auto"
                                            style={{ cursor: "pointer" }}
                                        >
                                            <a
                                                href={`${ERP_LINK}${url.DAILY_SALE_REPORT}/${encodeId(loginPartyID())}`}
                                                target="_blank"  // Optional: to open the link in a new tab
                                                style={{ color: "inherit", textDecoration: "inherit" }}  // Optional: to inherit the styles from the Label component
                                            >
                                                {`${ERP_LINK}${url.DAILY_SALE_REPORT}/${encodeId(loginPartyID())}`}
                                            </a>

                                        </Label>
                                    </CardHeader>

                                    {(data[0]?.TopSaleItems?.length === undefined) || (data[0]?.TopSaleItems?.length === 0) ? null : <div className="d-flex flex-wrap align-items-center mb-n2 mt-1">
                                        <div style={{ marginLeft: "5px" }}>
                                            <select className="form-select form-select-sm" value={selectedOption} onChange={handleChange}>
                                                <option value="TODAYS">Today's</option>
                                                <option value="YESTERDAY">Yesterday</option>
                                                <option value="MONTH">Month</option>
                                                <option value="SIX_MONTH">Six Month</option>

                                            </select>

                                            {selectedOption === "CUSTOM" && (
                                                <div style={{ marginTop: "10px", backgroundColor: "#whitesmoke" }}>
                                                    <CardBody className="c_card_body">

                                                        <C_DatePicker
                                                            options={{
                                                                altInput: true,
                                                                altFormat: "d-m-Y",
                                                                dateFormat: "Y-m-d",
                                                                minDate: "today",
                                                            }}
                                                            name="FromDate"
                                                            value={dateRange.fromDate}
                                                            onChange={(e, date) => {
                                                                setDateRange((i) => {
                                                                    const a = { ...i }
                                                                    a.fromDate = date;
                                                                    return a
                                                                })
                                                            }}
                                                        />

                                                        <C_DatePicker
                                                            options={{
                                                                altInput: true,
                                                                altFormat: "d-m-Y",
                                                                dateFormat: "Y-m-d",
                                                                minDate: "today",
                                                            }}
                                                            name="ToDate"
                                                            value={dateRange.toDate}
                                                            onChange={(e, date) => {
                                                                setDateRange((i) => {
                                                                    const a = { ...i }
                                                                    a.toDate = date;
                                                                    return a
                                                                })
                                                            }}
                                                        />
                                                    </CardBody>
                                                </div>
                                            )}
                                        </div>



                                        <div className="ml-auto" style={{ marginLeft: "5px" }}>
                                            <span className="badge rounded-pill badge-soft-primary fw-large" style={{ fontSize: "20px" }}>
                                                ₹ {data[0]?.TotalAmount ? amountCommaSeparateFunc(data[0].TotalAmount) : 0}
                                            </span>
                                        </div>
                                    </div>}


                                    {(data[0]?.TopSaleItems?.length === undefined) || (data[0]?.TopSaleItems?.length === 0) ? null : <Pie Item={data[0].TopSaleItems} />}
                                </Card>
                            </Col>
                        )}

                        {IsCompanySweetAndSnacks &&
                            <Col lg={6}>
                                <Card >
                                    <CardHeader style={{ backgroundColor: "whitesmoke" }}
                                        className="card-header align-items-center d-flex text-center">
                                        <Label className="card-title mb-0 flex-grow-4 text-primary text-bold mb-n2 text-decoration-underline"
                                            onClick={demandListLinkHandler}
                                            disabled={false}
                                            style={{ cursor: "pointer" }}

                                        >
                                            IB Sales Order List</Label>
                                        {(SalesReturnListloading) &&
                                            <DashboardLoader />
                                        }
                                    </CardHeader>
                                    <DemandListForDashboard />
                                </Card>
                            </Col>
                        }

                        {<Col lg={6}>
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
                        </Col>}



                    </Row>

                    <Row>



                        <Col lg={6}>
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

                        {!IsCompanySweetAndSnacks && <Col lg={6}>
                            <Card >
                                <div className='mb-n6'>
                                    <CardHeader style={{ backgroundColor: "whitesmoke" }}
                                        className="card-header align-items-center d-flex text-center">
                                        <Label className="card-title mb-0 flex-grow-4 text-primary text-bold mb-n2 text-decoration-underline"
                                            onClick={mobileRetailerAprproveLinkHandler}
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
                        </Col>}

                        {false && <Col lg={6}>
                            <Card >
                                <div className='mb-n6'>
                                    <CardHeader style={{ backgroundColor: "whitesmoke" }}
                                        className="card-header align-items-center d-flex text-center">
                                        <Label className="card-title mb-0 flex-grow-4 text-primary text-bold mb-n2 text-decoration-underline"
                                            onClick={mobileRetailerAprproveLinkHandler}
                                            disabled={SalesReturnListloading}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Item Wise Work Order</Label>
                                        {(SalesReturnListloading) &&
                                            <DashboardLoader />
                                        }
                                    </CardHeader>
                                </div>
                                <WorkOrderForDashboard />
                            </Card>
                        </Col>}
                    </Row>
                    <Row>
                        {(IsMannagementParty) && <Col lg={12}>
                            <Card >

                                <PosExeVersionDetails />

                            </Card>
                        </Col>}

                    </Row>


                </Container>
            </div>
        </React.Fragment>
    );
}

export default Dashboard_1;