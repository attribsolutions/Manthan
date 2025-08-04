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
    const mergeInfo = [];

    invoices.forEach((invoice) => {
        // 🔹 Header row (visual title per invoice)
        tableRows.push([
            {
                content: `Invoice: ${invoice.FullInvoiceNumber} | Date: ${invoice.InvoiceDate}`,
                colSpan: 8,
                styles: { halign: "left", fontStyle: "bold" },
                isHeader: true
            }
        ]);

        let invoiceTotal = 0;
        invoice.InvoiceItems.forEach((item, index) => {
            tableRows.push([
                invoice.FullInvoiceNumber,
                date_dmy_func(invoice.InvoiceDate),
                `${invoice.CustomerName} / ${invoice.PartyName}`,
                item.ItemName,
                item.Quantity,
                item.Rate,
                item.GSTPercentage,
                item.Amount
            ]);
            invoiceTotal += Number(item.Amount);

            if (index === 0 && invoice.InvoiceItems.length > 1) {
                mergeInfo.push({
                    rowIndex: tableRows.length - 1,
                    span: invoice.InvoiceItems.length
                });
            }
        });

        // 🔹 Total row
        tableRows.push([
            '', '', '', { content: 'Total', styles: { fontStyle: 'bold', halign: 'right' } },
            '', '', '',
            { content: invoiceTotal.toFixed(2), styles: { fontStyle: 'bold', halign: 'right' }, isTotal: true }
        ]);
    });

    drawBorder(doc);
    pageHeader(doc);

    doc.autoTable({
        startY: doc.previousAutoTable.finalY,
        head: [tableColumns],
        body: tableRows,
        theme: "grid",
        margin: { left: 27, right: 27, top: 115 },
        styles: { fontSize: 9 },
        bodyStyles: {
            textColor: [30, 30, 30],
            cellPadding: 3,
            fontSize: 7,
            lineColor: [0, 0, 0],
        },
        headerStyles: {
            cellPadding: 3,
            lineWidth: 0.3,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',
            fillColor: "white",
            textColor: "black",
            fontSize: 7,
            lineColor: "black"
        },
        didParseCell: function (data) {
            const row = data.row;
            const colIndex = data.column.index;

            // 🟫 Style for invoice header
            if (row.raw[0]?.isHeader) {
                data.cell.styles.fontStyle = "bold";
                data.cell.colSpan = 8;
            }

            // 🟫 Row-span logic for Invoice No, Date, Customer
            const merge = mergeInfo.find(m => m.rowIndex === row.index);
            if (merge && colIndex < 3) {
                data.cell.rowSpan = merge.span;
            }

            // 🟫 Hide duplicate text for merged rows
            if (mergeInfo.some(m => row.index > m.rowIndex && row.index < m.rowIndex + m.span) && colIndex < 3) {
                data.cell.text = "";
            }

            // ✅ Right-align Qty, Rate, GST%, Amount
            if ([4, 5, 6, 7].includes(colIndex)) {
                data.cell.styles.halign = 'right';
            }

            // 🟫 Total row styling
            if (row.raw[colIndex]?.isTotal) {
                data.cell.styles.fontStyle = "bold";
                data.cell.styles.halign = 'right';
            }
        }

    });

    window.open(doc.output("bloburl"));
}



