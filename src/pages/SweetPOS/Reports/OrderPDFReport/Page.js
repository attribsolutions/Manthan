import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import * as table from './TableData'
import { currentDate_dmy, CurrentTime } from "../../../../components/Common/CommonFunction";




var pageHeder = function (doc, data) {
    // style.pageHeder1(doc, data);
    style.reportHeder1(doc, data);
    // style.reportHeder2(doc, data);
    // style.reportHeder3(doc, data);

};


const FrenchiesesOrderReport = (data) => {
    let previousPageCount = 0;
    function generatePDF() {

        const doc = new jsPDF('p', 'pt', 'a4');
        const margin = {
            left: 30,
            right: 26,
            top: 50,
            bottom: 20,
        };

        const printWidth = doc.internal.pageSize.width - (margin.left + margin.right);
        const sections = 2;  // Number of sections per page
        const spacing = 5;
        const sectionWidth = (printWidth - ((sections - 1) * spacing)) / sections;

        // Iterate over each data set (or table) to be printed
        data.forEach((tableData, tableIndex) => {
            if (tableIndex >= 0) {
                doc.addPage(); // Add a new page for each table after the first one
            }

            pageHeder(doc, tableData);

            const lastTablePosition = tableData.initial_y;
            let startY = lastTablePosition;
            let currentSection = 1;
            let nextSection = 1;

            doc.autoTable({
                theme: 'grid',
                head: [table.columns_1],
                body: table.Rows_1({ OrderItem: tableData.OrderItem }),
                tableWidth: sectionWidth,
                headerStyles: {
                    cellPadding: 3,
                    lineWidth: 0.8,
                    valign: 'top',
                    fontStyle: 'bold',
                    halign: 'center',
                    fillColor: "white",
                    textColor: [0, 0, 0],
                    fontSize: 7,
                    rowHeight: 10,
                    lineColor: "black"
                },
                bodyStyles: {
                    columnWidth: 'wrap',
                    textColor: [30, 30, 30],
                    cellPadding: 3,
                    fontSize: 7,
                    lineColor: [6, 3, 1]
                },
                columnStyles: {
                    0: {
                        valign: "top",
                        columnWidth: 137,
                    },
                    1: {
                        columnWidth: 50,
                        halign: 'left',

                    },
                    2: {
                        columnWidth: 80,
                        halign: 'right',
                    },

                },
                margin: {
                    left: margin.left + ((nextSection - 1) * (sectionWidth + spacing)),
                    top: margin.top,
                    bottom: margin.bottom,
                },
                startY: lastTablePosition,
                rowPageBreak: 'avoid',
                didDrawPage({ table, pageNumber }) {

                    currentSection = nextSection;
                    nextSection = (nextSection % sections) + 1;

                    const shift = (nextSection - 1) * (sectionWidth + spacing);
                    table.settings.margin.left = margin.left + shift;

                    if (pageNumber === 1) {
                        table.settings.margin.top = lastTablePosition;
                    } else {
                        table.settings.margin.top = margin.top + 15;
                    }

                    if (nextSection > 1) {

                        doc.setPage(doc.internal.getNumberOfPages() - 1);
                    }




                },
                didDrawCell: (data1) => {
                    const rowIdx = data1.row.index;
                    const colIdx = data1.column.index;

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2;  // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    if (rowIdx === 0 && colIdx === 2) {

                        doc.line(startXVertical, startY1vertical + 2, startXVertical, endYvertical + 2); // Draw a vertical line
                        doc.line(startX, startY, endX, endY);

                    }

                    if (rowIdx !== 0 && colIdx === 2) {

                        doc.line(startXVertical, startY1vertical - 8, startXVertical, endYvertical - 8); // Draw a vertical line

                    }
                    debugger

                },

                didParseCell: (data1) => {
                    if (data1.row.cells[1].raw === "") {
                        data1.row.cells[0].colSpan = 3;
                        data1.row.cells[0].styles.halign = "left";
                        data1.row.cells[0].styles.fontSize = 8;
                        data1.row.cells[0].styles.fontStyle = "bold";
                    }
                    if (data1.row?.raw[3]?.IsHighlightItemInPrint) {

                        data1.row.cells[0].styles.fillColor = [211, 211, 211]
                        data1.row.cells[1].styles.fillColor = [211, 211, 211]
                        data1.row.cells[2].styles.fillColor = [211, 211, 211]

                    }
                },


            });

            // Ensure correct positioning for the next section
            const remainingVSpace = doc.internal.pageSize.height - margin.bottom - doc.lastAutoTable.finalY;

            if (remainingVSpace > 25) {
                nextSection = currentSection;
                startY = doc.lastAutoTable.finalY;
            } else {
                startY = margin.top;
                if (nextSection === 1) doc.addPage();
            }

            const pageCount = doc.internal.getNumberOfPages();

            doc.setFont('helvetica', 'Normal');

            if ((data.length - 1) === tableIndex) {
                for (let i = 0; i <= pageCount; i++) {
                    doc.setPage(i);

                    style.pageHeder1(doc, tableData);
                    style.reportHeder3(doc, tableData);
                    style.pageBorder(doc, tableData);

                    doc.setFont('helvetica', 'Normal');
                    doc.setFontSize(10);

                    doc.text('Print Date: ' + String(currentDate_dmy) + ' Time: ' + String(CurrentTime()), 30, 834);
                    // doc.text('Page ' + String(i) + ' of ' + String(pageCount), 500, 828);
                }
            }

        });

        // Delete the unused first empty page
        doc.deletePage(1);

        doc.setProperties({
            title: `POReport/${data[0].OrderDate}-${data[0].CustomerName}`
        });

        return doc;
    }

    // Function to generate, save and open the PDF report
    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(generatePDF().output('blob'));
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();
}

export default FrenchiesesOrderReport;























