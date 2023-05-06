import React, { useEffect, useState } from 'react';
import MetaTags from 'react-meta-tags';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactApexChart from "react-apexcharts"
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container, Label, Row,
} from "reactstrap";
import { breadcrumbReturnFunc, metaTagLabel } from '../../../components/Common/CommonFunction';
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import { commonPageField, commonPageFieldSuccess } from '../../../store/actions';
import * as mode from "../../../routes/PageMode"
import CountUp from "react-countup";
import { WidgetsData } from '../WidgetsData';
import { getDashbordDetails } from '../../../store/Dashboard/Dashboard_1_Redux/action';
import { options } from '../Options';
import PaymentEntryList from './PaymentEntryList';
import InvoiceForGRN from './GRNList';


const Dashboard_1 = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(123);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        getDashboard,
        pageField,
        updateMsg,
        userAccess } = useSelector((state) => ({
            getDashboard: state.DashboardReducer.getDashboard,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    const { OrderCount, InvoiceCount, GRNsCount } = getDashboard

    useEffect(() => {
        const page_Id = pageId.DASHBORD_1//changes
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getDashbordDetails())
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)//changes
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
        history.push(url.GRN_STP_1)
    }


    return (
        <React.Fragment>
            <div className="page-content">
            <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <Container fluid>
                    <Row>
                        {/* {(WidgetsData || []).map((widget, key) => ( */}
                        <Col xl={4} md={4} >
                            <Card className="card-h-100">
                                <CardBody>
                                    <Row className="align-items-center">
                                        <Col xs={4}>
                                            <span className="text-black mb-3 lh-1 d-block text-truncate">Total Orders</span>
                                            <h4 className="mb-3">
                                                {/* {widget.isDoller === true ? '$' : ''} */}
                                                <span className="counter-value">
                                                    {/* <CountUp
                                                            start={0}
                                                            end={widget.price}
                                                            duration={12}
                                                        /> */}
                                                    {OrderCount}
                                                </span>
                                            </h4>
                                        </Col>
                                        <Col xs={4}>
                                            <ReactApexChart
                                                options={options}
                                                // series={[{ data: [...widget['series']] }]}
                                                series={[2, 10, 18, 22, 36, 15, 47, 75, 65, 19, 14, 2, 47, 42, 15]}
                                                type="line"
                                                className="apex-charts"
                                                dir="ltr"
                                            />
                                        </Col>
                                    </Row>

                                    <div className="text-nowrap">
                                        <span className={"badge badge-soft-" + "success" + " text-" + "success"}>
                                            +$20.9k
                                        </span>
                                        <span className="ms-1 text-muted font-size-13">Since last week</span>
                                    </div>

                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4} md={4} >
                            <Card className="card-h-100">
                                <CardBody>
                                    <Row className="align-items-center">
                                        <Col xs={4}>
                                            <span className="text-black mb-3 lh-1 d-block text-truncate">Total Invoices</span>
                                            <h4 className="mb-3">
                                                {/* {widget.isDoller === true ? '$' : ''} */}
                                                <span className="counter-value">
                                                    {/* <CountUp
                                                            start={0}
                                                            end={widget.price}
                                                            duration={12}
                                                        /> */}
                                                    {InvoiceCount}
                                                </span>
                                            </h4>
                                        </Col>
                                        <Col xs={4}>
                                            <ReactApexChart
                                                options={options}
                                                // series={[{ data: [...widget['series']] }]}
                                                series={[2, 10, 18, 22, 36, 15, 47, 75, 65, 19, 14, 2, 47, 42, 15]}
                                                type="line"
                                                className="apex-charts"
                                                dir="ltr"
                                            />
                                        </Col>
                                    </Row>

                                    <div className="text-nowrap">
                                        <span className={"badge badge-soft-" + "success" + " text-" + "success"}>
                                            +$20.9k
                                        </span>
                                        <span className="ms-1 text-muted font-size-13">Since last week</span>
                                    </div>

                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4} md={4} >
                            <Card className="card-h-100">
                                <CardBody>
                                    <Row className="align-items-center">
                                        <Col xs={4}>
                                            <span className="text-black mb-3 lh-1 d-block text-truncate">Total GRNs</span>
                                            <h4 className="mb-3">
                                                {/* {widget.isDoller === true ? '$' : ''} */}
                                                <span className="counter-value">
                                                    {/* <CountUp
                                                            start={0}
                                                            end={widget.price}
                                                            duration={12}
                                                        /> */}
                                                    {GRNsCount}
                                                </span>
                                            </h4>
                                        </Col>
                                        <Col xs={4}>
                                            <ReactApexChart
                                                options={options}
                                                // series={[{ data: [...widget['series']] }]}
                                                series={[2, 10, 18, 22, 36, 15, 47, 75, 65, 19, 14, 2, 47, 42, 15]}
                                                type="line"
                                                className="apex-charts"
                                                dir="ltr"
                                            />
                                        </Col>
                                    </Row>

                                    <div className="text-nowrap">
                                        <span className={"badge badge-soft-" + "success" + " text-" + "success"}>
                                            +$20.9k
                                        </span>
                                        <span className="ms-1 text-muted font-size-13">Since last week</span>
                                    </div>

                                </CardBody>
                            </Card>
                        </Col>
                        {/* ))} */}
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <Card >
                                <CardHeader style={{ backgroundColor: "whitesmoke" }}>
                                    <Label className=" text-primary text-bold mb-n2"
                                        onClick={paymentEntry_onClick}
                                    >
                                        Todays Payment Entry</Label>
                                </CardHeader>
                                <PaymentEntryList />
                            </Card>
                        </Col>

                        <Col lg={6}>
                            <Card >
                                <CardHeader style={{ backgroundColor: "whitesmoke" }}>
                                    <Label className=" text-primary text-bold mb-n2"
                                        onClick={InvoiceFoRGRN_onClick}
                                    >
                                        Invoices For GRN</Label>
                                </CardHeader>
                                <InvoiceForGRN />
                            </Card>
                        </Col>
                    </Row>



                </Container>
            </div>
        </React.Fragment>
    );
}

export default Dashboard_1;