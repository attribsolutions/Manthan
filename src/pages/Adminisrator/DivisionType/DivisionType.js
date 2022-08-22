import React, { useEffect, useRef, useState, } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";

import { BreadcrumbShow ,AlertState} from "../../../store/actions";
import { PostDivisionTypeAPI, PostDivisionTypeSuccess, updateDivisionTypeID } from "../../../store/Administrator/DivisionTypeRedux/action";
import { editEmployeeTypeSuccess } from "../../../store/Administrator/EmployeeTypeRedux/action";

const DivisionType = (props) => {

    const formRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory()

//*** "isEditdata get all data from ModuleID for Binding  Form controls
let editDataGatingFromList = props.state;


  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');

  //Access redux store Data /  'save_ModuleSuccess' action data
  const { PostAPIResponse,RoleAccessModifiedinSingleArray } = useSelector((state) => ({
    PostAPIResponse: state.DivisionTypeReducer.PostData,
    RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
}));

// userAccess useEffect
useEffect(() => {
    if ((editDataGatingFromList === undefined)) {
        const userAcc = CommonGetRoleAccessFunction(history)
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    } else {
        let RelatedPageID = history.location.state.UserDetails.RelatedPageID
        const userfound = RoleAccessModifiedinSingleArray.find((element) => {
            return element.id === RelatedPageID
        })
        setUserPageAccessState(userfound)
    }

}, [history])


  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {
    if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setPageMode("edit");
      dispatch(editEmployeeTypeSuccess({ Status: false }))
      dispatch(BreadcrumbShow(editDataGatingFromList.Name))
      return
    }
  }, [editDataGatingFromList])

  useEffect(() => {
    if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
     
      dispatch(PostDivisionTypeSuccess({ Status: false }))
      formRef.current.reset();
      if (pageMode === "other") {
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
          RedirectPath: '/DivisionTypeList',

        }))
      }
    }
    else if (PostAPIResponse.Status === true) {
      dispatch(PostDivisionTypeSuccess({ Status: false }))
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
            CreatedBy: 1,
            CreatedOn: "2022-07-18T00:00:00",
            UpdatedBy: 1,
            UpdatedOn: "2022-07-18T00:00:00"
        });

        if (pageMode === "edit") {
            dispatch(updateDivisionTypeID(jsonBody, EditData.id));
        }
        else {
            dispatch(PostDivisionTypeAPI(jsonBody));
            console.log("jsonBody",jsonBody)
        }
    };
  


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if (pageMode === "edit") { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                <MetaTags>
                    <title>Division Type| FoodERP-React FrontEnd</title>
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
                                                            onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                        />
                                                    </FormGroup>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-5">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-5 col-form-label" >IsSCM </Label>
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
                                                    <FormGroup >
                                                        <Row >
                                                            <Col sm={2}>
                                                                <div>
                                                                    {
                                                                        pageMode === "edit" ?
                                                                            userPageAccessState.RoleAccess_IsEdit ?
                                                                                <button
                                                                                    type="submit"
                                                                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Division Type"
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
                                                                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Division Type"
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

export default DivisionType
