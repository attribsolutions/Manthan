import React, { useEffect, useRef, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationListStandalone, PaginationProvider } from 'react-bootstrap-table2-paginator'
import ToolkitProvider from 'react-bootstrap-table2-toolkit'
import { MetaTags } from 'react-meta-tags';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Modal, Row } from 'reactstrap';
import { deleteHpagesUsingID, editHPagesID, GetHpageListData, updateHPagesSuccess } from '../../../store/Administrator/HPagesRedux/actions';
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import HPageMaster from './HPageMaster';
import { AlertState } from '../../../store/Utilites/CostumeAlert/actions';

export default function HPageList() {

    const dispatch = useDispatch();
    const [modal_center, setmodal_center] = useState(false);

    // var HPageListData = [];
    const { HPageListData, editData, updateMessage } = useSelector((state) => ({
        HPageListData: state.H_Pages.HPagesListData,
        editData: state.H_Pages.editData,
        updateMessage: state.H_Pages.updateMessage,
    }));
    console.log("editData", editData)
    useEffect(() => {
        dispatch(dispatch(GetHpageListData()))
    }, []);

    useEffect(() => {
        if (editData.Status === true) {
            setmodal_center(true)
        };

    }, [editData]);

    useEffect(() => {
        if (updateMessage.Status === true) {
            setmodal_center(false)
            dispatch(updateHPagesSuccess({ Status: false }))
        }
    }, [updateMessage]);


    function tog_center() {
        setmodal_center(false)
        dispatch(updateHPagesSuccess({ Status: false }))
    }
    const EditPageHandler = (id) => {
        dispatch(editHPagesID(id));
    }

    const deleteHandeler = (id, name) => {
        dispatch(AlertState({
            Type: 5, Status: true,
            Message: `Are you sure you want to delete this item : "${name}"`,
            RedirectPath: false,
            PermissionAction: deleteHpagesUsingID,
            ID: id
        }));
    }
    const pageOptions = {
        sizePerPage: 15,
        totalSize: HPageListData.length, // replace later with size(users),
        custom: true,
    };

    const defaultSorted = [
        {
            dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    let myInlineStyle = {
        marginTop: '-10px'
    }

    const HPageListColoumns = [
        {
            text: "Name",
            dataField: "Name",
            sort: true,
        },
        {
            text: "Description",
            dataField: "Description",
            sort: true,
        },
        {
            text: "Module Name",
            dataField: "ModuleName",
            sort: true,
        },
        // {
        //     text: "Sub ModuleID",
        //     dataField: "SubModuleID",
        //     sort: true,
        // },
        {
            text: "DisplayIndex",
            dataField: "DisplayIndex",
            sort: true,
        },
        {
            text: "Icon",
            dataField: "Icon",
            sort: true,
        },
        {
            text: "Actual Page Path",
            dataField: "ActualPagePath",
            sort: true,
        },
        {
            text: "Is Active",
            dataField: "IsActive",
            sort: true,
        },
        {
            text: "Action",
            dataField: "pdf",
            formatter: (cellContent, module) => (
                <div class="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
                    <buton
                        type="button"
                        onClick={() => { EditPageHandler(module.ID); }}
                        className="badge badge-soft-primary font-size-12" >
                        <i class="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                    </buton>
                    <buton
                        className="badge badge-soft-danger font-size-12"
                        onClick={() => {
                            deleteHandeler(module.ID, module.Name);
                        }}
                    ><i class="mdi mdi-delete font-size-18" ></i>
                    </buton>
                </div>
            ),
        },
    ];
    return (
        <React.Fragment>
            <div className="page-content">
                <PaginationProvider
                    pagination={paginationFactory(pageOptions)}
                >
                    {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                            keyField="id"
                            data={HPageListData}
                            columns={HPageListColoumns}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <Breadcrumbs
                                        title={"Count :"}
                                        breadcrumbItem={"H Page List"}
                                        IsButtonVissible={true}
                                        SearchProps={toolkitProps.searchProps}
                                        breadcrumbCount={HPageListData.length}
                                        RedirctPath={"/Hpage"}
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
                                                    // selectRow={selectRow}
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

            </div>
            <Modal
                isOpen={modal_center}
                toggle={() => {
                    tog_center()
                }}
                size="xl"
            >
                <HPageMaster state={editData.Data} />
            </Modal>
            <MetaTags>
                <title>H Page List </title>
            </MetaTags>
        </React.Fragment>
    )
}
