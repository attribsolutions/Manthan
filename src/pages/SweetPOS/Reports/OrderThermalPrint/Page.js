import jsPDF from "jspdf";
import "jspdf-autotable";
import * as table from './TableData'
import Image from "../../../../assets/images/CBM_BlackWhite.png";





const OrderThermalPrintReport = (data) => {

    // Convert inches to points (1 inch = 72 points)
    const widthInInches = 3.14;
    const widthInPoints = widthInInches * 72;

    //Total Width 226.08 width in Point 
    //Center Of Page is 113.04 to start Content at Center

    // Define dimensions
    const lineHeight = 50; // Points for each line (adjust as needed)
    const marginTop = 40; // Margin from the top of the page
    const marginBottom = 40; // Margin from the bottom of the page



    // Calculate total content height
    const length = data.OrderItem.length
    console.log(length)
    const totalContentHeight = ((length) * (lineHeight)) + 500;

    // Create a new jsPDF instance with the calculated height
    var doc = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: [widthInPoints, totalContentHeight] // Set page height dynamically
    });

    // Add content to the PDF
    doc.addImage(Image, 'png', 50, 10, 130, 80, null, 'FAST');
    // Draw a dotted line
    const dottedLineY = marginTop + 54; // Y position for the dotted line (adjust as needed)
    const lineWidth = widthInPoints - 20; // Line width, adjusted for margins
    doc.setLineDash([1, 1]); // Dash pattern: 3 points dash, 3 points gap
    doc.line(10, dottedLineY, 10 + lineWidth, dottedLineY); // Draw line
    doc.setLineDash([]); // Empty array for a solid line
    doc.setFont('Cambria', 'normal');
    // let isCoustomeGSTIN = !(data.CustomerGSTIN === "")
    var DetailsStyle = {
        didParseCell: (data1) => {

            data1.table.body[0].cells[0].styles.fontSize = 12

            data1.table.body[0].cells[0].styles.fontStyle = "bold"
            data1.table.body[0].cells[0].styles.halign = "center"

            data1.table.body[1].cells[0].styles.fontSize = 11
            data1.table.body[1].cells[0].styles.fontStyle = "bold"
            data1.table.body[1].cells[0].styles.halign = "center"

            data1.table.body[2].cells[0].styles.halign = "center"
            data1.table.body[2].cells[0].styles.fontSize = 10

            data1.table.body[3].cells[0].styles.halign = "center"
            data1.table.body[3].cells[0].styles.fontSize = 9

            data1.table.body[4].cells[0].styles.fontStyle = "bold"
            data1.table.body[4].cells[0].styles.halign = "center"
            data1.table.body[4].cells[0].styles.fontSize = 9


        },
        margin: {
            top: 45, left: 10, right: 35,
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            font: 'Cambria',
            fontSize: 9,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 1,
            fontSize: 9,
            fontStyle: 'normal',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 210,
                halign: 'lfet',
            }

        },
        tableLineColor: "black",

        startY: 100,

    };

    doc.autoTable(table.Details, table.DetailsRow(data), DetailsStyle);


    var ItemStyle = {

        margin: {
            top: 45, left: 10, right: 35,
        },
        didDrawCell: (data) => {
            const { cell, row } = data;

            // Set the line color to green
            doc.setDrawColor(0, 0, 0);

            // Draw the top border only for the first row and header
            if (row.index === 0 || data.section === 'head') {

                doc.setLineWidth(cell.styles.lineWidth);
                doc.line(cell.x, cell.y, cell.x + cell.width, cell.y); // Top border
            }

            // Draw the bottom border for each row
            doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height); // Bottom border

            // Skip the default drawing behavior to avoid vertical lines
            return false;
        },

        // showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
            font: 'Cambria',
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 9,
            fontStyle: 'normal',
            lineColor: [0, 1, 0]
        },
        headerStyles: {
            cellPadding: 3,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',
            fillColor: "white",
            textColor: [0, 0, 0],
            fontSize: 9,
            rowHeight: 10,
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 50,
                halign: 'lfet',

            },
            1: {
                valign: "top",
                columnWidth: 110,
                halign: 'center',
            },
            2: {
                valign: "top",
                columnWidth: 50,
                halign: 'right',
            }

        },
        tableLineColor: "black",
        startY: doc.previousAutoTable.finalY,
    };

    doc.autoTable(table.Item, table.ItemRow(data), ItemStyle);
    doc.setFontSize(11)

    doc.text(`------------ GST Break Up details ------------`, 113, doc.previousAutoTable.finalY + 13, "center")




    var GSTDetailsStyle = {

        margin: {
            top: 45, left: 10, right: 35,
        },
        // showHead: 'always',
        theme: 'grid',
        styles: {
            overflow: 'linebreak',
            fontSize: 9,
            font: 'Cambria',
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 9,
            fontStyle: 'normal',
            lineColor: [0, 0, 0]
        },
        headerStyles: {
            cellPadding: 3,
            lineWidth: 0.8,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',
            fillColor: "white",
            textColor: [0, 0, 0],
            fontSize: 8,
            rowHeight: 10,
            lineColor: "black"
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 70,
                halign: 'center',
            },
            1: {
                valign: "top",
                columnWidth: 70,
                halign: 'center',
            },
            2: {
                valign: "top",
                columnWidth: 70,
                halign: 'center',
            }
        },
        tableLineColor: "black",
        startY: doc.previousAutoTable.finalY + 20,
    };
    doc.autoTable(table.GSTDetails, table.GSTDetailsRow(data, doc), GSTDetailsStyle);

    let GST_Table_Y = doc.previousAutoTable.finalY

    doc.setLineDash([]); // Dash pattern: 3 points dash, 3 points gap
    doc.line(10, GST_Table_Y + 6, 10 + lineWidth, GST_Table_Y + 6); // Draw line


    let totalAmount = 0
    let totalDiscount = 0
    data.OrderItem.forEach(arg => {
        totalAmount += Number(arg.Amount);
        totalDiscount += Number(arg.DiscountAmount);

    });


    doc.setFontSize(9)
    let isDiscount = (totalDiscount !== 0)
    if (isDiscount) {
        doc.text(`Total Amount:`, 10, GST_Table_Y + 18,)
        doc.text(`Discount Amount:`, 10, GST_Table_Y + 30,)
        doc.text(`${Number(totalDiscount).toFixed(2)}`, 215, GST_Table_Y + 30, "right")
        const totalAmountNum = Number(totalAmount);
        const totalDiscountNum = Number(totalDiscount);
        const totalSum = totalAmountNum + totalDiscountNum;
        // Convert the sum to a string with two decimal places
        const formattedSum = totalSum.toFixed(2);
        // Add the text to the PDF, aligned to the right
        doc.text(`${formattedSum}`, 215, GST_Table_Y + 18, { align: "right" });

    } else if (totalDiscount === 0) {
        GST_Table_Y = GST_Table_Y - 24
    }


    doc.setFontSize(12)
    doc.text(`Order Amount:`, 10, GST_Table_Y + 42,)
    doc.text(`${Number(data.OrderAmount).toFixed(2)}`, 215, GST_Table_Y + 42, "right")

    doc.text(`Advance Amount:`, 10, GST_Table_Y + 55,)
    doc.text(`${Number(data.AdvanceAmount).toFixed(2)}`, 215, GST_Table_Y + 55, "right")

    doc.text(`Total Payable:`, 10, GST_Table_Y + 70,)
    doc.text(`${(Number(data.OrderAmount) - Number(data.AdvanceAmount)).toFixed(2)}`, 215, GST_Table_Y + 70, "right")

    doc.setLineDash([]); // Dash pattern: 3 points dash, 3 points gap
    doc.line(10, GST_Table_Y + 60, 10 + lineWidth, GST_Table_Y + 60); // Draw line



    var DiscriptionStyle = {

        didParseCell: (data1) => {
            data1.table.body[1].cells[0].styles.fontSize = 9
            data1.table.body[1].cells[0].styles.fontStyle = "bold"
            data1.table.body[1].cells[0].styles.halign = "center"

        },

        margin: {
            top: 45, left: 10, right: 35,
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
            font: 'Cambria',
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 1,
            fontSize: 8,
            fontStyle: 'normal',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 210,
                halign: 'center',
            }

        },
        tableLineColor: "black",

        startY: GST_Table_Y + 75,

    };

    doc.autoTable(table.Discription, table.DiscriptionRow(data), DiscriptionStyle);
    doc.setLineDash([1, 1]); // Dash pattern: 3 points dash, 3 points gap
    const Discription_Table_Y = doc.previousAutoTable.finalY
    doc.line(10, Discription_Table_Y + 5, 10 + lineWidth, Discription_Table_Y + 5); // Draw line
    // doc.text(`Cashier: ${data.CashierName}`, 10, Discription_Table_Y + 20,)
    doc.text(`Thank You...!`, 113, Discription_Table_Y + 35, "center")

    doc.setProperties({
        title: `InvoiceReport/${data.InvoiceDate}-${data.CustomerName} `
    });

    // Save and open the PDF
    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();
}

export default OrderThermalPrintReport;