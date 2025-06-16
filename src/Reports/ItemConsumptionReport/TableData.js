import { convertOnlyTimefunc, date_dmy_func, getFixedNumber, loginUserDetails } from "../../components/Common/CommonFunction";
import { numberWithCommas } from "../Report_common_function";


export const columns = [
    "Name",
    "Production Quantity",
    "Used Quantity",
    // "UOM",

];





export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]

export const Rows = (data) => {
    debugger;
    const returnArr = [];
    let totalProductionQty = 0;
    let totalUsedQty = 0;


    function OpeningBalance() {
        return [
            `Opening Balance ${numberWithCommas(Number(data.OpeningBalance).toFixed(2))}`,
            "Close",
            " ",

        ];
    };


    function ClosingBalance() {
        return [
            `Closing Balance ${numberWithCommas(Number(data.ClosingBalance).toFixed(2))}`,
            "Open",
            " ",

        ];
    };


    returnArr.push(OpeningBalance());
    data.FinishproductDetails.forEach((element) => {
        const ProductionQty = Number(element.ProductionQty) || 0;
        const UsedQty = Number(element.UsedQty) || 0;

        totalProductionQty += ProductionQty;
        totalUsedQty += UsedQty;



        const tableitemRow = [
            `${element?.FinishProduct}`,
            `${element?.ProductionQty}`,
            `${element?.UsedQty}`,
            // `${element?.UOM  }`,

        ];






        returnArr.push(tableitemRow);

    });

    const totalRow = [
        "Total", `${totalProductionQty.toFixed(2)}`,
        `${totalUsedQty.toFixed(2)}`,
    ];
    returnArr.push(totalRow);

    returnArr.push(ClosingBalance());
    return returnArr;
};





export const ReportHederRows = (data) => {
    debugger
    const UserDetails = loginUserDetails()
    var reportArray = [
        [`                   :${UserDetails.PartyAddress}`, ` `,],
        [`                       ${data.Date}`, `         ${data.RawMaterial}`,],
        // [`                  `, ,],
    ]
    return reportArray;
}