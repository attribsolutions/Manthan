import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  CardHeader,
  FormGroup,
  Input,
} from "reactstrap";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../../../components/Common/Breadcrumb3";
import {
  editCompanyIDSuccess,
  PostCompanySubmit,
  PostCompanySubmitSuccess,
  updateCompanyID,
  getCompanyGroup,
  updateCompanyIDSuccess
} from "../../../store/Administrator/CompanyRedux/actions";
import { MetaTags } from "react-meta-tags";
import { AlertState, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { useHistory } from "react-router-dom";
import {
  comAddPageFieldFunc,
  formValid,
  initialFiledFunc,
  onChangeSelect,
  onChangeText,

} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import { COMPANY_lIST } from "../../../routes/route_url";
import SaveButton from "../../../components/Common/ComponentRelatedCommonFile/CommonSaveButton";
import { createdBy, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";


const CompanyModule = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()

  //*** "isEditdata get all data from ModuleID for Binding  Form controls

  const [modalCss, setModalCss] = useState(false);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [CompanyGroupselect, setCompanyGroup] = useState("");

  //Access redux store Data /  'save_ModuleSuccess' action data
  const { postMsg, updateMsg, userAccess, pageField } = useSelector((state) => ({
    postMsg: state.Company.postMsg,
    updateMsg: state.Company.updateMessage,
    userAccess: state.Login.RoleAccessUpdateData,
    pageField: state.CommonPageFieldReducer.pageField
  }));

  {/** Dyanamic Page access state and OnChange function */ }

  const fileds = {
    id: "",
    Name: "",
    Address: "",
    GSTIN: "",
    PhoneNo: "",
    CompanyAbbreviation: "",
    EmailID: "",
    CompanyGroupName: ""
  }

  const [state, setState] = useState(() => initialFiledFunc(fileds))

  const values = { ...state.values }
  const { isError } = state;
  const { fieldLabel } = state;

  useEffect(() => {
    dispatch(commonPageFieldSuccess(null));
    dispatch(commonPageField(1))
    dispatch(getCompanyGroup());
  }, [dispatch]);

  const location = { ...history.location }
  const hasShowloction = location.hasOwnProperty("editValue")
  const hasShowModal = props.hasOwnProperty("editValue")

  // userAccess useEffect
  useEffect(() => {
    let userAcc = null;
    let locationPath = location.pathname;

    if (hasShowModal) {
      locationPath = props.masterPath;
    };

    userAcc = userAccess.find((inx) => {
      return (`/${inx.ActualPagePath}` === locationPath)
    })

    if (userAcc) {
      setUserPageAccessState(userAcc)
    };
  }, [userAccess])

  useEffect(() => {

    if ((hasShowloction || hasShowModal)) {

      let hasEditVal = null
      if (hasShowloction) {
        setPageMode(location.pageMode)
        hasEditVal = location.editValue
      }
      else if (hasShowModal) {
        hasEditVal = props.editValue
        setPageMode(props.pageMode)
        setModalCss(true)
      }

      if (hasEditVal) {
        const { id, Name, Address, GSTIN, PhoneNo, CompanyAbbreviation, EmailID, CompanyGroup, CompanyGroupName } = hasEditVal
        const { values, fieldLabel, hasValid, required, isError } = { ...state }

        hasValid.Name.valid = true;
        hasValid.Address.valid = true;
        hasValid.GSTIN.valid = true;
        hasValid.PhoneNo.valid = true;
        hasValid.CompanyAbbreviation.valid = true;
        hasValid.EmailID.valid = true;
        hasValid.CompanyGroupName.valid = true;

        values.id = id
        values.Name = Name
        values.Address = Address;
        values.GSTIN = GSTIN;
        values.PhoneNo = PhoneNo;
        values.CompanyAbbreviation = CompanyAbbreviation;
        values.EmailID = EmailID;
        values.CompanyGroupName = { label: CompanyGroupName, value: CompanyGroup };
        setState({ values, fieldLabel, hasValid, required, isError })
        dispatch(Breadcrumb_inputName(hasEditVal.Name))
      }
      dispatch(editCompanyIDSuccess({ Status: false }))
    }

  }, []);


  useEffect(() => {

    if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
      dispatch(PostCompanySubmitSuccess({ Status: false }))
      setState(() => initialFiledFunc(fileds)) //+++++++++ Clear form values 
      saveDissable(false);//+++++++++save Button Is enable function
      setCompanyGroup('')
      if (pageMode === "other") {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: postMsg.Message,
        }))
      }
      else {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: postMsg.Message,
          RedirectPath: COMPANY_lIST,
        }))
      }
    }
    else if ((postMsg.Status === true) && !(pageMode === "dropdownAdd")) {
      saveDissable(false);//+++++++++save Button Is enable function
      dispatch(PostCompanySubmitSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(postMessage.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [postMsg])

  useEffect(() => {
    if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
      saveDissable(false);//+++++++++Update Button Is enable function
      setState(() => initialFiledFunc(fileds)) //+++++++++ Clear form values
      history.push({
        pathname: COMPANY_lIST,
      })
    } else if (updateMsg.Status === true && !modalCss) {
      saveDissable(false);//+++++++++Update Button Is enable function
      dispatch(updateCompanyIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(updateMsg.Message),
        })
      );
    }
  }, [updateMsg, modalCss]);

  const { CompanyGroup } = useSelector((state) => ({
    CompanyGroup: state.Company.CompanyGroup
  }));

  const CompanyGroupValues = CompanyGroup.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));

  useEffect(() => {

    if (pageField) {
      const fieldArr = pageField.PageFieldMaster
      comAddPageFieldFunc({ state, setState, fieldArr })
    }
  }, [pageField])

  const formSubmitHandler = (event) => {
    debugger
    event.preventDefault();
    if (formValid(state, setState)) {
      const jsonBody = JSON.stringify({
        Name: values.Name,
        Address: values.Address,
        GSTIN: values.GSTIN,
        PhoneNo: values.PhoneNo,
        CompanyAbbreviation: values.CompanyAbbreviation,
        EmailID: values.EmailID,
        CompanyGroup: values.CompanyGroupName.value,
        CreatedBy: createdBy(),
        UpdatedBy: createdBy(),
      });

      saveDissable(true);//+++++++++save Button Is dissable function

      if (pageMode === "edit") {
        dispatch(updateCompanyID(jsonBody, values.id,));
        console.log("Update jsonBody", jsonBody)
      }
      else {
        dispatch(PostCompanySubmit(jsonBody));
        console.log("post jsonBody", jsonBody)

      }
    }
  };

  // //'Save' And 'Update' Button Handller
  // const handleValidSubmit = (event, values) => {
  //   debugger
  //   const jsonBody = JSON.stringify({
  //     Name: values.Name,
  //     Address: values.Address,
  //     GSTIN: values.GSTIN,
  //     PhoneNo: values.PhoneNo,
  //     CompanyAbbreviation: values.CompanyAbbreviation,
  //     EmailID: values.EmailID,
  //     CompanyGroup: values.CompanyGroupselect,
  //     CreatedBy: 1,
  //     UpdatedBy: 1,
  //   });

  //   if (pageMode === 'edit') {
  //     dispatch(updateCompanyID(jsonBody, EditData.id));
  //     console.log("Update jsonBody", jsonBody)
  //   }

  //   else {
  //     dispatch(PostCompanySubmit(jsonBody));
  //     console.log("Post jsonBody", jsonBody)
  //   }
  // };

  var IsEditMode_Css = ''
  if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className={"page-content"} style={{ marginTop: IsEditMode_Css }} >
          <MetaTags>
            <title>{userPageAccessState.PageHeading} | FoodERP-React FrontEnd</title>
          </MetaTags>
          <Breadcrumb pageHeading={userPageAccessState.PageHeading} />
          <Container fluid>
            <Row>
              <Col lg={12}>
                <Card className="text-black" >
                  <CardHeader className="card-header   text-black c_card_header" >
                    <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                    <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                  </CardHeader>

                  <CardBody>
                    <form onSubmit={formSubmitHandler}noValidate>
                      <Card >
                        <CardBody className="c_card_body">
                          <Row>

                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                              <Input
                                name="Name"
                                id="txtName"
                                value={values.Name}
                                type="text"
                                className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter Name"
                                autoComplete='off'
                                autoFocus={true}
                                onChange={(event) => {
                                  onChangeText({ event, state, setState })
                                  dispatch(Breadcrumb_inputName(event.target.value))
                                }}
                              />
                              {isError.Name.length > 0 && (
                                <span className="invalid-feedback">{isError.Name}</span>
                              )}
                            </FormGroup>

                            <Col md="1">  </Col>
                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">{fieldLabel.Address} </Label>
                              <Input
                                name="Address"
                                value={values.Address}
                                type="text"
                                className={isError.Address.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter Address"
                                autoComplete='off'
                                onChange={(event) => onChangeText({ event, state, setState })}
                              />
                              {isError.Address.length > 0 && (
                                <span className="invalid-feedback">{isError.Address}</span>
                              )}
                            </FormGroup>

                          </Row>

                          <Row className="mb-1">

                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">{fieldLabel.PhoneNo} </Label>
                              <Input
                                name="PhoneNo"
                                value={values.PhoneNo}
                                type="text"
                                className={isError.PhoneNo.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter PhoneNo"
                                autoComplete='off'
                                onChange={(event) => {
                                  onChangeText({ event, state, setState })
                                }}
                              />
                              {isError.PhoneNo.length > 0 && (
                                <span className="invalid-feedback">{isError.PhoneNo}</span>
                              )}
                            </FormGroup>

                            <Col md="1">  </Col>
                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">{fieldLabel.EmailID} </Label>
                              <Input
                                name="EmailID"
                                value={values.EmailID}
                                type="text"
                                className={isError.EmailID.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter EmailID"
                                autoComplete='off'
                                onChange={(event) => {
                                  onChangeText({ event, state, setState })
                                }}
                              />
                              {isError.EmailID.length > 0 && (
                                <span className="invalid-feedback">{isError.EmailID}</span>
                              )}
                            </FormGroup>
                          </Row>
                        </CardBody>
                      </Card>

                      <Card className="mt-n2">
                        <CardBody className="c_card_body">

                          <Row>
                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">{fieldLabel.GSTIN} </Label>
                              <Input
                                name="GSTIN"
                                value={values.GSTIN}
                                type="text"
                                className={isError.GSTIN.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter GSTIN"
                                autoComplete='off'
                                onChange={(event) => {
                                  onChangeText({ event, state, setState })
                                }}
                              />
                              {isError.GSTIN.length > 0 && (
                                <span className="invalid-feedback">{isError.GSTIN}</span>
                              )}
                            </FormGroup>

                            <Col md="1">  </Col>
                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">{fieldLabel.CompanyAbbreviation} </Label>
                              <Input
                                name="CompanyAbbreviation"
                                value={values.CompanyAbbreviation}
                                type="text"
                                className={isError.CompanyAbbreviation.length > 0 ? "is-invalid form-control" : "form-control"}
                                placeholder="Please Enter CompanyAbbreviation"
                                autoComplete='off'
                                onChange={(event) => {
                                  onChangeText({ event, state, setState })
                                }}
                              />
                              {isError.CompanyAbbreviation.length > 0 && (
                                <span className="invalid-feedback">{isError.CompanyAbbreviation}</span>
                              )}
                            </FormGroup>
                          </Row>

                          <Row className=" mb-3">

                            <Col md="4">

                              <FormGroup className="mb-3 ">
                                <Label htmlFor="validationCustom01"> {fieldLabel.CompanyGroupName} </Label>
                                <Select
                                  name="CompanyGroupName"
                                  value={values.CompanyGroupName}
                                  //   value={{label:"abc",value:1}}//default value set
                                  className="react-dropdown"
                                  classNamePrefix="dropdown"
                                  options={CompanyGroupValues}
                                  onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState })}
                                />
                                {isError.CompanyGroupName.length > 0 && (
                                  <span className="text-danger f-8"><small>{isError.CompanyGroupName}</small></span>
                                )}
                              </FormGroup>
                            </Col>
                          </Row>


                          <FormGroup >
                            <Row >
                              <Col sm={2}>
                                <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                                  module={"Company"}
                                />

                              </Col>
                            </Row>
                          </FormGroup >
                        </CardBody>
                      </Card>
                    </form>
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


