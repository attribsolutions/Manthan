import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  CardHeader,
  FormGroup,
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
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { useHistory } from "react-router-dom";

const CompanyModule = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const [EditData, setEditData] = useState([]);
  const [IsEdit, setIsEdit] = useState(false);
  const [CompanyGroupselect, setCompanyGroup] = useState("");
  const [PageMode, setPageMode] = useState(false);
  const [pageHeading, setPageHeading] = useState({pageHeading:"",pageDescription:"",pageDescriptionDetails:""});

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  var editDataGatingFromList = props.state;

  const history = useHistory()

  const userPageAccess = history.location.state

  // useEffect(() => {
  //   if ((userPageAccess === undefined)) {
  //     history.push("/Dashboard")
  //   }
  //      else {
  //     if (!(userPageAccess.fromDashboardAccess)) {
  //       history.push("/Dashboard")
  //     }
  //     setPageHeading({pageHeading:userPageAccess.label.PageHeading,pageDescription:userPageAccess.label.PageDescription,pageDescriptionDetails:userPageAccess.label.PageDescriptionDetails})
  //   };
  // }, [props])

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
        value: editDataGatingFromList.CompanyGroup_id,
        label: editDataGatingFromList.CompanyGroupName
      })
      dispatch(editCompanyIDSuccess({ Status: false }))
      dispatch(BreadcrumbShow(editDataGatingFromList.Name))
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
    value: Data.id,
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
        CreatedBy: 1,
        UpdatedBy: 1,
      }),
    };
   
    if (IsEdit) {
      dispatch(updateCompanyID(requestOptions.body, EditData.id));
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
          <title>Company Master| FoodERP-React FrontEnd</title>
        </MetaTags>
        <Breadcrumbs breadcrumbItem={"Company Master"} />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card className="text-black" >
                <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                  <h4 className="card-title text-black">{"Page Description :Company Master"}</h4>
                  <p className="card-title-desc text-black">{"Page Description Details : Company Master"}</p>
                </CardHeader>

                <CardBody>
                  <AvForm onValidSubmit={(e, v) => { handleValidSubmit(e, v) }}
                    ref={formRef}
                  >
                    <Card >
                      <CardBody style={{ backgroundColor: "whitesmoke" }}>
                        <Row>
                          <FormGroup className="mb-3 col col-sm-4 " >
                            <Label htmlFor="validationCustom01">Name</Label>
                            <AvField name="Name" value={EditData.Name} type="text" id='txtName'
                              placeholder=" Please Enter Name "
                              autoComplete="off"
                              validate={{
                                required: { value: true, errorMessage: 'Please Enter Name' },
                              }}
                              onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                            />
                          </FormGroup>
                          <Col md="1">  </Col>
                          <FormGroup className="mb-3 col col-sm-4 " >
                            <Label htmlFor="validationCustom01">Address</Label>
                            <AvField name="Address" value={EditData.Address} type="text"
                              autoComplete="off"
                              placeholder=" Please Enter Address "
                              defaultValue=''
                            // validate={{
                            //   required: { value: true, errorMessage: 'Please Enter Address' },
                            // }}
                            />
                          </FormGroup>
                        </Row>

                        <Row className="mb-1">
                          <FormGroup className=" col col-sm-4 " >
                            <Label htmlFor="validationCustom01">Mobile Number</Label>
                            <AvField name="PhoneNo" type="tel"
                              autoComplete="off"
                              value={EditData.PhoneNo}
                              defaultValue=''
                              placeholder="Enter Phone Number"
                            // validate={{
                            //   required: { value: true, errorMessage: 'Please Enter Phone Number' },
                            //   tel: {
                            //     pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/,
                            //     errorMessage: 'Please Enter Phone Number'
                            //   }
                            // }}
                            />
                          </FormGroup>

                          <Col md="1">  </Col>
                          <FormGroup className=" col col-sm-4 " >
                            <Label htmlFor="validationCustom01">Email</Label>
                            <AvField name="EmailID" value={EditData.EmailID} type="email"
                              autoComplete="off"
                              defaultValue=''
                              placeholder="example@example.com"
                            // validate={{
                            //   required: { value: true, errorMessage: 'Please Enter Email' },
                            //   tel: {
                            //     pattern:  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                            //     errorMessage: "Please Enter valid Email Address.(Ex:abc@gmail.com)"
                            //   }
                            // }}
                            />
                          </FormGroup>
                        </Row>
                      </CardBody>
                    </Card>

                    <Card className="mt-n2">
                      <CardBody style={{ backgroundColor: "whitesmoke" }}>

                        <Row>
                          <FormGroup className="mb-3 col col-sm-4 " >
                            <Label htmlFor="validationCustom01">GSTIN </Label>
                            <AvField name="GSTIN"
                              autoComplete="off"
                              value={EditData.GSTIN} type="text"
                              placeholder="GSTIN "
                              validate={{
                                required: { value: true, errorMessage: 'Please Enter GSTIN' },
                                tel: {
                                  pattern: /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/,
                                  errorMessage: 'GSTIN is Required (Eg.27AAAAA0000A1Z5)'

                                }
                              }}
                            />
                          </FormGroup>
                          <Col md="1">  </Col>
                          <FormGroup className="mb-3 col col-sm-4 " >
                            <Label htmlFor="validationCustom01">Company Abbreviation </Label>
                            <AvField name="CompanyAbbreviation" value={EditData.CompanyAbbreviation} type="text"
                              autoComplete="off"
                              placeholder=" Please Enter Company Abbreviation"
                              validate={{
                                required: { value: true, errorMessage: 'Please Enter Company Abbreviation' },
                              }} />
                          </FormGroup>
                        </Row>

                        <Row className=" mb-3">
                          <FormGroup className=" col col-sm-4 " >
                            <Label htmlFor="validationCustom21">Company Group </Label>
                            <Select
                              value={CompanyGroupselect}
                              options={CompanyGroupValues}
                              onChange={(e) => { handllerCompanyGroupID(e) }}
                            />
                          </FormGroup>
                        </Row>


                        <Row  >
                          <Col sm={2} >
                            <div>
                              {
                                IsEdit ? (
                                  <button
                                    type="submit"
                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Company"
                                    className="btn btn-success w-md"
                                  >
                                    <i class="fas fa-edit me-2"></i>Update
                                  </button>) : (
                                  <button
                                    type="submit"
                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Company"
                                    className="btn btn-primary w-md"
                                  > <i className="fas fa-save me-2"></i> Save
                                  </button>
                                )
                              }
                            </div>
                          </Col>
                        </Row>

                      </CardBody>
                    </Card>



                  </AvForm>
                  <br></br><br></br><br></br> <br></br> <br></br>
                </CardBody>
              </Card>
            </Col >
          </Row >
        </Container >
      </div >
    </React.Fragment >
  );
};

export default CompanyModule;
