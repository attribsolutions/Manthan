import React, { useEffect } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { currentDate, loginPartyID } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as url from "../../../routes/route_url";
import { order_Type } from '../../../components/Common/C-Varialbes';
import { getOrderListPage } from '../../../store/Purchase/OrderPageRedux/actions';
import { mySearchProps } from '../../../components/Common/SearchBox/MySearch';
import { Button } from 'reactstrap';
import { makeGRN_Mode_1Action } from '../../../store/Inventory/GRNRedux/actions';
import * as mode from "../../../routes/PageMode";

export default function InvoiceForGRN() {

    const dispatch = useDispatch();
    const history = useHistory();

    const { tableList,GRNitem } = useSelector((state) => ({
        tableList: state.OrderReducer.orderList,
        GRNitem: state.GRNReducer.GRNitem,
    }));

    // const tableList = [
    //     {
    //         "id": 112,
    //         "OrderDate": "2023-05-05",
    //         "FullOrderNumber": "1",
    //         "DeliveryDate": "2023-05-05",
    //         "CustomerID": 4,
    //         "Customer": "Krupa Traders",
    //         "SupplierID": 5,
    //         "Supplier": "Katraj Division",
    //         "OrderAmount": "63000.00",
    //         "Description": "",
    //         "OrderType": 1,
    //         "POType": "Regular PO",
    //         "BillingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "ShippingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "CreatedBy": 5,
    //         "CreatedOn": "2023-05-05T15:37:46.323734",
    //         "Inward": 0,
    //         "Percentage": ""
    //     },
    //     {
    //         "id": 113,
    //         "OrderDate": "2023-05-05",
    //         "FullOrderNumber": "1",
    //         "DeliveryDate": "2023-05-05",
    //         "CustomerID": 4,
    //         "Customer": "Krupa Traders",
    //         "SupplierID": 5,
    //         "Supplier": "Katraj Division",
    //         "OrderAmount": "63000.00",
    //         "Description": "",
    //         "OrderType": 1,
    //         "POType": "Regular PO",
    //         "BillingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "ShippingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "CreatedBy": 5,
    //         "CreatedOn": "2023-05-05T15:37:46.323734",
    //         "Inward": 0,
    //         "Percentage": ""
    //     },
    //     {
    //         "id": 114,
    //         "OrderDate": "2023-05-05",
    //         "FullOrderNumber": "1",
    //         "DeliveryDate": "2023-05-05",
    //         "CustomerID": 4,
    //         "Customer": "Krupa Traders",
    //         "SupplierID": 5,
    //         "Supplier": "Katraj Division",
    //         "OrderAmount": "63000.00",
    //         "Description": "",
    //         "OrderType": 1,
    //         "POType": "Regular PO",
    //         "BillingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "ShippingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "CreatedBy": 5,
    //         "CreatedOn": "2023-05-05T15:37:46.323734",
    //         "Inward": 0,
    //         "Percentage": ""
    //     },
    //     {
    //         "id": 115,
    //         "OrderDate": "2023-05-05",
    //         "FullOrderNumber": "1",
    //         "DeliveryDate": "2023-05-05",
    //         "CustomerID": 4,
    //         "Customer": "Krupa Traders",
    //         "SupplierID": 5,
    //         "Supplier": "Katraj Division",
    //         "OrderAmount": "63000.00",
    //         "Description": "",
    //         "OrderType": 1,
    //         "POType": "Regular PO",
    //         "BillingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "ShippingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "CreatedBy": 5,
    //         "CreatedOn": "2023-05-05T15:37:46.323734",
    //         "Inward": 0,
    //         "Percentage": ""
    //     },
    //     {
    //         "id": 116,
    //         "OrderDate": "2023-05-05",
    //         "FullOrderNumber": "1",
    //         "DeliveryDate": "2023-05-05",
    //         "CustomerID": 4,
    //         "Customer": "Krupa Traders",
    //         "SupplierID": 5,
    //         "Supplier": "Katraj Division",
    //         "OrderAmount": "63000.00",
    //         "Description": "",
    //         "OrderType": 1,
    //         "POType": "Regular PO",
    //         "BillingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "ShippingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "CreatedBy": 5,
    //         "CreatedOn": "2023-05-05T15:37:46.323734",
    //         "Inward": 0,
    //         "Percentage": ""
    //     },
    //     {
    //         "id": 117,
    //         "OrderDate": "2023-05-05",
    //         "FullOrderNumber": "1",
    //         "DeliveryDate": "2023-05-05",
    //         "CustomerID": 4,
    //         "Customer": "Krupa Traders",
    //         "SupplierID": 5,
    //         "Supplier": "Katraj Division",
    //         "OrderAmount": "63000.00",
    //         "Description": "",
    //         "OrderType": 1,
    //         "POType": "Regular PO",
    //         "BillingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "ShippingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "CreatedBy": 5,
    //         "CreatedOn": "2023-05-05T15:37:46.323734",
    //         "Inward": 0,
    //         "Percentage": ""
    //     },
    //     {
    //         "id": 118,
    //         "OrderDate": "2023-05-05",
    //         "FullOrderNumber": "1",
    //         "DeliveryDate": "2023-05-05",
    //         "CustomerID": 4,
    //         "Customer": "Krupa Traders",
    //         "SupplierID": 5,
    //         "Supplier": "Katraj Division",
    //         "OrderAmount": "63000.00",
    //         "Description": "",
    //         "OrderType": 1,
    //         "POType": "Regular PO",
    //         "BillingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "ShippingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "CreatedBy": 5,
    //         "CreatedOn": "2023-05-05T15:37:46.323734",
    //         "Inward": 0,
    //         "Percentage": ""
    //     },
    //     {
    //         "id": 119,
    //         "OrderDate": "2023-05-05",
    //         "FullOrderNumber": "1",
    //         "DeliveryDate": "2023-05-05",
    //         "CustomerID": 4,
    //         "Customer": "Krupa Traders",
    //         "SupplierID": 5,
    //         "Supplier": "Katraj Division",
    //         "OrderAmount": "63000.00",
    //         "Description": "",
    //         "OrderType": 1,
    //         "POType": "Regular PO",
    //         "BillingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "ShippingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "CreatedBy": 5,
    //         "CreatedOn": "2023-05-05T15:37:46.323734",
    //         "Inward": 0,
    //         "Percentage": ""
    //     },
    //     {
    //         "id": 120,
    //         "OrderDate": "2023-05-05",
    //         "FullOrderNumber": "1",
    //         "DeliveryDate": "2023-05-05",
    //         "CustomerID": 4,
    //         "Customer": "Krupa Traders",
    //         "SupplierID": 5,
    //         "Supplier": "Katraj Division",
    //         "OrderAmount": "63000.00",
    //         "Description": "",
    //         "OrderType": 1,
    //         "POType": "Regular PO",
    //         "BillingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "ShippingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "CreatedBy": 5,
    //         "CreatedOn": "2023-05-05T15:37:46.323734",
    //         "Inward": 0,
    //         "Percentage": ""
    //     },
    //     {
    //         "id": 121,
    //         "OrderDate": "2023-05-05",
    //         "FullOrderNumber": "1",
    //         "DeliveryDate": "2023-05-05",
    //         "CustomerID": 4,
    //         "Customer": "Krupa Traders",
    //         "SupplierID": 5,
    //         "Supplier": "Katraj Division",
    //         "OrderAmount": "63000.00",
    //         "Description": "",
    //         "OrderType": 1,
    //         "POType": "Regular PO",
    //         "BillingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "ShippingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "CreatedBy": 5,
    //         "CreatedOn": "2023-05-05T15:37:46.323734",
    //         "Inward": 0,
    //         "Percentage": ""
    //     },
    //     {
    //         "id": 122,
    //         "OrderDate": "2023-05-05",
    //         "FullOrderNumber": "1",
    //         "DeliveryDate": "2023-05-05",
    //         "CustomerID": 4,
    //         "Customer": "Krupa Traders",
    //         "SupplierID": 5,
    //         "Supplier": "Katraj Division",
    //         "OrderAmount": "63000.00",
    //         "Description": "",
    //         "OrderType": 1,
    //         "POType": "Regular PO",
    //         "BillingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "ShippingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "CreatedBy": 5,
    //         "CreatedOn": "2023-05-05T15:37:46.323734",
    //         "Inward": 0,
    //         "Percentage": ""
    //     },
    //     {
    //         "id": 123,
    //         "OrderDate": "2023-05-05",
    //         "FullOrderNumber": "1",
    //         "DeliveryDate": "2023-05-05",
    //         "CustomerID": 4,
    //         "Customer": "Krupa Traders",
    //         "SupplierID": 5,
    //         "Supplier": "Katraj Division",
    //         "OrderAmount": "63000.00",
    //         "Description": "",
    //         "OrderType": 1,
    //         "POType": "Regular PO",
    //         "BillingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "ShippingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "CreatedBy": 5,
    //         "CreatedOn": "2023-05-05T15:37:46.323734",
    //         "Inward": 0,
    //         "Percentage": ""
    //     },
    //     {
    //         "id": 124,
    //         "OrderDate": "2023-05-05",
    //         "FullOrderNumber": "1",
    //         "DeliveryDate": "2023-05-05",
    //         "CustomerID": 4,
    //         "Customer": "Krupa Traders",
    //         "SupplierID": 5,
    //         "Supplier": "Katraj Division",
    //         "OrderAmount": "63000.00",
    //         "Description": "",
    //         "OrderType": 1,
    //         "POType": "Regular PO",
    //         "BillingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "ShippingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "CreatedBy": 5,
    //         "CreatedOn": "2023-05-05T15:37:46.323734",
    //         "Inward": 0,
    //         "Percentage": ""
    //     },

    //     {
    //         "id": 125,
    //         "OrderDate": "2023-05-05",
    //         "FullOrderNumber": "1",
    //         "DeliveryDate": "2023-05-05",
    //         "CustomerID": 4,
    //         "Customer": "Krupa Traders",
    //         "SupplierID": 5,
    //         "Supplier": "Katraj Division",
    //         "OrderAmount": "63000.00",
    //         "Description": "",
    //         "OrderType": 1,
    //         "POType": "Regular PO",
    //         "BillingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "ShippingAddress": "Shivdhan Plaza Pune Nashik Higway A/P Rajguru Nagar Tal Khed Dist Pune-410505",
    //         "CreatedBy": 5,
    //         "CreatedOn": "2023-05-05T15:37:46.323734",
    //         "Inward": 0,
    //         "Percentage": ""
    //     },

    // ]
    useEffect(() => {
        
        let subPageMode = url.GRN_STP_3
        const gobtnId = `gobtn-${subPageMode}`
        const filtersBody = JSON.stringify({
            FromDate: currentDate,
            ToDate: currentDate,
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
                // if (ele.hasSelect) {
                grnRef.push({
                    Invoice: ele.id,
                    Order: null,
                    ChallanNo: ele.FullOrderNumber,
                    Inward: true,
                    Challan: ''
                });
                isGRNSelect = isGRNSelect.concat(`${ele.id},`)
                challanNo = challanNo.concat(`${ele.FullOrderNumber},`)
            }
                // }
            );

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
            text: "OrderDate",
            dataField: "OrderDate",
        },
        {
            text: "FullOrderNumber",
            dataField: "FullOrderNumber",
        },
        {
            text: "Supplier",
            dataField: "Supplier",
        },
        {
            text: "OrderAmount",
            dataField: "OrderAmount",
        },
        {
            text: "Inward",
            dataField: "Inward",
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
            )
            }
        </ToolkitProvider>
    )
}

