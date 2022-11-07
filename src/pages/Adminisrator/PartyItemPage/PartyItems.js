import React, { useEffect, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import {
    Button,
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
import { AvField, AvForm, } from "availity-reactstrap-validation";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { Breadcrumb_inputName, commonPageField, commonPageFieldSuccess, } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/actions";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,

} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";
import { getSupplier, goButton, goButtonSuccess, PostPartyItemsSuccess } from "../../../store/Administrator/PartyItemsRedux/action";


const PartyItems = (props) => {

    const formRef = useRef(null);
    const history = useHistory()
    const dispatch = useDispatch();
    let editMode = history.location.pageMode;
    const [pageMode, setPageMode] = useState("");
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserPageAccessState] = useState(123);
    const [SupplierNameSelect, setSupplierNameSelect] = useState('');

    // get method for dropdown
    useEffect(() => {
        dispatch(getSupplier());
    }, [dispatch]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        supplier,
        items,
        pageField,
        userAccess } = useSelector((state) => ({
            postMsg: state.PartyItemsReducer.postMsg,
            items: state.PartyItemsReducer.orderItem,
            supplier: state.PartyItemsReducer.supplier,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {

        const locationPath = history.location.pathname
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [userAccess])

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.


    useEffect(() => {

        const editDataGatingFromList = history.location.editValue

        const locationPath = history.location.pathname
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (!(editDataGatingFromList === undefined)) {
            var SupplierName = editDataGatingFromList.Supplier
            var Supplierid = 32

            const jsonBody = JSON.stringify({
                Party: Supplierid,
            }
            );
            dispatch(goButton(jsonBody))
            setSupplierNameSelect({ label: SupplierName, value: Supplierid })

        }
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [userAccess])


    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(PostPartyItemsSuccess({ Status: false }))
            dispatch(goButtonSuccess([]))
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: false,
            }))

        } else if (postMsg.Status === true) {
            dispatch(PostPartyItemsSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "error Message",
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])



    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Supplier,
    }));


    const GoButton_Handler = () => {
        let party = SupplierNameSelect.value

        if (!party > 0) {
            alert("Please Select Supplier")
            return
        }

        if (items.length > 0) {
            if (window.confirm("Refresh Order Item...!")) {
                dispatch(goButtonSuccess([]))
            } else {
                return
            }
        }

        // let division = 0
        // try {
        //     division = JSON.parse(localStorage.getItem("roleId")).Party_id
        // } catch (e) {
        //     alert(e)
        // }
        const jsonBody = JSON.stringify({
            Party: party,
        }
        );

        dispatch(goButton(jsonBody))
        console.log("jsonBody", jsonBody)
    };



    const SubmitHandler = (event) => {
        event.preventDefault();

        const jsonBody = JSON.stringify({
            // CategoryType: values.CategoryTypeName.value,
        });

        // if (pageMode === "edit") {
        //     dispatch(updateCategoryID(jsonBody, values.id,));
        // }
        // else {
        //     dispatch(PostMethodForCategory(jsonBody));
        // }
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
                            <title>{userPageAccessState.PageHeading} | FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >

                                <Row className="">
                                    <Col md={12}>
                                        <Card>
                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                <Row>
                                                    <Row>
                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01"> SupplierName </Label>
                                                                <Col md="12">
                                                                    <Select
                                                                        value={SupplierNameSelect}
                                                                        classNamePrefix="select2-Supplier"
                                                                        isDisabled={editMode === "edit" ? true : false}
                                                                        options={supplierOptions}
                                                                        onChange={(e) => { setSupplierNameSelect(e) }}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="3" className="mt-4">
                                                            <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                                                                onClick={GoButton_Handler}
                                                            >Go</Button>
                                                        </Col>
                                                    </Row>
                                                </Row>

                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>

                                <button
                                    type="submit"
                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save"
                                    className="btn btn-primary w-xs"
                                    onClick={SubmitHandler}
                                > <i className="fas fa-save me-2"></i> Save
                                </button>
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
export default PartyItems

