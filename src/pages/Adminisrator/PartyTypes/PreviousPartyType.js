import React, { useEffect, useRef, useState } from "react";
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

import { MetaTags } from "react-meta-tags";

import Breadcrumb from "../../../components/Common/Breadcrumb";
import { AvField, AvForm,AvInput, } from "availity-reactstrap-validation";

import { useDispatch, useSelector } from "react-redux";
import {  useHistory } from "react-router-dom";


import { Breadcrumb_inputName,AlertState } from "../../../store/actions";

import {
  editPartyTypeSuccess,
  PostPartyTypeAPISuccess,
  getPartyTypelist,
  updatePartyTypeID,
  PostPartyTypeAPI,
} from "../../../store/Administrator/PartyTypeRedux/action";
import { SaveButton } from "../../../components/CommonSaveButton";


const PartyType = (props) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;
  let propsPageMode = props.pageMode;

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState("");

  console.log("userPageAccessState",userPageAccessState)

    

  //Access redux store Data /  'save_ModuleSuccess' action data

  const { PostAPIResponse, PartyTypes, RoleAccessModifiedinSingleArray } =
    useSelector((state) => ({
      PostAPIResponse: state.PartyTypeReducer.PostData,
      PartyTypes: state.PartyMasterReducer.PartyTypes,
      RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
    }));

  // userAccess useEffect
  useEffect(() => {
    let userAcc = undefined;
    if (editDataGatingFromList === undefined) {
      let locationPath = history.location.pathname;
      userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
        return `/${inx.ActualPagePath}` === locationPath;
      });
    } else if (!(editDataGatingFromList === undefined)) {
      let relatatedPage = props.relatatedPage;
      userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
        return `/${inx.ActualPagePath}` === relatatedPage;
      });
    }
    if (!(userAcc === undefined)) {
      setUserPageAccessState(userAcc);
    }
  }, [RoleAccessModifiedinSingleArray]);

  useEffect(() => {
    dispatch(getPartyTypelist());
  }, [dispatch]);


  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {
    if (!(userPageAccessState === "")) {
      document.getElementById("txtName").focus();
    }
    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setPageMode("edit");
      dispatch(editPartyTypeSuccess({ Status: false }));
      dispatch(Breadcrumb_inputName(editDataGatingFromList.Name));
    } else if (!(propsPageMode === undefined)) {
      setPageMode(propsPageMode);
    }
  }, [editDataGatingFromList, propsPageMode]);


    useEffect(() => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)&&!(pageMode==="dropdownAdd")) {
            // setpartyType_dropdown_Select('')
            dispatch(PostPartyTypeAPISuccess({ Status: false }))
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
                    RedirectPath: '/PartyTypeList',

                }))
            }
        }
        else if ((PostAPIResponse.Status === true) && !(pageMode==="dropdownAdd")) {
            dispatch(PostPartyTypeAPISuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(PostAPIResponse.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostAPIResponse])


    

    const FormSubmitButton_Handler = (event, values) => {
        const jsonBody = JSON.stringify({
            Name: values.Name,
            IsSCM: values.IsSCM,
            IsDivision: values.IsDivision,
            CreatedBy: 1,
            CreatedOn: "2022-07-18T00:00:00",
            UpdatedBy: 1,
            UpdatedOn: "2022-07-18T00:00:00"
        });

      
        if (pageMode === "edit") {
            dispatch(updatePartyTypeID(jsonBody, EditData.id));
        }
        else {
            dispatch(PostPartyTypeAPI(jsonBody));
        }
    };
  

// IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
var IsEditMode_Css = ''
if ((pageMode === "edit")||(pageMode==="copy")||(pageMode==="dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {   
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <MetaTags>
                        <title>PartyType| FoodERP-React FrontEnd</title>
                    </MetaTags>
                    <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
                    <Container fluid>
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <AvForm onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v) }}
                                    ref={formRef}
                                >
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">Name </Label>
                                                            <AvField
                                                                name="Name"
                                                                id="txtName"
                                                                value={EditData.Name}
                                                                type="text"
                                                                placeholder="Please Enter Name"
                                                                autoComplete='off'
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'Please Enter Name' },
                                                                }}
                                                                onChange={(e) => { dispatch(Breadcrumb_inputName(e.target.value)) }}
                                                            />
                                                        </FormGroup>
                                                        
                                                        <Row>
                                                        <FormGroup className="mb-2 col col-sm-5">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" >IsSCM </Label>
                                                                <Col md={2} style={{ marginTop: '9px' }} >
                                                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                        <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                            defaultChecked={EditData.IsSCM}
                                                                            name="IsSCM"
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
                                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" >IsDivision </Label>
                                                                <Col md={2} style={{ marginTop: '9px' }} >
                                                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                        <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                            defaultChecked={EditData.IsDivision}
                                                                            name="IsDivision"
                                                                        // defaultChecked
                                                                        />
                                                                        <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    </Row>

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                {SaveButton({ pageMode, userPageAccessState, module: "PartyType" })}
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
    else {
        return (
            <React.Fragment></React.Fragment>
        )
        }
};
    
export default PartyType


 
