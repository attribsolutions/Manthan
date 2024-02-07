import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Input, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../../components/Common/validationFunction";

import * as _cfunc from "../../../components/Common/CommonFunction";
import { mode, pageId, } from "../../../routes/index"
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import DynamicColumnHook from "../../../components/Common/TableCommonFunc";
import { Data } from './Data';
import SimpleBar from "simplebar-react"


const POSRoleAccess = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();


    const [tableData, settableData] = useState({ data: [], tableColumns: [{}] })
    const [cellReferesh, setcellReferesh] = useState(false)
    const [userPageAccessState, setUserAccState] = useState('');

    const {
        userAccess,
        pageField
    } = useSelector((state) => ({
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    })
    );

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        let pageID = pageId.POS_ROLE_ACCESS
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageID));
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


    /////////////////////////////////////////////////// column From Page master////////////////////////////////////////////////

    const [tableColumns] = DynamicColumnHook({ pageField })

    /////////////////////////////////////////////////////////////// Page Column //////////////////////////////////////////////////

    useEffect(() => {
        if (tableColumns.length > 1) {
            let columns = []
            tableColumns.forEach(i => {
                let column = {}
                let Not_RoleAccessColumn = ["Id", "DivName", "DivisionID"];
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
                                        id={`checkbox_${row.Id}_${key}`}
                                        type="checkbox"
                                        className="p-1"
                                        name={`${row.DivName}`}
                                        defaultChecked={cell}
                                        onChange={(e) => {
                                            if (e.target.id === `checkbox_${row.Id}_${key}`) {
                                                setcellReferesh(i => !i)
                                                row[i.dataField] = e.target.checked
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
                            background: "white"
                        },
                        sort: true,
                        classes: "table-cursor-pointer",
                    };
                }
                columns.push(column);
            });
            settableData({ data: Data, tableColumns: columns })
            dispatch(BreadcrumbShowCountlabel(`Count:${Data.length}`));
        }
    }, [tableColumns.length > 1, Data, cellReferesh])
    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="mt-1">
                    <ToolkitProvider
                        keyField="Id"
                        data={tableData.data}
                        columns={tableData.tableColumns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <SimpleBar className="" style={{ maxHeight: "80vh" }}>
                                        <Col xl="12">
                                            <BootstrapTable
                                                keyField="Id"
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
                                    </SimpleBar>
                                </Row>
                            </React.Fragment>
                        )}
                    </ToolkitProvider>
                </div>
            </div>
        </React.Fragment >
    )
}

export default POSRoleAccess;