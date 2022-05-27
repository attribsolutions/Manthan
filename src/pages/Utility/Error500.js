import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

//import images
import error from "../../assets/images/error-img.png"

const Error500 = () => {
    return (
        <React.Fragment>
            <div className="my-5 pt-5">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="text-center mb-5">
                                <h1 className="display-1 fw-semibold">5<span className="text-primary mx-2">0</span>0</h1>
                                <h4 className="text-uppercase">Internal Server Error</h4>
                                <div className="mt-5 text-center">
                                    <Link className="btn btn-primary" to="/dashboard">Back to Dashboard</Link>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <div className="row justify-content-center">
                        <div className="col-md-10 col-xl-8">
                            <div>
                                <img src={error} alt="" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default Error500;