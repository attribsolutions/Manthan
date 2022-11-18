// import React, { useEffect, useRef, useState, } from "react";
// import Breadcrumb from "../../../components/Common/Breadcrumb";
// import {
//     Card,
//     CardBody,
//     CardHeader,
//     Col,
//     Container,
//     FormGroup,
//     Label,
//     Row,
// } from "reactstrap";
// import { AvField, AvForm, } from "availity-reactstrap-validation";
// import { MetaTags } from "react-meta-tags";
// import { AlertState } from "../../../store/actions";
// import { useHistory } from "react-router-dom";

// import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
// import { useDispatch, useSelector } from "react-redux";
// import {
   
//     postTermAndCondition,
//     postTermAndConditionSuccess,
//     EditTermsAndCondtions,
  
// } from "../../../store/Administrator/TermsAndCondtionsRedux/actions";

// const TermsAndCondtionsMaster = (props) => {
//     const formRef = useRef(null);
//     const [EditData, setEditData] = useState([]);
//     const [pageMode, setPageMode] = useState("");
//     const history = useHistory()
//     const dispatch = useDispatch();
//     const [userPageAccessState, setUserPageAccessState] = useState(123);

//     //*** "isEditdata get all data from ModuleID for Binding  Form controls
//     let editDataGatingFromList = props.state;
//     let pageModeProps=props.pageMode;

//     //Access redux store Data /  'save_ModuleSuccess' action data
//     const { PostAPIResponse, RoleAccessModifiedinSingleArray } = useSelector((state) => ({
//         PostAPIResponse: state.TermsAndCondtionsReducer.PostData,
//         RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
//     }));


//     //userAccess useEffect
//     useEffect(() => {
//         let userAcc = undefined
//         if ((editDataGatingFromList === undefined)) {

//             let locationPath = history.location.pathname
//             userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
//                 return (`/${inx.ActualPagePath}` === locationPath)
//             })
//         }
//         else if (!(editDataGatingFromList === undefined)) {
//             let relatatedPage = props.relatatedPage
//             userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
//                 return (`/${inx.ActualPagePath}` === relatatedPage)
//             })

//         }
//         if (!(userAcc === undefined)) {
//             setUserPageAccessState(userAcc)
//         }

//     }, [RoleAccessModifiedinSingleArray])


//     //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
//     useEffect(() => {
//         if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
//         if (!(editDataGatingFromList === undefined)) {
//            // setEditData(editDataGatingFromList);
//             setPageMode(pageModeProps);
//             //dispatch(editCategoryTypeIDSuccess({ Status: false }))
//             dispatch(Breadcrumb_inputName(editDataGatingFromList.Name))
//             return
//         }
//     }, [editDataGatingFromList])

//     useEffect(() => {

//         if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
//             dispatch(postTermAndConditionSuccess({ Status: false }))


//             if (pageMode === "other") {
//                 dispatch(AlertState({
//                     Type: 1,
//                     Status: true,
//                     Message: PostAPIResponse.Message,
//                 }))
//             }

//             else {
//                 dispatch(AlertState({
//                     Type: 1,
//                     Status: true,
//                     Message: PostAPIResponse.Message,
//                     RedirectPath: '/TermsAndCondtionsMaster',
//                 }))
//             }
//         }
//         else if (PostAPIResponse.Status === true) {
//             dispatch(postTermAndConditionSuccess({ Status: false }))
//             dispatch(AlertState({
//                 Type: 4,
//                 Status: true,
//                 Message: JSON.stringify(postMessage.Message),
//                 RedirectPath: false,
//                 AfterResponseAction: false
//             }));
//         }
//     }, [PostAPIResponse])



//     const FormSubmitButton_Handler = (event, values) => {
//         alert("aaaa")
//         const jsonBody = JSON.stringify({
            
//             Name: values.Name,

//         });
       
//         if (pageMode === "edit") {
//             dispatch(EditTermsAndCondtions(jsonBody, EditData.id));
//         }
//         else {
//             alert(jsonBody)
//             dispatch(postTermAndCondition(jsonBody))
//         }

//     };


//     // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
//     var IsEditMode_Css = ''
//     if ((pageMode === "edit")||(pageMode==="copy")||(pageMode==="dropdownAdd")) { IsEditMode_Css = "-5.5%" };

//     if (!(userPageAccessState === '')) {
//         return (
//             <React.Fragment>
//                 <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
//                     <Container fluid>
//                         <MetaTags>
//                             <title>CategoryTypeMaster| FoodERP-React FrontEnd</title>
//                         </MetaTags>
//                         <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

//                         <Card className="text-black">
//                             <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
//                                 <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
//                                 <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
//                             </CardHeader>

