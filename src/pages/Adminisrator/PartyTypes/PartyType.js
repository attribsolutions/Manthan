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
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { AvField, AvForm, } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";

import { BreadcrumbShow,AlertState } from "../../../store/actions";
import { editPartyTypeSuccess, PostPartyTypeAPI, PostPartyTypeAPISuccess, updatePartyTypeID } from "../../../store/Administrator/PartyTypeRedux/action";
import { getDivisionTypesID } from "../../../store/Administrator/PartyRedux/action";

const PartyType = (props) => {

    const formRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory()

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;


    //SetState  Edit data Geting From Modules List component
    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [division_dropdown_Select, setDivision_dropdown_Select] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse,DivisionTypes,RoleAccessModifiedinSingleArray } = useSelector((state) => ({
        PostAPIResponse: state.PartyTypeReducer.PostData,
        DivisionTypes: state.PartyMasterReducer.DivisionTypes,
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

    useEffect(() => {
        dispatch(getDivisionTypesID());
    }, [dispatch]);
    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
        if (!(editDataGatingFromList === undefined)) {
            setEditData(editDataGatingFromList);
            setPageMode("edit");
            setDivision_dropdown_Select({
                value: editDataGatingFromList.DivisionType_id,
                label: editDataGatingFromList.DivisionTypeName
            })
            dispatch(editPartyTypeSuccess({ Status: false }))
            dispatch(BreadcrumbShow(editDataGatingFromList.Name))
            return
        }
    }, [editDataGatingFromList])

    useEffect(() => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            setDivision_dropdown_Select('')
            dispatch(PostPartyTypeAPISuccess({ Status: false }))
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
                    RedirectPath: '/PartyTypeList',

                }))
            }
        }
        else if (PostAPIResponse.Status === true) {
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

     
    const DivisionTypesValues = DivisionTypes.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    function handllerDivisionTypes(e) {
        setDivision_dropdown_Select(e)
    }

    const FormSubmitButton_Handler = (event, values) => {
        const jsonBody = JSON.stringify({
            Name: values.Name,
            DivisionType: division_dropdown_Select.value,
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
    if (pageMode === "edit") { IsEditMode_Css = "-5.5%" };

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
                                                                onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                            />
                                                        </FormGroup>
                                                        <Row>
                                                            <Col md="4">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01"> Division Type </Label>
                                                                    <Col sm={12}>
                                                                        <Select
                                                                            value={division_dropdown_Select}
                                                                            options={DivisionTypesValues}
                                                                            onChange={(e) => { handllerDivisionTypes(e) }}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
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
                                                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Party Type"
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

export default PartyType
