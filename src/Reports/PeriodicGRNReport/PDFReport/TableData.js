import { numberWithCommas } from "../../Report_common_function";
import { date_dmy_func } from "../../../components/Common/CommonFunction";

export const columns = [
    "GRN Date",
    "GRNNo",
    "PO",
    "Supplier",
    "Challan NO",
    "ItemName",
    "Quantity",
    "Rate",
    "Unit",
];

export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]

export const Rows = (data) => {
    const { StockDetails = [] } = data
    StockDetails.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];

    StockDetails.forEach((element, key) => {
        const tableitemRow = [
            `${element.GRNDate}`,
            `${element.GRNNo}`,
            `${element.PO}`,
            `${element.Supplier}`,
            `${element.ChallanNo}`,
            `${element.ItemName}`,
            `${(Number(element.Quantity).toFixed(2))}`,
            `${(Number(element.Rate).toFixed(2))}`,
            `${(Number(element.Unit).toFixed(2))}`,
        ];
        returnArr.push(tableitemRow);
    })
    return returnArr;
}

export const ReportHederRows = (data) => {
    var reportArray = [
        [`From Date:  ${date_dmy_func(data.FromDate)}`,],
        [`To Date:      ${date_dmy_func(data.ToDate)}`],
    ]
    return reportArray;
}