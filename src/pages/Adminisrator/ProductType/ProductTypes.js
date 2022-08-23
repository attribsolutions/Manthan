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
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShow } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { getMethodForProductTypes, PostMethodForProductTypes, PostMethod_ForProductTypesAPISuccess   } from "../../../store/Administrator/ProductTypesRedux/action";
import { AlertState } from "../../../store/actions";



const ProductTypes = (props) => {
    const formRef = useRef(null);
    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("");
    const [ProductCategoryTypes_dropdown_Select, setProductCategoryTypes_dropdown_Select] = useState("");
    const dispatch = useDispatch();
    const [userPageAccessState, setUserPageAccessState] = useState(123);
    const [ProductCategoryTypes,setProductCategoryTypes] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse ,ProductTypeAPI} = useSelector((state) => ({
        PostAPIResponse: state.ProductTypesReducer.PostDataMessage,
        ProductTypeAPI: state.ProductTypesReducer.ProductTypeAPI,
    }));

console.log("ProductTypeAPI",ProductTypeAPI)

    useEffect(() => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
          dispatch(PostMethod_ForProductTypesAPISuccess({ Status: false }))
         
        
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
            //   RedirectPath: '/',
            }))
          }
        }
        else if (PostAPIResponse.Status === true) {
          dispatch(PostMethod_ForProductTypesAPISuccess({ Status: false }))
          dispatch(AlertState({
            Type: 4,
            Status: true,
            Message: JSON.stringify(postMessage.Message),
            RedirectPath: false,
            AfterResponseAction: false
          }));
        }
      }, [PostAPIResponse])
   
    //get method for dropdown
    useEffect(() => {
    dispatch(getMethodForProductTypes());
   }, [dispatch]);



    function handllerProductCategoryTypes(e) {
        setProductCategoryTypes_dropdown_Select(e)
    }

    const ProductCategoryTypesValues = ProductTypeAPI.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));



    const FormSubmitButton_Handler = (event, values) => {
        const jsonBody = JSON.stringify({
            Name: values.Name,
            ProductCategoryType: ProductCategoryTypes_dropdown_Select.value,
        });
        dispatch(PostMethodForProductTypes (jsonBody))
        console.log("jsonBody",jsonBody)
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
                            <title>Product Types| FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb breadcrumbItem={"Product Types"} />

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
                                                            <Col md="4">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01"> ProductCategory Type </Label>
                                                                    <Col sm={12}>
                                                                        <Select
                                                                            value={ProductCategoryTypes_dropdown_Select}
                                                                             options={ProductCategoryTypesValues}
                                                                            onChange={(e) => { handllerProductCategoryTypes(e) }}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <div className="w-xs">
                                                        <button
                                                                 type="submit"
                                                                 data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save ProductCategory Types"
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

export default ProductTypes