//                             <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
//                                 <AvForm onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v) }}
//                                     ref={formRef}
//                                 >
//                                     <Row className="">
//                                         <Col md={12}>
//                                             <Card>
//                                                 <CardBody style={{ backgroundColor: "whitesmoke" }}>
//                                                     <Row>
//                                                         <FormGroup className="mb-2 col col-sm-4 ">
//                                                             <Label htmlFor="validationCustom01">Name </Label>
//                                                             <AvField
//                                                                 name="Name"
//                                                                 id="txtName"
//                                                                 value={EditData.Name}
//                                                                 type="text"
//                                                                 placeholder="Please Enter Name"
//                                                                 autoComplete='off'
//                                                                 validate={{
//                                                                     required: { value: true, errorMessage: 'Please Enter Name' },
//                                                                 }}
//                                                                 onChange={(e) => { dispatch(Breadcrumb_inputName(e.target.value)) }}
//                                                             />
//                                                         </FormGroup>

//                                                         <FormGroup>
//                                                             <Row>
//                                                                 <Col sm={2}>
//                                                                     <div>
//                                                                         {
//                                                                             pageMode === "edit" ?
//                                                                                 userPageAccessState.RoleAccess_IsEdit ?
//                                                                                     <button
//                                                                                         type="submit"
//                                                                                         data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Party Type"
//                                                                                         className="btn btn-success w-md"
//                                                                                     >
//                                                                                         <i class="fas fa-edit me-2"></i>Update
//                                                                                     </button>
//                                                                                     :
//                                                                                     <></>
//                                                                                 : (
//                                                                                     userPageAccessState.RoleAccess_IsSave ?
//                                                                                         <button
//                                                                                             type="submit"
//                                                                                             data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save ProductCategory Type"
//                                                                                             className="btn btn-primary w-sm">
//                                                                                             <i className="fas fa-save me-2"></i>
//                                                                                             Save

//                                                                                         </button>
//                                                                                         :
//                                                                                         <></>
//                                                                                 )
//                                                                         }
//                                                                     </div>
//                                                                 </Col>
//                                                             </Row>
//                                                         </FormGroup>

//                                                     </Row>
//                                                 </CardBody>
//                                             </Card>
//                                         </Col>
//                                     </Row>
//                                 </AvForm>
//                             </CardBody>



//                         </Card>

//                     </Container>
//                 </div>
//             </React.Fragment>
//         );
//     }
//     else {
//         return (
//             <React.Fragment></React.Fragment>
//         )
//     }
// };

// export default TermsAndCondtionsMaster

import React, { useEffect, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";

import { MetaTags } from "react-meta-tags";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { useDispatch, useSelector } from "react-redux";

import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeText
} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";
import SaveButton from "../../../components/Common/CommonSaveButton";
import { EditTermsAndCondtions_Success, postTermAndCondition, postTermAndConditionSuccess, UpdateTermsAndCondtions, UpdateTermsAndCondtions_Success } from "../../../store/Administrator/TermsAndCondtionsRedux/actions";
import { TERMS_AND_CONDITION_LIST } from "../../../routes/route_url";

const TermsAndCondtionsMaster = (props) => {
    const formRef = useRef(null);
    const history = useHistory()
    const dispatch = useDispatch();
    const [modalCss, setModalCss] = useState(false);

    const [pageMode, setPageMode] = useState("");
    const [userPageAccessState, setUserPageAccessState] = useState(123);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg, updateMsg, pageField, userAccess } = useSelector((state) => ({
        postMsg: state.TermsAndCondtionsReducer.PostData,
        updateMsg: state.TermsAndCondtionsReducer.TermsAndCondtionsupdateMessage,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    useEffect(() => {
        dispatch(commonPageField(42))
    }, []);

    {/** Dyanamic Page access state and OnChange function */ }
    const initialFiled = {
        Name: "",
        id: ""
    }

    const [state, setState] = useState(initialFiledFunc(initialFiled))


    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

    //userAccess useEffect
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

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
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

                const { id, Name } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                values.Name = Name;
                values.id = id

                hasValid.Name.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))

            }
            dispatch(EditTermsAndCondtions_Success({ Status: false }))
        }
    }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postTermAndConditionSuccess({ Status: false }))

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
                    RedirectPath: TERMS_AND_CONDITION_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(postTermAndConditionSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            history.push({
                pathname: TERMS_AND_CONDITION_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(UpdateTermsAndCondtions_Success({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg, modalCss]);
  

    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
            const jsonBody = JSON.stringify({
                Name: values.Name,
            });
            if (pageMode === "edit") {
                dispatch(UpdateTermsAndCondtions(jsonBody, values.id));
            }
            else {
                dispatch(postTermAndCondition(jsonBody))
            }

        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form onSubmit={formSubmitHandler} ref={formRef} noValidate>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Name}</Label>
                                                            <Input
                                                                name="Name"
                                                                id="txtName"
                                                                value={values.Name}
                                                                type="text"
                                                                className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Name"
                                                                autoComplete="off"
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

                                                        <FormGroup className="mt-2">
                                                            <Row>
                                                                <Col sm={2}>
                                                                    <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                                                                        module={"TermsAndCondtionsMaster"}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>

                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </form>
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

export default TermsAndCondtionsMaster

