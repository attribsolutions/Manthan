import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Col, Input, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";

import * as _cfunc from "../../../components/Common/CommonFunction";
import { mode, pageId, } from "../../../routes/index"
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import DynamicColumnHook from "../../../components/Common/TableCommonFunc";
import { getPosRoleAccesslist, savePosRoleAccess, savePosRoleAccess_Success } from "../../../store/SweetPOSStore/Administrator/POSRoleAccessRedux/action";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { SaveButton } from "../../../components/Common/CommonButton";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { get_POSRoleAccess_List_Api } from "../../../helpers/backend_helper";
import { C_DatePicker } from "../../../CustomValidateForm";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";



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

    ///  use effect for compare actual save value to change value in ui change value are update in tablelist variable

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
        ////set Table Data here so that check actual save value to change value in tablelist variavle after save with out referesh
        settableData((i) => {
            const a = { ...i }
            a.data = response.Data;
            return a
        })
        if (postMsg.Status === true && postMsg.StatusCode === 200) {
            dispatch(savePosRoleAccess_Success({ Status: false }));
            customAlert({
                Type: 1,
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
                let Not_RoleAccessColumn = ["Name", "TopRows", "Query", "TouchSaleHistoryRows", "LicenseValidTill", "DivisionID"];
                let RoleAccess_TextColumn = ["Query"];
                let RoleAccess_DateColumn = ["LicenseValidTill"];
                let RoleAccess_InputColumn = ["TopRows", "TouchSaleHistoryRows", "DivisionID"];

                let isColumnInput = RoleAccess_InputColumn.includes(i.dataField);
                let isColumntext = RoleAccess_TextColumn.includes(i.dataField);
                let isColumnDate = RoleAccess_DateColumn.includes(i.dataField);
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
                                        style={{ cursor: 'pointer' }}
                                        className="p-1"
                                        name={`${row.Name}`}
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
                } else if (isColumntext) {
                    column = {
                        text: i.dataField,
                        dataField: i.dataField,
                        sort: true,
                        classes: "table-cursor-pointer",
                        style: {
                            position: "sticky",
                            left: 0,
                            background: "white"
                        },
                        formatter: (cell, row, key) => {
                            return (
                                <>
                                    <div style={{ position: 'relative' }}>
                                        <textarea
                                            rows={3}
                                            defaultValue={cell}
                                            style={{ borderRadius: '5px', borderColor: '#ced4da', paddingRight: '30px' }}
                                            id={`Text_${row.id}_${key}`}
                                            onChange={(e) => {
                                                if (e.target.id === `Text_${row.id}_${key}`) {
                                                    row[i.dataField] = e.target.value
                                                }
                                            }}
                                            cols={40}
                                        />
                                    </div>


                                </>
                            );
                        },
                    };
                } else if (isColumnDate) {
                    column = {
                        text: i.dataField,
                        dataField: i.dataField,
                        sort: true,
                        classes: "table-cursor-pointer",
                        formatter: (cell, row, key) => {
                            cell = (cell === 0 ? _cfunc.date_ymd_func() : cell)
                            let options = {
                                maxDate: "",
                                altInput: true,
                                altFormat: "d-m-Y",
                                dateFormat: "Y-m-d",
                            }
                            return (
                                <>
                                    <C_DatePicker
                                        placeholder="Enter License Date"
                                        options={options}
                                        value={cell}
                                        id={`Date_${row.id}_${key}`}
                                        onChange={(e, date) => {
                                            
                                            row[i.dataField] = date
                                        }}
                                    />
                                </>
                            );
                        },
                    };
                }
                else if (isColumnInput) {
                    column = {
                        text: i.dataField,
                        dataField: i.dataField,
                        sort: true,
                        classes: "table-cursor-pointer",
                        formatter: (cell, row, key) => {
                            return (
                                <>
                                    <Input
                                        id={`Input_${row.id}_${key}`}
                                        style={{ width: "100px" }}
                                        type="text"
                                        name={`${row.Name}`}
                                        defaultValue={cell}
                                        onChange={(e) => {
                                            if (e.target.id === `Input_${row.id}_${key}`) {
                                                let value = Number(e.target.value);
                                                if (!isNaN(value)) {
                                                    row[i.dataField] = e.target.value
                                                } else {
                                                    e.target.value = cell
                                                }
                                            }
                                        }}
                                    >
                                    </Input >
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

            dispatch(BreadcrumbShowCountlabel(`Count:${tableList.length}`));
        }
    }, [tableColumns.length > 1, tableList, cellReferesh])

    const saveHandler = () => {
        ///only Save json row that are change in UI..../////
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
                DivName: Name,
                LicenseValidTill: i.LicenseValidTill === 0 ? _cfunc.date_ymd_func() : i.LicenseValidTill,
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: _cfunc.loginUserID(),
            };
        });
        if (TableData.length > 0) {
            const jsonBody = JSON.stringify(TableData);
            dispatch(savePosRoleAccess({ jsonBody }));
        } else {
            customAlert({
                Type: 4,
                Message: alertMessages.updateAtLeastOneField
            })
        }
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
                        {(toolkitProps) => (
                            <React.Fragment>
                                <Row>
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
                                </Row>
                            </React.Fragment>
                        )}
                    </ToolkitProvider>

                    {tableData.data.length > 0 && <SaveButtonDraggable>
                        <SaveButton
                            loading={saveBtnloading}
                            pageMode={pageMode}
                            userAcc={userPageAccessState}
                            module={"POS RoleAccess"} onClick={saveHandler}
                        />
                    </SaveButtonDraggable>
                    }

                </div>
            </div>
        </React.Fragment >
    )
}

export default POSRoleAccess;