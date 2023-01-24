
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Breadcrumb3";
import { Button, Col, Input, Modal, Row } from "reactstrap";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useDispatch } from "react-redux";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";

import { AlertState,  BreadcrumbDownBtndata, BreadcrumbShowCountlabel } from "../../../store/actions";
import { listPageCommonButtonFunction, makeBtnCss }
    from "./listPageCommonButtons";
import { defaultSearch, mySearchProps } from "./MySearch";
import C_Report from "./C_Report";
import * as url from "../../../routes/route_url";
import BreadcrumbNew from "../BreadcrumbNew";

let sortType = "asc"
let searchCount = 0
let downList = []
let listObj = {}

let searchProps = {
    onClear: function onClear() { },
    onSearch: function onSearch() { },
    searchText: ""
}

export const countlabelFunc = (toolkitProps, paginationProps, dispatch, ButtonMsgLable) => {

    let iscall = 0
    if (paginationProps.dataSize) {
        iscall = paginationProps.dataSize
    }

    if (!(iscall === searchCount)) {
        dispatch(BreadcrumbShowCountlabel(`${ButtonMsgLable} Count :${iscall}`))
        searchCount = paginationProps.dataSize
    }
    searchProps = toolkitProps.searchProps
}

const PurchaseListPage = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [userAccState, setUserAccState] = useState('');
    const [modal_edit, setmodal_edit] = useState(false);
    const [tableList, settableList] = useState([]);

    const {
        editData,
        updateMsg,
        deleteMsg,
        userAccess,
        postMsg,
        pageField,
    } = props.reducers;

    const {
        getList,
        editId,
        deleteId,
        postSucc,
        updateSucc,
        deleteSucc

    } = props.action

    const {
        editBodyfunc,
        MasterModal,
        masterPath,
        ButtonMsgLable,
        deleteName,
        pageMode,
        goButnFunc = () => { },
        makeBtnFunc = () => { },
        makeBtnShow,
        makeBtnName,
        downBtnFunc = () => { },
    } = props;

    const fileds = pageField.PageFieldMaster;

    useEffect(() => {

        let tableArr = props.reducers.tableList;
        if (pageMode === url.GRN_ADD_Mode_2) {
            let OnlyInwardZeroRecord = props.reducers.tableList.filter((i) => {
                return i.Inward === "Open"
            })
            tableArr = OnlyInwardZeroRecord
            settableList(OnlyInwardZeroRecord)
        }
        else {
            settableList(props.reducers.tableList)
        };

        downList = []
        listObj = {}

        tableArr.forEach((index1) => {
            fileds.forEach((index2) => {
                if (index2.ShowInDownload) {
                    listObj[`$defSelect${index2.ControlID}`] = index2.ShownloadDefaultSelect
                    listObj[index2.ControlID] = index1[index2.ControlID]
                }
            })
            downList.push(listObj)
            listObj = {}
        })
        
        // dispatch(BreadcrumbDownBtndata(downList))

    }, [props.reducers.tableList])

    useEffect(() => {

        const locationPath = history.location.pathname
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

   
    // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
    useEffect(() => {

        if (updateMsg.Status === true && updateMsg.StatusCode === 200) {
            dispatch(updateSucc({ Status: false }));
            goButnFunc()
            dispatch(
                AlertState({
                    Type: 1,
                    Status: true,
                    Message: updateMsg.Message,
                    isFunc: true,
                })
            );
            tog_center();
        } else if (updateMsg.Status === true) {
            dispatch(updateSucc({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg]);

    useEffect(() => {
        if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {
            dispatch(deleteSucc({ Status: false }));
            goButnFunc();
            dispatch(
                AlertState({
                    Type: 1,
                    Status: true,
                    Message: deleteMsg.Message,
                })
            );
        } else if (deleteMsg.Status === true) {
            dispatch(deleteSucc({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(deleteMsg.Message),
                })
            );
        }
    }, [deleteMsg]);

    useEffect(() => {
        debugger

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postSucc({ Status: false }))
            tog_center();
            dispatch(getList());
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
            }))
        }

        else if ((postMsg.Status === true)) {
            dispatch(postSucc({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }


    }, [postMsg])


    // Edit Modal Show When Edit Data is true
    useEffect(() => {

        if (editData.Status === true) {
            if (pageField.IsEditPopuporComponent) {
                history.push({
                    pathname: masterPath,
                    editValue: editData.Data,
                    pageMode: editData.pageMode,
                })
            }
            else {
                tog_center();
            }
        }
    }, [editData]);

    function makeBtnHandler(rowData) {
        rowData["hasSelect"] = true;
        let arr = []
        arr.push(rowData)
        makeBtnFunc(arr)
    }

    function onSaveBtnClick() {

        makeBtnFunc(tableList);

    }

    function tog_center() {
        setmodal_edit(!modal_edit); //when edit mode show in pop up that modal view controle
    }


    // ****** columns sort by sequnce
    fileds.sort(function (a, b) {  //sort function is  sort list page coloumn by asending order by listpage sequense
        return a.ListPageSeq - b.ListPageSeq
    });
    // *******

    //**** GRNMode2_ list multilple make_GRN checkBox selection Onchange ********************/

    function GRNMode2_checkBtnOnchange(e, rowData) {

        let isEvent = e.target.checked
        rowData.hasSelect = isEvent

        let found = tableList.filter(i => (i.hasSelect))

        tableList.map((ele, k) => {
            if (found.length === 1 && isEvent) {
                // validation only show checkbox =supplier and same 
                if (!(ele.SupplierID === rowData.SupplierID)||!(ele.POType === rowData.POType)) {
                    try {
                        document.getElementById(`checkhasSelect${ele.id}`).disabled = true
                        document.getElementById(`checkhasSelect${ele.id}`).style.border = "white"
                    }
                    catch (e) { }
                };
            }
            else if (found.length === 0 && !isEvent) {
                try {
                    document.getElementById(`checkhasSelect${ele.id}`).disabled = false
                    document.getElementById(`checkhasSelect${ele.id}`).style.border = ""
                }
                catch (e) { }
            };
        })

    }

    let sortLabel = ""
    const columns = []

    fileds.forEach((i, k) => {
        if (i.ShowInListPage) {
            columns.push({
                text: i.FieldLabel,
                dataField: i.ControlID,
                sort: true,
            })

            if (i.DefaultSort === 1) {
                sortLabel = i.ControlID
                sortType = "asc"
            } else if (i.DefaultSort === 2) {
                sortLabel = i.ControlID;
                sortType = "desc"
            }
        }

        // ======================== for GRNMode2 Page Action Button ================================

        if ((pageMode === url.GRN_ADD_Mode_2) && (makeBtnShow) && (fileds.length - 1 === k)) {

            columns.push({
                text: "Select",
                dataField: "hasSelect",
                sort: true,
                formatter: (cellContent, rowData, key) => {
                    rowData["hasSelect"] = false
                    return (
                        <div>
                            <Input
                                type="checkbox"
                                className="mx-2"
                                id={`checkhasSelect${rowData.id}`}
                                defaultChecked={rowData.hasSelect}
                                // disabled={rowData["isdisabled"]}
                                key={rowData.hasSelect}
                                onChange={(e) => GRNMode2_checkBtnOnchange(e, rowData)}




                            />
                            <Button
                                type="button"
                                className={makeBtnCss}
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title={makeBtnName}
                                onClick={() => { makeBtnHandler(rowData) }}
                            >
                                <span style={{ marginLeft: "6px", marginRight: "6px" }}
                                    className=" fas fa-file-invoice" ></span> </Button>
                        </div>)
                }
            })
        }

        // ======================== for GRNMode2 Page Action Button ================================

        else if ((makeBtnShow) && (fileds.length - 1 === k)) {

            columns.push({
                text: "Select",
                dataField: "hasSelect",
                sort: true,
                formatter: (cellContent, rowData, key) => {
                    rowData["hasSelect"] = false
                    return (
                        <div>

                            <Button
                                type="button"
                                className={makeBtnCss}
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title={makeBtnName}
                                onClick={() => { makeBtnHandler(rowData) }}
                            >
                                <span style={{ marginLeft: "6px", marginRight: "6px" }}
                                    className=" fas fa-file-invoice" ></span> </Button>
                        </div>)
                }
            })
        }

        // ======================== for List Page Action Button ================================

        else if ((fileds.length - 1 === k)) {
            columns.push(
                listPageCommonButtonFunction({
                    dispatchHook: dispatch,
                    ButtonMsgLable: ButtonMsgLable,
                    deleteName: deleteName,
                    userAccState: userAccState,
                    editActionFun: editId,
                    deleteActionFun: deleteId,
                    downBtnFunc: downBtnFunc,
                    makeBtnShow: makeBtnShow,
                    makeBtnName: makeBtnName,
                    editBodyfunc: editBodyfunc
                })
            )
        }
    })


    const defaultSorted = [
        {
            dataField: sortLabel, // if dataField is not match to any column you defined, it will be ignored.
            order: sortType, // desc or asc
        },
    ];

    const pageOptions = {
        sizePerPage: 15,
        // totalSize: tableList.length,
        custom: true,
    };

    if (!(userAccState === '')) {
        return (
            <React.Fragment>
                <MetaTags>
                    <title>{userAccState.PageHeading}| FoodERP-React FrontEnd</title>
                </MetaTags>
                {/* <BreadcrumbNew
                    userAccess={userAccess}
                /> */}
                <div >
                    <PaginationProvider pagination={paginationFactory(pageOptions)}>
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                data={tableList}
                                columns={columns}
                                search={defaultSearch(pageField.id)}
                            >
                                {(toolkitProps, a) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table-responsive mt-1">
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        responsive
                                                        bordered={false}
                                                        defaultSorted={defaultSorted}
                                                        striped={true}
                                                        classes={"table  table-bordered table-hover"}
                                                        noDataIndication={<div className="text-danger text-center "> No record(s) Not Found.</div>}
                                                        {...toolkitProps.baseProps}
                                                        {...paginationTableProps}
                                                    />
                                                </div>
                                            </Col>

                                            {countlabelFunc(toolkitProps, paginationProps, dispatch, ButtonMsgLable)}
                                            {mySearchProps(toolkitProps.searchProps, pageField.id)}
                                        </Row>
                                        <Row className="align-items-md-center mt-30">
                                            <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                <PaginationListStandalone {...paginationProps} />
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                                )}
                            </ToolkitProvider>
                        )}


                    </PaginationProvider>

                    {

                        (pageMode === url.GRN_ADD_Mode_2) ?
                            (tableList.length == 0) ? null :
                                <div className=" " style={{ paddingBottom: 'center' }}>
                                    <button
                                        style={{ marginTop: "-10px" }}
                                        id='form_submmit'
                                        type="submit"
                                        data-mdb-toggle="tooltip" data-mdb-placement="top"
                                        className="btn btn-primary w-md  "
                                        onClick={onSaveBtnClick}
                                    >
                                        <i class="fas fa-edit me-2"></i>{makeBtnName}
                                    </button>
                                </div>
                            :
                            null
                    }
                    <Modal
                        isOpen={modal_edit}
                        toggle={() => {
                            tog_center();
                        }}
                        size="xl"
                    >

                        <MasterModal editValue={editData.Data} masterPath={masterPath} pageMode={editData.pageMode} />

                    </Modal>
                </div>

                <C_Report />
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
}

export default PurchaseListPage;
