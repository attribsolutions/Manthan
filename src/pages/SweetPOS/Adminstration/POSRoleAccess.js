import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Input, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";

import * as _cfunc from "../../../components/Common/CommonFunction";
import { mode, pageId, } from "../../../routes/index"
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import DynamicColumnHook from "../../../components/Common/TableCommonFunc";
import { Data } from './Data';
import { getPosRoleAccesslist, savePosRoleAccess, savePosRoleAccess_Success } from "../../../store/SweetPOSStore/Administrator/POSRoleAccessRedux/action";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { SaveButton } from "../../../components/Common/CommonButton";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { get_POSRoleAccess_List_Api } from "../../../helpers/backend_helper";



const POSRoleAccess = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();


    const [tableData, settableData] = useState({ data: [], tableColumns: [{}] })
    const [cellReferesh, setcellReferesh] = useState(false)
    const [userPageAccessState, setUserAccState] = useState('');
    const [pageMode, setPageMode] = useState(mode.defaultsave);

    const [DataBase_Data, setDataBase_Data] = useState([]);



    const {
        userAccess,
        pageField,
        tableList,
        saveBtnloading,
        postMsg
    } = useSelector((state) => ({
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        saveBtnloading: state.PosRoleAccessReducer.saveBtnloading,
        postMsg: state.PosRoleAccessReducer.postMsg,

        tableList: state.PosRoleAccessReducer.PosRoleAccessListData
    })
    );

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        let pageID = pageId.POS_ROLE_ACCESS
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageID));
        dispatch(getPosRoleAccesslist())
        return () => {
            dispatch(commonPageFieldSuccess(null));
        }
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
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])
    useEffect(async () => {
        const response = await get_POSRoleAccess_List_Api()
        response.Data.forEach(i => {
            for (let key in i) {
                if (i.hasOwnProperty(key) && i[key] === null) {
                    i[key] = 0;
                } else if (i.hasOwnProperty(key) && i[key] === true) {
                    i[key] = 1;
                } else if (i.hasOwnProperty(key) && i[key] === false) {
                    i[key] = 0;
                }
            }
        });
        setDataBase_Data(response.Data)
    }, [])


    useEffect(() => {
        if (postMsg.Status === true && postMsg.StatusCode === 200) {
            dispatch(getPosRoleAccesslist())
            dispatch(savePosRoleAccess_Success({ Status: false }));
            customAlert({
                Type: 4,
                Message: postMsg.Message,
            })
        }
    }, [postMsg]);

    /////////////////////////////////////////////////// column From Page master////////////////////////////////////////////////

    const [tableColumns] = DynamicColumnHook({ pageField })

    /////////////////////////////////////////////////////////////// Page Column //////////////////////////////////////////////////

    useEffect(() => {
        if (tableColumns.length > 1) {
            let columns = []
            tableColumns.forEach(i => {
                let column = {}
                let Not_RoleAccessColumn = ["Name"];
                let isColumn = Not_RoleAccessColumn.includes(i.dataField);
                if (!isColumn) {
                    column = {
                        text: i.dataField,
                        dataField: i.dataField,
                        sort: true,
                        classes: "table-cursor-pointer",
                        formatExtraData: { cellReferesh },
                        formatter: (cell, row, key) => {

                            return (
                                <>
                                    <Input
                                        id={`checkbox_${row.id}_${key}`}
                                        type="checkbox"
                                        className="p-1"
                                        name={`${row.DivName}`}
                                        defaultChecked={cell}
                                        onChange={(e) => {
                                            if (e.target.id === `checkbox_${row.id}_${key}`) {
                                                setcellReferesh(i => !i)
                                                row[i.dataField] = (e.target.checked === true ? e.target.checked = 1 : e.target.checked = 0)
                                            }
                                        }}
                                    >
                                    </Input>
                                </>
                            );
                        },
                    };
                } else {
                    column = {
                        text: i.dataField,
                        dataField: i.dataField,
                        style: {
                            position: "sticky",
                            left: 0,
                            background: "white"
                        },
                        headerStyle: {
                            zIndex: 2,
                            position: "sticky",
                            left: 0,
                            background: "#e9e9ef"
                        },
                        sort: true,
                        classes: "table-cursor-pointer",
                    };
                }
                columns.push(column);
            });

            settableData({ data: tableList, tableColumns: columns })

            dispatch(BreadcrumbShowCountlabel(`Count:${Data.length}`));
        }
    }, [tableColumns.length > 1, tableList, cellReferesh])



    const saveHandler = () => {
        const isChangeRow = [];
        DataBase_Data.forEach((objA, index) => {
            const objB = tableList[index];
            const isChangeObject = _cfunc.compareObjects(objA, objB)
            if (!isChangeObject) {
                isChangeRow.push(objB);
            }
        })
        const TableData = isChangeRow.map(i => {
            const { Name, id, CreatedOn, UpdatedOn, ...rest } = i;
            return {
                ...rest,
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: _cfunc.loginUserID(),

            };
        });

        const jsonBody = JSON.stringify(TableData);
        dispatch(savePosRoleAccess({ jsonBody }));
    }


    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="mt-1">
                    <ToolkitProvider
                        keyField="id"
                        data={tableData.data}
                        columns={tableData.tableColumns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    {/* <SimpleBar className="" style={{ maxHeight: "81vh" }}> */}
                                    <Col xl="12">
                                        <BootstrapTable
                                            keyField="id"
                                            classes={"table  table-bordered table-hover"}
                                            noDataIndication={
                                                <div className="text-danger text-center ">
                                                    Record Not available
                                                </div>
                                            }
                                            onDataSizeChange={({ dataSize }) => {
                                                dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
                                            }}
                                            {...toolkitProps.baseProps}
                                        />
                                        {globalTableSearchProps(toolkitProps.searchProps)}
                                    </Col>
                                    {/* </SimpleBar> */}
                                </Row>
                            </React.Fragment>
                        )}
                    </ToolkitProvider>
                    <SaveButtonDraggable>
                        <SaveButton
                            loading={saveBtnloading}
                            pageMode={pageMode}
                            userAcc={userPageAccessState}
                            module={"POS RoleAccess"} onClick={saveHandler}
                        />
                    </SaveButtonDraggable>
                </div>
            </div>
        </React.Fragment >
    )
}

export default POSRoleAccess;