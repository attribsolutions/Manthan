import jsPDF from "jspdf";



import "jspdf-autotable";
import { date_dmy_func, GET_ERP_IMG, loginUserDetails } from "../../components/Common/CommonFunction";



const pageHeader = (doc) => {
    doc.addFont("Arial", 'Normal');
    doc.setFont('Arial');

    doc.addImage(GET_ERP_IMG().Logo, 'PNG', 33, 18, 60, 40, null, 'FAST');

    doc.setFontSize(15);
    doc.text('Item Sale Report', 250, 40);

    doc.setFont('Tahoma');
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');

    const UserDetails = loginUserDetails();

    var options3 = {
        didDrawCell: (data1) => {
            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2;
                let y = data1.cursor.y + 10;
                doc.setFontSize(9);
                doc.setFont(undefined, 'bold');
                doc.text('Party: ', x, y);
            }
            if (rowIdx === 1 && colIdx === 0) {
                let x = data1.cursor.x + 2;
                let y = data1.cursor.y + 10;
                doc.setFontSize(9);
                doc.setFont(undefined, 'bold');
                doc.text('Party Address: ', x, y);
            }
            if (rowIdx === 2 && colIdx === 0) {
                let x = data1.cursor.x + 2;
                let y = data1.cursor.y + 10;
                doc.setFontSize(9);
                doc.setFont(undefined, 'bold');
                doc.text('Date: ', x, y);
            }
        },
        margin: { top: 25, left: 27, right: 27 },
        theme: 'grid',
        styles: { fontSize: 8 },
        showHead: 'always',
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 3,
            fontSize: 9,
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: { valign: "top", columnWidth: 542, halign: 'left' }
        },
        startY: 65
    };

    const Column = [""];
    const Row = [
        [`                   ${UserDetails.PartyName}`],
        [`                          ${UserDetails.PartyAddress}`],
        [`                       ${date_dmy_func()}- ${date_dmy_func()}`],
    ];

    doc.autoTable(Column, Row, options3);
};

function drawBorder(doc) {
    doc.setDrawColor('black');
    doc.line(569, 17, 27, 17);    // Top
    doc.line(27, 815, 27, 17);    // Left
    doc.line(569, 815, 569, 17);  // Right
    doc.line(569, 815, 27, 815);  // Bottom   
}

export function PeriodWiseInvoiceReport(invoices) {
    const doc = new jsPDF('p', 'pt', 'a4');

    const tableColumns = ["Invoice No", "Date", "Customer / Party", "Item Name", "Qty", "Rate", "GST%", "Amount"];
    const tableRows = [];

    invoices.forEach((invoice) => {
        // 🔹 Add a header row for the invoice (spanning multiple columns visually)
        tableRows.push([
            { content: `Invoice: ${invoice.FullInvoiceNumber} | Date: ${invoice.InvoiceDate}`, colSpan: 8, styles: { halign: "left", fillColor: [220, 220, 220], fontStyle: "bold" } }
        ]);

        // 🔹 Add item rows for this invoice
        invoice.InvoiceItems.forEach((item) => {
            tableRows.push([
                invoice.FullInvoiceNumber,
                invoice.InvoiceDate,
                `${invoice.CustomerName} / ${invoice.PartyName}`,
                item.ItemName,
                item.Quantity,
                item.Rate,
                item.GSTPercentage,
                item.Amount
            ]);
        });


    });

    // 3️⃣ SINGLE AUTOTABLE
    drawBorder(doc)
    pageHeader(doc)
    doc.autoTable({
        startY: 40,
        head: [tableColumns],
        body: tableRows,
        startY: doc.previousAutoTable.finalY,
        theme: "grid",
        margin: { left: 27, right: 27, top: 115 },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [211, 211, 211] },
        didParseCell: function (data) {
            // ✅ Make invoice header rows bold and grey
            if (data.row.raw[0]?.colSpan === 8) {
                data.cell.styles.fillColor = data.row.raw[0].styles.fillColor;
                data.cell.styles.fontStyle = "bold";
            }
        }
    });

    window.open(doc.output("bloburl"));
}





