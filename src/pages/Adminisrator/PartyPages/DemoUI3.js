// import React, { useEffect, useRef, useState } from "react";
// import Breadcrumbs from "../../../components/Common/Breadcrumb";
// import { Card, CardBody, Col, Container, Row, Label, Input, FormGroup, CardHeader, InputGroup, Button } from "reactstrap";
// import { AvForm, AvGroup, AvField, AvInput } from "availity-reactstrap-validation";

// import Flatpickr from "react-flatpickr"
// import Select from "react-select";

// const DemoUI3 = (props) => {
//     return (
//         <React.Fragment>
//             <div className="page-content">
//                 <Breadcrumbs breadcrumbItem={"Party UI DEMO "} />
//                 <Container fluid>

//                     <Card >
//                         <CardHeader className="card-header text-center  text-dark" style={{ backgroundColor: "#dddddd" }}>
//                             <h4 className=" text-center text-black" >React Validation - Normal</h4>
//                             <p className="text-center text-black">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
//                         </CardHeader>
//                         <CardBody>
//                             <AvForm>
//                                 <Row className="d-flex justify-content-center">

//                                     <Col md={6}  >
//                                         <Card >
//                                             <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                              
//                                                <Row>
//                                                     <FormGroup className="mb-2 col col-sm-6 " >
//                                                         <Label htmlFor="validationCustom01">Name </Label>
//                                                         <AvField name="Name" id="txtName"
//                                                             type="text"
//                                                             placeholder="Please Enter Name"
//                                                             autoComplete='off'
//                                                         />
//                                                     </FormGroup>
//                                                 </Row>
//                                                 <Row>
//                                                     <FormGroup className="mb-2 col col-sm-6">
//                                                         <Label htmlFor="validationCustom01">Module </Label>
//                                                         <AvField name="Name" id="txtName"
//                                                             type="text"
//                                                             placeholder="Please Enter Name"
//                                                             autoComplete='off'
//                                                         />
//                                                     </FormGroup>
//                                                 </Row>
//                                                 <Row>
//                                                     <FormGroup className="mb-2 col col-sm-6 " >
//                                                         <Label htmlFor="validationCustom01">Description </Label>
//                                                         <AvField name="Name" id="txtName"
//                                                             type="text"
//                                                             placeholder="Please Enter Name"
//                                                             autoComplete='off'
//                                                         />
//                                                     </FormGroup>
//                                                 </Row>
//                                                 <Row>
//                                                     <FormGroup className="mb-2 col col-sm-6">
//                                                         <Label htmlFor="validationCustom01">Display Index </Label>
//                                                         <AvField name="Name" id="txtName"
//                                                             type="text"
//                                                             placeholder="Please Enter Name"
//                                                             autoComplete='off'
//                                                         />
//                                                     </FormGroup>
//                                                 </Row>




//                                                 <FormGroup className="mb-3 ">
//                                                     <Row >
                                                        
//                                                         <Col sm={2}>
//                                                             <button
//                                                                 type="submit"
//                                                                 data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Page"
//                                                                 className="btn btn-primary w-md"
//                                                             > <i className="fas fa-save me-2"></i> Save
//                                                             </button>
//                                                         </Col>

//                                                     </Row>
//                                                 </FormGroup >
//                                             </CardBody>

//                                         </Card>
//                                     </Col>
//                                 </Row>

//                             </AvForm>
//                         </CardBody>
//                     </Card>

//                 </Container>
//             </div>
//         </React.Fragment>
//     );
// }

// export default DemoUI3



import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, Input, FormGroup, CardHeader, InputGroup, Button } from "reactstrap";
import { AvForm, AvGroup, AvField, AvInput } from "availity-reactstrap-validation";

import Flatpickr from "react-flatpickr"
import Select from "react-select";

const DemoUI3 = (props) => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumbs breadcrumbItem={"Party UI DEMO "} />
                <Container fluid>

                    <Card >
                        <CardHeader className="card-header   text-dark" style={{ backgroundColor: "#dddddd" }}>
                            <h4 className="  text-black" >React Validation - Normal</h4>
                            <p className=" text-black">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
                        </CardHeader>
                        <CardBody>
                            <AvForm>
                                <Row className="">

                                    <Col md={12}  >
                                        <Card >
                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                              
                                               <Row>
                                                    <FormGroup className="mb-2 col col-sm-4 " >
                                                        <Label htmlFor="validationCustom01">Name </Label>
                                                        <AvField name="Name" id="txtName"
                                                            type="text"
                                                            placeholder="Please Enter Name"
                                                            autoComplete='off'
                                                        />
                                                    </FormGroup>
                                                </Row>
                                                <Row>
                                                    <FormGroup className="mb-2 col col-sm-4">
                                                        <Label htmlFor="validationCustom01">Module </Label>
                                                        <AvField name="Name" id="txtName"
                                                            type="text"
                                                            placeholder="Please Enter Name"
                                                            autoComplete='off'
                                                        />
                                                    </FormGroup>
                                                </Row>
                                                <Row>
                                                    <FormGroup className="mb-2 col col-sm-4 " >
                                                        <Label htmlFor="validationCustom01">Description </Label>
                                                        <AvField name="Name" id="txtName"
                                                            type="text"
                                                            placeholder="Please Enter Name"
                                                            autoComplete='off'
                                                        />
                                                    </FormGroup>
                                                </Row>
                                                <Row>
                                                    <FormGroup className="mb-3 col col-sm-4">
                                                        <Label htmlFor="validationCustom01">Display Index </Label>
                                                        <AvField name="Name" id="txtName"
                                                            type="text"
                                                            placeholder="Please Enter Name"
                                                            autoComplete='off'
                                                        />
                                                    </FormGroup>
                                                </Row>




                                                <FormGroup >
                                                    <Row >
                                                        
                                                        <Col sm={2}>
                                                            <button
                                                                type="submit"
                                                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Page"
                                                                className="btn btn-primary w-md"
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

export default DemoUI3
