import { loginUserDetails } from "../../components/Common/CommonFunction";
import { numberWithCommas } from "../Report_common_function";


export const columns = [
    "Name",
    "Production Quantity",
    "Used Quantity",
    "UOM",

];



export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]

export const Rows = (data) => {
   
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

    function ReceiveQuantity() {
        const space = "          "; // 5 regular spaces (~20px approx in monospace font)
    
        return [
            `Receive/Tranfer Quantity : ${data.RecieveQuantity} ${data?.RawMaterialUnit}${space}` +
            `IB Receive Quantity : ${data.IBRecieveQuantity} ${data?.RawMaterialUnit}${space}` +
            `IB Sale Quantity : ${data.IBSaleQty} ${data?.RawMaterialUnit}`,
            "Open",
            ""
        ];
    }
    
    
    


    function ClosingBalance() {
        return [
            `Closing Balance ${numberWithCommas(Number(data.ClosingBalance).toFixed(2))}`,
            "Open",
            " ",

        ];
    };


    returnArr.push(ReceiveQuantity());
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
            `${data?.RawMaterialUnit}`,

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
   
    const UserDetails = loginUserDetails()
    var reportArray = [
        [`                   :${UserDetails.PartyAddress}`, ` `,],
        [`                       ${data.Date}`, `         ${data.RawMaterial}`,],
        // [`                  `, ,],
    ]
    return reportArray;
}