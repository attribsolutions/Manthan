import React from 'react';
import MetaTags from "react-meta-tags"
import { Card, CardBody, CardHeader, CardTitle, Container, Row, Col } from 'reactstrap';

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Link } from 'react-router-dom';

import img1 from "../../assets/images/small/img-2.jpg";
import img2 from "../../assets/images/small/img-5.jpg";

const PageTimeline = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Timeline | Minia - React Admin & Dashboard Template</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Pages" breadcrumbItem="Timeline" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <CardTitle>Bootstrap Timeline</CardTitle>
                </CardHeader>

                <CardBody>

                  <Row className="justify-content-center">
                    <Col xl={10}>
                      <div className="timeline">
                        <div className="timeline-container">
                          <div className="timeline-end">
                            <p>Start</p>
                          </div>
                          <div className="timeline-continue">
                            <Row className="timeline-right">
                              <Col md={6}>
                                <div className="timeline-icon">
                                  <i className="bx bx-briefcase-alt-2 text-primary h2 mb-0"></i>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="timeline-box">
                                  <div className="timeline-date bg-primary text-center rounded">
                                    <h3 className="text-white mb-0">25</h3>
                                    <p className="mb-0 text-white-50">June</p>
                                  </div>
                                  <div className="event-content">
                                    <div className="timeline-text">
                                      <h3 className="font-size-18">Timeline Event One</h3>
                                      <p className="mb-0 mt-2 pt-1 text-muted">Perspitis unde omnis it voluptatem
                                        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                                        quae ab illo inventore veritatis et quasi
                                        architecto beatae explicabo.</p>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            <Row className="timeline-left">
                              <Col md={6} className="d-md-none d-block">
                                <div className="timeline-icon">
                                  <i className="bx bx-user-pin text-primary h2 mb-0"></i>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="timeline-box">
                                  <div className="timeline-date bg-primary text-center rounded">
                                    <h3 className="text-white mb-0">25</h3>
                                    <p className="mb-0 text-white-50">June</p>
                                  </div>
                                  <div className="event-content">
                                    <div className="timeline-text">
                                      <h3 className="font-size-18">Timeline Event two</h3>
                                      <p className="mb-0 mt-2 pt-1 text-muted">At vero eos dignissimos ducimus quos
                                        dolores chooses to enjoy pleasure that has no annoying.</p>

                                      <div className="d-flex flex-wrap align-items-start event-img mt-3 gap-2">
                                        <img src={img1} alt=""
                                          className="img-fluid rounded" width="60" />
                                        <img src={img2} alt=""
                                          className="img-fluid rounded" width="60" />
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </Col>
                              <Col md={6} className="d-md-block d-none">
                                <div className="timeline-icon">
                                  <i className="bx bx-user-pin text-primary h2 mb-0"></i>
                                </div>
                              </Col>
                            </Row>

                            <div className="row timeline-right">
                              <Col md={6}>
                                <div className="timeline-icon">
                                  <i className="bx bx-bar-chart-square text-primary h2 mb-0"></i>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="timeline-box">
                                  <div className="timeline-date bg-primary text-center rounded">
                                    <h3 className="text-white mb-0">28</h3>
                                    <p className="mb-0 text-white-50">Des</p>
                                  </div>
                                  <div className="event-content">
                                    <div className="timeline-text">
                                      <h3 className="font-size-18">Timeline Event Three</h3>
                                      <p className="mb-0 mt-2 pt-1 text-muted">Vivamus ultrices massa turna interdum
                                        eu. Pellentesque habitant morbi tristique eget justo sit amet est
                                        varius mollis et quis nisi. Suspendisse potenti. senectus
                                        et netus et malesuada fames ac turpis egestas.</p>

                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </div>

                            <Row className="timeline-left">
                              <Col md={6} className="d-md-none d-block">
                                <div className="timeline-icon">
                                  <i className="bx bx-camera text-primary h2 mb-0"></i>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="timeline-box">
                                  <div className="timeline-date bg-primary text-center rounded">
                                    <h3 className="text-white mb-0">25</h3>
                                    <p className="mb-0 text-white-50">June</p>
                                  </div>
                                  <div className="event-content">
                                    <div className="timeline-text">
                                      <h3 className="font-size-18">Timeline Event Four</h3>
                                      <p className="mb-0 mt-2 pt-1 text-muted">Printing and typesetting industry. been
                                        the industry'scrambled
                                        it make a type specimen book.</p>

                                      <button type="button" className="btn btn-primary btn-rounded waves-effect waves-light mt-4">See
                                        more detail
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col md={6} className="d-md-block d-none">
                                <div className="timeline-icon">
                                  <i className="bx bx-camera text-primary h2 mb-0"></i>
                                </div>
                              </Col>
                            </Row>

                            <Row className="timeline-right">
                              <Col md={6}>
                                <div className="timeline-icon">
                                  <i className="bx bx-pie-chart-alt text-primary h2 mb-0"></i>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="timeline-box">
                                  <div className="timeline-date bg-primary text-center rounded">
                                    <h3 className="text-white mb-0">23</h3>
                                    <p className="mb-0 text-white-50">July</p>
                                  </div>
                                  <div className="event-content">
                                    <div className="timeline-text">
                                      <h3 className="font-size-18">Timeline Event Five</h3>

                                      <p className="mb-0 mt-2 pt-1 text-muted">Excepturi, obcaecati, quisquam id
                                        molestias eaque asperiores voluptatibus cupiditate error
                                        assumenda delectus odit
                                        similique earum voluptatem
                                        Odit, itaque, deserunt corporis vero ipsum nisi repellat ... <Link
                                          to="#">Read more</Link></p>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            <Row className="timeline-left">
                              <Col md={6} className="d-md-none d-block">
                                <div className="timeline-icon">
                                  <i className="bx bx-home-alt text-primary h2 mb-0"></i>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="timeline-box">
                                  <div className="timeline-date bg-primary text-center rounded">
                                    <h3 className="text-white mb-0">25</h3>
                                    <p className="mb-0 text-white-50">June</p>
                                  </div>
                                  <div className="event-content">
                                    <div className="timeline-text">
                                      <h3 className="font-size-18">Timeline Event End</h3>
                                      <p className="mb-0 mt-2 pt-1 text-muted">Suspendisse tempor porttitor elit non
                                        maximus. Sed suscipit, purus in convallis condimentum, risus ex
                                        pellentesque sapien, vel tempor arcu dolor ut est. Nam ac felis id
                                        mauris fermentum
                                        nisl pharetra auctor.</p>
                                    </div>
                                  </div>

                                </div>
                              </Col>
                              <Col md={6} className="d-md-block d-none">
                                <div className="timeline-icon">
                                  <i className="bx bx-home-alt text-primary h2 mb-0"></i>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          <div className="timeline-start">
                            <p>End</p>
                          </div>
                          <div className="timeline-launch">
                            <div className="timeline-box">
                              <div className="timeline-text">
                                <h3 className="font-size-18">Launched our company on 21 June 2021</h3>
                                <p className="text-muted mb-0">Pellentesque sapien ut est.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
}

export default PageTimeline;