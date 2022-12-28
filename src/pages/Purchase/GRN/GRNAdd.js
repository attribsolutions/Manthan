import {
    Button,
    Col,
    Dropdown,
    DropdownMenu,
    DropdownToggle,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import React, { useEffect, useState } from "react";
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import { useHistory } from "react-router-dom";
import { getSupplierAddress } from "../../../store/CommonAPI/SupplierRedux/actions"
import { AlertState, BreadcrumbFilterSize } from "../../../store/actions";
import { basicAmount, GstAmount, handleKeyDown, Amount } from "../Order/OrderPageCalulation";
import '../../Order/div.css'
import { GRN_lIST } from "../../../routes/route_url";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import Breadcrumb from "../../../components/Common/Breadcrumb3";
import { getGRN_itemMode2_Success, postGRN, postGRNSuccess } from "../../../store/Purchase/GRNRedux/actions";
import { mySearchProps } from "../../../components/Common/ComponentRelatedCommonFile/MySearch";
import { createdBy, currentDate, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import FeatherIcon from "feather-icons-react";


let initialTableData = []

const GRNAdd = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [pageMode, setPageMode] = useState("save");
    const [userAccState, setUserPageAccessState] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const [grnDate, setgrnDate] = useState(currentDate);
    const [orderAmount, setOrderAmount] = useState(0);
    const [grnDetail, setGrnDetail] = useState({});
    const [grnItemList, setgrnItemList] = useState([]);
    const [openPOdrp, setopenPOdrp] = useState(false);
    const [openPOdata, setopenPOdata] = useState([]);

    useEffect(() => {
        dispatch(getSupplierAddress())
    }, [])

    const {
        items,
        postMsg,
        userAccess,
    } = useSelector((state) => ({
        supplierAddress: state.SupplierReducer.supplierAddress,
        items: state.GRNReducer.GRNitem,
        postMsg: state.GRNReducer.postMsg,
        updateMsg: state.GRNReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageFieldList,
    }));

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) { locationPath = props.masterPath; };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserPageAccessState(userAcc)
        };
    }, [userAccess])

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty("editValue")

    useEffect(() => {
        if ((items.Status === true) && (items.StatusCode === 200)) {
            const grnItems = items.Data
            grnItems.OrderItem.forEach((ele, k) => {
                ele.id = k + 1;
                ele["poQuantity"] = ele.Quantity
                ele["Quantity"] = ''

                ele["poAmount"] = ele.Amount
                ele["Amount"] = 0
                ele["BatchDate"] = currentDate
                ele["BatchCode"] = '0'
                ele["delbtn"] = false

            });
            initialTableData = []
            let details = { ...grnItems }
            initialTableData = details.OrderItem;
            setgrnItemList(initialTableData)
            details.OrderItem = []

            setGrnDetail(details)

            let myArr = grnItems.challanNo.split(",");
            let newArr = myArr.map(i => ({ Name: i, hascheck: false }))
            setopenPOdata(details.GRNReferences)
            items.Status = false
            dispatch(getGRN_itemMode2_Success(items))

            dispatch(BreadcrumbFilterSize(`${"GRN Amount"} :${grnItems.OrderAmount}`))
        }

    }, [items])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postGRNSuccess({ Status: false }))
            saveDissable(false);//save Button Is enable function
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: GRN_lIST,
            }))

        } else if (postMsg.Status === true) {
            saveDissable(false);//save Button Is enable function
            dispatch(postGRNSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])


    function val_onChange(val, row, type) {

        if (type === "qty") {
            row["Quantity"] = val;
        }
        else {
            row["Rate"] = val
        }
        const amount = Amount(row)
        row["Amount"] = amount
        try {
            document.getElementById(`abc${row.id}`).innerText = amount
           
        }
        catch { alert("`abc${row.id}`") }

        let sum = 0
        grnItemList.forEach(ind => {
            sum = sum + parseFloat(ind.Amount)
        });
        setOrderAmount(sum.toFixed(2))
        dispatch(BreadcrumbFilterSize(`${"GRN Amount"} :${sum.toFixed(2)}`))
    }

    const pagesListColumns = [
        {//------------- ItemName column ----------------------------------
            text: "Item Name",
            dataField: "ItemName",
            sort: true,
            formatter: (value, row) => (
                <div className=" mt-2">
                    <span>{value}</span>
                </div>
            ),
        },
        {//------------- Quntity first column ----------------------------------
            text: "PO-QTY",
            dataField: "poQuantity",
            sort: true,
            formatter: (value, row, k) => {
                debugger
                return (
                    <samp className="font-asian">{value}</samp>
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center', text: "end" };
            }
        },
        {//  ------------Quntity column -----------------------------------  
            text: "GRN-QTY",
            dataField: "",
            sort: true,
            formatter: (value, row, k) => {
                try {
                    document.getElementById(`Quantity${k}`).value = row.Quantity
                } catch (e) { }
                return (
                    <span >
                        <Input type="text"
                            id={`Quantity${k}`}
                            defaultValue={row.Quantity}
                            className="text-end"
                            autoComplete="off"
                            key={row.Quantity}
                            onChange={(e) => {
                                const val = e.target.value
                                let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
                                if ((isnum) || (val === '')) {
                                    val_onChange(val, row, "qty")
                                } else {
                                    document.getElementById(`Quantity${k}`).value = row.Quantity
                                }
                            }}
                            onKeyDown={(e) => handleKeyDown(e, grnItemList)}
                        />
                    </span>
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center' };
            }
        },

        {  //------------- Unit column ----------------------------------
            text: "Unit",
            dataField: "",
            sort: true,
            formatter: (value, row, key) => {
                if (row.UnitName === undefined) {
                    row["Unit"] = row.UnitDetails[0].Unit
                    row["UnitName"] = row.UnitDetails[0].UnitName
                    row["BaseUnitQuantity"] = row.UnitDetails[0].BaseUnitQuantity
                }
                return (
                    <Select
                        classNamePrefix="select2-selection"
                        id={"ddlUnit"}
                        defaultValue={{ value: row.Unit, label: row.UnitName }}
                        options={
                            row.UnitDetails.map(i => ({
                                label: i.UnitName,
                                value: i.Unit,
                                baseUnitQty: i.BaseUnitQuantity
                            }))
                        }
                        onChange={e => {
                            row["Unit"] = e.value;
                            row["UnitName"] = e.label
                            row["BaseUnitQuantity"] = e.baseUnitQty
                        }}
                    >
                    </Select >
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '150px', textAlign: 'center' };
            }

        },

        {  //-------------Rate column ----------------------------------
            text: "Rate",
            dataField: "Rate",
            sort: true,
            formatter: (value, row, k) => {
                if (row.Rate === undefined) { row["Rate"] = 0 }
                if (row.Amount === undefined) { row["Amount"] = 0 }
                return (
                    <span className="text-right" >
                        <Input
                            type="text"
                            id={`Ratey${k}`}
                            className="border-0 text-end"
                            defaultValue={row.Rate}
                            disabled={(row.GST === '') ? true : false}
                            onChange={e => {
                                row["Rate"] = e.target.value;
                                const qty = document.getElementById(`Quantity${k}`)
                                const val = e.target.value
                                if (val > 0) {
                                    val_onChange(val, row, "rate")
                                    qty.disabled = false
                                } else {
                                    val_onChange(0, row, "rate")
                                    qty.disabled = true
                                }
                            }}
                            onKeyDown={(e) => handleKeyDown(e, items)}
                        />
                    </span>
                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center' };
            }
        },
        {//------------- GST column ------------------------------------
            text: "GST %",
            dataField: "GSTPercentage",
            sort: true,
            formatter: (value, row) => (
                <div className="text-center mt-2">
                    <span>{value}</span>
                </div>


            ),
            headerStyle: (colum, colIndex) => {
                return { width: '70px', textAlign: 'center', text: "left" };
            }

        },
        {//------------- ItemName column ----------------------------------
            text: "Amount",
            dataField: "",
            sort: true,
            formatter: (value, row, k) => (
                <div className="row mt-1">
                    <div className="col ">
                        <samp id={`abc${row.id}`}>{row.Amount}</samp>
                    </div>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center', text: "center" };
            }
        },
        {//------------- Batch Code column ----------------------------------
            text: "BatchCode",
            dataField: "",
            sort: true,
            formatter: (value, row, k) => {
                try {
                    document.getElementById(`Batch${k}`).value = row.BatchCode
                } catch (e) { }
                return (
                    <Input type="text"
                        id={`Batch${k}`}
                        placeholder="Batch Code..."
                        className="text-end "
                        defaultValue={row.BatchCode}
                        onChange={e => { row["BatchCode"] = e.target.value }}
                        autoComplete="off"
                    />
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "center" };
            }
        },
        {//------------- Batch Date column ----------------------------------
            text: "Batch Date",
            dataField: "",
            sort: true,
            formatter: (value, row, k) => {
                try {
                    document.getElementById(`BatchDate${k}`).value = row.BatchDate
                } catch (e) { }
                return (
                    <Flatpickr
                        className="form-control d-block p-2 bg-white text-dark"
                        placeholder="Batch Date..."
                        id={`BatchDate${k}`}

                        value={row.BatchDate}
                        data-enable-time
                        options={{
                            altInput: true,
                            altFormat: "d-m-Y",
                            dateFormat: "Y-m-d",
                        }}
                        onChange={(e, date) => { row.BatchDate = date }}
                    />
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "center" };
            }
        },
        {//------------- Action column ----------------------------------
            text: "Action",
            dataField: "",
            formatter: (value, row, k, a, v) => (
                <div className="d-flex justify-Content-center mt-2" >
                    <div> <Button
                        type="button"
                        data-mdb-toggle="tooltip" data-mdb-placement="top"
                        onClick={(e) => copybtnOnclick(row)}
                        className="badge badge-soft-primary font-size-12 btn btn-primary
                     waves-effect waves-light w-xxs border border-light"
                    >
                        <i className="bx bxs-copy font-size-8 "></i>
                    </Button ></div>

                    <div >
                        {row.delbtn ? <div >
                            <Button
                                type="button"
                                data-mdb-toggle="tooltip" data-mdb-placement="top"
                                onClick={(e) => deletebtnOnclick(row)}
                                className="badge badge-soft-danger font-size-12 btn btn-danger
                                      waves-effect waves-light w-xxs border border-light"
                            >
                                <i class="mdi mdi-delete font-size-8 "></i>
                            </Button >
                        </div>
                            : null}

                    </div>
                </div>

            ),
            headerStyle: (colum, colIndex) => {
                return { width: '30px', textAlign: 'center', text: "center" };
            }
        },
    ];

    const defaultSorted = [
        {
            dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pageOptions = {
        sizePerPage: (grnItemList.length + 2),
        totalSize: 0,
        custom: true,
    };

    const copybtnOnclick = (r) => {
        const id = r.id
        const newArr = []
        let list = [...initialTableData];

        list.forEach(element => {

            if (element.id < id) {
                newArr.push(element)
            }
            else if (element.id === id) {
                newArr.push(element);
                const ele = { ...element }
                ele.id = element.id + 1
                ele.delbtn = true
                ele.Quantity = 0
                newArr.push(ele)
            }
            else {
                const ele1 = { ...element }
                ele1.id = element.id + 1
                newArr.push(ele1)
            }
        });

        initialTableData = newArr
        setgrnItemList(newArr)

    }
    const deletebtnOnclick = (r) => {
        const list = [...initialTableData];
        const newArr = list.filter(i => { return (!(i.id === r.id)) })
        initialTableData = newArr
        setgrnItemList(newArr)

    }


    const saveHandeller = () => {

        const itemArr = []
        grnItemList.forEach(i => {
            if ((i.Quantity > 0)) {
                const basicAmt = parseFloat(basicAmount(i))
                const cgstAmt = (GstAmount(i))

                const arr = {
                    Item: i.Item,
                    Quantity: i.Quantity,
                    MRP: i.MRP,
                    ReferenceRate: i.Rate,
                    Rate: i.Rate,
                    Unit: i.Unit,
                    BaseUnitQuantity: i.Quantity,
                    GST: i.GST,
                    BasicAmount: basicAmt.toFixed(2),
                    GSTAmount: cgstAmt.toFixed(2),
                    Amount: i.Amount,

                    CGST: (cgstAmt / 2).toFixed(2),
                    SGST: (cgstAmt / 2).toFixed(2),
                    IGST: 0,
                    CGSTPercentage: (i.GSTPercentage / 2),
                    SGSTPercentage: (i.GSTPercentage / 2),
                    IGSTPercentage: 0,

                    BatchDate: i.BatchDate,
                    BatchCode: i.BatchCode,
                    DiscountType: "0",
                    Discount: "0.00",
                    DiscountAmount: "0.00",
                    TaxType: "GST",

                }
                itemArr.push(arr)
            };
        })


        if (itemArr.length === 0) {
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "Please Enter One Item Quantity",
                RedirectPath: false,
                AfterResponseAction: false
            }));
            return
        }
        const jsonBody = JSON.stringify({
            GRNDate: grnDate,
            Customer: grnDetail.Customer,
            GRNNumber: 1,
            GrandTotal: orderAmount,
            Party: grnDetail.Supplier,
            CreatedBy: createdBy(),
            UpdatedBy: 1,
            GRNItems: itemArr,
            GRNReferences: openPOdata

        });

        saveDissable(true);//save Button Is dissable function

        if (pageMode === "edit") {
        } else {

            dispatch(postGRN(jsonBody))
        }
    }

    if (!(userAccState === "")) {
        return (
            <React.Fragment>
                <MetaTags>
                    <title>{userAccState.PageHeading}| FoodERP-React FrontEnd</title>
                </MetaTags>
                <div className="page-content" >
                    <Breadcrumb
                        pageHeading={userAccState.PageHeading}
                        showCount={true}
                    />
                    <div className="px-2 mb-1  c_card_header " style={{ marginTop: "-15px" }} >
                        <Row>
                            <Col sm={5}>

                                <FormGroup className=" row mt-2 " >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "130px" }}>GRN Date</Label>
                                    <Col sm="7">
                                        <Flatpickr
                                            name="grndate"
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                defaultDate: "today"
                                            }}
                                            onChange={(e, date) => { setgrnDate(date) }}
                                        />
                                    </Col>
                                </FormGroup>



                                <FormGroup className=" row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Supplier Name</Label>
                                    <Col md="7">
                                        < Input
                                            style={{ backgroundColor: "white" }}
                                            type="text" value={grnDetail.SupplierName} disabled={true} />
                                    </Col>
                                </FormGroup>

                                <FormGroup className=" row " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>PO Number</Label>
                                    <Col sm="7">
                                        <Input type="text"
                                            style={{ backgroundColor: "white" }}
                                            value={grnDetail.challanNo}
                                            placeholder="Enter Challan No" />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm={5}>
                                <FormGroup className=" row mt-2" >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Invoice Date</Label>
                                    <Col md="7">
                                        <Flatpickr
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                defaultDate: "today"
                                            }}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="mb-2 row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Invoice No</Label>
                                    <Col md="7">
                                        <Input type="text"
                                            placeholder="Enter Invoice No" />
                                    </Col>
                                </FormGroup>

                                <FormGroup className="mb-2 row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Close PO</Label>
                                    <Col md="7" style={{ marginLeft: "-14px" }}>
                                        {
                                            openPOdata.length === 1 ?
                                                <Input
                                                    type="checkbox"
                                                    style={{ paddingTop: "7px" }}
                                                    placeholder="Enter Invoice No"
                                                    onChange={(e) => openPOdata[0].Inward = e.target.checked}
                                                />
                                                :
                                                <Dropdown
                                                    className="d-none d-lg-inline-block ms-1"

                                                    isOpen={openPOdrp}
                                                    toggle={() => {
                                                        setopenPOdrp(!openPOdrp)
                                                    }}
                                                >
                                                    <DropdownToggle
                                                        className="btn header-item noti-icon mt-n2 mb-n3 "
                                                        tag="button"
                                                    >
                                                        <FeatherIcon
                                                            icon="square"
                                                            className="icon-sm text-primary"
                                                        />
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-lg dropdown-menu-custom"  >
                                                        <Row className="row  g-0 " >
                                                            {openPOdata.map((index, key) => {
                                                                return (
                                                                    <Col className="col col-6 dropdown-icon-item-custom  text-black "
                                                                    >
                                                                        <li onClick={e => {
                                                                            openPOdata[key].Inward = !openPOdata[key].Inward
                                                                            document.getElementById(`hasInwardCheck${key}`).checked = openPOdata[key].Inward;
                                                                        }} >
                                                                            <Row className="row ">
                                                                                <Col className=" col user-select ">
                                                                                    <li>
                                                                                        <Label className="" >{index.ChallanNo}</Label>
                                                                                    </li>
                                                                                </Col>

                                                                                <Col className=" col  mt-2" style={{ paddingLeft: "inherit" }}>
                                                                                    <Input
                                                                                        id={`hasInwardCheck${key}`}
                                                                                        className="col col-2 text-black "
                                                                                        type="checkbox"
                                                                                        defaultChecked={openPOdata[key].Inward}
                                                                                    />
                                                                                </Col>
                                                                            </Row>
                                                                        </li>
                                                                    </Col>
                                                                )
                                                            })}
                                                        </Row>

                                                    </DropdownMenu>
                                                </Dropdown>
                                        }

                                    </Col>
                                </FormGroup>

                            </Col>
                        </Row>
                    </div>

                    <PaginationProvider pagination={paginationFactory(pageOptions)}>
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                defaultSorted={defaultSorted}
                                data={grnItemList}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps,) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table table-Rresponsive">
                                                    <BootstrapTable
                                                        responsive
                                                        bordered={false}
                                                        striped={false}
                                                        classes={"table  table-bordered table-hover"}
                                                        noDataIndication={
                                                            <div className="text-danger text-center ">
                                                                Items Not available
                                                            </div>
                                                        }
                                                        {...toolkitProps.baseProps}
                                                        {...paginationTableProps}
                                                    />
                                                    {mySearchProps(toolkitProps.searchProps)}
                                                </div>
                                            </Col>
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
                        (grnItemList.length > 0) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                            <SaveButton pageMode={pageMode} userAcc={userAccState}
                                module={"GRN"} onClick={saveHandeller}
                            />
                        </div>
                            :
                            <div className="row save1"></div>
                    }
                </div >

            </React.Fragment >
        )
    } else {
        return null
    }

}
export default GRNAdd

