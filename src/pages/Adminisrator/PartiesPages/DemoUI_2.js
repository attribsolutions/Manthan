import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, Input, FormGroup, CardHeader, InputGroup, Button } from "reactstrap";
import { AvForm, AvGroup, AvField, AvInput } from "availity-reactstrap-validation";

import Flatpickr from "react-flatpickr"
import Select from "react-select";

const DemoUi_2 = (props) => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumbs breadcrumbItem={"Party UI DEMO "} />
                <Container fluid>

                    <Card >
                        <CardHeader className="card-header text-center  text-dark" style={{ backgroundColor: "#dddddd" }}>
                            <h4 className=" text-center text-black" >React Validation - Normal</h4>
                            <p className="text-center text-black">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
                        </CardHeader>
                        <CardBody>
                            <AvForm>
                                <Row className="d-flex justify-content-center">

                                    <Col md={6}  >
                                        <Card >

                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                <FormGroup className="mb-3 ">
                                                    <Row className="justify-content-md-center">
                                                        <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label  text-black">Name </Label>
                                                        <Col sm={5}>
                                                            <AvField
                                                                name="Name"
                                                                placeholder="Please Enter Name"
                                                                type="text"
                                                                errorMessage="Enter First Name"
                                                                className="form-control"
                                                                validate={{ required: { value: true } }}
                                                                id="horizontal-firstname-input"
                                                            />
                                                        </Col>

                                                    </Row>

                                                </FormGroup>
                                                <FormGroup className="mb-3 ">
                                                    <Row className="justify-content-md-center">
                                                        <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label  text-black">Description </Label>
                                                        <Col sm={5}>
                                                            <AvField
                                                                name="Name"
                                                                placeholder="Please Enter Name"
                                                                type="text"
                                                                errorMessage="Enter First Name"
                                                                className="form-control"
                                                                validate={{ required: { value: true } }}
                                                                id="horizontal-firstname-input"
                                                            />
                                                        </Col>

                                                    </Row>

                                                </FormGroup>

                                                <FormGroup className="mb-3 ">
                                                    <Row className="justify-content-md-center">
                                                        <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label  text-black">Modules </Label>
                                                        <Col sm={5}>
                                                            <AvField
                                                                name="Name"
                                                                placeholder="Please Enter Name"
                                                                type="text"
                                                                errorMessage="Enter First Name"
                                                                className="form-control"
                                                                validate={{ required: { value: true } }}
                                                                id="horizontal-firstname-input"
                                                            />
                                                        </Col>

                                                    </Row>

                                                </FormGroup>

                                                <FormGroup className="mb-3 ">
                                                    <Row className="justify-content-md-center">
                                                        <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label  text-black">Mobile </Label>
                                                        <Col sm={5}>
                                                            <AvField
                                                                name="Name"
                                                                placeholder="Please Enter Name"
                                                                type="text"
                                                                errorMessage="Enter First Name"
                                                                className="form-control"
                                                                validate={{ required: { value: true } }}
                                                                id="horizontal-firstname-input"
                                                            />
                                                        </Col>

                                                    </Row>

                                                </FormGroup>

                                                <FormGroup className="mb-3 ">
                                                    <Row className="justify-content-md-center">
                                                        <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label  text-black">Company </Label>
                                                        <Col sm={5}>
                                                            <AvField
                                                                name="Name"
                                                                placeholder="Please Enter Name"
                                                                type="text"
                                                                errorMessage="Enter First Name"
                                                                className="form-control"
                                                                validate={{ required: { value: true } }}
                                                                id="horizontal-firstname-input"
                                                            />
                                                        </Col>

                                                    </Row>

                                                </FormGroup>

                                                {/* <FormGroup className="mb-3 ">
                                                    <Row className="justify-content-md-center">
                                                        <Col className="col-sm-2 "></Col>
                                                        <Col sm={5} >
                                                            <Row>
                                                            <Label
                                                                        htmlFor="horizontal-firstname-input"
                                                                        className="col-sm-4 col-form-label"
                                                                    >
                                                                        IsActive
                                                                    </Label>
                                                                    <Col md={4} style={{ marginTop: '7px' }} className="form-check form-switch form-switch-sm ">
                                                                        <AvInput name="isActive" type="checkbox" id="switch1" switch="none" defaultChecked  />
                                                                        <Label className="me-1" htmlFor="switch1" data-on-label="Yes" data-off-label="No"></Label>
                                                                    </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </FormGroup> */}

                                                <FormGroup className="mb-3 ">
                                                    <Row className="justify-content-md-center">
                                                        <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label  text-black">isActive </Label>
                                                        <Col md={5} style={{ marginTop: '7px' }} >
                                                            <AvInput
                                                               name="isActive" type="checkbox" id="switch1" switch="none" defaultChecked  />
                                                               <Label className="me-1" htmlFor="switch1" data-on-label="Yes" data-off-label="No"></Label>
                                                               
                                                                
                                                          
                                                        </Col>

                                                    </Row>

                                                </FormGroup>


                                                <FormGroup className="mb-3 ">
                                                    <Row className="justify-content-center">
                                                        <Col sm={1}></Col>
                                                        <Col sm={2}>
                                                            <button
                                                                type="submit"
                                                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Page"
                                                                className="btn btn-success w-md"
                                                            > <i className="fas fa-save me-2"></i> Save
                                                            </button>
                                                        </Col>

                                                    </Row>
                                                </FormGroup >
                                            </CardBody>

                                        </Card>
                                    </Col>
                                </Row>

                            </AvForm>
                        </CardBody>
                    </Card>

                </Container>
            </div>
        </React.Fragment>
    );
}

export default DemoUi_2
