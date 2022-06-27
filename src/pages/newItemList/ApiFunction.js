import { GET_FRANCHISE_NAME_LIST_ACTION_ACTION_SUCCESS } from "../../store/NewItemList/actionType";

 
 export function AxiosApiCallFunction(FromDate, ToDate,dispatch,axios) {
    // alert(`//web.chitalebandhu.in:8080/FoodERPWebAPIChart/api/StockReport/GetDateWiseStockReport?FromDate=${FromDate}&ToDate=${ToDate}&CompanyID=1&DivisionID=35`)
    var config = {
        method: 'get',
        url: `http://web1.chitalebandhu.in:8080/ChartjsAPI/api/MiniGeographic/GETFranchises`,
        headers: { "Access-Control-Allow-Origin": "*" }
    };
    // dispatch(SpinnerState(true));
    axios(config)
        .then(function (response) {
            // dispatch(SpinnerState(false));
            if (response.data.StatusCode === 200) {
                
                dispatch(GET_FRANCHISE_NAME_LIST_ACTION_ACTION_SUCCESS(response.data.data))
            } else {
                // dispatch(GetPosStockReportDataActionSuccess([]))
                alert("Data Not Found")
            }
        })
        .catch(function (error) {
            // dispatch(SpinnerState(false));
            // dispatch(GetPosStockReportDataActionSuccess([]))
            console.log('error', error);
            alert("NetWork Error")
        });
}



export function AxiosApiCallFunction1(FromDate, ToDate) {
    // alert(`//web.chitalebandhu.in:8080/FoodERPWebAPIChart/api/StockReport/GetDateWiseStockReport?FromDate=${FromDate}&ToDate=${ToDate}&CompanyID=1&DivisionID=35`)
    // var config = {
    //     method: 'get',
    //     url: `//web.chitalebandhu.in:8080/FoodERPWebAPIChart/api/StockReport/GetDateWiseStockReport?FromDate=${FromDate}&ToDate=${ToDate}&CompanyID=1&DivisionID=35`,
    //     headers: { "Access-Control-Allow-Origin": "*" }
    // };
    // dispatch(SpinnerState(true));
    // axios(config)
    //     .then(function (response) {
    //         // dispatch(SpinnerState(false));
    //         if (response.data.StatusCode === 200) {
    //             // dispatch(GetPosStockReportDataActionSuccess(response.data.data))
    //         } else {
    //             // dispatch(GetPosStockReportDataActionSuccess([]))
    //             alert("Data Not Found")
    //         }
    //     })
    //     .catch(function (error) {
    //         dispatch(SpinnerState(false));
    //         dispatch(GetPosStockReportDataActionSuccess([]))
    //         console.log('error', error);
    //         alert("NetWork Error")
    //     });
}