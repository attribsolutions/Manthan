import React, { useEffect, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
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
import { AvField, AvForm, } from "availity-reactstrap-validation";
import { MetaTags } from "react-meta-tags";
import { AlertState } from "../../../store/actions";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { useHistory } from "react-router-dom";

import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { useDispatch, useSelector } from "react-redux";
// import { PostMethodForCategoryTypeMaster,
//      PostMethod_ForCategoryTypeMasterAPISuccess
//      } from "../../../store/actions";
   
     import {
        PostMethodForCategoryTypeMaster,
        PostMethod_ForCategoryTypeMasterAPISuccess,
         editCategoryTypeIDSuccess,
         updateCategoryTypeID,
      } from "../../../store/Administrator/CategoryTypeRedux/actions";


const CategoryTypeMaster = (props) => {
    const formRef = useRef(null);
    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("");
    const history = useHistory()
    const dispatch = useDispatch();
    const [userPageAccessState, setUserPageAccessState] = useState(123);

//*** "isEditdata get all data from ModuleID for Binding  Form controls
   let editDataGatingFromList = props.state;
  

    //Access redux store Data /  'save_ModuleSuccess' action data
const { PostAPIResponse,RoleAccessModifiedinSingleArray} = useSelector((state) => ({
        PostAPIResponse: state.categoryTypeMasterReducer.PostData,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
    }));


//userAccess useEffect
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


 //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
 useEffect(() => {
    if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
    if (!(editDataGatingFromList === undefined)) {
        setEditData(editDataGatingFromList);
        setPageMode("edit");
        dispatch(editCategoryTypeIDSuccess({ Status: false }))
        dispatch(BreadcrumbShow(editDataGatingFromList.Name))
        return
    }
}, [editDataGatingFromList])

    useEffect(() => {
    
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            dispatch(PostMethod_ForCategoryTypeMasterAPISuccess({ Status: false }))
           
          
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
                 RedirectPath: '/CategoryTypeList',
              }))
            }
          }
          else if (PostAPIResponse.Status === true) {
            dispatch(PostMethod_ForCategoryTypeMasterAPISuccess({ Status: false }))
            dispatch(AlertState({
              Type: 4,
              Status: true,
              Message: JSON.stringify(postMessage.Message),
              RedirectPath: false,
              AfterResponseAction: false
            }));
          }
        }, [PostAPIResponse])

    

    const FormSubmitButton_Handler = (event, values) => {
        const jsonBody = JSON.stringify({
            Name: values.Name,

        });
        if (pageMode === "edit") {
            dispatch(updateCategoryTypeID(jsonBody, EditData.id));
        }
        else {
            dispatch(PostMethodForCategoryTypeMaster(jsonBody))
        }
        
    };
    

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if (pageMode === "edit") { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>CategoryTypeMaster| FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

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
                                                        
                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                    <div>
                                                                        {
                                                                            pageMode === "edit" ?
                                                                                userPageAccessState.RoleAccess_IsEdit ?
                                                                                    <button
                                                                                        type="submit"
                                                                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Party Type"
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
                                                                 data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save ProductCategory Type"
                                                                className="btn btn-primary w-sm">
                                                                 <i className="fas fa-save me-2"></i> 
                                                                 Save
                                                       
                                                               </button>
                                                               :
                                                               <></>
                                                       )
                                                                                }
                                                               </div>
                                                               </Col>
                                                           </Row>
                                                      </FormGroup>            
                                                                   
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
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default CategoryTypeMaster

