import React, { useEffect, useState } from 'react'
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Button, Col, Modal, Row } from "reactstrap";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import { AlertState } from "../../../store/actions";

import "../../../assets/scss/CustomeTable/datatables.scss"
import {
    deletePartyID,
    deletePartyIDSuccess,
    editPartyID,
    getPartyListAPI,
    postPartyDataSuccess,
    updatePartyIDSuccess
} from '../../../store/Administrator/PartyRedux/action';
import PartyMaster from './PartyMaster';
import { MetaTags } from "react-meta-tags";
import { CommonGetRoleAccessFunction } from '../../../components/Common/CommonGetRoleAccessFunction';
import { useHistory } from 'react-router-dom';
import { listPageCommonButtonFunction } from '../../../components/Common/CmponentRelatedCommonFile/listPageCommonButtons';

const PartyList = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [modal_center, setmodal_center] = useState(false);

    // get Access redux data
    const { TableListData, editData, updateMessage, deleteMessage ,RoleAccessModifiedinSingleArray,PostAPIResponse} = useSelector((state) => ({
        TableListData: state.PartyMasterReducer.partyList,
        editData: state.PartyMasterReducer.editData,
        updateMessage: state.PartyMasterReducer.updateMessage,
        deleteMessage: state.PartyMasterReducer.deleteMessage,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
        PostAPIResponse: state.PartyMasterReducer.PartySaveSuccess,
    }));

    useEffect(() => {
        const locationPath = history.location.pathname
        let userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [RoleAccessModifiedinSingleArray])

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(getPartyListAPI());
    }, []);

    // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal 
    useEffect(() => {
        if ((updateMessage.Status === true) && (updateMessage.StatusCode === 200)) {
            dispatch(updatePartyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1, Status: true,
                Message: updateMessage.Message,
                AfterResponseAction: getPartyListAPI,
            }))
            tog_center()
        }
        else if (updateMessage.Status === true) {
            dispatch(updatePartyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: JSON.stringify(updateMessage.Message),
            }));
        }
    }, [updateMessage.Status, dispatch]);

    useEffect(() => {
        if ((deleteMessage.Status === true) && (deleteMessage.StatusCode === 200)) {
            dispatch(deletePartyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1, Status: true,
                Message: deleteMessage.Message,
                AfterResponseAction: getPartyListAPI,
            }))
        } else if (deleteMessage.Status === true) {
            dispatch(deletePartyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3,
                Status: true,
                Message: deleteMessage.Message,
            }));
        }
    }, [deleteMessage.Status])


    
  useEffect(() => {

    if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
        dispatch(postPartyDataSuccess({ Status: false }))
        tog_center();
        dispatch(getPartyListAPI());
        dispatch(AlertState({
            Type: 1,
            Status: true,
            Message: PostAPIResponse.Message,
        }))
    }

    else if ((PostAPIResponse.Status === true)) {
        dispatch(postPartyDataSuccess({ Status: false }))
        dispatch(AlertState({
            Type: 4,
            Status: true,
            Message: JSON.stringify(PostAPIResponse.Message),
            RedirectPath: false,
            AfterResponseAction: false
        }));
    }
}, [PostAPIResponse.Status])
    // Edit Modal Show When Edit Data is true
    useEffect(() => {
        if (editData.Status === true) {
            tog_center()
        }
    }, [editData]);

    function tog_center() {
        setmodal_center(!modal_center)
    }

    const pageOptions = {
        sizePerPage: 20,
        totalSize: TableListData.length, // replace later with size(users),
        custom: true,
    };
    const defaultSorted = [
        {
            dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];
    const pagesListColumns = [
        {
            text: "Name",
            dataField: "Name",
            sort: true,
        },
        {
            text: "PriceList",
            dataField: "PriceListName",
            sort: true,
        },
        {
            text: "PartyType",
            dataField: "PartyTypeName",
            sort: true,
        },
        {
            text: "Party Address",
            dataField: "PartyAddress",
            sort: true,
        },
            // For Edit, Delete ,and View Button Common Code function
            listPageCommonButtonFunction({
                dispatchHook: dispatch,
                ButtonMsgLable: "Party",
                deleteName:"Name",
                userPageAccessState: userPageAccessState,
                editActionFun: editPartyID,
                deleteActionFun: deletePartyID
            })
    ];

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Party List| FoodERP-React FrontEnd</title>
                    </MetaTags>

                    <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                    >
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                data={TableListData}
                                columns={pagesListColumns}
                                search
                            >
                                {toolkitProps => (
                                    <React.Fragment>
                                        <Breadcrumbs
                                            title={"Count :"}
                                            breadcrumbItem={userPageAccessState.PageHeading}
                                            IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                                            SearchProps={toolkitProps.searchProps}
                                            IsSearchVissible={true}
                                            defaultSorted={defaultSorted}
                                            breadcrumbCount={`Party Count: ${TableListData.length}`}
                                            isExcelButtonVisible={true}
                                            ExcelData={TableListData}
                                            RedirctPath={"/PartyMaster"}
                                        />
                                        <Row>
                                            <Col xl="12">
                                                <div className="table-responsive">
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        responsive
                                                        bordered={false}
                                                        striped={false}
                                                        classes={
                                                            "table  table-bordered"
                                                        }
                                                        {...toolkitProps.baseProps}
                                                        {...paginationTableProps}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
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
                    <Modal
                        isOpen={modal_center}
                        toggle={() => { tog_center() }}
                        size="xl"
                    >
                        <PartyMaster state={editData.Data} relatatedPage={"/PartyMaster"} pageMode={editData.pageMode}/>
                    </Modal>
                </div>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }

}

export default PartyList;