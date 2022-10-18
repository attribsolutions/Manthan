import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import {
    Button,
    Col,
    Modal,
    Row,
} from "reactstrap";
import {
    deleteCompany_ID,
    editCompanyID,
    fetchCompanyList,
    updateCompanyIDSuccess,
    deleteCompanyIDSuccess,
    PostCompanySubmitSuccess,
} from "../../../store/Administrator/CompanyRedux/actions";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//redux
import { useSelector, useDispatch } from "react-redux";
import CompanyModule from "./CompanyModule";
import "../../../assets/scss/CustomTable2/datatables.scss"
import { AlertState } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { listPageCommonButtonFunction } from "../../../components/Common/CmponentRelatedCommonFile/listPageCommonButtons";

const CompanyList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [modal_center, setmodal_center] = useState(false);

    // get Access redux data
    const { TableListData, editData, updateMessage, deleteCompanyID, RoleAccessModifiedinSingleArray, PostAPIResponse } = useSelector((state) => ({
        TableListData: state.Company.companyList,
        PostAPIResponse: state.Company.companySubmitSuccesss,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
        editData: state.Company.editData,
        updateMessage: state.Company.updateMessage,
        deleteCompanyID: state.Company.deleteCompanyID,
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

    // tag_center -- Control the Edit Modal show and close
    function tog_center() {
        setmodal_center(!modal_center)
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(fetchCompanyList());
    }, []);

    // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal 
    useEffect(() => {
        if ((updateMessage.Status === true) && (updateMessage.StatusCode === 200)) {
            dispatch(updateCompanyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1, Status: true,
                Message: updateMessage.Message,
                AfterResponseAction: fetchCompanyList,
            }))
            tog_center()
        }
        else if (updateMessage.Status === true) {
            dispatch(updateCompanyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: JSON.stringify(updateMessage.Message),
            }));
        }
    }, [updateMessage]);

    useEffect(() => {
        if ((deleteCompanyID.Status === true) && (deleteCompanyID.StatusCode === 200)) {
            dispatch(deleteCompanyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1, Status: true,
                Message: deleteCompanyID.Message,
                AfterResponseAction: fetchCompanyList,
            }))
        } else if (deleteCompanyID.Status === true) {
            dispatch(deleteCompanyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3,
                Status: true,
                Message: JSON.stringify(deleteCompanyID.Message),
            }));
        }
    }, [deleteCompanyID.Status])


    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            dispatch(PostCompanySubmitSuccess({ Status: false }))
            tog_center();
            dispatch(fetchCompanyList());
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: PostAPIResponse.Message,
            }))
        }

        else if ((PostAPIResponse.Status === true)) {
            dispatch(PostCompanySubmitSuccess({ Status: false }))
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


    const pageOptions = {
        sizePerPage: 10,
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
            text: "Address",
            dataField: "Address",
            sort: true,
        },
        {
            text: "GSTIN",
            dataField: "GSTIN",
            sort: true,
        },
        {
            text: "Phone No",
            dataField: "PhoneNo",
            sort: true,
        },
        {
            text: "Company Abbreviation",
            dataField: "CompanyAbbreviation",
            sort: true,
        },
        {
            text: "Email",
            dataField: "EmailID",
            sort: true,
        },
        // For Edit, Delete ,and View Button Common Code function
        listPageCommonButtonFunction({
            dispatchHook: dispatch,
            ButtonMsgLable: "Company",
            deleteName: "Name",
            userPageAccessState: userPageAccessState,
            editActionFun: editCompanyID,
            deleteActionFun: deleteCompany_ID
        })


    ];

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Company List| FoodERP-React FrontEnd</title>
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
                                            breadcrumbCount={`Company Count: ${TableListData.length}`}
                                            RedirctPath={"/UserMaster"}
                                            isExcelButtonVisible={true}
                                            ExcelData={TableListData}
                                        />
                                        <Row>
                                            <Col xl="12">
                                                <div className="table-responsive">
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        responsive
                                                        bordered={false}
                                                        striped={false}
                                                        defaultSorted={defaultSorted}
                                                        classes={"table  table-bordered"}
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
                </div >
                <Modal
                    isOpen={modal_center}
                    toggle={() => { tog_center() }}
                    size="xl"
                >
                    <CompanyModule state={editData.Data} relatatedPage={"/CompanyMaster"} pageMode={editData.pageMode} />
                </Modal>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }

}

export default CompanyList;




