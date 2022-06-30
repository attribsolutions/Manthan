import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, Input, FormGroup, CardHeader, InputGroup } from "reactstrap";
import { AvForm, AvGroup, AvField, AvInput } from "availity-reactstrap-validation";

import Flatpickr from "react-flatpickr"
import Select from "react-select";

const PartyUIDemo = (props) => {

    //     return (
    //         <React.Fragment>
    //             <div className="page-content">
    //                 <Breadcrumbs breadcrumbItem={"Party Master "} />
    //                 <Container fluid>
    //                     <Row>
    //                         <Col lg={12}>
    //                             <Card>
    //                                 <CardHeader>
    //                                     <h4 className="card-title">React Validation - Normal</h4>
    //                                     <p className="card-title-desc">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
    //                                 </CardHeader>
    //                                 <CardBody>
    //                                     <AvForm
    //                                     >

    //                                         <InputGroup>
    //                                             {/* <DatePicker
    //                           selected={startDate}
    //                         //   onChange={date => setStartDate(date)}
    //                           dateFormat="MM/yyyy"
    //                           showMonthYearPicker
    //                         /> */}
    //                                             {/* <Flatpickr
    //                                                 className="form-control d-block"
    //                                                 placeholder="dd M,yyyy"
    //                                                 options={{
    //                                                     altInput: true,
    //                                                     altFormat: "F j, Y",
    //                                                     dateFormat: "Y-m-d"
    //                                                 }}
    //                                             /> */}
    //                                         </InputGroup>
    //                                         <Row>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">Name </Label>
    //                                                     <AvField
    //                                                         name="Name"
    //                                                         placeholder="Please Enter Name"
    //                                                         type="text"
    //                                                         errorMessage="Enter First Name"
    //                                                         className="form-control"
    //                                                         validate={{ required: { value: true } }}
    //                                                         id="validationCustom01"
    //                                                     />
    //                                                 </FormGroup>
    //                                             </Col>
    //                                             <Col md="1"></Col>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">EmailID </Label>
    //                                                     <AvField
    //                                                         name="Email"
    //                                                         placeholder="Enter your EmailID"
    //                                                         type="text"
    //                                                         errorMessage="Please Enter your EmailID"
    //                                                         className="form-control"
    //                                                         validate={{ required: { value: true } }}
    //                                                         id="validationCustom01"
    //                                                     />
    //                                                 </FormGroup>
    //                                             </Col>
    //                                             < Col md="1"></Col>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">Mobile </Label>
    //                                                     <AvField
    //                                                         name="MobileNo"
    //                                                         placeholder="Enter your Mobile Number"
    //                                                         type="text"
    //                                                         errorMessage="Please Enter your Mobile NO"
    //                                                         className="form-control"
    //                                                         validate={{ required: { value: true } }}
    //                                                         id="validationCustom01"
    //                                                     />
    //                                                 </FormGroup>
    //                                             </Col>
    //                                         </Row>

    //                                         <Row>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">PartyType </Label>
    //                                                     <Col sm={12}>
    //                                                         <Select
    //                                                             value={""}
    //                                                             options={""}
    //                                                         // onChange={(e) => { handllerDesignationID(e) }}
    //                                                         />
    //                                                     </Col>
    //                                                 </FormGroup>
    //                                             </Col>
    //                                             <Col md="1"></Col>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">DivisionType </Label>
    //                                                     <Col sm={12}>
    //                                                         <Select
    //                                                             value={""}
    //                                                             options={""}
    //                                                         // onChange={(e) => { handllerDesignationID(e) }}
    //                                                         />
    //                                                     </Col>
    //                                                 </FormGroup>
    //                                             </Col>
    //                                             < Col md="1"></Col>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">CompanyName </Label>
    //                                                     <Col sm={12}>
    //                                                         <Select
    //                                                             value={""}
    //                                                             options={""}
    //                                                         // onChange={(e) => { handllerDesignationID(e) }}
    //                                                         />
    //                                                     </Col>
    //                                                 </FormGroup>
    //                                             </Col>
    //                                         </Row>

    //                                         <Row>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">state </Label>
    //                                                     <Col sm={12}>
    //                                                         <Select
    //                                                             value={""}
    //                                                             options={""}
    //                                                         // onChange={(e) => { handllerDesignationID(e) }}
    //                                                         />
    //                                                     </Col>
    //                                                 </FormGroup>
    //                                             </Col>
    //                                             <Col md="1"></Col>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">District </Label>
    //                                                     <Col sm={12}>
    //                                                         <Select
    //                                                             value={""}
    //                                                             options={""}
    //                                                         // onChange={(e) => { handllerDesignationID(e) }}
    //                                                         />
    //                                                     </Col>
    //                                                 </FormGroup>
    //                                             </Col>
    //                                             < Col md="1"></Col>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">Taluka </Label>
    //                                                     <Col sm={12}>
    //                                                         <Select
    //                                                             value={""}
    //                                                             options={""}
    //                                                         // onChange={(e) => { handllerDesignationID(e) }}
    //                                                         />
    //                                                     </Col>
    //                                                 </FormGroup>
    //                                             </Col>
    //                                         </Row>

    //                                         <Row>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">Address </Label>
    //                                                     <AvField
    //                                                         name="Address"
    //                                                         placeholder="Please Enter Address"
    //                                                         type="text"
    //                                                         errorMessage="Enter First Address"
    //                                                         className="form-control"
    //                                                         validate={{ required: { value: true } }}
    //                                                         id="validationCustom01"
    //                                                     />
    //                                                 </FormGroup>
    //                                             </Col>
    //                                             <Col md="1"></Col>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">PIN </Label>
    //                                                     <AvField
    //                                                         name="PIN"
    //                                                         placeholder="Enter your PIN"
    //                                                         type="text"
    //                                                         errorMessage="Please Enter your PIN"
    //                                                         className="form-control"
    //                                                         validate={{ required: { value: true } }}
    //                                                         id="validationCustom01"
    //                                                     />
    //                                                 </FormGroup>
    //                                             </Col>

    //                                             < Col md="1"></Col>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">City </Label>
    //                                                     <Col sm={12}>
    //                                                         <Select
    //                                                             value={""}
    //                                                             options={""}
    //                                                         // onChange={(e) => { handllerDesignationID(e) }}
    //                                                         />
    //                                                     </Col>
    //                                                 </FormGroup>
    //                                             </Col>
    //                                         </Row>
    //                                         <Row>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">CustomerDivision </Label>
    //                                                     <AvField
    //                                                         name="CustomerDivision"
    //                                                         placeholder="Please Enter CustomerDivision"
    //                                                         type="text"
    //                                                         errorMessage="Enter First CustomerDivision"
    //                                                         className="form-control"
    //                                                         validate={{ required: { value: true } }}
    //                                                         id="validationCustom01"
    //                                                     />
    //                                                 </FormGroup>
    //                                             </Col>
    //                                             <Col md="1"></Col>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">GSTIN </Label>
    //                                                     <AvField
    //                                                         name="GSTIN"
    //                                                         placeholder="Please Enter GSTIN"
    //                                                         type="text"
    //                                                         errorMessage="Enter First CustomerDivision"
    //                                                         className="form-control"
    //                                                         validate={{ required: { value: true } }}
    //                                                         id="validationCustom01"
    //                                                     />
    //                                                 </FormGroup>
    //                                             </Col>
    //                                             <Col md="1"></Col>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">FSSAINo </Label>
    //                                                     <AvField
    //                                                         name="FSSAINo"
    //                                                         placeholder="Please Enter FSSAINo"
    //                                                         type="text"
    //                                                         errorMessage="Enter First FSSAINo"
    //                                                         className="form-control"
    //                                                         validate={{ required: { value: true } }}
    //                                                         id="validationCustom01"
    //                                                     />
    //                                                 </FormGroup>
    //                                             </Col>
    //                                             <Col md="1"></Col>
    //                                             <Col md="3">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">FSSAIExipry </Label>
    //                                                     <AvField
    //                                                         name="FSSAIExipry"
    //                                                         placeholder="Please Enter FSSAIExipry"
    //                                                         type="date"
    //                                                         errorMessage="Enter First FSSAIExipry"
    //                                                         className="form-control"
    //                                                         validate={{ required: { value: true } }}
    //                                                         id="validationCustom01"
    //                                                     />
    //                                                 </FormGroup>
    //                                             </Col>
    //                                             {/* <Row>
    //                                              <Col md="4"></Col>
    //                                              <AvGroup>
    //                                             <Row className="mb-4">
    //                                                 <Label className="col-sm-2 col-form-label">
    //                                                     IsActive
    //                                                 </Label>
    //                                                 <Col sm={4}>
    //                                                     <AvField name="IsActive" type="checkbox"
    //                                                     value=""
    //                                                         />
    //                                                 </Col>
    //                                             </Row>

    //                                         </AvGroup>
    //                                         </Row> */}
    //                                             <Row className="justify-content-end">
    //                                                 <Col sm={10}></Col>
    //                                                 <Col sm={2}>
    //                                                     <div>
    //                                                         <button
    //                                                             type="submit"
    //                                                             data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Modules ID"
    //                                                             className="btn btn-success w-md"
    //                                                         > <i className="fas fa-save me-2"></i> Save
    //                                                         </button>
    //                                                     </div>
    //                                                 </Col>
    //                                             </Row>
    //                                         </Row>
    //                                     </AvForm>
    //                                     <div>
    //                                     </div>
    //                                 </CardBody>
    //                             </Card>
    //                         </Col>
    //                     </Row>
    //                 </Container>
    //             </div>
    //         </React.Fragment>
    //     );
    // return (
    //     <React.Fragment>
    //         <div className="page-content">
    //             <Breadcrumbs breadcrumbItem={"Party Master "} />
    //             <Container fluid>
    //                 <Row>
    //                     <Col lg={12}>
    //                         <Card>
    //                             <CardHeader>
    //                                 <h4 className="card-title">React Validation - Normal</h4>
    //                                 <p className="card-title-desc">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
    //                             </CardHeader>
    //                             <CardBody>
    //                                 <AvForm
    //                                 >
    //                                     <Row>
    //                                         <Col md="3">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">Name </Label>
    //                                                 <AvField
    //                                                     name="Name"
    //                                                     placeholder="Please Enter Name"
    //                                                     type="text"
    //                                                     errorMessage="Enter First Name"
    //                                                     className="form-control"
    //                                                     validate={{ required: { value: true } }}
    //                                                     id="validationCustom01"
    //                                                 />
    //                                             </FormGroup>
    //                                         </Col>
    //                                         <Col md="1"></Col>
    //                                         <Col md="3">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">EmailID </Label>
    //                                                 <AvField
    //                                                     name="Email"
    //                                                     placeholder="Enter your EmailID"
    //                                                     type="text"
    //                                                     errorMessage="Please Enter your EmailID"
    //                                                     className="form-control"
    //                                                     validate={{ required: { value: true } }}
    //                                                     id="validationCustom01"
    //                                                 />
    //                                             </FormGroup>
    //                                         </Col>

    //                                     </Row>

    //                                     <Row>
    //                                         <Col md="3">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">PartyType </Label>
    //                                                 <Col sm={12}>
    //                                                     <Select
    //                                                         value={""}
    //                                                         options={""}
    //                                                     // onChange={(e) => { handllerDesignationID(e) }}
    //                                                     />
    //                                                 </Col>
    //                                             </FormGroup>
    //                                         </Col>
    //                                         <Col md="1"></Col>
    //                                         <Col md="3">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">DivisionType </Label>
    //                                                 <Col sm={12}>
    //                                                     <Select
    //                                                         value={""}
    //                                                         options={""}
    //                                                     // onChange={(e) => { handllerDesignationID(e) }}
    //                                                     />
    //                                                 </Col>
    //                                             </FormGroup>
    //                                         </Col>

    //                                     </Row>
    //                                     <Row>
    //                                         <Col md="3">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">CompanyName </Label>
    //                                                 <Col sm={12}>
    //                                                     <Select
    //                                                         value={""}
    //                                                         options={""}
    //                                                     // onChange={(e) => { handllerDesignationID(e) }}
    //                                                     />
    //                                                 </Col>
    //                                             </FormGroup>
    //                                         </Col>
    //                                         <Col md="1"></Col>
    //                                         <Col md="3">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">CustomerDivision </Label>
    //                                                 <AvField
    //                                                     name="CustomerDivision"
    //                                                     placeholder="Please Enter CustomerDivision"
    //                                                     type="text"
    //                                                     errorMessage="Enter First CustomerDivision"
    //                                                     className="form-control"
    //                                                     validate={{ required: { value: true } }}
    //                                                     id="validationCustom01"
    //                                                 />
    //                                             </FormGroup>
    //                                         </Col>
    //                                     </Row>

    //                                     <Row>
    //                                         <Col md="3">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">Address </Label>

    //                                                 <textarea
    //                                                     className="form-control"
    //                                                     id="exampleFormControlTextarea1"
    //                                                     rows="5"
    //                                                 />
    //                                                 {/* /> */}
    //                                             </FormGroup>
    //                                         </Col>
    //                                         <Col md="1"></Col>
    //                                         <Col md="3">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">PIN </Label>
    //                                                 <AvField
    //                                                     name="PIN"
    //                                                     placeholder="Enter your PIN"
    //                                                     type="text"
    //                                                     errorMessage="Please Enter your PIN"
    //                                                     className="form-control"
    //                                                     validate={{ required: { value: true } }}
    //                                                     id="validationCustom01"
    //                                                 />
    //                                             </FormGroup>
    //                                             < Col md="1"></Col>
    //                                             <Col md="12">
    //                                                 <FormGroup className="mb-3">
    //                                                     <Label htmlFor="validationCustom01">Mobile </Label>
    //                                                     <AvField
    //                                                         name="MobileNo"
    //                                                         placeholder="Enter your Mobile Number"
    //                                                         type="text"
    //                                                         errorMessage="Please Enter your Mobile NO"
    //                                                         className="form-control"
    //                                                         validate={{ required: { value: true } }}
    //                                                         id="validationCustom01"
    //                                                     />
    //                                                 </FormGroup>
    //                                             </Col>
    //                                         </Col>


    //                                     </Row>

    //                                     <Row>
    //                                         <Col md="3">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">GSTIN </Label>
    //                                                 <AvField
    //                                                     name="GSTIN"
    //                                                     placeholder="Please Enter GSTIN"
    //                                                     type="text"
    //                                                     errorMessage="Enter First CustomerDivision"
    //                                                     className="form-control"
    //                                                     validate={{ required: { value: true } }}
    //                                                     id="validationCustom01"
    //                                                 />
    //                                             </FormGroup>
    //                                         </Col>
    //                                         <Col md="1"></Col>
    //                                         <Col md="3">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">FSSAINo </Label>
    //                                                 <AvField
    //                                                     name="FSSAINo"
    //                                                     placeholder="Please Enter FSSAINo"
    //                                                     type="text"
    //                                                     errorMessage="Enter First FSSAINo"
    //                                                     className="form-control"
    //                                                     validate={{ required: { value: true } }}
    //                                                     id="validationCustom01"
    //                                                 />
    //                                             </FormGroup>
    //                                         </Col>
    //                                         <Col md="1"></Col>
    //                                         <Col md="3">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">FSSAIExipry </Label>
    //                                                 <AvField
    //                                                     name="FSSAIExipry"
    //                                                     placeholder="Please Enter FSSAIExipry"
    //                                                     type="date"
    //                                                     errorMessage="Enter First FSSAIExipry"
    //                                                     className="form-control"
    //                                                     validate={{ required: { value: true } }}
    //                                                     id="validationCustom01"
    //                                                 />
    //                                             </FormGroup>
    //                                         </Col>

    //                                     </Row>
    //                                     <Row>
    //                                         <Col md="2">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">state </Label>
    //                                                 <Col sm={12}>
    //                                                     <Select
    //                                                         value={""}
    //                                                         options={""}
    //                                                     // onChange={(e) => { handllerDesignationID(e) }}
    //                                                     />
    //                                                 </Col>
    //                                             </FormGroup>
    //                                         </Col>
    //                                         <Col md="1"></Col>
    //                                         <Col md="2">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">District </Label>
    //                                                 <Col sm={12}>
    //                                                     <Select
    //                                                         value={""}
    //                                                         options={""}
    //                                                     // onChange={(e) => { handllerDesignationID(e) }}
    //                                                     />
    //                                                 </Col>
    //                                             </FormGroup>
    //                                         </Col>
    //                                         < Col md="1"></Col>
    //                                         <Col md="2">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">Taluka </Label>
    //                                                 <Col sm={12}>
    //                                                     <Select
    //                                                         value={""}
    //                                                         options={""}
    //                                                     // onChange={(e) => { handllerDesignationID(e) }}
    //                                                     />
    //                                                 </Col>
    //                                             </FormGroup>
    //                                         </Col>

    //                                         < Col md="1"></Col>
    //                                         <Col md="2">
    //                                             <FormGroup className="mb-3">
    //                                                 <Label htmlFor="validationCustom01">City </Label>
    //                                                 <Col sm={12}>
    //                                                     <Select
    //                                                         value={""}
    //                                                         options={""}
    //                                                     // onChange={(e) => { handllerDesignationID(e) }}
    //                                                     />
    //                                                 </Col>
    //                                             </FormGroup>
    //                                         </Col>

    //                                         <Col md="4"></Col>
    //                                         <AvGroup>
    //                                             <Row className="mb-4">
    //                                                 <Label className="col-sm-1 col-form-label">
    //                                                     IsActive
    //                                                 </Label>
    //                                                 <Col sm={4}>
    //                                                     <AvField name="IsActive" type="checkbox"
    //                                                         value=""
    //                                                     />
    //                                                 </Col>
    //                                             </Row>

    //                                         </AvGroup>

    //                                     </Row>


    //                                     <Row className="justify-content-end">
    //                                         <Col sm={10}></Col>
    //                                         <Col sm={2}>
    //                                             <div>
    //                                                 <button
    //                                                     type="submit"
    //                                                     data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Modules ID"
    //                                                     className="btn btn-success w-md"
    //                                                 > <i className="fas fa-save me-2"></i> Save
    //                                                 </button>
    //                                             </div>
    //                                         </Col>
    //                                     </Row>


    //                                 </AvForm>
    //                                 <div>
    //                                 </div>
    //                             </CardBody>
    //                         </Card>
    //                     </Col>
    //                 </Row>
    //             </Container>
    //         </div>
    //     </React.Fragment>
    // );
    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumbs breadcrumbItem={"Party Master "} />
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title">React Validation - Normal</h4>
                                    <p className="card-title-desc">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
                                </CardHeader>
                                <CardBody>
                                    <AvForm
                                    >
                                        <Row>
                                            <Col md="6">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">Name </Label>
                                                    <AvField
                                                        name="Name"
                                                        placeholder="Please Enter Name"
                                                        type="text"
                                                        errorMessage="Enter First Name"
                                                        className="form-control"
                                                        validate={{ required: { value: true } }}
                                                        id="validationCustom01"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            </Row>
                                            {/* <Row>
                                           
                                            <Col md="2">
                                                <FormGroup className="mb-2">
                                                    <Label htmlFor="validationCustom01">EmailID </Label>
                                                    <AvField
                                                        name="Email"
                                                        placeholder="Enter your EmailID"
                                                        type="text"
                                                        errorMessage="Please Enter your EmailID"
                                                        className="form-control"
                                                        validate={{ required: { value: true } }}
                                                        id="validationCustom01"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            < Col md="2"></Col>
                                                <Col md="2">
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">Mobile </Label>
                                                        <AvField
                                                            name="MobileNo"
                                                            placeholder="Enter your Mobile Number"
                                                            type="text"
                                                            errorMessage="Please Enter your Mobile NO"
                                                            className="form-control"
                                                            validate={{ required: { value: true } }}
                                                            id="validationCustom01"
                                                        />
                                                    </FormGroup>
                                                </Col>
   

                                        </Row> */}

                                        <Row>
                                            <Col md="2">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">PartyType </Label>
                                                    <Col sm={12}>
                                                        <Select
                                                            value={""}
                                                            options={""}
                                                        // onChange={(e) => { handllerDesignationID(e) }}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col md="2"></Col>
                                            <Col md="2">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">DivisionType </Label>
                                                    <Col sm={12}>
                                                        <Select
                                                            value={""}
                                                            options={""}
                                                        // onChange={(e) => { handllerDesignationID(e) }}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                        </Row>
                                        <Row>
                                            <Col md="2">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">CompanyName </Label>
                                                    <Col sm={12}>
                                                        <Select
                                                            value={""}
                                                            options={""}
                                                        // onChange={(e) => { handllerDesignationID(e) }}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col md="2"></Col>
                                            <Col md="2">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">CustomerDivision </Label>
                                                    <AvField
                                                        name="CustomerDivision"
                                                        placeholder="Please Enter CustomerDivision"
                                                        type="text"
                                                        errorMessage="Enter First CustomerDivision"
                                                        className="form-control"
                                                        validate={{ required: { value: true } }}
                                                        id="validationCustom01"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="3">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">GSTIN </Label>
                                                    <AvField
                                                        name="GSTIN"
                                                        placeholder="Please Enter GSTIN"
                                                        type="text"
                                                        errorMessage="Enter First CustomerDivision"
                                                        className="form-control"
                                                        validate={{ required: { value: true } }}
                                                        id="validationCustom01"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="1"></Col>
                                            <Col md="3">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">FSSAINo </Label>
                                                    <AvField
                                                        name="FSSAINo"
                                                        placeholder="Please Enter FSSAINo"
                                                        type="text"
                                                        errorMessage="Enter First FSSAINo"
                                                        className="form-control"
                                                        validate={{ required: { value: true } }}
                                                        id="validationCustom01"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="1"></Col>
                                            <Col md="3">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">FSSAIExipry </Label>
                                                    <AvField
                                                        name="FSSAIExipry"
                                                        placeholder="Please Enter FSSAIExipry"
                                                        type="date"
                                                        errorMessage="Enter First FSSAIExipry"
                                                        className="form-control"
                                                        validate={{ required: { value: true } }}
                                                        id="validationCustom01"
                                                    />
                                                </FormGroup>
                                            </Col>

                                        </Row>
                                        <Row>
                                            <Col md="3">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">Address </Label>

                                                    <textarea
                                                        className="form-control"
                                                        id="exampleFormControlTextarea1"
                                                        rows="5"
                                                    />
                                                    {/* /> */}
                                                </FormGroup>
                                            </Col>
                                            <Col md="1"></Col>
                                            <Col md="3">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">PIN </Label>
                                                    <AvField
                                                        name="PIN"
                                                        placeholder="Enter your PIN"
                                                        type="text"
                                                        errorMessage="Please Enter your PIN"
                                                        className="form-control"
                                                        validate={{ required: { value: true } }}
                                                        id="validationCustom01"
                                                    />
                                                </FormGroup>
                                                                                       </Col>


                                        </Row>

                                        
                                        <Row>
                                            <Col md="3">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">state </Label>
                                                    <Col sm={12}>
                                                        <Select
                                                            value={""}
                                                            options={""}
                                                        // onChange={(e) => { handllerDesignationID(e) }}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col md="1"></Col>
                                            <Col md="3">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">District </Label>
                                                    <Col sm={12}>
                                                        <Select
                                                            value={""}
                                                            options={""}
                                                        // onChange={(e) => { handllerDesignationID(e) }}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            < Col md="1"></Col>
                                            <Col md="3">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">Taluka </Label>
                                                    <Col sm={12}>
                                                        <Select
                                                            value={""}
                                                            options={""}
                                                        // onChange={(e) => { handllerDesignationID(e) }}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            {/* < Col md="1"></Col>
                                            <Col md="2">
                                                <FormGroup className="mb-3">
                                                    <Label htmlFor="validationCustom01">City </Label>
                                                    <Col sm={12}>
                                                        <Select
                                                            value={""}
                                                            options={""}
                                                        // onChange={(e) => { handllerDesignationID(e) }}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col> */}

                                            <Col md="4"></Col>
                                            <AvGroup>
                                                <Row className="mb-4">
                                                    <Label className="col-sm-1 col-form-label">
                                                        IsActive
                                                    </Label>
                                                    <Col sm={4}>
                                                        <AvField name="IsActive" type="checkbox"
                                                            value=""
                                                        />
                                                    </Col>
                                                </Row>

                                            </AvGroup>

                                        </Row>


                                        <Row className="justify-content-end">
                                            <Col sm={10}></Col>
                                            <Col sm={2}>
                                                <div>
                                                    <button
                                                        type="submit"
                                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Modules ID"
                                                        className="btn btn-success w-md"
                                                    > <i className="fas fa-save me-2"></i> Save
                                                    </button>
                                                </div>
                                            </Col>
                                        </Row>


                                    </AvForm>
                                    <div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default PartyUIDemo
