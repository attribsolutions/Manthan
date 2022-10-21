import React from "react";
import MetaTags from 'react-meta-tags';
import { Card, CardBody, Col, Container, Row } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const PageFaqs = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>FAQS | Minia - React Admin & Dashboard Template</title>
                </MetaTags>
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Pages" breadcrumbItem="FAQs" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <Row className="justify-content-center mt-3">
                                        <div className="col-xl-5 col-lg-8">
                                            <div className="text-center">
                                                <h5>Can't find what you are looking for?</h5>
                                                <p className="text-muted">If several languages coalesce, the grammar of the resulting language
                                                    is more simple and regular than that of the individual</p>
                                                <div>
                                                    <button type="button" className="btn btn-primary mt-2 me-2 waves-effect waves-light">Email
                                                        Us</button>
                                                    <button type="button" className="btn btn-success mt-2 waves-effect waves-light">Send us a
                                                        tweet</button>
                                                </div>

                                                <Row className="justify-content-center">
                                                    <div className="col-xl-10">
                                                        <form className="app-search d-none d-lg-block mt-4">
                                                            <div className="position-relative">
                                                                <input type="text" className="form-control" placeholder="Search..." />
                                                                <button className="btn btn-primary" type="button"><i className="bx bx-search-alt align-middle"></i></button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </Row>
                                            </div>
                                        </div>
                                    </Row>

                                    <Row className="mt-5">
                                        <Col xl={4} sm={6}>
                                            <Card>
                                                <CardBody className="overflow-hidden position-relative">
                                                    <div>
                                                        <i className="bx bx-help-circle widget-box-1-icon text-primary"></i>
                                                    </div>
                                                    <div className="faq-count">
                                                        <h5 className="text-primary">01.</h5>
                                                    </div>
                                                    <h5 className="mt-3">What is Lorem Ipsum?</h5>
                                                    <p className="text-muted mt-3 mb-0">New common language will be more simple and regular than the existing European languages. It will be as simple as occidental.</p>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col xl={4} sm={6}>
                                            <Card>
                                                <CardBody className="overflow-hidden position-relative">
                                                    <div>
                                                        <i className="bx bx-help-circle widget-box-1-icon text-primary"></i>
                                                    </div>
                                                    <div className="faq-count">
                                                        <h5 className="text-primary">02.</h5>
                                                    </div>
                                                    <h5 className="mt-3">Where does it come from?</h5>
                                                    <p className="text-muted mt-3 mb-0">Everyone realizes why a new common language would be desirable one could refuse to pay expensive translators.</p>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                        <Col xl={4} sm={6}>
                                            <Card>
                                                <CardBody className="overflow-hidden position-relative">
                                                    <div>
                                                        <i className="bx bx-help-circle widget-box-1-icon text-primary"></i>
                                                    </div>
                                                    <div className="faq-count">
                                                        <h5 className="text-primary">03.</h5>
                                                    </div>
                                                    <h5 className="mt-3">Where can I get some?</h5>
                                                    <p className="text-muted mt-3 mb-0">If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual languages.</p>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                        <Col xl={4} sm={6}>
                                            <Card>
                                                <CardBody className="overflow-hidden position-relative">
                                                    <div>
                                                        <i className="bx bx-help-circle widget-box-1-icon text-primary"></i>
                                                    </div>
                                                    <div className="faq-count">
                                                        <h5 className="text-primary">04.</h5>
                                                    </div>
                                                    <h5 className="mt-3">Why do we use it?</h5>
                                                    <p className="text-muted mt-3 mb-0">Their separate existence is a myth. For science, music, sport, etc, Europe uses the same vocabulary.</p>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                        <Col xl={4} sm={6}>
                                            <Card>
                                                <CardBody className="overflow-hidden position-relative">
                                                    <div>
                                                        <i className="bx bx-help-circle widget-box-1-icon text-primary"></i>
                                                    </div>
                                                    <div className="faq-count">
                                                        <h5 className="text-primary">05.</h5>
                                                    </div>
                                                    <h5 className="mt-3">
                                                        Where can I get some?</h5>
                                                    <p className="text-muted mt-3 mb-0">The point of using Lorem Ipsum is that it has a
                                                        more-or-less normal they distribution of letters opposed to using content here.</p>
                                                </CardBody>                                                </Card>
                                        </Col>

                                        <Col xl={4} sm={6}>
                                            <Card>
                                                <CardBody className="overflow-hidden position-relative">
                                                    <div>
                                                        <i className="bx bx-help-circle widget-box-1-icon text-primary"></i>
                                                    </div>
                                                    <div className="faq-count">
                                                        <h5 className="text-primary">06.</h5>
                                                    </div>
                                                    <h5 className="mt-3">What is Lorem Ipsum?</h5>
                                                    <p className="text-muted mt-3 mb-0">To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what Occidental</p>
                                                </CardBody>
                                            </Card>
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

export default PageFaqs;