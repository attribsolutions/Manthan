import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col } from 'reactstrap';

const CreativeProjectMonth = ({ monthData }) => {
    return (
        <React.Fragment>
            {(monthData || []).map((month, key) => (
                <Col xl={3} sm={6} key={key}>
                    <Card className={month.isFeatured ? "bg-primary mb-xl-0" : "mb-xl-0"}>
                        <CardBody>
                            <div className="p-2">
                                {month.isFeatured && (
                                    <div className="pricing-badge">
                                        <span className="badge">Featured</span>
                                    </div>
                                )}
                                <h5
                                    className={
                                        month.isFeatured
                                            ? "font-size-16 text-white"
                                            : "font-size-16 text-muted"
                                    }
                                >
                                    {month.title}
                                </h5>
                                <h1
                                    className={
                                        month.isFeatured ? "mt-3 text-white" : "mt-3 text-muted"
                                    }
                                >
                                    ${month.price}{" "}
                                    <span
                                        className={
                                            month.isFeatured
                                                ? "text-white font-size-16 fw-medium"
                                                : "text-muted font-size-16 fw-medium"
                                        }
                                    >
                                        / Month
                                    </span>
                                </h1>
                                <p
                                    className={
                                        month.isFeatured
                                            ? "text-white-50 mt-3 font-size-15"
                                            : "text-muted-50 mt-3 font-size-15"
                                    }
                                >
                                    {month.desc}
                                </p>
                                <div
                                    className={
                                        month.isFeatured
                                            ? "mt-4 pt-2 text-white"
                                            : "mt-4 pt-2 text-muted"
                                    }
                                >
                                    <p className="mb-3 font-size-15">
                                        <i
                                            className={
                                                month.isFeatured
                                                    ? "mdi mdi-check-circle text-light font-size-18 me-2"
                                                    : "mdi mdi-check-circle text-secondary font-size-18 me-2"
                                            }
                                        ></i>
                                        Verifide work and reviews
                                    </p>
                                    <p className="mb-3 font-size-15">
                                        <i
                                            className={
                                                month.isFeatured
                                                    ? "mdi mdi-check-circle text-light font-size-18 me-2"
                                                    : "mdi mdi-check-circle text-secondary font-size-18 me-2"
                                            }
                                        ></i>
                                        Dedicated Ac managers
                                    </p>
                                    <p className="mb-3 font-size-15">
                                        <i
                                            className={
                                                month.isFeatured
                                                    ? "mdi mdi-check-circle text-light font-size-18 me-2"
                                                    : "mdi mdi-check-circle text-secondary font-size-18 me-2"
                                            }
                                        ></i>
                                        Unlimited proposals
                                    </p>
                                    <p className="mb-3 font-size-15">
                                        <i
                                            className={
                                                month.isFeatured
                                                    ? "mdi mdi-check-circle text-light font-size-18 me-2"
                                                    : "mdi mdi-check-circle text-secondary font-size-18 me-2"
                                            }
                                        ></i>
                                        Project tracking
                                    </p>
                                    <p className="mb-3 font-size-15">
                                        <i
                                            className={
                                                month.isFeatured
                                                    ? "mdi mdi-check-circle text-light font-size-18 me-2"
                                                    : "mdi mdi-check-circle text-secondary font-size-18 me-2"
                                            }
                                        ></i>
                                        Dedicated Ac managers
                                    </p>
                                    <p className="mb-3 font-size-15">
                                        <i
                                            className={
                                                month.isFeatured
                                                    ? "mdi mdi-check-circle text-light font-size-18 me-2"
                                                    : "mdi mdi-check-circle text-secondary font-size-18 me-2"
                                            }
                                        ></i>
                                        Unlimited proposals
                                    </p>
                                </div>

                                <div className="mt-4 pt-2">
                                    <Link
                                        to="#"
                                        className={
                                            month.isFeatured
                                                ? "btn btn-light w-100"
                                                : "btn btn-outline-primary w-100"
                                        }
                                    >
                                        Choose Plan
                                    </Link>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            ))}
        </React.Fragment>
    );
}

export default CreativeProjectMonth;