import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

//import images
import logo from "../../assets/images/logo-sm.svg";

const PageMaintenance = () => {
    return (
        <React.Fragment>
            <div className="bg-soft-light min-vh-100 py-5">
                <div className="py-4">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center">
                                    <div className="mb-5">
                                        <Link to="/dashboard">
                                            <img src={logo} alt="" height="30" className="me-1" /><span className="logo-txt text-dark font-size-22">Minia</span>
                                        </Link>
                                    </div>

                                    <div className="maintenance-cog-icon text-primary pt-4">
                                        <i className="mdi mdi-cog spin-right display-3"></i>
                                        <i className="mdi mdi-cog spin-left display-4 cog-icon"></i>
                                    </div>
                                    <h3 className="mt-4">Site is Under Maintenance</h3>
                                    <p>Please check back in sometime.</p>

                                    <div className="mt-4">
                                        <Row>
                                            <Col md={4}>
                                                <div className="mt-4 maintenance-box">
                                                    <div className="p-4">
                                                        <div className="avatar-md mx-auto">
                                                            <span className="avatar-title bg-soft-primary rounded-circle">
                                                                <i className="mdi mdi-access-point-network font-size-24 text-primary"></i>
                                                            </span>
                                                        </div>

                                                        <h5 className="font-size-15 text-uppercase mt-4">Why is the Site Down?</h5>
                                                        <p className="text-muted mb-0">There are many variations of passages of
                                                            Lorem Ipsum available, but the majority have suffered alteration.</p>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="mt-4 maintenance-box">
                                                    <div className="p-4">
                                                        <div className="avatar-md mx-auto">
                                                            <span className="avatar-title bg-soft-primary rounded-circle">
                                                                <i className="mdi mdi-clock-outline font-size-24 text-primary"></i>
                                                            </span>
                                                        </div>
                                                        <h5 className="font-size-15 text-uppercase mt-4">
                                                            What is the Downtime?</h5>
                                                        <p className="text-muted mb-0">Contrary to popular belief, Lorem Ipsum is not
                                                            simply random text. It has roots in a piece of classical.</p>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="mt-4 maintenance-box">
                                                    <div className="p-4">
                                                        <div className="avatar-md mx-auto">
                                                            <span className="avatar-title bg-soft-primary rounded-circle">
                                                                <i className="mdi mdi-email-outline font-size-24 text-primary"></i>
                                                            </span>
                                                        </div>
                                                        <h5 className="font-size-15 text-uppercase mt-4">
                                                            Do you need Support?</h5>
                                                        <p className="text-muted mb-0">If you are going to use a passage of Lorem
                                                            Ipsum, you need to be sure there isn't anything embar.. <a
                                                                href="mailto:no-reply@domain.com"
                                                                className="text-decoration-underline">no-reply@domain.com</a></p>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </React.Fragment>
    );
}

export default PageMaintenance;