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
import {
    AvForm,
    AvGroup,
    AvInput,
} from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import {
    PostModelsSubmit,
    updateModuleID,
    PostModelsSubmitSuccess,
    editModuleIDSuccess,
} from "../../../store/Administrator/ModulesRedux/actions";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import AvField from "availity-reactstrap-validation/lib/AvField";
import { MetaTags } from "react-meta-tags";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";

const Modules = (props) => {

    const formRef = useRef(null);
    const dispatch = useDispatch();

    //SetState  Edit data Geting From Modules List component
    const [EditData, setEditData] = useState([]);

    //'IsEdit'--if true then update data otherwise it will perfrom save operation
    const [IsEdit, setIsEdit] = useState(false);
    const [PageMode, setPageMode] = useState(false);

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;
    let CheckPageMode = props.IsComponentMode;

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { APIResponse, } = useSelector((state) => ({
        APIResponse: state.Modules.modulesSubmitSuccesss,
    }));

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        document.getElementById("txtName").focus();
        if (!(editDataGatingFromList === undefined)) {
            setEditData(editDataGatingFromList);
            setIsEdit(true);
            dispatch(editModuleIDSuccess({ Status: false }))
            return
        }
        if (!(CheckPageMode === undefined)) {
            setPageMode(true)
            return
        }
    }, [editDataGatingFromList, CheckPageMode])

    // This UseEffect clear Form Data and when modules Save Successfully.
    useEffect(() => {
        if ((APIResponse.Status === true) && (APIResponse.StatusCode === 200)) {
            dispatch(PostModelsSubmitSuccess({ Status: false }))
            formRef.current.reset();
            if (PageMode === true) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: APIResponse.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: APIResponse.Message,
                    RedirectPath: '/moduleList',

                }))
            }
        } else if (APIResponse.Status === true) {
            dispatch(PostModelsSubmitSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "error Message",
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [APIResponse.Status])

    //'Save' And 'Update' Button Handller
    const handleValidSubmit = (event, values) => {
        const requestOptions = {
            body: JSON.stringify({
                Name: values.Name,
                DisplayIndex: values.DisplayIndex,
                isActive: values.IsActive,
                Icon: values.Icon,
                CreatedBy: 9,
                UpdatedBy: 9
            }),
        };
        debugger
        if (IsEdit) {
            dispatch(updateModuleID(requestOptions.body, EditData.id));
        }
        else {
            dispatch(PostModelsSubmit(requestOptions.body));
        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if (IsEdit === true || PageMode == true) { IsEditMode_Css = "-5.5%" };

    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                <MetaTags>
                    <title>Modules| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Breadcrumbs breadcrumbItem={"Module Page "} />
                <Container fluid  >

                    <Card className="text-black">
                        <CardHeader>
                            <h4 className="card-title text-black ">React Validation - Normal</h4>
                            <p className="card-title-desc text-black">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
                        </CardHeader>

                        <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                            <AvForm onValidSubmit={(e, v) => { handleValidSubmit(e, v) }}
                                ref={formRef}
                            >

                                <Row className="">
                                    <Col md={12}  >
                                        <Card >
                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                <Row>
                                                    <FormGroup className="mb-2 col col-sm-4 " >
                                                        <Label htmlFor="validationCustom01">Name </Label>
                                                        <AvField
                                                            name="Name"
                                                            id="txtName"
                                                            value={EditData.Name}
                                                            type="text"
                                                            placeholder="Please Enter Name"
                                                            autoComplete='off'
                                                            validate={{
                                                                required: { value: true, errorMessage: 'Please enter a Name' },
                                                            }}
                                                        />
                                                    </FormGroup>

                                                </Row>


                                                <Row>
                                                    <FormGroup className="mb-2 col col-sm-4 " >
                                                        <Label htmlFor="validationCustom01">DisplayIndex </Label>
                                                        <AvField name="DisplayIndex" autoComplete='off'
                                                            placeholder="Please Enter DisplayIndex"
                                                            value={EditData.DisplayIndex} type="text"
                                                            validate={{
                                                                number: true,
                                                                required: { value: true, errorMessage: 'Display Index is Required' },
                                                                tel: {
                                                                    pattern: /^\d{1,4}$/,
                                                                    errorMessage: 'Display Index is Required (Only Two Digit) '
                                                                }
                                                            }}
                                                        />
                                                    </FormGroup>
                                                </Row>

                                                <Row>
                                                    <FormGroup className="mb-2 col col-sm-4 " >
                                                        <Label htmlFor="validationCustom01">Icon </Label>
                                                        <AvField name="Icon"
                                                            autoComplete='off'
                                                            placeholder="Please Enter IconPath"
                                                            value={EditData.Icon} type="text" validate={{
                                                                required: { value: true, errorMessage: 'Please enter a Icon' },
                                                            }}
                                                        />
                                                    </FormGroup>
                                                </Row>




                                                <FormGroup className="mb-2 col col-sm-5">
                                                    <Row className="justify-content-md-left">
                                                        <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label" >IsActive </Label>
                                                        <Col md={2} style={{ marginTop: '9px' }} >
                                                            {/* <AvInput
                                                                checked={(EditData.ID === 0) ? false : EditData.IsActive}
                                                                name="IsActive"
                                                                type="checkbox"
                                                                id="switch1"
                                                                switch="none"
                                                                defaultChecked /> */}
                                                            {/* <Label className="me-1" htmlFor="switch1" data-on-label="Yes" data-off-label="No"></Label> */}
                                                            <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                    checked={EditData.isActive}
                                                                    name="IsActive"
                                                                    defaultChecked
                                                                />
                                                                <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                            </div>


                                                        </Col>

                                                    </Row>

                                                </FormGroup>



                                                <FormGroup >
                                                    <Row >

                                                        <Col sm={2}>
                                                            <div>
                                                                {
                                                                    IsEdit ? (
                                                                        <button
                                                                            type="submit"
                                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Module"
                                                                            className="btn btn-success w-md"
                                                                        >
                                                                            <i class="fas fa-edit me-2"></i>Update
                                                                        </button>) : (
                                                                        <button
                                                                            type="submit"
                                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Module"
                                                                            className="btn btn-primary w-md"
                                                                        > <i className="fas fa-save me-2"></i> Save
                                                                        </button>
                                                                    )
                                                                }
                                                            </div>
                                                        </Col>

                                                    </Row>
                                                </FormGroup >
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
};
export default Modules
