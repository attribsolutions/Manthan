import React, { useEffect, useState } from "react";
import { HorizontalBar } from "react-chartjs-2";
// import { DataApi } from "./ChartJSData";
import {
    Button,
    DropdownToggle,
    DropdownItem,
    DropdownMenu,
    UncontrolledDropdown,
    Label,
    Input,
} from "reactstrap";
import AmountComponent from "./AmountComponent";
import BillsComponent from "./BillsComponent";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { GetFranchiseSellData, GetFranchiseSellDataSuccess } from "../../../store/Chart/FranchiseSale_Chart/actions"
import { SpinnerState } from "../../../store/Utilites/Spinner/actions";
import  Breadcrumbs  from "../../../components/Common/Breadcrumb";
export default function FranchiseSaleWithoutOther() {

    const axios = require('axios');
    const dispatch = useDispatch();
    const current = new Date();
    const month = current.getMonth() + 1;
    const currentDate = `${current.getFullYear()}-${month < 10 ? `0${month}` : `${month}`}-${current.getDate()<10?`0${current.getDate()}`:`${current.getDate()}`}`;
    function AxiosApiCallFunction(FromDate,Todate) {
        // alert(`http://web1.chitalebandhu.in:8080/ChartjsAPI/api/SaleChart/GetChartHoriData?FromDate=${FromDate}&ToDate=${Todate}`)

        var config = {
            method: 'get',
            url: `http://web1.chitalebandhu.in:8080/ChartjsAPI/api/SaleChart/GetChartHoriData?FromDate=${FromDate}&ToDate=${Todate}`,
            headers: { "Access-Control-Allow-Origin": "*" }
        };
        dispatch(SpinnerState(true));
        axios(config)
            .then(function (response) {
                dispatch(SpinnerState(false));
                if (response.data.StatusCode === 200) {
                    dispatch(GetFranchiseSellDataSuccess(response.data.data))
                } else {
                    dispatch(GetFranchiseSellDataSuccess({DataArray:[], DataArray1:[],CompanyLabels: [],}))
                    alert("Data Not Found")
                }
            })
            .catch(function (error) {
                dispatch(SpinnerState(false));
                alert("Network Error")
                dispatch(GetFranchiseSellDataSuccess({DataArray:[], DataArray1:[],CompanyLabels: [],}))
              
            });
    }
    const [ChartState, setChartState] = useState(true);
    const [SelectDateDropdownState, setSelectDateDropdownState] = useState('Today');

    const { GETApiData, } = useSelector((state) => ({
        GETApiData: state.FranchiseSale_ChartReducer.DataApi,
    }));

    // Intitialization  Date = (select to-date) And (from_date_input) .....return => Todate and FromDate in string format 

    useEffect(() => {
        AxiosApiCallFunction(GetCurrentDate(),GetCurrentDate());
    }, [])

    function DropdownMenuAPICallhandller(name,date) {
        if (date === 1) {
            AxiosApiCallFunction(GetPeriviousDateByDays(date), GetPeriviousDateByDays(date))
        }
        else {
            AxiosApiCallFunction(GetPeriviousDateByDays(date), GetCurrentDate())
        }
        setSelectDateDropdownState(name)
    }
    function GetPeriviousDateByDays(date)
    {
        const today = new Date();
        const yyyy = today.getFullYear();
        
        let mm = today.getMonth() + 1; // Months start at 0!
       
        let dd = today.getDate() - date;
        if(dd<=0)
        {
            mm=mm-1;
            var d = new Date(2008, month + 1, 0);
            dd=dd+d.getDate();
        }

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        let date1 = dd + '-' + mm + '-' + yyyy;
        //alert(date1)
       return date1
    }
    function GetCurrentDate()
    {
        const today = new Date();
        const yyyy = today.getFullYear();
        
        let mm = today.getMonth() + 1; // Months start at 0!
       
        let dd = today.getDate();
        

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        let date1 = dd + '-' + mm + '-' + yyyy;
       return date1
    }

    function SelectDate_GO_Button_Handller() {
        let FromDate = document.getElementById("fromDate-input").value;
        let ToDate = document.getElementById("toDate-input").value;
        AxiosApiCallFunction(FromDate, ToDate);
    }
    return (
        <React.Fragment>
            <MetaTags>
                <title>Franchise sale Chart| FoodERP-React FrontEnd</title>
            </MetaTags>
            <div className="page-content">
            <Breadcrumbs
                                        title={"Count :"}
                                        breadcrumbItem={"Franchise Sale"}
                                        IsButtonVissible={false}
                                        // SearchProps={toolkitProps.searchProps}
                                        // breadcrumbCount={TableListData.length}
                                        RedirctPath={false}
                                        IsSearch={false}
                                    />
                <div className="d-flex   justify-content-between  gap-1 " style={{ marginRight: "20px", marginTop: "10px" }}>
                    <div className="d-flex justify-content-start  gap-3">
                        <UncontrolledDropdown>
                            <DropdownToggle type="button" className="btn btn-info border-dark">{SelectDateDropdownState}<i className="mdi mdi-chevron-down"></i></DropdownToggle>
                            <DropdownMenu className="dropdownmenu-info">
                                <DropdownItem onClick={() => { DropdownMenuAPICallhandller("Today",0) }}>Today</DropdownItem>
                                <DropdownItem onClick={() => { DropdownMenuAPICallhandller("Yesterday",1) }}>Yesterday</DropdownItem>
                                <DropdownItem onClick={() => { DropdownMenuAPICallhandller("Last 7 day",7) }}>Last 7 Day</DropdownItem>
                                <DropdownItem onClick={() => { DropdownMenuAPICallhandller("Last 30 day",30) }}>Last 30 Day</DropdownItem>
                                {/* <DropdownItem onClick={() => { DropdownMenuAPICallhandller("Current Month") }}>Current Month</DropdownItem>
                                <DropdownItem onClick={() => { DropdownMenuAPICallhandller("Last Month") }}>Last Month</DropdownItem> */}
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
                    <div className="d-flex justify-content-end">
                        <Button className="btn btn-outline-warning"
                            onClick={() => { setChartState(!ChartState) }}>{ChartState ? "SHOW BILLS" : "SHOW AMOUNT"}</Button>
                    </div>
                </div>
                {/* <hr></hr> */}
                {
                    ((ChartState) && (GETApiData.CompanyLabels.length) > 0) ?
                        <AmountComponent GETApiData={GETApiData} />
                        : (((GETApiData.CompanyLabels.length) > 0) ?
                            <BillsComponent GETApiData={GETApiData} />
                            :<div> <div> No data found</div>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            </div>
                        )
                }
            </div>
        </React.Fragment>
    );
}
