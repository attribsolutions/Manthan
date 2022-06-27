import React, { useEffect, useState } from "react";
import {
    DropdownToggle,
    DropdownItem,
    DropdownMenu,
    UncontrolledDropdown,
    Input,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { GetFranchiseSellData, GetFranchiseSellDataSuccess, GetFranchiseSell_Top_5_Success } from "../../../store/Chart/FranchiseSale_Chart/actions"
import { SpinnerState } from "../../../store/Utilites/Spinner/actions";
import  Breadcrumbs  from "../../../components/Common/Breadcrumb";

import ChartComponent from './ChartComponent'

export default function FranchiseSalePiaChart() {

    const axios = require('axios');
    const dispatch = useDispatch();
    const current = new Date();
    const month = current.getMonth() + 1;
    const currentDate = `${current.getFullYear()}-${month < 10 ? `0${month}` : `${month}`}-${current.getDate()<10?`0${current.getDate()}`:`${current.getDate()}`}`;

    function AxiosApiCallFunction(FromDate,Todate) {
        // alert(`http://web.chitalebandhu.in:8080/ChartjsAPI/api/SaleChart/GetChartHoriData?FromDate=${FromDate}&ToDate=${Todate}`)

        var config = {
            method: 'get',
            url: `http://web.chitalebandhu.in:8080/ChartjsAPI/api/SaleChart/GetTopTenItems?FromDate=${FromDate}&ToDate=${Todate}&Divisions=3,20`,
            headers: { "Access-Control-Allow-Origin": "*" }
        };
        dispatch(SpinnerState(true));
        axios(config)
            .then(function (response) {
                // console.log("GetFranchiseSellDataSuccess",response.data)
                dispatch(SpinnerState(false));
                if (response.data.status_code === 200) {
                    dispatch(GetFranchiseSell_Top_5_Success(response.data.data))
                } else {
                    dispatch(GetFranchiseSell_Top_5_Success({labels:[],PrimaryData: [],SecondaryData:[],Secondarylabels:[]}))
                    alert("Data Not Found")
                }
            })
            .catch(function (error) {
                dispatch(SpinnerState(false));
                console.log("GetFranchiseSellDataSuccess",error)
                dispatch(GetFranchiseSell_Top_5_Success({labels:[],PrimaryData: [],SecondaryData:[],Secondarylabels:[]}))
              
            });
    }
    const [ChartState, setChartState] = useState(true);
    const [SelectDateDropdownState, setSelectDateDropdownState] = useState('Today');

    const { GETApiData1, } = useSelector((state) => ({
        GETApiData1: state.FranchiseSale_ChartReducer.Top5ApiData,
    }));
 
    // Intitialization  Date = (select to-date) And (from_date_input) .....return => Todate and FromDate in string format 

    useEffect(() => {
        AxiosApiCallFunction(GetCurrentDate(),GetCurrentDate());
    }, [])

    function DropdownMenuAPICallhandller(name,date) {
       
        setSelectDateDropdownState(name)
        AxiosApiCallFunction(GetPeriviousDateByDays(date),GetCurrentDate());
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
                                        breadcrumbItem={"Top Bottom Sales"}
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
                </div>
                {
                    ((GETApiData1.PrimaryData.length) > 0) ?
                        <ChartComponent GETApiData={GETApiData1} />
                            :<div> <div> No data found</div>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            </div>
                }
            </div>
      
        </React.Fragment>
    );
}
