import React, { useState } from 'react';
import MetaTags from 'react-meta-tags';
import { Card, CardBody, CardHeader, CardTitle, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import CreativeProjectMonth from './CreativeProjectMonth';
import CreativeProjectYearly from "./CreativeProjectYearly";
import LowMonthPlans from './LowMonthPlans';
import MediumMonthPlans from './MediumMonthPlans';
import HighMonthPlans from './HighMonthPlans';

const monthData = [
    {
        id: 1,
        title: "Stater",
        price: "29",
        desc: "For small teams trying out Minia for an unlimited period of time"
    },
    {
        id: 2,
        title: "Professional",
        price: "49",
        desc: "For larger businesses or those with onal administration needs"
    },
    {
        id: 3,
        title: "Enterprise",
        price: "79",
        isFeatured: true,
        desc: "For extra large businesses or those in regulated industries"
    },
    {
        id: 3,
        title: "Unlimited",
        price: "99",
        desc: "For small teams trying out Minia for an unlimited period of time"
    },
];

const yearData = [
    {
        id: 1,
        title: "Stater",
        price: "129",
        desc: "For small teams trying out Minia for an unlimited period of time"
    },
    {
        id: 2,
        title: "Professional",
        price: "149",
        desc: "For larger businesses or those with onal administration needs"
    },
    {
        id: 3,
        title: "Enterprise",
        price: "179",
        isFeatured: true,
        desc: "For extra large businesses or those in regulated industries"
    },
    {
        id: 3,
        title: "Unlimited",
        price: "199",
        desc: "For small teams trying out Minia for an unlimited period of time"
    },
];

const PagePricing = () => {
    const [activeTab, toggleTab] = useState("1");
    const [activeTab2, toggleTab2] = useState("1");
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Pricing Page | Minia - React Admin & Dashboard Template</title>
                </MetaTags>
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Pages" breadcrumbItem="Pricing" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader className="d-flex">
                                    <CardTitle className="mb-0 flex-grow-1">Start your creative project right plans</CardTitle>
                                    <div className="flex-shrink-0 align-self-end">
                                        <Nav className="justify-content-end nav-tabs-custom rounded card-header-tabs">
                                            <NavItem>
                                                <NavLink
                                                    to="#"
                                                    className={classnames({
                                                        active: activeTab === "1",
                                                    }, "px-3 rounded monthly")}
                                                    onClick={() => {
                                                        toggleTab("1");
                                                    }}
                                                >Monthly</NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    to="#"
                                                    className={classnames({
                                                        active: activeTab === "2",
                                                    }, "px-3 rounded yearly")}
                                                    onClick={() => {
                                                        toggleTab("2");
                                                    }}
                                                >Yearly</NavLink>
                                            </NavItem>
                                        </Nav>
                                    </div>
                                </CardHeader>
                                <div className="card-body">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            <Row>
                                                <CreativeProjectMonth monthData={monthData} />
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <Row>
                                                <CreativeProjectYearly yearData={yearData} />
                                            </Row>
                                        </TabPane>
                                    </TabContent>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title">Project Plans</h4>
                                    <p className="card-title-desc">Call to action pricing table is really crucial to your for your business website.
                                        Make your bids stand-out with amazing options.
                                    </p>
                                </CardHeader>

                                <CardBody>
                                    <Row>
                                        <Col xl={3}>
                                            <Nav pills className="flex-column pricing-tab-box">
                                                <NavLink
                                                    to="#"
                                                    className={classnames({
                                                        active: activeTab2 === "1",
                                                    }, "mb-3")}
                                                    onClick={() => {
                                                        toggleTab2("1");
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-check-circle h3 mb-0 me-4"></i>
                                                        <div className="flex-1">
                                                            <h2 className="fw-medium">$29 <span className="text-muted font-size-15">/ Month Plans</span></h2>
                                                            <p className="fw-normal mb-0 text-muted">For small teams trying out Minia for an unlimited period of time</p>
                                                        </div>
                                                    </div>
                                                </NavLink>
                                                <NavLink
                                                    to="#"
                                                    className={classnames({
                                                        active: activeTab2 === "2",
                                                    }, "mb-3")}
                                                    onClick={() => {
                                                        toggleTab2("2");
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-check-circle h3 mb-0 me-4"></i>
                                                        <div className="flex-1">
                                                            <h2 className="fw-medium">$79 <span className="text-muted font-size-15">/ Month Plans</span></h2>
                                                            <p className="fw-normal mb-0 text-muted">For larger businesses or those with onal administration needs</p>
                                                        </div>
                                                    </div>
                                                </NavLink>
                                                <NavLink
                                                    to="#"
                                                    className={classnames({
                                                        active: activeTab2 === "3",
                                                    }, "mb-3")}
                                                    onClick={() => {
                                                        toggleTab2("3");
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-check-circle h3 mb-0 me-4"></i>
                                                        <div className="flex-1">
                                                            <h2 className="fw-medium">$99 <span className="text-muted font-size-15">/ Month Plans</span></h2>
                                                            <p className="fw-normal mb-0 text-muted">For extra large businesses or those in regulated industries</p>
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </Nav>
                                        </Col>
                                        <Col xl={9}>
                                            <TabContent className="text-muted mt-4 mt-xl-0" activeTab={activeTab2}>
                                                <TabPane tabId="1">
                                                    <LowMonthPlans />
                                                </TabPane>
                                                <TabPane tabId="2">
                                                    <MediumMonthPlans />
                                                </TabPane>
                                                <TabPane tabId="3">
                                                    <HighMonthPlans />
                                                </TabPane>
                                            </TabContent>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default PagePricing;