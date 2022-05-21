import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
} from "reactstrap";

import {
  AvForm,
  AvGroup,
} from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";

import AvField from "availity-reactstrap-validation/lib/AvField";
import {
  PostCompanySubmit,
  PostCompanySubmitSuccess,
  updateCompanyID,
} from "../../../store/Administrator/Company/actions";
import { MetaTags } from "react-meta-tags";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const CompanyModule = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const [EditData, setEditData] = useState([]);
  const [IsEdit, setIsEdit] = useState(false);

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    var editDataGatingFromList = props.state;

  //Access redux store Data /  'save_ModuleSuccess' action data
  const { SubmitSuccesss, } = useSelector((state) => ({
    SubmitSuccesss: state.Company.companySubmitSuccesss,
  }));

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {
    document.getElementById("txtName").focus();
    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setIsEdit(true);
    }
  }, [editDataGatingFromList]);

  useEffect(() => {
    if ((SubmitSuccesss.Status === true)) {
      dispatch(PostCompanySubmitSuccess({ Status: false }))
      formRef.current.reset();
    }
  }, [SubmitSuccesss.Status]);

 //'Save' And 'Update' Button Handller
  const handleValidSubmit = (event, values) => {

    const requestOptions = {
      body: JSON.stringify({
        Name: values.Name,
        Address: values.Address,
        GSTIN: values.GSTIN,
        PhoneNo: values.PhoneNo,
        CompanyAbbreviation: values.CompanyAbbreviation,
        EmailID: values.EmailID,
        CompanyGroup: parseInt(values.CompanyGroup),
      }),
    };
    if (IsEdit) {
      dispatch(updateCompanyID(requestOptions.body, EditData.ID));
    }
    else {
      dispatch(PostCompanySubmit(requestOptions.body));
    }
  };
  var IsEditModeSaSS = ''
  if (IsEdit === true) { IsEditModeSaSS = "-3.5%" };

  return (
    <React.Fragment>
      <div className={"page-content"} style={{ marginTop: IsEditModeSaSS }} >
        <MetaTags>
          <title>Company_Master| FoodERP-React FrontEnd</title>
        </MetaTags>
        <Breadcrumbs breadcrumbItem={"Company Master"} />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <AvForm onValidSubmit={(e, v) => { handleValidSubmit(e, v) }}
                    ref={formRef}
                  >
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-3 col-form-label">
                          Name
                        </Label>
                        <Col sm={4}>
                          <AvField name="Name" value={EditData.Name} type="text" id='txtName'
                            placeholder=" Please Enter Name " autoComplete="off"
                            validate={{
                              required: { value: true, errorMessage: 'Please Enter a Name' },
                            }}
                          />
                        </Col>
                      </Row>
                    </AvGroup>  <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-3 col-form-label">
                          Address
                        </Label>
                        <Col sm={4}>
                          <AvField name="Address" value={EditData.Address} type="text" autoComplete="off"
                            placeholder=" Please Enter Address "
                            validate={{
                              required: { value: true, errorMessage: 'Please Enter a  Address' },
                            }}
                          />
                        </Col>
                      </Row>
                    </AvGroup>  <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-3 col-form-label">
                          GSTIN
                        </Label>
                        <Col sm={4}>
                          <AvField name="GSTIN" autoComplete="off"
                            value={EditData.GSTIN} type="text"
                            placeholder="GSTIN "
                            validate={{
                              required: { value: true, errorMessage: 'Please Enter a  GSTIN' },
                            }}
                          />
                        </Col>
                      </Row>
                    </AvGroup>
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-3 col-form-label">
                          Phone NO
                        </Label>
                        <Col sm={4}>
                          <AvField name="PhoneNo" type="tel" autoComplete="off"
                            value={EditData.PhoneNo}
                            placeholder="+91 "
                            validate={{
                              required: { value: true, errorMessage: 'Please Enter a  Phone NO' },
                              tel: {
                                pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/
                              }
                            }
                            }
                          />
                        </Col>
                      </Row>
                    </AvGroup>
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-3 col-form-label">
                          Company Abbreviation
                        </Label>
                        <Col sm={4}>
                          <AvField name="CompanyAbbreviation" value={EditData.CompanyAbbreviation} type="text"
                            autoComplete="off"
                            placeholder=" Please Enter Company Abbreviation"
                            validate={{
                              required: { value: true, errorMessage: 'Please Enter a Company Abbreviation' },
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-3 col-form-label">
                          Email ID
                        </Label>
                        <Col sm={4}>
                          <AvField name="EmailID" value={EditData.EmailID} type="email"
                            autoComplete="off"
                            placeholder="example@example.com" validate={{
                              required: { value: true, errorMessage: 'Please Enter a Email ID' },
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-3 col-form-label">
                          Group Company
                        </Label>
                        <Col sm={4}>
                          <AvField name="CompanyGroup" value={EditData.CompanyGroup} type="text"
                            placeholder="Please Enter Company Group ID"
                            autoComplete="off"
                            validate={{
                              number: true,
                              required: { value: true, errorMessage: 'Please Enter Company Group ID' },
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>
                    <Row className="justify-content-end">
                      <Col sm={10}></Col>
                      <Col sm={2}>
                        <div>
                          {
                            IsEdit ? (<button
                              type="submit"
                              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Modules ID"
                              className="btn btn-success w-md"
                            >
                              <i class="fas fa-edit me-2"></i>Update
                            </button>) : (
                              <button
                                type="submit"
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Modules ID"
                                className="btn btn-success w-md"
                              > <i className="fas fa-save me-2"></i> Save
                              </button>
                            )
                          }
                        </div>
                      </Col>{" "}
                    </Row>
                  </AvForm>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CompanyModule;
