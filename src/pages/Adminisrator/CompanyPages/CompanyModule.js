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
import { AvForm, AvInput} from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import AvField from "availity-reactstrap-validation/lib/AvField";
import {
  editCompanyIDSuccess,
  PostCompanySubmit,
  PostCompanySubmitSuccess,
  updateCompanyID,
  getCompanyGroup
} from "../../../store/Administrator/CompanyRedux/actions";
import { MetaTags } from "react-meta-tags";
import { AlertState } from "../../../store/actions";
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";

const CompanyModule = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  var editDataGatingFromList = props.state;
  let propsPageMode = props.pageMode;

  const [EditData, setEditData] = useState([]);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');

  const [CompanyGroupselect, setCompanyGroup] = useState("");

  //Access redux store Data /  'save_ModuleSuccess' action data
  const { PostAPIResponse,RoleAccessModifiedinSingleArray } = useSelector((state) => ({
    PostAPIResponse: state.Company.companySubmitSuccesss,
    RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
  }));

  // userAccess useEffect
  useEffect(() => {
    let userAcc = undefined
    if ((editDataGatingFromList === undefined)) {

      let locationPath = history.location.pathname
      userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
        return (`/${inx.ActualPagePath}` === locationPath)
      })
    }
    else if (!(editDataGatingFromList === undefined)) {
      let relatatedPage = props.relatatedPage
      userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
        return (`/${inx.ActualPagePath}` === relatatedPage)
      })

    }
    if (!(userAcc === undefined)) {
      setUserPageAccessState(userAcc)
    }

}, [RoleAccessModifiedinSingleArray])

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {

    if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setPageMode("edit");
      setCompanyGroup({
        value: editDataGatingFromList.CompanyGroup_id,
        label: editDataGatingFromList.CompanyGroupName
      })
      dispatch(editCompanyIDSuccess({ Status: false }))
      dispatch(BreadcrumbShow(editDataGatingFromList.Name))
    }
    else if (!(propsPageMode === undefined)) {
      setPageMode(propsPageMode)
  }
  }, [editDataGatingFromList,propsPageMode]);

  useEffect(() => {
    if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)&&!(pageMode==="dropdownAdd")) {
      dispatch(PostCompanySubmitSuccess({ Status: false }))
      setCompanyGroup('')
      formRef.current.reset();
      if (pageMode === "dropdownAdd") {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: PostAPIResponse.Message,
        }))
      }
      else {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: PostAPIResponse.Message,
          RedirectPath: '/CompanyList',
        }))
      }
    }
    else if ((PostAPIResponse.Status === true) && !(pageMode==="dropdownAdd")) {
      dispatch(PostCompanySubmitSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(postMessage.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [PostAPIResponse])

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

    const jsonBody = JSON.stringify({
      Name: values.Name,
      Address: values.Address,
      GSTIN: values.GSTIN,
      PhoneNo: values.PhoneNo,
      CompanyAbbreviation: values.CompanyAbbreviation,
      EmailID: values.EmailID,
      CompanyGroup: CompanyGroupselect.value,
      CreatedBy: 1,
      UpdatedBy: 1,
    });

    if (pageMode === 'edit') {
      dispatch(updateCompanyID(jsonBody, EditData.id));
    }

    else {
      dispatch(PostCompanySubmit(jsonBody));
    }
  };

  var IsEditModeSaSS = ''
  if (pageMode === "edit" || pageMode == "dropdownAdd") { IsEditModeSaSS = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className={"page-content"} style={{ marginTop: IsEditModeSaSS }} >
          <MetaTags>
            <title>Company Master| FoodERP-React FrontEnd</title>
          </MetaTags>
          <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
          <Container fluid>
            <Row>
              <Col lg={12}>
                <Card className="text-black" >
                  <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                    <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                    <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
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
                              <AvInput name="PhoneNo" type="text"
                                autoComplete="off"
                                value={EditData.PhoneNo}
                                defaultValue=''
                                placeholder="Enter Phone Number"
                              // validate={{
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


                          <FormGroup >
                            <Row >
                              <Col sm={2}>
                                <div>
                                  {
                                    pageMode === "edit" ?
                                      userPageAccessState.RoleAccess_IsEdit ?
                                        <button
                                          type="submit"
                                          data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Module"
                                          className="btn btn-success w-md"
                                        >
                                          <i class="fas fa-edit me-2"></i>Update
                                        </button>
                                        :
                                        <></>
                                      : (
                                        userPageAccessState.RoleAccess_IsSave ?
                                          <button
                                            type="submit"
                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Module"
                                            className="btn btn-primary w-md"
                                          > <i className="fas fa-save me-2"></i> Save
                                          </button>
                                          :
                                          <></>
                                      )
                                  }
                                </div>
                              </Col>
                            </Row>
                          </FormGroup >
                        </CardBody>
                      </Card>
                    </AvForm>
                  </CardBody>
                </Card>
              </Col >
            </Row >
          </Container >
        </div >
      </React.Fragment >
    );
  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
};
export default CompanyModule;
