import React, { useEffect, useState, } from "react";
import {
    Col,
    Row,
} from "reactstrap";

import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { BreadcrumbShowCountlabel, Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { useDispatch, useSelector } from "react-redux";
import {
    comAddPageFieldFunc,

    initialFiledFunc,
} from "../../../components/Common/validationFunction";
import { PageLoadingSpinner, SaveButton } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, btnIsDissablefunc, metaTagLabel, } from "../../../components/Common/CommonFunction";
import { mode, pageId } from "../../../routes/index"
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { Post_RouteUpdate, Post_RouteUpdateSuccess, RouteUpdateListAPI, RouteUpdateListSuccess } from "../../../store/Administrator/RouteUpdateRedux/action";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { C_Select } from "../../../CustomValidateForm";
import { GetRoutesList } from "../../../store/Administrator/RoutesRedux/actions";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";

const RouteUpdate = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        IsActive: false
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss] = useState(false);
    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [forceRefresh, setForceRefresh] = useState(false);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        loading,
        RouteUpdateList,
        pageField,
        RoutesList,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            loading: state.RouteUpdateReducer.loading,
            saveBtnloading: state.RouteUpdateReducer.saveBtnloading,
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
        return () => {
            dispatch(RouteUpdateListSuccess([]))
        }
    }, []);

    const location = { ...history.location }
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

            if (pageMode === "other") {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
        }
        else if (postMsg.Status === true) {
            dispatch(Post_RouteUpdateSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`${"Count"}:${Data.length}`))
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

    const RouteName_Options = [...RoutesListOptions.filter((index) => index.IsActive === true)];

    RouteName_Options.unshift({
        value: null,
        label: "Select...",
    })

    const pagesListColumns = [
        {
            text: "Party Name",
            dataField: "SubPartyName",
        },
        {
            text: "RouteName",
            dataField: "Route Name",
            style: () => ({ width: "30%" }),
            formatExtraData: { forceRefresh },
            formatter: (value, row, key, { forceRefresh }) => {

                return (
                    <C_Select
                        value={!(row.Route > 0) ? "" : {
                            value: row.Route, label: row.RouteName
                        }}
                        options={RouteName_Options}
                        onChange={e => {
                            row["Route"] = e.value;
                            row["RouteName"] = e.label
                            setForceRefresh(!forceRefresh)
                        }}
                    // onCancelClick={() => {
                    //     row["Route"] = null;
                    //     row["RouteName"] = ''
                    //     setForceRefresh(!forceRefresh)
                    // }}
                    >
                    </C_Select >
                )
            },
        }
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

            const data = Data.map((index) => ({
                id: index.id,
                Party: index.Party,
                SubPartyName: index.SubPartyName,
                SubParty: index.SubParty,
                Route: index.Route,
                RouteName: index.RouteName,
            }))
            const jsonBody = JSON.stringify({
                Data: data
            })
            dispatch(Post_RouteUpdate({ jsonBody, btnId }));

        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <PageLoadingSpinner isLoading={(loading || !pageField)} />
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>

                    <div style={{ minHeight: "45vh" }}>
                        <PaginationProvider pagination={paginationFactory(pageOptions)} >
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                    keyField="id"
                                    data={Data}
                                    columns={pagesListColumns}
                                    search
                                >
                                    {toolkitProps => (
                                        <React.Fragment>
                                            <div className="table-responsive table">
                                                <BootstrapTable
                                                    keyField="id"
                                                    id="table_Arrow"
                                                    classes={"table  table-bordered table-hover"}
                                                    noDataIndication={
                                                        <div className="text-danger text-center ">
                                                            Party Not available
                                                        </div>
                                                    }
                                                    onDataSizeChange={(e) => {
                                                        _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                                    }}
                                                    {...toolkitProps.baseProps}
                                                    {...paginationTableProps}
                                                />
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
                                    )}
                                </ToolkitProvider>
                            )}
                        </PaginationProvider>
                    </div>

                    {Data.length > 0 &&
                       <SaveButtonDraggable>
                            <SaveButton pageMode={pageMode}
                                loading={saveBtnloading}
                                onClick={SaveHandler}
                                userAcc={userPageAccessState}
                                module={"RouteUpdate"}
                            />
                        </SaveButtonDraggable>
                    }

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

