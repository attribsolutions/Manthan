import jsPDF from "jspdf";
import "jspdf-autotable";
import * as table from './TableData'
import Image from "../../../../assets/images/CBM_BlackWhite.png";
import { amountCommaSeparateFunc } from "../../../../components/Common/CommonFunction";





const PosInvoiceReport = (data) => {

    // Transform the array dynamically
    const transformedItems = [];
    const mixGroups = {}; // To group items by MixItemId

    // Step 1: Group items by MixItemId
    data.InvoiceItems.forEach(item => {
        if (item.MixItemId) {
            if (!mixGroups[item.MixItemId]) {
                mixGroups[item.MixItemId] = [];
            }
            mixGroups[item.MixItemId].push(item);
        }
    });

    // Step 2: Transform the array with nested MixItems
    data.InvoiceItems.forEach(item => {
        if (item.MixItemId === null && mixGroups[item.Item]) {
            // Parent item with MixItems
            transformedItems.push({
                ...item,
                MixItems: mixGroups[item.Item],
            });
        } else if (!item.MixItemId) {
            // Add non-mix items as they are
            transformedItems.push(item);
        }
    });



    const widthInInches = 3.14;
    const widthInPoints = widthInInches * 72;

    //Total Width 226.08 width in Point 
    //Center Of Page is 113.04 to start Content at Center

    // Define dimensions
    const lineHeight = 50; // Points for each line (adjust as needed)
    const marginTop = 40; // Margin from the top of the page
    const marginBottom = 40; // Margin from the bottom of the page



    // Calculate total content height
    const length = data.InvoiceItems.length
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
    let isCoustomeGSTIN = !(data.CustomerGSTIN === "")
    var DetailsStyle = {
        didParseCell: (data1) => {

            data1.table.body[0].cells[0].styles.fontSize = 15

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

            // data1.table.body[5].cells[0].styles.fontStyle = "bold"
            // data1.table.body[5].cells[0].styles.fontSize = 9

            // data1.table.body[5].cells[0].styles.halign = "center"
            // data1.table.body[5].cells[0].styles.fontStyle = "bold"

            if (isCoustomeGSTIN) {
                data1.table.body[5].cells[0].styles.fontSize = 7

                data1.table.body[5].cells[0].styles.fontStyle = "bold"
            }




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
        didDrawCell: (Table_data) => {

            const { cell, row } = Table_data;

            // Set the line color to green
            doc.setDrawColor(0, 0, 0);

            // Draw the top border only for the first row and header
            if (row.index === 0 || Table_data.section === 'head') {

                doc.setLineWidth(cell.styles.lineWidth);
                doc.line(cell.x, cell.y, cell.x + cell.width, cell.y); // Top border
            }

            if (Table_data.row.cells[1].raw === "Item\nGST%") {
                debugger
                let isDiscount = false
                let TotalBox = 0;
                data.InvoiceItems.forEach((element, key) => {
                    if (Number(element.Discount) > 0) {
                        isDiscount = true

                    }
                })
                if (isDiscount) {
                    Table_data.row.cells[1].text[0] = `Item(${data.InvoiceItems.length})`
                    Table_data.row.cells[1].text[1] = `GST%/Disc./Disc.Amt`
                }

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
            lineHeight: 1,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 9,
            fontStyle: 'normal',
            lineColor: [0, 1, 0],
            rowHeight: 0,

        },
        headerStyles: {
            cellPadding: 3,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',
            fillColor: "white",
            textColor: [0, 0, 0],
            fontSize: 9,
            rowHeight: 5,
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

    doc.autoTable(table.Item, table.ItemRow(transformedItems), ItemStyle);
    doc.setFontSize(9)

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
    data.InvoiceItems.forEach(arg => {
        totalAmount += Number(arg.Amount);
        totalDiscount += Number(arg.DiscountAmount);
    });


    doc.setFontSize(9)
    let isDiscount = (totalDiscount !== 0)

    if (totalDiscount !== 0) {
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

    if (Number(data.AdvanceAmount) > 0) {
        doc.text(`Advance Amount:`, 10, GST_Table_Y + 40,)
        doc.text(`${amountCommaSeparateFunc(Number(data.AdvanceAmount).toFixed(2))}`, 215, GST_Table_Y + 40, "right")

        doc.text(`Total:`, 10, GST_Table_Y + 53,)
        doc.text(`${amountCommaSeparateFunc(Number(data.GrandTotal).toFixed(2))}`, 215, GST_Table_Y + 53, "right")
    } else {

        doc.text(`Total:`, 10, GST_Table_Y + 47,)
        doc.text(`${amountCommaSeparateFunc(Number(data.GrandTotal).toFixed(2))}`, 215, GST_Table_Y + 47, "right")
    }


    doc.setLineDash([]); // Dash pattern: 3 points dash, 3 points gap
    doc.line(10, GST_Table_Y + 57, 10 + lineWidth, GST_Table_Y + 57); // Draw line



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

        startY: GST_Table_Y + 59,

    };

    doc.autoTable(table.Discription, table.DiscriptionRow(data), DiscriptionStyle);
    doc.setLineDash([1, 1]); // Dash pattern: 3 points dash, 3 points gap
    const Discription_Table_Y = doc.previousAutoTable.finalY
    doc.line(10, Discription_Table_Y + 5, 10 + lineWidth, Discription_Table_Y + 5); // Draw line
    doc.setFontSize(10)
    doc.text(`Cashier: ${data.CashierName}`, 10, Discription_Table_Y + 20,)
    doc.setFontSize(12)
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



export default PosInvoiceReport;