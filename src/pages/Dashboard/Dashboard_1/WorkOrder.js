import React, { useEffect, useState } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { date_dmy_func, date_ymd_func, loginCompanyID, loginSelectedPartyID } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { globalTableSearchProps } from '../../../components/Common/SearchBox/MySearch';
import SimpleBar from "simplebar-react"
import { getBOMListPage } from '../../../store/Production/BOMRedux/action';
import { mode, url } from '../../../routes';
import { Button, Spinner } from 'reactstrap';
import { useHistory } from "react-router-dom";
import { selectAllCheck } from '../../../components/Common/TableCommonFunc';
import { postGoButtonForWorkOrder_Master } from '../../../store/Production/WorkOrder/action';



export default function WorkOrderForDashboard() {
    const history = useHistory();

    const dispatch = useDispatch();
    const currentDate_ymd = date_ymd_func();
    const [userAccState, setUserAccState] = useState('');
    const [bomData, setbomData] = useState({});




    const { tableList, commonPartyDropSelect, userAccess, listBtnLoading, GoButton } = useSelector((state) => ({
        tableList: state.BOMReducer.BOMList,
        listBtnLoading: state.GRNReducer.listBtnLoading,
        GoButton: state.WorkOrderReducer.GoButton,
        userAccess: state.Login.RoleAccessUpdateData,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));


    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            Party: loginSelectedPartyID(),
            ItemID: "",
            Category: 0,
            IsVDCItem: ""
        });
        dispatch(getBOMListPage(jsonBody));
    }, [commonPartyDropSelect])

    useEffect(() => {

        const locationPath = history.location.pathname
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === url.WORK_ORDER)
        })

        if (!(userAcc === undefined)) {
            setUserAccState(userAcc);
        }
    }, [userAccess]);


    useEffect(() => {

        if (GoButton.StatusCode === 200 && GoButton.Status === true) {

            const Bomdate = date_ymd_func(bomData.BomDate)
            history.push({
                pathname: url.WORK_ORDER,
                editValue: {
                    WorkOrderDate: Bomdate,
                    Item: bomData.Item,
                    ItemName: bomData.ItemName,
                    NumberOfLot: "1",
                    Stock: bomData.StockQty,
                    Quantity: bomData.EstimatedOutputQty,
                    EstimatedOutputQty: bomData.EstimatedOutputQty,
                    Bom: bomData.ID,
                    Unit: bomData.Unit,
                    UnitName: bomData.UnitName
                },
                pageMode: mode.defaultsave
            });
        }

    }, [GoButton])


    const hasRole = (role) => userAccState[role];

    function makeBtnHandler(rowData, btnId) {
        setbomData(rowData)
        const jsonBody = JSON.stringify({
            Item: rowData.Item,
            Bom: rowData.ID,
            Quantity: parseFloat(rowData.EstimatedOutputQty),
            Party: loginSelectedPartyID()
        });
        dispatch(postGoButtonForWorkOrder_Master(jsonBody));
    }


    function rowSelected() {
        return tableList.map((index) => { return (index.selectCheck) && index.id })
    }

    const pagesListColumns = [
        {
            text: "Bom Date",
            dataField: "BomDate",
        },
        {
            text: "Item Name",
            dataField: "ItemName",
        },
        {
            text: "Estimated Qty",
            dataField: "EstimatedOutputQty",
        },
        {
            text: "User Name",
            dataField: "UserName",
        },
        {
            text: "Action",
            hidden: !hasRole("RoleAccess_IsSave"),
            dataField: "",
            formatExtraData: { listBtnLoading: listBtnLoading, },
            headerFormatter: (column, colIndex, { sortElement, filterElement }) => {
                return (
                    <div>
                        <span>Action &nbsp;&nbsp;&nbsp;</span>
                        <Button
                            type="button"
                            id={`btn-makeBtn`}
                            className="badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light ml-2"
                            title="Make Selected Work Order"
                            onClick={() => {
                                const btnId = `btn-makeBtn`
                                history.push({
                                    pathname: url.BULK_WORK_ORDER,
                                });
                            }}
                        >
                            {listBtnLoading === `btn-makeBtn` ? (
                                <Spinner style={{ height: '16px', width: '16px' }} color="white" />
                            ) : (
                                <span className=" bx bx-select-multiple font-size-17"></span>
                            )}
                        </Button>
                    </div>
                );
            },
            formatter: (cellContent, rowData, key, formatExtra) => {

                let { listBtnLoading } = formatExtra;
                return (<>
                    < Button
                        type="button"
                        id={`btn-makeBtn-${rowData.id}`}
                        className="badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light "
                        title="Make Work Order"
                        onClick={() => {
                            const btnId = `btn-makeBtn-${rowData.id}`
                            !listBtnLoading && makeBtnHandler(rowData, btnId)
                        }}
                    >
                        {(listBtnLoading === `btn-makeBtn-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <span
                                className=" fas fa-file-invoice font-size-17"
                            ></span>
                        }
                    </Button>


                </>)
            }
        },

    ];

    return (
        <ToolkitProvider
            keyField="id"
            data={tableList}
            columns={pagesListColumns}
            search
        >
            {toolkitProps => (
                <React.Fragment>
                    <SimpleBar className="" style={{ maxHeight: "352px" }}>
                        <BootstrapTable
                            keyField={"id"}
                            selectRow={selectAllCheck({
                                rowSelected: rowSelected(),
                                tableList: tableList,
                                position: "left"
                            })}
                            bordered={true}
                            striped={false}
                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                            classes={"table align-middle table-nowrap table-hover"}
                            headerWrapperClasses={"thead-light"}
                            {...toolkitProps.baseProps}
                        />
                        {globalTableSearchProps(toolkitProps.searchProps)}

                    </SimpleBar >


                </React.Fragment>
            )
            }
        </ToolkitProvider>
    )
}

