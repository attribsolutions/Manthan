import React, { useEffect, useState, } from "react";
import {
    Col,
    Container,
    FormGroup,
    Row,
} from "reactstrap";

import { MetaTags } from "react-meta-tags";
import { AlertState, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { BreadcrumbShowCountlabel, Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, btnIsDissablefunc, metaTagLabel, } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { Post_RouteUpdate, Post_RouteUpdateSuccess, RouteUpdateListAPI } from "../../../store/Administrator/RouteUpdateRedux/action";
import { GetRoutesList } from "../../../store/Administrator/RoutesRedux/actions";
<<<<<<< Updated upstream
import * as commonFunc from "../../../components/Common/CommonFunction";
import { selectAllCheck } from "../../../components/Common/TableCommonFunc";
=======
import * as _cfunc from "../../../components/Common/CommonFunction";
>>>>>>> Stashed changes

const RouteUpdate = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        IsActive: false
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(123);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        RouteUpdateList,
        pageField,
        RoutesList,
        userAccess } = useSelector((state) => ({
            postMsg: state.RouteUpdateReducer.postMsg,
            RouteUpdateList: state.RouteUpdateReducer.RouteUpdateList,
            RoutesList: state.RoutesReducer.RoutesList,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));
    const { Data = [] } = RouteUpdateList

    useEffect(() => {
        const page_Id = pageId.ROUTE_UPDATE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(GetRoutesList())
        dispatch(RouteUpdateListAPI())
    }, []);

    const location = { ...history.location }
    // const hasShowloction = location.hasOwnProperty(mode.editValue)
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
            setUserAccState(userAcc)
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(Post_RouteUpdateSuccess({ Status: false }))
            dispatch(Breadcrumb_inputName(''))
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
                    RedirectPath: url.ROUTE_UPDATE,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(Post_RouteUpdateSuccess({ Status: false }))
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
        dispatch(BreadcrumbShowCountlabel(`${"Route Update Count"}:${Data.length}`))
    }, [RouteUpdateList])

    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [Data]);

    const RoutesListOptions = RoutesList.map((index) => ({
        value: index.id,
        label: index.Name,
        IsActive: index.IsActive
    }));

    const RouteName_Options = RoutesListOptions.filter((index) => {
        return index.IsActive === true
    });

    const pagesListColumns = [
        {
            text: "Party Name",
            dataField: "SubPartyName",
        },
        {
            text: "RouteName",
            dataField: "Route Name",

            formatter: (value, row, key) => {

                return (
                    <Select
                        classNamePrefix="select2-selection"
                        defaultValue={!(row.Route > 0) ? { value: "", label: " select... " } : {
                            value: row.Route, label: row.RouteName
                        }}
                        options={RouteName_Options}
                        onChange={e => {
                            row["Route"] = e.value;
                            row["RouteName"] = e.label
                        }}
                    >
                    </Select >
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '300px', textAlign: 'center' };
            }
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
                    Route: index.Route,
                }))
                const jsonBody = JSON.stringify({
                    Data: data
                })

                dispatch(Post_RouteUpdate({ jsonBody, btnId }));

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

                <div className="page-content" style={{ marginTop: IsEditMode_Css, marginBottom: "200px" }}>
                    {/* <Container fluid> */}

                    <form noValidate>
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
                                                    noDataIndication={<div className="text-danger text-center ">Party Not available</div>}
                                                    classes={"table align-middle table-nowrap table-hover"}
                                                    headerWrapperClasses={"thead-light"}

                                                    {...toolkitProps.baseProps}
                                                    {...paginationTableProps}
                                                />
                                                {/* {countlabelFunc(toolkitProps, paginationProps, dispatch, "Route Update")} */}
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

                        {Data.length > 0 ?
                            <FormGroup style={{ marginTop: "-25px" }}>
                                <Row >
                                    <Col sm={2} className="mt-n4">
                                        <SaveButton pageMode={pageMode}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                            module={"RouteUpdate"}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup >
                            : null
                        }

                    </form>
                    {/* </Container> */}
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

export default RouteUpdate

