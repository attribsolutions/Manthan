import React, { useEffect, useState } from 'react'
// import { useHistory } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Modal, Col, Row, Button, Input, } from "reactstrap";
// import { useAlert } from "react-alert";
import "../../../assets/scss/CustomeTable/datatables.scss"
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { SpinnerON } from "../../../store/Utilites/Spinner/actions";
import {
    getEmployeelist, editEmployeeeId, deleteEmployeeIDSuccess, updateEmployeeIDSuccess, delete_Employee_ID
} from "../../../store/Administrator/M_EmployeeRedux/action";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
const Employee_List = () => {

    const dispatch = useDispatch();
    const [modal_center, setmodal_center] = useState(false);

    // get Access redux data
    const { TableListData, editData, updateMessage, deleteMessage } = useSelector((state) => ({
        TableListData: state.M_EmployeesReducer.employeeList,
        editData: state.M_EmployeesReducer.editData,
        updateMessage: state.M_EmployeesReducer.updateMessage,
        deleteMessage: state.M_EmployeesReducer.deleteMessage,

    }));
    console.log("editData", editData)

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(getEmployeelist());
    }, []);

    // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal 
    useEffect(() => {
        if ((updateMessage.Status === true) && (updateMessage.StatusCode === 200)) {
            dispatch(updateEmployeeIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1, Status: true,
                Message: updateMessage.Message,
                AfterResponseAction: getEmployeelist,
            }))
            tog_center()
        }
        else if (updateMessage.Status === true) {
            dispatch(deleteEmployeeIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: deleteMessage.Message,
            }));
        }
    }, [updateMessage.Status, dispatch]);

    useEffect(() => {
        if ((deleteMessage.Status === true) && (deleteMessage.StatusCode === 200)) {
            dispatch(deleteEmployeeIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1, Status: true,
                Message: deleteMessage.Message,
                AfterResponseAction: getEmployeelist,
            }))
        } else if (deleteMessage.Status === true) {
            dispatch(deleteEmployeeIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3,
                Status: true,
                Message: "error Message",
            }));
        }
    }, [deleteMessage.Status])

    //Delete Button Handller
    const deleteHandeler = (id, name) => {
        dispatch(AlertState({
            Type: 5, Status: true,
            Message: `Are you sure you want to delete this Employee : "${name}"`,
            RedirectPath: false,
            PermissionAction: delete_Employee_ID,
            ID: id
        }));
    }

    // Edit Modal Show When Edit Data is true
    useEffect(() => {
        if (editData.Status === true) {
            tog_center()
        }
    }, [editData]);

    // tag_center -- Control the Edit Modal show and close
    function tog_center() {
        setmodal_center(!modal_center)
    }

    // Edit Button Handler
    const EditPageHandler = (id) => {
        dispatch(editEmployeeeId(id));
    }


    const defaultSorted = [
        {
            dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];
    const pageOptions = {
        sizePerPage: 5,
        totalSize: TableListData.length,
        custom: true,
    };

    // Employee List component table columns 
    const pagesListColumns = [
        {
            text: "PageID",
            dataField: "ID",
            sort: true,
            hidden: true,
            formatter: (cellContent, TableListData) => <>{TableListData.ID}</>,
        },

        {
            text: "Name",
            dataField: "Name",
            sort: true,
            formatter: (cellContent, TableListData) => <>{TableListData.Name}</>,
        },

        {
            text: "Is Show",
            dataField: "Address",
            sort: true,
            formatter: (cellContent, TableListData) => <>
                <input type="checkbox"
                /></>,
        },

        {
            text: "Is Delete",
            dataField: "Mobile",
            sort: true,
            formatter: (cellContent, TableListData) => <>
                <input type="checkbox"
                /></>,
        },
        {
            text: "Is Add",
            dataField: "email",
            sort: true,
            formatter: (cellContent, TableListData) => <>
                <input type="checkbox"
                /></>,
        },

        {
            text: "Actions",

            formatter: (cellContent, TableListData) => (
                <>
                    <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
                        <button
                            type="button"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit Employee"
                            onClick={() => {
                                EditPageHandler(TableListData.id);
                            }}
                            className="badge badge-soft-primary font-size-12 border border-light btn btn-outline-primary"
                        >
                            <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                        </button>
                        <buton
                            className="badge badge-soft-danger font-size-12"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Employee"
                            onClick={() => {
                                deleteHandeler(TableListData.id, TableListData.Name);
                            }}
                        >
                            <i className="mdi mdi-delete font-size-18" ></i>
                        </buton>

                    </div>
                </>
            ),
        },
    ]

    // const ExcelTableData = [
    //     { label: "Id", key: "id" },
    //     { label: "Name", key: "Name" },
    //     { label: "Address", key: "Address" },
    //     { label: "Mobile", key: "Mobile" },
    //     { label: "Email", key: "email" },
    //     { label: " Date of Birth", key: "DOB" },
    //     { label: "Company Name ", key: "CompanyName" },
    //     // { label: "State", key: "StateName" },

    // ];
    //     const tableListNew = {
    //         name: 'Batman'
    //       };
    //       tableListNew.hasOwnProperty('name'); 
    //    console.log("tableListNew",tableListNew) 
    // const tableListNew = TableListData.Map([
    //   ]);
    //   console.log(tableListNew.hasOwnProperty('id'))
    //   const obj = Object.fromEntries(tableListNew);
    //   console.log("obj",tableListNew[0])
    //   tableListNew.hasOwnProperty('Name'); 
    //   console.log(tableListNew.hasOwnProperty('id'));

    const downloadExcel = (TableListData) => {

        var demoList = ["Name", "Address", "email", "Mobile"]

        var li = []
        var obj = {}

        TableListData.map((index1) => {
            demoList.map((index2) => {
                if (index1.hasOwnProperty(index2)) {
                    obj[index2] = index1[index2]
                }
            })
            li.push(obj)
            obj={}
           
        })
        
        const worksheet = XLSX.utils.json_to_sheet(li);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "DataSheet.xlsx");
    };



    useEffect(() => {
       
    }, [TableListData])

   
    console.log(TableListData);

    return (
        <React.Fragment>
            <div className="page-content">

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
                                        breadcrumbItem={"Employee List"}
                                        IsButtonVissible={true}
                                        SearchProps={toolkitProps.searchProps}
                                        breadcrumbCount={`Employee Count: ${TableListData.length}`}
                                        RedirctPath={"/employeesMaster"}
                                        isExcelButtonVisible={true}
                                        ExcelData={TableListData}
                                    />
                                    {/* <Row>
                                        <Col className='btn sm text-end '>
                                      
                                            {/* <Button
                                                variant="contained"
                                                color="primary"
                                                className='export-btn text-right mb-2  align-end'
                                            > */}
                                    {/* <CSVLink
                                                    headers={ExcelTableData}
                                                    data={TableListData}
                                                    filename="Employee Data"
                                                    style={{ "textDecoration": "none", "color": "#fff" }}
                                                >
                                                </CSVLink> */}

                                    {/* </Button> */}
                                    {/* </Col> */}
                                    {/* </Row> */}
                                    {/* <button onClick={() => downloadExcel(TableListData)}>
                                        Download As Excel
                                    </button> */}
                                    <Row>
                                        <Col xl="12">
                                            <div className="table-responsive">
                                                <BootstrapTable

                                                    keyField={"id"}
                                                    responsive
                                                    bordered={false}
                                                    defaultSorted={defaultSorted}
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
                {/* <CSVLink data={TableListData} filename="Employee Data" className="btn btn-success mb-3">Download to Excel</CSVLink> */}
            </div>
        </React.Fragment>
    );
};


export default Employee_List;