import React, { useEffect, useState, } from "react";
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
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { useDispatch, useSelector } from "react-redux";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, btnIsDissablefunc, loginUserID, metaTagLabel, } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { editSub_ClusterIDSuccess, saveSub_ClusterMaster, saveSub_ClusterMaster_Success, updateSub_ClusterID, updateSub_ClusterIDSuccess } from "../../../store/Administrator/SubClusterRedux/action";
import { getClusterlist } from "../../../store/Administrator/ClusterRedux/action";
import ClusterMaster from "./ClusterMaster";
import Select from "react-select";
import AddMaster from "../EmployeePages/Drodown";

const SubClusterMaster = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        ClusterName: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [cluster_AddAccess, setCluster_AddAccess] = useState(false)

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        saveBtnloading,
        clusterDropdown,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.SubClusterReducer.saveBtnloading,
            postMsg: state.SubClusterReducer.postMsg,
            updateMsg: state.SubClusterReducer.updateMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            clusterDropdown: state.ClusterReducer.ClusterListData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.SUB_CLUSTER_MASTER
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id));
        dispatch(getClusterlist());
    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue);
    const hasShowModal = props.hasOwnProperty(mode.editValue);

    // userAccess useEffect

    useEffect(() => {
        let userAcc = null;
        let locationPath;

        if (props.pageMode === mode.dropdownAdd) {
            locationPath = props.masterPath;
        } else {
            locationPath = location.pathname;
        }

        if (hasShowModal) {
            locationPath = props.masterPath;
        };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc);
            if (!props.isdropdown) {
                breadcrumbReturnFunc({ dispatch, userAcc });
            }
        };
        userAccess.find((index) => {
            if (index.id === pageId.CLUSTER_MASTER) {
                return setCluster_AddAccess(true)
            }
        });
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

                const { id, Name, Cluster, ClusterName } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                values.Name = Name;
                values.id = id
                values.ClusterName = { value: Cluster, label: ClusterName }

                hasValid.Name.valid = true;
                hasValid.ClusterName.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editSub_ClusterIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveSub_ClusterMaster_Success({ Status: false }))
            dispatch(Breadcrumb_inputName(''))
            setState(() => resetFunction(fileds, state))// Clear form values  
            if (props.pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })

                dispatch(getClusterlist());

                props.isOpenModal(false)
            }
            else if (pageMode === mode.edit) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                history.push({ pathname: url.SUB_CLUSTER_lIST })
            }
            else {
                dispatch(Breadcrumb_inputName(''))
                const promise = await customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (promise) { history.push({ pathname: url.SUB_CLUSTER_lIST }) }
            }

        } else if
            (postMsg.Status === true) {
            customAlert({
                Type: 3,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state))// Clear form values
            history.push({
                pathname: url.SUB_CLUSTER_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateSub_ClusterIDSuccess({ Status: false }));
            customAlert({
                Type: 3,
                Message: JSON.stringify(updateMsg.Message),
            })
        }
    }, [updateMsg, modalCss]);

    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const Cluster_Options = clusterDropdown.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    Cluster: values.ClusterName.value
                });

                if (pageMode === mode.edit) {
                    dispatch(updateSub_ClusterID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveSub_ClusterMaster({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };



    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >
                    <Container fluid>

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header">
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form noValidate>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody className="c_card_body">
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
                                                    </Row>
                                                    <Row>

                                                        <Col md="4" >
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01"> {fieldLabel.ClusterName} </Label>
                                                                <Col sm={12} >
                                                                    <Select
                                                                        name="ClusterName"
                                                                        value={values.ClusterName}
                                                                        isSearchable={true}
                                                                        className="react-dropdown"
                                                                        classNamePrefix="dropdown"
                                                                        options={Cluster_Options}
                                                                        onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}

                                                                    />
                                                                    {isError.ClusterName.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.ClusterName}</small></span>
                                                                    )}
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>

                                                        {(cluster_AddAccess) &&
                                                            <Col md="1" className=" mt-3">
                                                                <AddMaster
                                                                    masterModal={ClusterMaster}
                                                                    masterPath={url.CLUSTER_MASTER}
                                                                />
                                                            </Col>}
                                                    </Row>


                                                    <FormGroup className="mt-2">
                                                        <Row>
                                                            <Col sm={2}>
                                                                <SaveButton pageMode={pageMode}
                                                                    loading={saveBtnloading}
                                                                    onClick={SaveHandler}
                                                                    userAcc={userPageAccessState}
                                                                    editCreatedBy={editCreatedBy}
                                                                    module={"CategoryTypeMaster"}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>

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

export default SubClusterMaster

