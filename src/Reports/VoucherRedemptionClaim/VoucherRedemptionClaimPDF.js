
import jsPDF from "jspdf";
import "jspdf-autotable";
import { currentDate_dmy, CurrentTime } from "../../components/Common/CommonFunction";
import { numberWithCommas, toWords } from "../Report_common_function";


const columns = [
    "",
    "",
    "",
    "",
];



const Rows = (Data) => {

    function Header() {
        return [
            "Voucher Redeemption Claim",
            "",
            "",
            ""
        ];
    };
    function ShortName() {
        return [
            `${Data.SchemeShortName}`,
            "ShortName",
            "",
            ""
        ];
    };
    function PartyName() {
        return [
            "",
            `${Data.FranchiseName}`,
            "",
            "",
        ];
    }; function ClaimDetails() {
        return [
            "Month",
            `${new Date(Data.Month + "-01").toLocaleString('en-US', { year: 'numeric', month: 'long' })}`,
            "",
            "",
        ];
    }; function VoucherHeader() {
        return [
            `Franchise Name`,
            `Voucher Code Count`,
            `Claim Per Voucher`,
            `Total Claim Amount`,
        ];
    }; function VoucherHeaderDetails() {
        return [
            `${Data.FranchiseName}`,
            `${Data.VoucherCodeCount}`,
            `${Data.ClaimPerVoucher}`,
            `${numberWithCommas(Number(Data.recordsAmountTotal).toFixed(2))}`,
        ];
    }; function TotalAmount() {
        return [
            "Total",
            `${numberWithCommas(Number(Data.recordsAmountTotal).toFixed(2))}`,
            "",
            ""
        ];
    }; function TotalAmountInWords() {
        return [
            "Amount in Words",
            `${toWords(Number(Data.recordsAmountTotal))}`,
            "",
            "",
        ];
    };; function Stamp() {
        return [
            "Franchise Stamp And Signature",
            "",
            "",
            "",
        ];
    }; function Signature() {
        return [
            "ASM Signature",
            "",
            "",
            "",
        ];
    };

    function Empty() {
        return [
            "",
            "  ",
            "",
            "",
        ];
    };

    let returnArr = []
    returnArr.push(Header());
    returnArr.push(ShortName());
    returnArr.push(PartyName());
    returnArr.push(ClaimDetails());
    returnArr.push(Empty());
    returnArr.push(VoucherHeader());
    returnArr.push(VoucherHeaderDetails());
    returnArr.push(TotalAmount());
    returnArr.push(Empty());
    returnArr.push(TotalAmountInWords());
    returnArr.push(Empty());
    returnArr.push(Stamp());
    returnArr.push(Signature());

    return returnArr;

}

const tableBody = (doc, data) => {
    var options = {
        didParseCell: (Data) => {

            if (Data.row.cells[0].raw === "Voucher Redeemption Claim") {
                Data.row.cells[0].colSpan = 4
                Data.row.cells[0].styles.halign = "center"
                Data.row.cells[0].styles.fontSize = 15
                Data.row.cells[0].styles.fontStyle = "bold"

            }

            if (Data.row.cells[1].raw === "ShortName") {
                Data.row.cells[0].colSpan = 4
                Data.row.cells[0].styles.halign = "center"
                Data.row.cells[0].styles.fontSize = 12
                Data.row.cells[0].styles.fontStyle = "bold"

            }


            if (Data.row.cells[1].raw === data.FranchiseName) {
                Data.row.cells[1].colSpan = 3
                Data.row.cells[1].styles.halign = "center"
                Data.row.cells[1].styles.fontSize = 15
                Data.row.cells[1].styles.fontStyle = "bold"

            }


            if (Data.row.cells[0].raw === data.FranchiseName) {

                Data.row.cells[1].styles.halign = "right"
                Data.row.cells[2].styles.halign = "right"
                Data.row.cells[3].styles.halign = "right"


            }

            if (Data.row.cells[0].raw === "Franchise Name") {

                Data.row.cells[0].styles.fontStyle = "bold"
                Data.row.cells[1].styles.fontStyle = "bold"
                Data.row.cells[2].styles.fontStyle = "bold"
                Data.row.cells[3].styles.fontStyle = "bold"

            }

            if (Data.row.cells[0].raw === "Total") {
                Data.row.cells[1].colSpan = 3
                Data.row.cells[0].styles.fontStyle = "bold"
                Data.row.cells[1].styles.fontStyle = "bold"
                Data.row.cells[1].styles.halign = "right"

            }

            if (Data.row.cells[0].raw === "Amount in Words") {
                Data.row.cells[1].colSpan = 3
                Data.row.cells[0].styles.fontStyle = "bold"
                Data.row.cells[1].styles.fontStyle = "bold"
                Data.row.cells[1].styles.halign = "right"



            }





            if (Data.row.cells[0].raw === "Month") {
                Data.row.cells[1].colSpan = 3
                Data.row.cells[0].styles.fontStyle = "bold"

                Data.row.cells[1].styles.halign = "right"
            }
            if (Data.row.cells[1].raw === "  ") {
                Data.row.cells[0].colSpan = 4
                Data.row.cells[0].styles.fillColor = [200, 200, 200]

            }

            if (Data.row.cells[1].raw === "") {
                Data.row.cells[1].colSpan = 3
            }
            if (Data.row.cells[0].raw === "Franchise Stamp And Signature") {
                Data.row.cells[1].styles.cellPadding = 14
                Data.row.cells[0].styles.fontStyle = "bold"

            }
            if (Data.row.cells[0].raw === "ASM Signature") {
                Data.row.cells[1].styles.cellPadding = 15
                Data.row.cells[0].styles.fontStyle = "bold"

            }

        },

        margin: {
            left: 30, right: 25, top: 56
        },
        theme: 'grid',
        showHead: 'never',

        bodyStyles: {
            textColor: [30, 30, 30],
            cellPadding: 6,
            columnWidth: 'wrap',
            lineColor: [0, 0, 0],
        },
        columnStyles: {
            0: {

                halign: "top",
                fontSize: 9,
                columnWidth: 214,
            },
            1: {
                halign: "top",
                columnWidth: 111,
            },
            2: {
                halign: "top",
                columnWidth: 105,
            },
            3: {
                halign: "top",
                columnWidth: 105,
            },

        },
        tableLineColor: "black",
        startY: 20,

    };

    doc.autoTable(columns, Rows(data), options,);
    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)
    doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 30, 395,)
}


const voucherRedemptionClaimReport = (data) => {
    // debugger
    // var doc = new jsPDF('l', 'pt', 'a5');
    // tableBody(doc, data);
    // doc.setProperties({
    //     title: `Voucher Redeemption Claim/${data.FranchiseName}/${new Date(data.Month + "-01").toLocaleString('en-US', { year: 'numeric', month: 'long' })} `
    // });

    var doc = new jsPDF('l', 'pt', 'a5');
    data.tableList.forEach((data, index) => {
        if (index !== 0) {  // Add a new page only after the first iteration
            doc.addPage();
        }
        tableBody(doc, data);
        doc.setProperties({
            title: `Voucher Redeemption Claim/${data.FranchiseName}/${new Date(data.Month + "-01").toLocaleString('en-US', { year: 'numeric', month: 'long' })} `
        });
    });

    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));

        window.open(pdfUrl);
    }

    generateSaveAndOpenPDFReport();

}

export default voucherRedemptionClaimReport;
