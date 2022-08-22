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

import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { useDispatch, useSelector } from "react-redux";
import { PostMethodForProductCategoryTypeMaster, PostMethod_ForProductCategoryTypeMasterAPISuccess } from "../../../store/Administrator/ProductCategoryTypeMasterRedux/action";


const ProductCategoryTypeMaster = (props) => {
    const formRef = useRef(null);
    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("");
   
    const dispatch = useDispatch();
    const [userPageAccessState, setUserPageAccessState] = useState(123);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse } = useSelector((state) => ({
        PostAPIResponse: state.ProductCategoryTypeMasterReducer.PostData,

    }));

    useEffect(() => {
    
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            dispatch(PostMethod_ForProductCategoryTypeMasterAPISuccess({ Status: false }))
           
          
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
                // RedirectPath: '/',
              }))
            }
          }
          else if (PostAPIResponse.Status === true) {
            dispatch(PostMethod_ForProductCategoryTypeMasterAPISuccess({ Status: false }))
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
        dispatch(PostMethodForProductCategoryTypeMaster(jsonBody))
    }
    

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if (pageMode === "edit") { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>ProductCategoryTypeMaster| FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb breadcrumbItem={"ProductCategoryTypeMaster"} />

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{"userPageAccessState.PageDescription"}</h4>
                                <p className="card-title-desc text-black">{"userPageAccessState.PageDescriptionDetails"}</p>
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
                                                            <div className="w-xs">
                                                        <button
                                                                 type="submit"
                                                                 data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save ProductCategory Type"
                                                                className="btn btn-primary w-sm">
                                                                 <i className="fas fa-save me-2"></i> 
                                                                 Save
                                                       
                                                               </button>
                                                               </div>
                                                        </Row> 

                                                                   
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
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default ProductCategoryTypeMaster

