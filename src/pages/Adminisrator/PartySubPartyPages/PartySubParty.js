import React, { useEffect, useMemo, useState } from "react";
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
    Table,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import {
    editPartySubPartySuccess,
    savePartySubParty,
    savePartySubPartySuccess,
    updatePartySubParty,
    updatePartySubPartySuccess,
    getPartySubParty_For_party_dropdown,
} from "../../../store/Administrator/PartySubPartyRedux/action";
import {
    BreadcrumbShowCountlabel,
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess
} from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
} from "../../../components/Common/validationFunction";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    loginCompanyID,
    loginUserID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { Retailer_List, SSDD_List_under_Company, } from "../../../store/CommonAPI/SupplierRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { Tbody, Thead } from "react-super-responsive-table";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { mobileApp_RetailerUpdate_Api, mobileApp_Send_Retailer_Api } from "../../../helpers/backend_helper";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";

const PartySubParty = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        id: "",
        PartyName: "",
        Subparty: "",
        IsRetailerTransfer: false,
        SSDD: "",
        Retailer: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [partyTableArr, setPartyTableArr] = useState([]);
    const [userPageAccessState, setUserPageAccessState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [TableRow, setTableRow] = useState([]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        SSDD_List,
        RetailerList,
        updateMsg,
        pageField,
        PartySubParty,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.PartySubPartyReducer.saveBtnloading,
            postMsg: state.PartySubPartyReducer.postMsg,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            updateMsg: state.PartySubPartyReducer.updateMsg,
            pageField: state.CommonPageFieldReducer.pageField,
            userAccess: state.Login.RoleAccessUpdateData,
            PartySubParty: state.PartySubPartyReducer.PartySubParty,
        }));

    useEffect(() => {
        const page_Id = pageId.PARTY_SUB_PARTY
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(SSDD_List_under_Company());

    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
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
                const { id, Party, Division } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Party.valid = true;
                hasValid.Division.valid = true;

                values.id = id
                values.Party = { label: Party, value: Party };
                values.Division = { label: Division, value: Division };

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Party))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editPartySubPartySuccess({ Status: false }))
        }
    }, [])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(savePartySubPartySuccess({ Status: false }))
            dispatch(Breadcrumb_inputName(''))
            if (pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let isPermission = await customAlert({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                })
                if (isPermission) {
                    history.push({ pathname: url.PARTY_SUB_PARTY_lIST })
                }
            }
        }
        else if ((postMsg.Status === true)) {
            dispatch(savePartySubPartySuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            history.push({
                pathname: url.PARTY_SUB_PARTY_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updatePartySubPartySuccess({ Status: false }));
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

    useEffect(() => {

        if (values.PartyName.value > 0) {
            const newArr = (PartySubParty.map(i => ({
                value: i.SubParty,
                label: i.SubPartyName,
                IsVendor: i.IsVendor,
                Creditlimit: i.Creditlimit,
                Route: i.Route
            })))
            setPartyTableArr(newArr)
        }

    }, [PartySubParty]);

    const PartyDropdown_Options = SSDD_List.map(i => ({
        value: i.id,
        label: i.Name
    }));

    const RetailerDropdown_Options = RetailerList.map(i => ({
        value: i.id,
        label: i.Name,
        Creditlimit: null,
        Route: null
    }));

    function handllerParty(e) {
        dispatch(getPartySubParty_For_party_dropdown(e.value));
        setState((i) => {
            const a = { ...i }
            a.PartyName = e
            a.values.Subparty = '';
            a.values.SSDD = '';
            a.hasValid.Subparty.valid = true
            a.hasValid.SSDD.valid = true
            return a
        })
    }

    function IsRetailerTransfer(e) {
        setState((i) => {
            const a = { ...i }
            a.values.IsRetailerTransfer = e.target.checked;
            a.values.Subparty = '';
            a.hasValid.Subparty.valid = true
            a.hasValid.IsRetailerTransfer.valid = true
            return a
        })
        if (values.IsRetailerTransfer) {
            setState((i) => {
                const a = { ...i }
                a.values.Subparty = '';
                a.values.SSDD = '';
                a.hasValid.Subparty.valid = true
                a.hasValid.SSDD.valid = true
                return a
            })
        }
    }

    function handllerSub_Party(e) {
        setState((i) => {
            const a = { ...i }
            a.values.Subparty = e;
            a.hasValid.Subparty.valid = true
            return a
        })
    }

    function handller_SSDD(e) {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: e.value,
            CompanyID: loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }

    // Role Table Validation
    function AddPartyHandler() {

        const find = partyTableArr.find((element) => {
            return element.value === values.Subparty.value
        });

        if (values.PartyName === '') {
            customAlert({
                Type: 3,
                Message: alertMessages.selectParty,
            })
        }
        else if ((values.Subparty === '')) {
            const msg = (values.IsRetailerTransfer) ? "Select Retailer" : "Select Sub-Party"
            customAlert({
                Type: 3,
                Message: msg,
            })
        }
        else if (find === undefined) {
            values.Subparty["isNewAdded"] = true
            setPartyTableArr([...partyTableArr, values.Subparty]);

            setState((i) => {
                const a = { ...i }
                a.values.Subparty = '';
                a.hasValid.Subparty.valid = true
                return a
            })
        }
        else {
            customAlert({
                Type: 3,
                Message: alertMessages.partyAlreadyExist,
            })
        }
    }

    const onDeleteHandeler = (id) => {
        var filerData = partyTableArr.filter((index) => {
            return !(index.value === id);
        });
        setPartyTableArr(filerData)
    };

    globalTableSearchProps({
        onSearch: (text) => {
            setSearchQuery(text);
        },
    });

    const filterdItemWise_tableData = useMemo(() => {

        return partyTableArr.filter((item) => {
            return (
                item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(item.value).toLowerCase().includes(searchQuery.toLowerCase())
            );
        })
    }, [searchQuery, partyTableArr]);

    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`Count:${filterdItemWise_tableData.length}`))
        const tableRows = filterdItemWise_tableData.map((info) => {
            return (
                <tr>
                    <td>{info.label}</td>
                    <td>
                        <Button
                            className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                            data-mdb-toggle="tooltip"
                            data-mdb-placement="top"
                            title="Delete Party Type"
                            onClick={(e) => {
                                onDeleteHandeler(info.value);
                            }}
                        >
                            <i className="mdi mdi-delete font-size-18"></i>
                        </Button>
                    </td>
                </tr>
            );
        });
        setTableRow(tableRows)
    }, [filterdItemWise_tableData])

    async function mobileRetailerApiCall(partySaveArray) {
        debugger
        const subPartyIds = partySaveArray.reduce((acc, item) => {
            if (!acc.includes(item.SubParty) ) {
                acc.push(item.SubParty);
            }
            return acc;
        }, []).join(',');
        debugger
        // Create the desired object
        const jsonBody = JSON.stringify({ "RetailerID": subPartyIds, });

        try {
            const mobilApiResp = await mobileApp_RetailerUpdate_Api({ jsonBody });

            if (mobilApiResp.StatusCode === 200) {
                customAlert({ Type: 1, Status: true, Message: mobilApiResp.Message });
            }
            else {
                customAlert({ Type: 4, Status: true, Message: mobilApiResp.Message });
            }
        } catch (e) { }
    };

    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id;

        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })
                const arr = partyTableArr.map(i => {

                    const normal = {
                        Party: values.PartyName.value,
                        SubParty: i.value,
                        PartyID: values.PartyName.value,
                        isNewAdded: i.isNewAdded ? true : false

                    }
                    const isvendor = {
                        Party: i.value,
                        SubParty: values.PartyName.value,
                        PartyID: values.PartyName.value,

                    }

                    const ramain = {
                        CreatedBy: loginUserID(),
                        UpdatedBy: loginUserID(),
                        Creditlimit: i.Creditlimit,
                        Route: i.Route
                    }

                    if (i.IsVendor === true) {
                        return { ...isvendor, ...ramain }
                    }
                    else {
                        return { ...normal, ...ramain }
                    }
                })

                const jsonBody = JSON.stringify(arr);

                // ************* mobile Retailer Send API Call when IsRetailerTransfer flag true ************//
                if (values.IsRetailerTransfer) {

                    mobileRetailerApiCall(arr)
                }

                if (pageMode === mode.edit) {
                    dispatch(updatePartySubParty({ jsonBody, updateId: values.id, btnId }));
                }
                else {

                    dispatch(savePartySubParty({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === mode.edit) || (pageMode === mode.copy) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" >
                    <Container fluid>
                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form onSubmit={SaveHandler} noValidate>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody className="c_card_body">
                                                    <Row className="mb-3">
                                                        <Col sm="4">
                                                            <FormGroup className="mb-1">
                                                                <Label htmlFor="validationCustom01">{fieldLabel.PartyName} </Label>
                                                                <Col sm={12}>
                                                                    <Select
                                                                        name="PartyName"
                                                                        value={values.PartyName}
                                                                        isSearchable={true}
                                                                        autoFocus={true}
                                                                        className="react-dropdown"
                                                                        classNamePrefix="dropdown"
                                                                        options={PartyDropdown_Options}
                                                                        onChange={(hasSelect, evn) => {
                                                                            onChangeSelect({ hasSelect, evn, state, setState, })
                                                                            handllerParty(hasSelect)
                                                                        }}
                                                                        styles={{
                                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                                        }}
                                                                    />
                                                                    {isError.PartyName.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.PartyName}</small></span>
                                                                    )}
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={1}></Col>
                                                        <FormGroup className="mt-4 col col-sm-5">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input"
                                                                    className="col-sm-5 col-form-label">{fieldLabel.IsRetailerTransfer}</Label>
                                                                <Col md={2} style={{ marginTop: '9px' }} >
                                                                    <div className="form-check form-switch form-switch-md ">
                                                                        <Input type="checkbox" className="form-check-input"
                                                                            checked={values.IsRetailerTransfer}
                                                                            name="IsRetailerTransfer"
                                                                            onChange={(e) => {
                                                                                IsRetailerTransfer(e)
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    </Row>

                                                    {(values.IsRetailerTransfer) ?
                                                        <Row className="mb-3">
                                                            <Col sm="4" >
                                                                <FormGroup>
                                                                    <Label htmlFor="validationCustom01"> {fieldLabel.SSDD}</Label>
                                                                    <Select
                                                                        name="SSDD"
                                                                        value={values.SSDD}
                                                                        isSearchable={true}
                                                                        className="react-dropdown"
                                                                        classNamePrefix="dropdown"
                                                                        options={PartyDropdown_Options}
                                                                        onChange={(hasSelect, evn) => {
                                                                            onChangeSelect({ hasSelect, evn, state, setState, })
                                                                            handller_SSDD(hasSelect)
                                                                        }}
                                                                        styles={{
                                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                                        }}
                                                                    />

                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        : null}

                                                    <Row className="">
                                                        <Col sm="4">
                                                            <FormGroup>
                                                                <Label >{(values.IsRetailerTransfer) ? fieldLabel.Retailer : fieldLabel.Subparty}</Label>
                                                                <Select
                                                                    name="Subparty"
                                                                    value={values.Subparty}
                                                                    isSearchable={true}
                                                                    className="react-dropdown"
                                                                    classNamePrefix="dropdown"
                                                                    options={(values.IsRetailerTransfer) ? RetailerDropdown_Options : PartyDropdown_Options}
                                                                    onChange={(hasSelect, evn) => {
                                                                        onChangeSelect({ hasSelect, evn, state, setState, })
                                                                        handllerSub_Party(hasSelect)
                                                                    }}
                                                                    styles={{
                                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                                    }}
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col sm={2} style={{ marginTop: '16px' }} >
                                                            <Button
                                                                type="button"
                                                                className=" button_add"
                                                                color="btn btn-outline-primary border-2 font-size-12"
                                                                onClick={() =>
                                                                    AddPartyHandler()
                                                                }
                                                            >
                                                                <i className="dripicons-plus"></i>
                                                            </Button>
                                                        </Col>
                                                    </Row>

                                                </CardBody>
                                            </Card>

                                            <Table className="table table-bordered table-hover">
                                                <Thead>
                                                    <tr>
                                                        <th className="col col-sm-3">SubPartyName</th>
                                                        <th className="col col-sm-3">{"Action"}</th>
                                                    </tr>
                                                </Thead>
                                                <Tbody>{TableRow}</Tbody>
                                            </Table>

                                            {TableRow.length > 0 &&
                                                < SaveButtonDraggable >
                                                    <SaveButton pageMode={pageMode}
                                                        loading={saveBtnloading}
                                                        onClick={SaveHandler}
                                                        userAcc={userPageAccessState}
                                                        editCreatedBy={editCreatedBy}
                                                        module={"PartySubParty"}
                                                    />
                                                </SaveButtonDraggable>
                                            }
                                        </Col>
                                    </Row>
                                </form>
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

export default PartySubParty

