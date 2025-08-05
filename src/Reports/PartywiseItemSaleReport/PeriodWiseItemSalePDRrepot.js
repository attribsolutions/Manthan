import jsPDF from "jspdf";
import "jspdf-autotable";
import { date_dmy_func, GET_ERP_IMG, getFixedNumber, loginUserDetails } from "../../components/Common/CommonFunction";

const PeriodWiseItemSale = (data) => {


    const doc = new jsPDF('p', 'pt', 'a4');
    const margin = 27;

    // 🔹 Draw outer border
    function drawBorder() {
        doc.setDrawColor('black');
        doc.line(569, 17, 27, 17);    // Top
        doc.line(27, 815, 27, 17);    // Left
        doc.line(569, 815, 569, 17);  // Right
        doc.line(569, 815, 27, 815);  // Bottom   
    }

    // 🔹 Header
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

    // 🔹 Table — ITEM ROW (spanning) + PARTY ROWS (no totals)
    function reportBody() {
        const headerTop = ["Party-RowSpan_2", ...Array.from({ length: 16 }, (_, i) => (i + 1).toString()), "Unit"];
        const headerBottom = ["", ...Array.from({ length: 15 }, (_, i) => (i + 17).toString()), "", "Total"];

        // ✅ Group by item
        const groupedByItem = {};
        data.forEach(({ InvoiceDate, ItemName, CustomerName, BaseItemUnitQuantity, BaseItemUnitName }) => {
            debugger
            const day = new Date(InvoiceDate).getDate();
            if (!groupedByItem[ItemName]) {
                groupedByItem[ItemName] = {};
            }
            if (!groupedByItem[ItemName][CustomerName]) {
                groupedByItem[ItemName][CustomerName] = { CustomerName, BaseItemUnitName, quantities: {} };
            }



            groupedByItem[ItemName][CustomerName].quantities[day] =
                (groupedByItem[ItemName][CustomerName].quantities[day] || 0) + BaseItemUnitQuantity;
        });

        const tableBody = [];




        Object.entries(groupedByItem).forEach(([ItemName, parties]) => {

            // 🔵 ITEM ROW FIRST — spans all columns
            const itemRow = new Array(19).fill("");
            itemRow[0] = `${ItemName}-ItemRow`;
            tableBody.push(itemRow);

            // ✅ Keep track of day-wise totals for this item
            let itemTotalsByDay = {};
            let grandTotalForItem = 0;

            const partyEntries = Object.values(parties);

            partyEntries.forEach((row, index) => {
                const totalQty = Object.values(row.quantities).reduce((a, b) => a + b, 0);

                // Row 1 → Days 1–16 + Unit
                const row1 = [`${row.CustomerName}-RowSpan_2`];
                for (let i = 1; i <= 16; i++) {
                    const qty = row.quantities[i] || "";
                    row1.push((getFixedNumber(qty, 2)));

                    // 🔢 Add to day-wise total
                    if (qty) itemTotalsByDay[i] = (itemTotalsByDay[i] || 0) + qty;
                }

                row1.push(row.BaseItemUnitName);

                // Row 2 → Days 17–31 + Total
                const row2 = [""];
                for (let i = 17; i <= 32; i++) {

                    const qty = row.quantities[i] || "";
                    row2.push((getFixedNumber(qty, 2)));

                    // 🔢 Add to day-wise total
                    if (qty) itemTotalsByDay[i] = (itemTotalsByDay[i] || 0) + qty;
                }
                row2.push(totalQty.toFixed(2));

                // ✅ Push party rows
                tableBody.push(row1);
                tableBody.push(row2);

                // ✅ Add separator row only if NOT last party
                if (index < partyEntries.length - 1) {
                    const row3 = ["..."];
                    for (let i = 17; i <= 32; i++) {
                        row3.push("...");
                    }
                    tableBody.push(row3);
                }

                // 🔢 Add to grand total
                grandTotalForItem += totalQty;
            });

            // ✅ 📍 Add **one more row3** before TOTAL row
            const beforeTotalRow = ["..."];
            for (let i = 17; i <= 32; i++) {
                beforeTotalRow.push("...");
            }
            tableBody.push(beforeTotalRow);

            // ✅ 📊 ITEM TOTAL ROW (day-wise total across all parties)
            const totalRow1 = [`Total-RowSpan_2`];

            // ➡ Days 1–16
            for (let i = 1; i <= 16; i++) {
                totalRow1.push(itemTotalsByDay[i] ? itemTotalsByDay[i].toFixed(2) : "");
            }
            totalRow1.push("Kg");

            const totalRow2 = ["Total"];
            // ➡ Days 17–31
            for (let i = 17; i <= 32; i++) {
                totalRow2.push(itemTotalsByDay[i] ? itemTotalsByDay[i].toFixed(2) : "");
            }
            totalRow2.push(grandTotalForItem.toFixed(2));

            // ✅ Add Total Rows to table
            tableBody.push(totalRow1);
            tableBody.push(totalRow2);
        });


        doc.autoTable({
            head: [headerTop, headerBottom],
            body: tableBody,
            startY: doc.previousAutoTable.finalY,
            theme: "grid",
            margin: { left: margin, right: margin, top: 115 },
            styles: {
                fontSize: 9,
                halign: "center",
                valign: "middle",
                lineWidth: 0.5
            },

            didParseCell: (data1) => {
                // ✅ PARTY cell spans 2 rows
                if (data1.row.cells[0].raw.includes("-RowSpan_2")) {
                    data1.row.cells[0].text[0] = data1.row.cells[0].raw.replace("-RowSpan_2", "");
                    data1.row.cells[0].rowSpan = 2;
                }


                if (data1.row.cells[0].raw.includes("Total")) {
                    data1.cell.styles.fontStyle = "bold";
                    data1.cell.styles.fontSize = 7;
                }

                if (data1.row.cells[0].raw.includes("...")) {
                    data1.row.cells[0].colSpan = 18;
                    data1.row.cells[0].styles.cellPadding = 0.5;
                    data1.row.cells[0].styles.fontSize = 1;
                    data1.cell.styles.fillColor = [220, 220, 220]; // light blue
                }

                // ✅ ITEM ROW spans across all columns
                if (data1.row.cells[0].raw.includes("-ItemRow")) {
                    data1.row.cells[0].text[0] = data1.row.cells[0].raw.replace("-ItemRow", "");
                    data1.row.cells[0].colSpan = 18;
                    data1.row.cells[0].styles.fontSize = 8
                    data1.cell.styles.fontStyle = "bold";
                    data1.cell.styles.halign = "left";
                }
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
            bodyStyles: {
                textColor: [30, 30, 30],
                cellPadding: 3,
                fontSize: 7,
                // columnWidth: 'wrap',
                lineColor: [0, 0, 0],
            },
            columnStyles: {
                0: { cellWidth: 70, halign: "left" },
                17: { cellWidth: 30, halign: "center" }
            }
        });
    }

    // 🔹 Footer
    function pageFooter() {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            drawBorder(doc);
            pageHeader(doc);

        }
    }

    // 🏗️ Build PDF
    drawBorder(doc);
    // pageHeader(doc);
    reportBody(doc);
    pageFooter(doc);

    const pdfUrl = URL.createObjectURL(doc.output('blob'));
    window.open(pdfUrl);
};

export default PeriodWiseItemSale;
