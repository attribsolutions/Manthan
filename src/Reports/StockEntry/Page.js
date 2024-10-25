import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import * as table from './TableData'
import { currentDate_dmy, CurrentTime } from "../../components/Common/CommonFunction";




var pageHeder = function (doc, data) {
    style.pageBorder(doc, data);
    style.pageHeder(doc, data);
    style.reportHeder3(doc, data);
};

function reportBody_1(doc, data) {
    style.pageBorder(doc, data);

}


const StockEntryReport = (data) => {
    debugger
    function generatePDF() {
        const doc = new jsPDF('p', 'pt', 'a4');

        const margin = {
            left: 30,
            right: 26,
            top: 62,
            bottom: 20,
        };

        // Configuration parameters (these could be made dynamic as needed)
        const tablesCount = 1; // Example value, replace with actual count if needed
        const rowsCount = 100; // Example value, replace with actual count if needed
        const sections = 2; // Example value, replace with actual count if needed
        const spacing = 5;

        // Calculate each section width
        const printWidth = doc.internal.pageSize.width - (margin.left + margin.right);
        const sectionWidth = (printWidth - ((sections - 1) * spacing)) / sections;

        // Add an initial empty page that will be deleted later
        doc.addPage();

        let currentSection;
        let nextSection = 1;

        for (let i = 0; i < tablesCount; i++) {
            pageHeder(doc, data)
            reportBody_1(doc, data)
            const lasttable = 63
            let startY = lasttable;

            doc.autoTable({
                theme: 'grid',
                head: [table.columns_1],
                body: table.Rows_1({ data }),
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
                margin: {
                    left: margin.left + ((nextSection - 1) * (sectionWidth + spacing)),
                    top: margin.top,
                    bottom: margin.bottom,
                },
                startY,
                rowPageBreak: 'avoid', // Avoid breaking rows into multiple sections
                didDrawPage({ table, pageNumber, pageCount }) {
                    currentSection = nextSection;
                    nextSection = (nextSection % sections) + 1;

                    // Set left margin which will control x position of next section
                    const shift = (nextSection - 1) * (sectionWidth + spacing);
                    table.settings.margin.left = margin.left + shift;
                    if (pageNumber === 1) {
                        table.settings.margin.top = lasttable
                    } else {
                        table.settings.margin.top = 62
                    }
                    // If next section is not the first, move to previous page
                    if (nextSection > 1) {
                        doc.setPage(doc.internal.getNumberOfPages() - 1);
                    }
                },
                didParseCell: (data1) => {
                    if (data1.row.cells[1].raw === "") {
                        data1.row.cells[0].colSpan = 3
                        data1.row.cells[0].styles.halign = "left"
                        data1.row.cells[0].styles.fontSize = 8
                        data1.row.cells[0].styles.fontStyle = "bold"
                    }
                },
            });

            // Activate last page for further printing
            doc.setPage(doc.internal.getNumberOfPages());

            // If there's remaining vertical space in the page: start printing next table from the current section
            const remainingVSpace = doc.internal.pageSize.height - margin.bottom - doc.lastAutoTable.finalY;
            if (remainingVSpace > 25) {
                nextSection = currentSection;
                startY = doc.lastAutoTable.finalY + 10;
            } else {
                startY = margin.top;
                if (nextSection == 1) doc.addPage();
            }
        }


        const pageCount = doc.internal.getNumberOfPages()

        doc.setFont('helvetica', 'Normal')

        for (var i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            if (i !== 1) {
                style.pageHeder(doc)
                style.reportHeder3(doc, data)

            }
            doc.setFont('helvetica', 'Normal')
            doc.setFontSize(11)
            style.pageBorder(doc)
            doc.text('Print Date :' + String(currentDate_dmy) + 'Time' + String(CurrentTime()), 30, 828,)
            doc.text('Page' + String(i) + ' of ' + String(pageCount), 500, 828,)

        }

        doc.deletePage(1);
        doc.setProperties({

            title: `Stock Entry`
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

export default StockEntryReport;




























//     doc.setProperties({
//         title: `POReport/${data.OrderDate}-${data.CustomerName} `
//     });

//     function generateSaveAndOpenPDFReport() {
//         const pdfUrl = URL.createObjectURL(doc.output('blob'));
//         window.open(pdfUrl);
//     }
//     generateSaveAndOpenPDFReport();

// }
// export default FrenchiesesOrderReport;