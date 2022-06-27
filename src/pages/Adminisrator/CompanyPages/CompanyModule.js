import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
} from "reactstrap";
import Select from "react-select";
import {
  AvForm,
  AvGroup,
} from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";

import AvField from "availity-reactstrap-validation/lib/AvField";
import {
  editCompanyIDSuccess,
  PostCompanySubmit,
  PostCompanySubmitSuccess,
  updateCompanyID,
  getCompanyGroup
} from "../../../store/Administrator/CompanyRedux/actions";
import { MetaTags } from "react-meta-tags";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";

const CompanyModule = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const [EditData, setEditData] = useState([]);
  const [IsEdit, setIsEdit] = useState(false);
  const [CompanyGroupselect, setCompanyGroup] = useState("");
  const [PageMode, setPageMode] = useState(false);

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
      setCompanyGroup({
        value: editDataGatingFromList.CompanyGroup.ID,
        label: editDataGatingFromList.CompanyGroup.Name
      })
      dispatch(editCompanyIDSuccess({ Status: false }))
    }
  }, [editDataGatingFromList]);

  useEffect(() => {
    if ((SubmitSuccesss.Status === true) && (SubmitSuccesss.StatusCode === 200)) {
      dispatch(PostCompanySubmitSuccess({ Status: false }))
      setCompanyGroup('')
      formRef.current.reset();
      if (PageMode === true) {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: SubmitSuccesss.Message,
        }))
      }
      else {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: SubmitSuccesss.Message,
          RedirectPath: '/companyList',
          AfterResponseAction: false
        }))
      }
    }
    else if (SubmitSuccesss.Status === true) {
      dispatch(PostCompanySubmitSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: "error Message",
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [SubmitSuccesss.Status])

  /// CompanyGroupDropDown
  useEffect(() => {
    dispatch(getCompanyGroup());
  }, [dispatch]);

  const { CompanyGroup } = useSelector((state) => ({
    CompanyGroup: state.Company.CompanyGroup
  }));

  const CompanyGroupValues = CompanyGroup.map((Data) => ({
    value: Data.ID,
    label: Data.Name
  }));

  function handllerCompanyGroupID(e) {
    setCompanyGroup(e)
  }

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
        CompanyGroup: CompanyGroupselect.value,
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
                            placeholder=" Please Enter Name "
                            autoComplete="off"
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
                          <AvField name="Address" value={EditData.Address} type="text"
                            autoComplete="off"
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
                          <AvField name="GSTIN"
                            autoComplete="off"
                            value={EditData.GSTIN} type="text"
                            placeholder="GSTIN "
                            validate={{
                              required: { value: true, errorMessage: 'Please Enter a  GSTIN' },
                              tel: {
                                pattern: /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/
                              }
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
                          <AvField name="PhoneNo" type="tel"
                            autoComplete="off"
                            value={EditData.PhoneNo}
                            placeholder="+91 "
                            validate={{
                              required: { value: true, errorMessage: 'Please Enter a  Phone N' },
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

                    <Row className="mb-4">
                      <Label className="col-sm-3 col-form-label">
                        CompanyGroup
                      </Label>
                      <Col sm={4}>
                        <Select
                          value={CompanyGroupselect}
                          options={CompanyGroupValues}
                          onChange={(e) => { handllerCompanyGroupID(e) }}
                        />
                      </Col>
                    </Row>


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
                  <br></br><br></br><br></br> <br></br> <br></br>
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
