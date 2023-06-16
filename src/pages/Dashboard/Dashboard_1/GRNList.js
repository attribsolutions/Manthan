import React, { useEffect } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { date_ymd_func, loginPartyID } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { order_Type } from '../../../components/Common/C-Varialbes';
import { getOrderListPage } from '../../../store/Purchase/OrderPageRedux/actions';
import { mySearchProps } from '../../../components/Common/SearchBox/MySearch';
import { Button } from 'reactstrap';
import { makeGRN_Mode_1Action } from '../../../store/Inventory/GRNRedux/actions';
import { mode, url } from "../../../routes/index";

export default function InvoiceForGRN() {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = date_ymd_func();

    const { tableList, GRNitem } = useSelector((state) => ({
        tableList: state.OrderReducer.orderList,
        GRNitem: state.GRNReducer.GRNitem,
    }));

    useEffect(() => {

        let subPageMode = url.GRN_STP_3
        const gobtnId = `gobtn-${subPageMode}`
        const filtersBody = JSON.stringify({
            FromDate: currentDate_ymd,
            ToDate: currentDate_ymd,
            Supplier: "",
            Customer: loginPartyID(),
            OrderType: order_Type.InvoiceToGRN,
            IBType: ""
        });
        dispatch(getOrderListPage({ subPageMode, filtersBody, btnId: gobtnId }));
    }, [])

    useEffect(() => {
        if (GRNitem.Status === true && GRNitem.StatusCode === 200) {
            history.push({
                pathname: GRNitem.path,
                page_Mode: GRNitem.page_Mode,
            })
        }
    }, [GRNitem])

    function makeBtnHandler(rowData, btnId) {

        const list = [rowData]
        var isGRNSelect = ''
        var challanNo = ''
        const grnRef = []
        if (list.length > 0) {
            list.forEach(ele => {
                grnRef.push({
                    Invoice: ele.id,
                    Order: null,
                    ChallanNo: ele.FullOrderNumber,
                    Inward: true,
                    Challan: ''
                });
                isGRNSelect = isGRNSelect.concat(`${ele.id},`)
                challanNo = challanNo.concat(`${ele.FullOrderNumber},`)
            });

            if (isGRNSelect) {
                let path = url.GRN_ADD_3
                isGRNSelect = isGRNSelect.replace(/,*$/, '');//****** withoutLastComma  function */
                challanNo = challanNo.replace(/,*$/, '');           //****** withoutLastComma  function */


                const jsonBody = JSON.stringify({
                    OrderIDs: isGRNSelect,
                    Mode: 3
                })

                dispatch(makeGRN_Mode_1Action({ jsonBody, pageMode: mode.modeSTPsave, path: path, grnRef, challanNo }))

            } else {
                alert("Please Select Order1")
            }
        }

    }

    const pagesListColumns = [
        {
            text: "InvoiceDate",
            dataField: "OrderDate",
        },
        {
            text: "InvoiceNo",
            dataField: "FullOrderNumber",
        },
        {
            text: "InvoiceAmount",
            dataField: "OrderAmount",
            align:"right"
        },
        {
            text: "Action",
            dataField: "",
            formatter: (cellContent, rowData) => {
                return (<>
                    < Button
                        type="button"
                        id={`btn-makeBtn-${rowData.id}`}
                        className="badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light "
                        title="Make GRN"
                        onClick={() => {
                            const btnId = `btn-makeBtn-${rowData.id}`
                            makeBtnHandler(rowData, btnId)
                        }}
                    >
                        <span style={{ marginLeft: "6px", marginRight: "6px" }}
                            className=" fas fa-file-invoice" ></span> </Button>
                </>)
            }
        },
    ];

    return (
        <ToolkitProvider
            keyField="Invoice"
            data={tableList}
            columns={pagesListColumns}
            search
        >
            {toolkitProps => (
                <React.Fragment>
                    <div className="table table-responsive">
                        <BootstrapTable
                            keyField={"Invoice"}
                            bordered={true}
                            striped={false}
                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                            classes={"table align-middle table-nowrap table-hover"}
                            headerWrapperClasses={"thead-light"}

                            {...toolkitProps.baseProps}

                        />
                        {mySearchProps(toolkitProps.searchProps)}
                    </div>

                </React.Fragment>
            )}
        </ToolkitProvider>
    )
}

