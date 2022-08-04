import React, { useState, useEffect, useRef } from "react";
import {

    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Label,
    Row,

} from "reactstrap";


import Breadcrumb from "../../../components/Common/Breadcrumb";

import { MetaTags } from "react-meta-tags";
import { AvField, AvForm, AvInput } from "availity-reactstrap-validation";
import { PostEmployeeTypeSubmit } from "../../../store/Administrator/EmployeeTypeRedux/action";
import { useDispatch } from "react-redux";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";

const EmployeeTypesMaster = (props) => {
    const dispatch = useDispatch();
    
    const [Name, setName] = useState("");
    const [IsPartyConnection, setIsPartyConnection] = useState("");
    const [IsSCM, setIsSCM] = useState("");

    const FormSubmitButton_Handler = (event, values) => {

        const jsonBody = JSON.stringify({
            Name: values.Name,
            IsPartyConnection: values.IsPartyConnection,
            IsSCM: values.IsSCM,
            Description: "sfasfgasd",
            CreatedBy: 1,
            CreatedOn: "2022-07-18T00:00:00",
            UpdatedBy: 1,
            UpdatedOn: "2022-07-18T00:00:00"
        });
        dispatch(PostEmployeeTypeSubmit(jsonBody));
        // console.log("jsonBody",jsonBody)
        dispatch(AlertState({
            Type: 1, Status: true,
            Message: "Employee Type Save Successfully",
          }));
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Module| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Breadcrumb breadcrumbItem={"Employee Type Master"} />
                <Container fluid >
                    <Card className="text-black" >
                        <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                            <h4 className="card-title text-black">{"Employee Type Master"}</h4>
                            <p className="card-title-desc text-black">{"Employee Type Master"}</p>
                        </CardHeader>
                        <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                            <AvForm onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v) }}

                            >

                                <Row className="">
                                    <Col md={12}  >
                                        <Card >
                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                <Row>
                                                    <FormGroup className="mb-2 col col-sm-4 " >
                                                        <Label htmlFor="validationCustom01">Name </Label>
                                                        <AvField
                                                            name="Name"
                                                            id="txtName"
                                                            value={Name}
                                                            type="text"
                                                            placeholder="Please Enter Name"
                                                            autoComplete='off'
                                                            validate={{
                                                                required: { value: true, errorMessage: 'Please Enter Name' },
                                                            }}
                                                        // onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                        />
                                                    </FormGroup>
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-5">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-5 col-form-label" >IsPartyConnection </Label>
                                                                <Col md={2} style={{ marginTop: '9px' }} >
                                                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                        <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                            defaultChecked={IsPartyConnection}
                                                                            name="IsPartyConnection"
                                                                        // defaultChecked
                                                                        />
                                                                        <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>

                                                    </Row>
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-5">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-5 col-form-label" >IsSCM </Label>
                                                                <Col md={2} style={{ marginTop: '9px' }} >
                                                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                        <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                            defaultChecked={IsSCM}
                                                                            name="IsSCM"
                                                                        // defaultChecked
                                                                        />
                                                                        <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>

                                                    </Row>
                                                    <FormGroup >
                                                        <Row >
                                                            <Col sm={2}>
                                                                <button
                                                                    type="submit"
                                                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Module"
                                                                    className="btn btn-primary w-md"
                                                                > <i className="fas fa-save me-2"></i> Save
                                                                </button>

                                                            </Col>
                                                        </Row>
                                                    </FormGroup >
                                                </Row>

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
    )
}

export default EmployeeTypesMaster
