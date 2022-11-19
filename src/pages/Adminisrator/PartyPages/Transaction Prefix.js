// import React from 'react'
import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import Flatpickr from "react-flatpickr"
import Select from "react-select";
// import { useDispatch, useSelector } from 'react-redux';
// import { getAddressTypes } from '../../../store/Administrator/PartyRedux/action';
import AddressDetailsTable from './Table';
import { AvField, AvInput } from 'availity-reactstrap-validation';

const Transaction = () => {
    return (

        <Row>
            <Col>
                <Card className="text-black">
                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                        {/* <Row> */}
                            <Col>
                                <FormGroup className="mb-3">
                                <Row md="5">

                                    <Label htmlFor="validationCustom01"> Order Prefix</Label>
                                    <AvField
                                        type="text"
                                        autoComplete='off'
                                        name="FSSAINo"
                                        placeholder="Please Enter FSSAINo"
                                        className="form-control "
                                    />
                                    </Row>

                                </FormGroup>
                            </Col>
                            {/* <Col md="1"></Col> */}
                            <Col >
                                <FormGroup className="mb-3">
                                <Row md="5">

                                    <Label htmlFor="validationCustom01">Invoice Prefix</Label>
                                    <AvField
                                        type="text"
                                        autoComplete='off'
                                        name="Invoice"
                                        placeholder="Please Enter Invoice "
                                        className="form-control"
                                    />
                                    </Row>

                                </FormGroup>
                            </Col>
                            {/* <Col md="1"></Col>  */}
                            <Col>
                                <FormGroup className="mb-3">
                                    <Row md="5">
                                    <Label htmlFor="validationCustom01" > GRN Prefix</Label>
                                    <AvField
                                        type="text"
                                        autoComplete='off'
                                        name="GRN"
                                        placeholder="Please Enter GRN"
                                        className="form-control "
                                    />
                                    </Row>

                                </FormGroup>
                            </Col>
                            {/* <Col md="1"></Col> */}

                            <Col>
                                <FormGroup className="mb-3">
                                <Row md="5">

                                    <Label htmlFor="validationCustom01"> Receipt Prefix</Label>
                                    <AvField
                                        type="text"
                                        autoComplete='off'
                                        name="Receipt"
                                        placeholder="Please Enter Receipt Prefix"
                                        className="form-control"
                                    />
                                    </Row>


                                </FormGroup>
                            </Col>





                        {/* </Row> */}

                    </CardBody>

                </Card>
            </Col>


        </Row>


    )
}

export default Transaction



