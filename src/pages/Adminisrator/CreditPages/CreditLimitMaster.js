import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    loginPartyID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import * as pageId from "../../../routes//allPageID";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import React, { useEffect, useState } from "react";
import { GetRoutesList } from "../../../store/Administrator/RoutesRedux/actions";
import {
    GoButton_For_CreditLimit_Add,
    GoButton_For_CreditLimit_AddSuccess,
    postCreditLimit,
    postCreditLimitSuccess
} from "../../../store/Administrator/CreditLimitRedux/actions";
import * as _cfunc from "../../../components/Common/CommonFunction";


const CreditLimitMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [RouteSelect, setRouteSelect] = useState([]);

    const fileds = {
        id: "",
        RoutesName: ""
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        RoutesList,
        Data,
        saveBtnloading,
        listBtnLoading,
    } = useSelector((state) => ({
        listBtnLoading: state.CreditLimitReducer.listBtnLoading,
        saveBtnloading: state.CreditLimitReducer.saveBtnloading,
        postMsg: state.CreditLimitReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Routes: state.CreditLimitReducer.Routes,
        Data: state.CreditLimitReducer.goButtonCreditLimit,
        RoutesList: state.RoutesReducer.RoutesList,
    }));

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        dispatch(GoButton_For_CreditLimit_AddSuccess([]))
        const page_Id = pageId.CREDITLIMIT
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(GetRoutesList());
    }, []);

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
            setUserAccState(userAcc)
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            dispatch(postCreditLimitSuccess({ Status: false }))
            dispatch(GoButton_For_CreditLimit_AddSuccess([]))
            setRouteSelect('')
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === mode.dropdownAdd) {
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
                    RedirectPath: url.CREDITLIMIT,

                }))
            }
        }
        else if ((postMsg.Status === true) && !(pageMode === "dropdownAdd")) {
            dispatch(postCreditLimitSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg.Status])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`${" Credit Limit Count"} :${Data.length}`))
    }, [Data])

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [Data]);

    const RoutesDropdown_options = RoutesList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const goButtonHandler = (event) => {

        if (RouteSelect.value === undefined) {
            {
                dispatch(
                    AlertState({
                        Type: 4,
                        Status: true,
                        Message: "Please Select Route",
                    })
                );
                return;
            }
        }
        const jsonBody = JSON.stringify({
            Party: loginPartyID(),
            Route: RouteSelect.value
        });
        dispatch(GoButton_For_CreditLimit_Add(jsonBody));
    }

    function CreditlimitHandler(event, user) {

        let val = event.target.value;
        const result = /^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/.test(val);
        if ((result) && (parseFloat(event.target.value).toFixed(3))) {
            user.Creditlimit = event.target.value;
        }
        else if (val === "") {
            user.Creditlimit = event.target.value;
        }
        else {
            event.target.value = user.Creditlimit
        }
    }

    const pagesListColumns = [
        {
            text: "SubPartyName",
            dataField: "SubPartyName",
        },
        {
            text: "Creditlimit",
            dataField: "Creditlimit",
            formatter: (cellContent, user) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    id=""
                                    type="text"
                                    defaultValue={user.Creditlimit}
                                    className="col col-sm text-center"
                                    onChange={(e) => CreditlimitHandler(e, user)}
                                />
                            </FormGroup>
                        </Col>
                    </div>

                </>
            ),
        },
    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: Data.length,
        custom: true,
    };

    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })
                const data = Data.map((index) => ({
                    id: index.id,
                    Party: index.Party,
                    SubParty: index.SubParty,
                    Creditlimit: index.Creditlimit,
                }))

                const Find = data.filter((index) => {
                    return !(index.Creditlimit === '')
                })
                const jsonBody = JSON.stringify({
                    Data: Find
                })
                dispatch(postCreditLimit({ jsonBody, btnId }));

            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginTop: IsEditMode_Css, height: "18cm" }}>
                    <Container fluid>
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
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
                                                        <Row>
                                                            <Col md="4" >
                                                                <FormGroup className=" row  mt-2" >
                                                                    <Label className="mt-1"
                                                                        style={{ width: "150px" }}>Routes </Label>
                                                                    <div className="col col-6 sm-1">
                                                                        <Select
                                                                            name="RoutesName"
                                                                            value={RouteSelect}
                                                                            isSearchable={true}
                                                                            // isDisabled={(Data.length > 0) ? true : false}
                                                                            className="react-dropdown"
                                                                            classNamePrefix="dropdown"
                                                                            options={RoutesDropdown_options}
                                                                            onChange={(e) => { setRouteSelect(e) }}
                                                                        />
                                                                        {/* {isError.RoutesName.length > 0 && (
                                                                            <span className="text-danger f-8"><small>{isError.RoutesName}</small></span>
                                                                        )} */}
                                                                    </div>
                                                                </FormGroup>
                                                            </Col>


                                                            <Col sm={1}>
                                                                <div className="col col-1 mt-2">
                                                                    < Go_Button onClick={(e) => goButtonHandler()} loading={listBtnLoading} />

                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <PaginationProvider
                                        pagination={paginationFactory(pageOptions)}
                                    >
                                        {({ paginationProps, paginationTableProps }) => (
                                            <ToolkitProvider
                                                keyField="id"
                                                data={Data}
                                                columns={pagesListColumns}
                                                search
                                            >
                                                {toolkitProps => (
                                                    <React.Fragment>
                                                        <div className="table">
                                                            <BootstrapTable
                                                                keyField={"id"}
                                                                id="table_Arrow"
                                                                bordered={true}
                                                                striped={false}
                                                                noDataIndication={<div className="text-danger text-center ">Creditlimit Not available</div>}
                                                                classes={"table align-middle table-nowrap table-hover"}
                                                                headerWrapperClasses={"thead-light"}

                                                                {...toolkitProps.baseProps}
                                                                {...paginationTableProps}
                                                            />
                                                            {countlabelFunc(toolkitProps, paginationProps, dispatch, "MRP")}
                                                            {mySearchProps(toolkitProps.searchProps)}
                                                        </div>

                                                        <Row className="align-items-md-center mt-30">
                                                            <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                                <PaginationListStandalone
                                                                    {...paginationProps}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </React.Fragment>
                                                )
                                                }
                                            </ToolkitProvider>
                                        )
                                        }

                                    </PaginationProvider>

                                    {Data.length > 0 ? <FormGroup style={{ marginTop: "-25px" }}>
                                        <Row >
                                            <Col sm={2} className="mt-n4">
                                                <SaveButton
                                                    loading={saveBtnloading}
                                                    pageMode={pageMode}
                                                    onClick={SaveHandler}
                                                    userAcc={userPageAccessState}
                                                    module={"CreditLimitMaster"}
                                                />
                                            </Col>
                                        </Row>
                                    </FormGroup >
                                        : null
                                    }
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

export default CreditLimitMaster

