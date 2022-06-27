import React, { useState, useEffect, } from "react";
import {
    CardBody,
    Container,
    Table,
    UncontrolledDropdown,
    DropdownToggle,
    Input,
    DropdownItem,
    DropdownMenu,
} from "reactstrap";
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import { useDispatch, useSelector } from "react-redux";
import { MetaTags } from "react-meta-tags";
import { GetPOSSellDataSuccess } from "../../../store/Chart/FranchiseSale_Chart/actions"
import { SpinnerState } from "../../../store/Utilites/Spinner/actions";
import CountUp from "react-countup";


const PosSale = (props) => {
    var count = 1;
    const current = new Date();
    const month = current.getMonth() + 1;
    const currentDate = `${current.getFullYear()}-${month < 10 ? `0${month}` : `${month}`}-${current.getDate() < 10 ? `0${current.getDate()}` : `${current.getDate()}`}`;
    const axios = require('axios');
    const dispatch = useDispatch();
    const [SelectDateDropdownState, setSelectDateDropdownState] = useState('Today');

    useEffect(() => {
        AxiosApiCallFunction(GetCurrentDate(), GetCurrentDate())
    }, [])

    const { POSData, } = useSelector((state) => ({
        POSData: state.FranchiseSale_ChartReducer.POSDataApi,
    }));

    function GetPeriviousDateByDays(date) {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate() - date;
        if (dd <= 0) {
            mm = mm - 1;
            var d = new Date(2008, month + 1, 0);
            dd = dd + d.getDate();
        }

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        let date1 = dd + '-' + mm + '-' + yyyy;
        return date1
    }
    function GetCurrentDate() {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        let date1 = dd + '-' + mm + '-' + yyyy;
        return date1
    }
    function DropdownMenuAPICallhandller(name, date) {
        if (date === 1) {
            AxiosApiCallFunction(GetPeriviousDateByDays(date), GetPeriviousDateByDays(date))
        }
        else {
            AxiosApiCallFunction(GetPeriviousDateByDays(date), GetCurrentDate())
        }
        setSelectDateDropdownState(name)
    }

    function SelectDate_GO_Button_Handller() {
        let FromDate = document.getElementById("fromDate-input").value;
        let ToDate = document.getElementById("toDate-input").value;
        AxiosApiCallFunction(FromDate, ToDate);
    }

    function AxiosApiCallFunction(Fromdate, Todate) {
        // alert(`http://web.chitalebandhu.in:8080/FoodERPWebAPIChart/api/SendFranchisesPOSList/GetPOSSaleFranchisewise?FromDate=${Fromdate}&ToDate=${Todate}`)
        var config = {
            method: 'get',
            url: `http://web.chitalebandhu.in:8080/FoodERPWebAPIChart/api/SendFranchisesPOSList/GetPOSSaleFranchisewise?FromDate=${Fromdate}&ToDate=${Todate}`,
            headers: { "Access-Control-Allow-Origin": "*" }
        };
        dispatch(SpinnerState(true));
        axios(config)
            .then(function (response) {
                dispatch(SpinnerState(false));
                if (response.data.StatusCode === 200) {
                    dispatch(GetPOSSellDataSuccess(response.data.data))
                } else {
                    dispatch(GetPOSSellDataSuccess([]))
                    alert("Data Not Found")
                }
            })
            .catch(function (error) {
                dispatch(GetPOSSellDataSuccess([]))
                dispatch(SpinnerState(false));
                alert("NetWork Error")
                console.log('POS Error', error);
            });
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>POS Sales| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Breadcrumbs breadcrumbItem={"Sales Top 5 Items"} />
                <Container fluid>
                    <CardBody style={{ marginBlockEnd: "50px" }}>
                        <div className="d-flex   justify-content-between  gap-1 " style={{ marginRight: "20px", }}>
                            <div className="d-flex justify-content-start  gap-3">
                                <UncontrolledDropdown>
                                    <DropdownToggle type="button" className="btn btn-info border-dark">{SelectDateDropdownState}<i className="mdi mdi-chevron-down"></i></DropdownToggle>
                                    <DropdownMenu className="dropdownmenu-info">
                                        <DropdownItem onClick={() => { DropdownMenuAPICallhandller("Today", 0) }}>Today</DropdownItem>
                                        <DropdownItem onClick={() => { DropdownMenuAPICallhandller("Yesterday", 1) }}>Yesterday</DropdownItem>
                                        <DropdownItem onClick={() => { DropdownMenuAPICallhandller("Last 7 day", 7) }}>Last 7 Day</DropdownItem>
                                        <DropdownItem onClick={() => { DropdownMenuAPICallhandller("Last 30 day", 30) }}>Last 30 Day</DropdownItem>
                                        {/* <DropdownItem onClick={() => { DropdownMenuAPICallhandller("Current Month") }}>Current Month</DropdownItem> */}
                                        {/* <DropdownItem onClick={() => { DropdownMenuAPICallhandller("Last Month") }}>Last Month</DropdownItem> */}
                                        <div className="dropdown-divider"></div>
                                        <DropdownItem onClick={() => { setSelectDateDropdownState("Custom") }}>Custom</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>

                                {SelectDateDropdownState === "Custom" ?
                                    <React.Fragment>
                                        <div className="col">From Date</div>
                                        <div className="col">
                                            <Input
                                                type="date"
                                                defaultValue={currentDate}
                                                id="fromDate-input"
                                            />
                                        </div>
                                        <div className="col ">To Date</div>
                                        <div className="col">
                                            <Input
                                                className="form-control"
                                                type="date"
                                                defaultValue={currentDate}
                                                id="toDate-input"
                                            />
                                        </div>
                                        <div className="col ">
                                            <button className="btn btn-light   btn-outline-success" type="button"
                                                onClick={() => { SelectDate_GO_Button_Handller() }}
                                            >GO</button></div>
                                    </React.Fragment> :
                                    <></>}
                            </div>

                        </div>
                        <hr></hr>
                        {
                            POSData.map((i, k) => {
                                if (k % 3 === 0) {
                                    count = count + 3;
                                    return <div className="row gx-4 mt-4 " >
                                        {POSData.map((index, key) => {
                                            if (key + 1 === (count - 3)) {
                                                return (
                                                    <div className="col-sm-4">
                                                        <div className="card h-100 border border-success">
                                                            <div className="card-header bg-transparent border-success">
                                                                <h3 className="my-0 text-success text-center">{index.DivisionName} </h3>
                                                                <h6 className="my-0 text-success text-center">{index.Address} </h6>
                                                                <h6 className="my-0 text-success text-center">BillCount :{index.BillCount} </h6>

                                                            </div>
                                                            <CardBody id={key} >
                                                                <h1 className="my-0 text-center text-danger">
                                                                    &#x20b9; {(index.Amount).toLocaleString('en-IN')} </h1>
                                                                <Table className="table mb-0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Item Name</th>
                                                                            <th>Qty</th>
                                                                            <th>Amt</th>
                                                                            <th>%</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {index.Items.map((index1, indexKey) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td id={index1.ItemName + indexKey+key} >{index1.ItemName}</td>
                                                                                    <td id={index1.ItemName + indexKey+key} style={{ textAlign: "right" }}>{index1.Quantity}</td>
                                                                                    <td id={index1.ItemName+ indexKey+key} style={{ textAlign: "right" }}>{index1.Amount}</td>
                                                                                    <td id={index1.ItemName + indexKey+key} style={{ textAlign: "right" }}>{(index1.Amount * 100 / index.Amount).toFixed(1)}</td>
                                                                                </tr>

                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                </Table>
                                                            </CardBody>
                                                            <div className="my-0 text-center text-muted">Last Updated DateTime :{index.CreatedOn} </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            if ((key + 1 > (count - 3)) && (key + 1 < (count))) {
                                                // console.log("count in or inside  inside side formap function111111", index)
                                                return (
                                                    <div className="col-sm-4">
                                                        <div className="card h-100 border border-success">
                                                            <div className="card-header bg-transparent border-success">
                                                                <h3 className="my-0 text-success text-center">{index.DivisionName} </h3>
                                                                <h6 className="my-0 text-success text-center">{index.Address} </h6>
                                                                <h6 className="my-0 text-success text-center">BillCount :{index.BillCount} </h6>

                                                            </div>
                                                            <CardBody >
                                                                <h1 className="my-0 text-center text-danger">&#x20b9; {(index.Amount).toLocaleString('en-IN')} </h1>
                                                                <Table className="table mb-0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Item Name</th>
                                                                            <th>Qty</th>
                                                                            <th>Amt</th>
                                                                            <th>%</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {index.Items.map((index1,indexKey) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td id={index1.ItemName + indexKey+key}>{index1.ItemName}</td>
                                                                                    <td id={index1.ItemName + indexKey+key} style={{ textAlign: "right" }}>{index1.Quantity}</td>
                                                                                    <td id={index1.ItemName + indexKey} style={{ textAlign: "right" }}>{index1.Amount}</td>
                                                                                    <td id={index1.ItemName + indexKey+key} style={{ textAlign: "right" }}>{(index1.Amount * 100 / index.Amount).toFixed(1)}</td>
                                                                                </tr>

                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                </Table>
                                                            </CardBody>
                                                            <div className="my-0 text-center text-muted">Last Updated DateTime :{index.CreatedOn} </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                }
                                return (
                                    <></>)
                            })
                        }
                    </CardBody>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default PosSale;
