// import reportHederPng from "../../assets/images/reportHeder.png"
// import upi_qr_code from "../../assets/images/upi_qr_code.png"
// import * as table from './TableData'

// export const pageBorder = (doc) => { }
// export const pageHeder = (doc) => {
//     // doc.addImage(reportHederPng, 'PNG', 35, 20, 80, 45)
//     doc.addImage(reportHederPng, 'PNG', 40, 10, 80, 45)
//     doc.addFont("Arial", 'Normal')
//     doc.setFont('Arial')
//     // doc.setFont('Courier')
//     doc.setFontSize(20)
//     doc.text(' Tax Invoice', 460, 50)
// }

// export const reportHeder1 = (doc, data) => {
//     debugger
//     doc.setFont('Tahoma')
//     doc.setFontSize(10)
//     doc.setFont(undefined, 'bold')
//     doc.text("Billed by", 35, 80)
//     doc.text('Billed to', 235, 80)
//     var options3 = {
//         // tableLineColor: [189, 195, 199],
//         // tableLineWidth: 0.75,
//         margin: {
//             top: 40, left: 30, right: 22,// bottom:100 
//         },
//         showHead: 'always',
//         theme: 'plain',
//         styles: {
//             // overflowColumns: false ,
//             overflow: 'linebreak',
//             fontSize: 8,
//             height: 0,
//         },
//         bodyStyles: {
//             columnWidth: 'wrap',
//             textColor: [30, 30, 30],
//             cellPadding: 3,
//             fontSize: 8,
//             fontStyle: 'bold',
//             lineColor: [0, 0, 0]
//         },
//         columnStyles: {
//             0: {
//                 valign: "top",
//                 columnWidth: 200,
//                 halign: 'lfet',
//             },
//             1: {
//                 columnWidth: 200,
//                 halign: 'left',
//             },
//             1: {
//                 columnWidth: 200,
//                 halign: 'left',

//             },
//         },
//         tableLineColor: "black",
//         startY: doc.autoTableEndPosY() + 85,// 45,
//     };
// debugger
//     doc.autoTable(table.PageHedercolumns, table.ReportHederRows(data), options3);
// }
// export const reportHederR = (doc, data) => {
//     doc.line(285, 15, 30, 15);//horizontal line 1
//     doc.line(285, 45, 30, 45);//horizontal bottom
//     doc.line(30, 45, 30, 15);//vertical left
//     doc.line(285, 45, 285, 15);//vertical right 

//     doc.line(285, 15, 573, 15);//horizontal line 1
//     doc.line(285, 45, 575, 45);//horizontal bottom
//     doc.line(285, 45, 285, 15);//vertical left
//     doc.line(575, 45, 575, 15);//vertical right 
//     doc.setFont('Tahoma', 'Normal')
//     doc.setFontSize(9)

//     // doc.text(`GSTIN: ${data.GSTIN}`, 33, 25)
//     // doc.text('PAN:AAAFC5288N', 33, 35)
//     // doc.text(`Invoice Number:${data.InvoiceID}`, 288, 25)
//     // doc.text(`Invoice Date: ${data.InvoiceDate}`, 288, 35)
// }
// export const reportHeder2 = (doc, data) => {
// }
// export const reportFooter = (doc, data) => {
//     var optionsTable2 = {

//         margin: {
//             top: 45, left: 35, right: 35,// bottom:100 
//         },
//         theme: 'grid',
//         headerStyles: {
//             //columnWidth: 'wrap',
//             cellPadding: 4,
//             lineWidth: 1,
//             valign: 'top',
//             fontStyle: 'bold',
//             halign: 'left',    //'center' or 'right'
//             fillColor: "white",
//             textColor: [0, 0, 0], //Black     
//             // textColor: [255, 255, 255], //White     
//             // fillColor: "white"
//             fontSize: 8,
//             rowHeight: 10,
//             lineColor: [0, 0, 0]
//         },
//         bodyStyles: {
//             textColor: [30, 30, 30],
//             cellPadding: 3,
//             fontSize: 7,
//             fontStyle: 'bold',
//             lineColor: [0, 0, 0]
//         },
//         columnStyles: {
//             0: {
//                 valign: "top",
//                 columnWidth: 140,
//                 // fontStyle: 'bold',
//             },
//             1: {
//                 columnWidth: 50,
//                 // fontStyle: 'bold',
//                 halign: 'right',
//                 // fontStyle: 'bold',
//                 //  height:50,
//             },
//             2: {
//                 columnWidth: 40,
//                 // fontStyle: 'bold',
//                 // fontStyle: 'bold',
//                 halign: 'center',
//             },
//             3: {
//                 // columnWidth: 40,
//                 // fontStyle: 'bold',
//                 halign: 'center',
//             },
//             4: {
//                 // columnWidth: 40,
//                 // fontStyle: 'bold',
//                 halign: 'center',
//             },
//             5: {
//                 // columnWidth: 40,
//                 // fontStyle: 'bold',
//                 halign: 'center',
//             },
//             6: {
//                 // columnWidth: 40,
//                 // fontStyle: 'bold',
//                 halign: 'center',
//             },
//             7: {
//                 // columnWidth: 40,
//                 // fontStyle: 'bold',
//                 halign: 'center',
//             },
//             8: {
//                 // columnWidth: 40,
//                 fontStyle: 'bold',
//                 halign: 'center',
//             },
//         },
//         startY: doc.autoTableEndPosY(),// 45,
//     };
//     const optionsTable3 = {

//         margin: {
//             top: 45, left: 35, right: 200
//             ,// bottom:100 
//         },
//         showHead: 'never',
//         theme: 'plain',
//         headerStyles: {
//             // columnWidth: 'wrap',
//             cellPadding: 1,
//             lineWidth: 0,
//             valign: 'top',
//             fontStyle: 'bold',
//             halign: 'left',    //'center' or 'right'
//             fillColor: "white",
//             textColor: [0, 0, 0], //Black     
//             // textColor: [255, 255, 255], //White     
//             // fillColor: "white"
//             fontSize: 8,
//             rowHeight: 10,
//             lineColor: [0, 0, 0]
//         },
//         bodyStyles: {
//             columnWidth: 'wrap',
//             textColor: [30, 30, 30],
//             cellPadding: 1,
//             fontSize: 7,
//             fontStyle: 'bold',
//             lineColor: [0, 0, 0]
//         },
//         columnStyles: {
//             0: {
//                 valign: "top",
//                 columnWidth: 280,
//                 // fontStyle: 'bold',
//             },
//         },
//         didParseCell: function (cell, data) {
//             if (cell.row.index === 0) {
//                 cell.cell.styles.fontSize = 7;
//                 cell.cell.styles.lineColor = 'gray'
//                 cell.cell.styles.lineWidth = 0.5
//             }
//         },
//         startY: 745,
//     };
//     const optionsTable4 = {

//         margin: {
//             top: 410, left: 410, right: 30, bottom: 10
//         },
//         showHead: 'never',
//         theme: 'plain',
//         headerStyles: {
//             // columnWidth: 'wrap',
//             cellPadding: 1,
//             lineWidth: 0,
//             valign: 'top',
//             fontStyle: 'bold',
//             halign: 'left',    //'center' or 'right'
//             fillColor: "white",
//             textColor: [0, 0, 0], //Black     
//             // textColor: [255, 255, 255], //White     
//             // fillColor: "white"
//             fontSize: 8,
//             rowHeight: 10,
//             lineColor: [0, 0, 0]
//         },
//         bodyStyles: {
//             columnWidth: 'wrap',
//             textColor: [30, 30, 30],
//             cellPadding: 2,
//             fontSize: 7,
//             fontStyle: 'bold',
//             lineColor: [0, 0, 0]
//         },
//         columnStyles: {
//             0: {
//                 valign: "top",
//                 // columnWidth:10,
//                 // fontStyle: 'bold',
//             },
//             1: {
//                 halign: 'right',    //'center' or 'left'
//                 valign: "top",
//                 // columnWidth: 140,
//                 // fontStyle: 'bold',
//             },
//         },
//         didParseCell: function (cell, data) {
//             console.log("didParseCell", cell)
//             console.log(" didParse data", data)

//             if (cell.row.index === 4) {
//                 cell.cell.styles.fontSize = 12;
//                 cell.cell.styles.lineColor = 'gray'
//                 cell.cell.styles.lineWidth = 0.5

//             }
//         },

//         startY: 745,
//     };
//     // doc.autoTable(table.ReportFotterColumns, table.ReportFooterRow(data), optionsTable2);
//     doc.autoTable(table.ReportFotterColumns2, table.ReportFooterRow2(data), optionsTable3);
//     doc.autoTable(table.ReportFotterColumns4, table.ReportFooterRow4(data), optionsTable4);

//     let finalY = doc.previousAutoTable.finalY;

//     if (finalY < 745) {
//         doc.line(35, finalY, 35, 815);//horizontal line 3
//         doc.line(561, finalY, 561, 815);//horizontal line 3
//     }

//     doc.addImage(upi_qr_code, 'PNG', 325, 751, 80, 60)
//     doc.line(561, 745, 35, 745);//horizontal line 1
//     // doc.line(561, 795, 410, 795);//horizontal line 2
//     doc.line(561, 815, 35, 815);//horizontal line 3
//     doc.line(410, 744, 410, 815);//vertical right1 

//     doc.setFontSize(9)
//     // doc.setFont('Tahoma', 'Normal')
//     // // doc.text(`${stringNumber}`, 36, 759)
//     // doc.text(`Total Amount :67674168.45`, 415, 759)

//     // doc.text(`Total GST:124855.25`, 415, 770)
//     // doc.text(`Total CTCS:45742.635`, 415, 781)
//     // doc.text(`Round Off:46464.253`, 415, 791)
//     // doc.setFontSize(12)
//     // doc.text(`Amount:7654214463.53`, 415, 807)
// }
// export const tableBody = (doc, data) => {

//     var options = {
//         margin: {
//             top: 45, left: 35, right: 35,// bottom:100 
//         },
//         theme: 'grid',
//         headerStyles: {
//             //columnWidth: 'wrap',
//             cellPadding: 4,
//             lineWidth: 1,
//             valign: 'top',
//             fontStyle: 'bold',
//             halign: 'left',    //'center' or 'right'
//             fillColor: "white",
//             textColor: [0, 0, 0], //Black     
//             fontSize: 8,
//             // fillColor: "white"
//             rowHeight: 10,
//             lineColor: [0, 0, 0]
//         },
//         bodyStyles: {
//             textColor: [30, 30, 30],
//             cellPadding: 3,
//             fontSize: 7,
//             fontStyle: 'bold',
//             // fontStyle: 'Normal',
//             lineColor: [0, 0, 0]
//         },
//         columnStyles: {
//             0: {
//                 valign: "top",
//                 columnWidth: 140,
//                 // fontStyle: 'bold',
//             },
//             1: {
//                 columnWidth: 50,
//                 // fontStyle: 'bold',
//                 halign: 'right',
//                 // fontStyle: 'bold',
//                 //  height:50,
//             },
//             2: {
//                 columnWidth: 40,
//                 // fontStyle: 'bold',
//                 // fontStyle: 'bold',
//                 halign: 'center',
//             },
//             3: {
//                 // columnWidth: 40,
//                 // fontStyle: 'bold',
//                 halign: 'center',
//             },
//             4: {
//                 // columnWidth: 40,
//                 // fontStyle: 'bold',
//                 halign: 'center',
//             },
//             5: {
//                 // columnWidth: 40,
//                 // fontStyle: 'bold',
//                 halign: 'center',
//             },
//             6: {
//                 // columnWidth: 40,
//                 // fontStyle: 'bold',
//                 halign: 'center',
//             },
//             7: {
//                 halign: 'center',
//             },
//             8: {
//                 // columnWidth: 40,
//                 fontStyle: 'bold',
//                 halign: 'center',
//             },
//         },
//         didParseCell(data) {
//             if (data.cell.row.index === 0) {
//                 data.cell.styles.textColor = [255, 255, 255];
//                 data.cell.styles.fillColor = '#FF5783';
//             }
//         },

//         drawHeaderCell: function (cell, data) {

//             if (cell.raw === 'Total GST') {//paint.Name header red
//                 cell.styles.fontSize = 15;
//                 cell.styles.textColor = [255, 0, 0];
//             } else {
//                 cell.styles.textColor = 255;
//                 cell.styles.fontSize = 10;
//             }
//         },

//         createdCell: function (cell, data) {
//             // // console.log("aaaaaaaaaaaaaaaaaaaaaa",cell)
//             // if (cell.raw === 'Total GST') {//paint.Name header red
//             //     cell.styles.fontSize = 15;
//             //     // cell.styles.textColor = [255, 0, 0];
//             // } else {
//             //     // cell.styles.textColor = 255;
//             //     cell.styles.fontSize = 10;
//             // }
//         },
//         tableLineColor: "black",
//         // tableLineWidth: 0.01,
//         startY: doc.autoTableEndPosY(),// 45,
//     };
//     doc.autoTable(table.columns, table.Rows(data), options);

// }
// export const pageFooter = (doc,data) => {
//     let finalY = doc.previousAutoTable.finalY;
//     if (finalY > 675) {
//         // doc.addPage();
//         pageBorder(doc,data)
//         reportFooter(doc,data)
//     } else {
//         pageBorder(doc,data)
//         reportFooter(doc,data)
//     }
//     const pageCount = doc.internal.getNumberOfPages()

//     doc.setFont('helvetica', 'Normal')
//     doc.setFontSize(8)
//     for (var i = 1; i <= pageCount; i++) {
//         doc.setPage(i)
//         doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 10, 828, {
//             align: 'center'
//         })
//         console.log("aaa", doc.internal.pageSize.height)
//     }
// }
// Demo report 


import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import * as table from './TableData'

export const pageBorder = (doc) => {
    // doc.line(570 ,40,50, 40);//horizontal line (Top)
    doc.line(30, 815, 30, 40);//vertical line (left)
    doc.line(570, 815, 570, 40);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)   
}

export const pageHeder = (doc, data) => {
    doc.addImage(reportHederPng, 'PNG', 35, 10, 80, 45)
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(15)
    doc.text('Tax Invoice', 200, 40,)
}


export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text("Billed by", 80, 75)
    doc.text('Billed to', 280, 75)

    // doc.text(`GSTIN:${data.Total.TotalAmount}`, 570,95)
    doc.line(570, 60, 30, 60) //horizontal line 1 billby upper
    doc.line(570, 10, 30, 10);//horizontal line 2
    doc.line(410, 80, 30, 80);//horizontal line 3
    doc.line(409, 100, 30, 100) //horizontal line 4
    doc.line(30, 789, 30, 10);//vertical left 1
    doc.line(570, 789, 570, 10);//vertical left 2
    doc.line(408, 200, 408, 10);//vertical right 1
    doc.line(220, 200, 220, 60);//vertical right 2
    // doc.line(570, 815, 30, 815);//horizontal line buttom 1
    // doc.line(570, 795, 410, 795);//horizontal line buttom Amount 2
    var options3 = {
        
        margin: {
            top: 40, left: 30, right: 22,// bottom:100 /
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            // overflowColumns: false ,
            overflow: 'linebreak',
            fontSize: 8,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 3,
            fontSize: 8,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 200,
                halign: 'lfet',
            },
            1: {
                columnWidth: 200,
                halign: 'left',
            },
            1: {
                columnWidth: 200,
                halign: 'left',
            },

        },
        tableLineColor: "black",
        startY: doc.autoTableEndPosY() + 85,// 45,
    };
    doc.autoTable(table.PageHedercolumns, table.ReportHederRows(data), options3);
}
export const ReportHederRows = (doc, data) => {
    // doc.line(285, 15, 30, 15);//horizontal line 1
    // doc.line(285, 45, 30, 45);//horizontal bottom
    // doc.line(30, 45, 30, 15);//vertical left
    // doc.line(285, 45, 285, 15);//vertical right 
    // doc.line(285, 15, 573, 15);//horizontal line 1
    // doc.line(285, 45, 575, 45);//horizontal bottom
    // doc.line(285, 45, 285, 15);//vertical left
    // doc.line(575, 45, 575, 15);//vertical right 
    // doc.setFont('Tahoma', 'Normal')
    // doc.setFontSize(9)
    // doc.text(`GSTIN: ${data.GSTIN}`, 33, 25)
    // doc.text('PAN:AAAFC5288N', 33, 35)
    // doc.text(`Invoice Number:${data.InvoiceID}`, 288, 25)
    // doc.text(`Invoice Date: ${data.InvoiceDate}`, 288, 35)
}
export const reportHeder2 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.text(`GSTIN:${data.CustomerGSTIN}`, 50, 95)
    doc.text(`GSTIN:${data.PartyGSTIN}`, 250, 95)
}

export const reportHeder3 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.line(570, 35, 408, 35) //horizontal line 1 billby upper
    doc.text(`Invoice No:   ${data.id}`, 415, 30) //Invoice Id
    doc.text(`Invoice Date: ${data.InvoiceDate}`, 415, 50) //Invoice date
}

export const reportFooter = (doc, data) => {
    var optionsTable2 = {
        margin: {
            top: 45, left: 35, right: 35,// bottom:100 
        },
        theme: 'grid',
        headerStyles: {
            //columnWidth: 'wrap',
            cellPadding: 4,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'left',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            // textColor: [255, 255, 255], //White     
            // fillColor: "white"
            fontSize: 8,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            textColor: [30, 30, 30],
            cellPadding: 3,
            fontSize: 7,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 140,
                // fontStyle: 'bold',
            },
            1: {
                columnWidth: 50,
                // fontStyle: 'bold',
                halign: 'right',
                // fontStyle: 'bold',
                //  height:50,
            },
            2: {
                columnWidth: 40,
                // fontStyle: 'bold',
                // fontStyle: 'bold',
                halign: 'center',
            },
            3: {
                // columnWidth: 40,
                // fontStyle: 'bold',
                halign: 'center',
            },
            4: {
                // columnWidth: 40,
                // fontStyle: 'bold',
                halign: 'center',
            },
            5: {
                // columnWidth: 40,
                // fontStyle: 'bold',
                halign: 'center',
            },
            6: {
                // columnWidth: 40,
                // fontStyle: 'bold',
                halign: 'center',
            },
            7: {
                // columnWidth: 40,
                // fontStyle: 'bold',
                halign: 'center',
            },
            8: {
                // columnWidth: 40,
                fontStyle: 'bold',
                halign: 'center',
            },
        },
        startY: doc.autoTableEndPosY(),// 45,
    };
    const optionsTable3 = {

        margin: {
            top: 45, left: 35, right: 200
        },
        showHead: 'never',
        theme: 'plain',
        headerStyles: {
            cellPadding: 1,
            lineWidth: 0,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'left',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            fontSize: 8,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            textColor: [30, 30, 30],
            cellPadding: 1,
            fontSize: 7,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                // valign: "top",
                // columnWidth: 280,
                // fontStyle: 'bold',
            },
        },
        didParseCell: function (cell, data) {
            if (cell.row.index === 0) {
                cell.cell.styles.fontSize = 7;
                cell.cell.styles.lineColor = 'gray'
                cell.cell.styles.lineWidth = 0.5
            }
        },
        startY: 745,


    };
    // doc.autoTable(table.ReportFotterColumns2, table.ReportFooterRow2(data),optionsTable3);

    const optionsTable4 = {
        margin: {
            top: 410, left: 410, right: 30, bottom: 10
        },
        showHead: 'never',
        theme: 'plain',
        headerStyles: {
            cellPadding: 1,
            lineWidth: 0,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'left',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            fontSize: 8,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 7,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",

            },
            1: {
                halign: 'right',    //'center' or 'left'
                valign: "top",

            },
        },
        didParseCell: function (cell, data) {
            console.log("didParseCell", cell)
            console.log(" didParse data", data)

            if (cell.row.index === 4) {
                cell.cell.styles.fontSize = 12;
                cell.cell.styles.lineWidth = 1

            }
        },
        startY: 745,
    };
    let finalY = doc.previousAutoTable.finalY;
    doc.setFontSize(9)
}
export const tableBody = (doc, data) => {
    var options = {
        margin: {
            left: 30, right: 25,// bottom:100 
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'left',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            fontSize: 8,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            textColor: [30, 30, 30],
            cellPadding: 3,
            fontSize: 7,
            // fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 140,
            },
            1: {
                columnWidth: 50,
                halign: 'right',

            },
            2: {
                columnWidth: 40,
                halign: 'center',
            },
            3: {

                halign: 'center',
            },
            4: {
                columnWidth: 30,
                halign: 'center',
            },
            5: {
                halign: 'center',
            },
            6: {
                columnWidth: 30,
                halign: 'center',
            },
            7: {
                halign: 'center',
            },
            8: {
                fontStyle: 'bold',
                halign: 'center',
            },
        },


        drawHeaderCell: function (cell, data) {

            if (cell.raw === 'Total GST') {//paint.Name header red
                cell.styles.fontSize = 20;
                cell.styles.textColor = [255, 0, 0];
            } else {
                cell.styles.textColor = 255;
                cell.styles.fontSize = 10;
            }
        },

        // createdCell: function (cell, data) {
        //     // // console.log("aaaaaaaaaaaaaaaaaaaaaa",cell)
        //     // if (cell.raw === 'Total GST') {//paint.Name header red
        //     //     cell.styles.fontSize = 15;
        //     //     // cell.styles.textColor = [255, 0, 0];
        //     // } else {
        //     //     // cell.styles.textColor = 255;
        //     //     cell.styles.fontSize = 10;
        //     // }
        // },
        tableLineColor: "black",
        startY: doc.autoTableEndPosY(),// 45,

        // html: '#table',
        // didParseCell(data) {
        //     debugger
        //   if (data.cell.row.index === 1) {
        //     data.cell.styles.textColor = [255, 255, 255];
        //     data.cell.styles.fillColor = '#FF5783';
        //   }
        // }
    };

    doc.autoTable(table.columns, table.Rows(data), options);
    // doc.autoTable({
    //     html: '#table',
    //     didParseCell(data) {
    //       if (data.cell.row.index === 0) {
    //         data.cell.styles.textColor = [255, 255, 255];
    //         data.cell.styles.fillColor = '#FF5783';
    //       }
    //     }
    //   })


}

export const pageFooter = (doc, data) => {
    var th = ['', 'thousand', 'million', 'billion', 'trillion'];
    var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    function toWords(s) {
        s = s.toString();
        s = s.replace(/[\, ]/g, '');
        if (s != parseFloat(s)) return 'not a number';
        var x = s.indexOf('.');
        if (x == -1)
            x = s.length;
        if (x > 15)
            return 'too big';
        var n = s.split('');
        var str = '';
        var sk = 0;
        for (var i = 0; i < x; i++) {
            if ((x - i) % 3 == 2) {
                if (n[i] == '1') {
                    str += tn[Number(n[i + 1])] + ' ';
                    i++;
                    sk = 1;
                } else if (n[i] != 0) {
                    str += tw[n[i] - 2] + ' ';
                    sk = 1;
                }
            } else if (n[i] != 0) { // 0235
                str += dg[n[i]] + ' ';
                if ((x - i) % 3 == 0) str += 'hundred ';
                sk = 1;
            }
            if ((x - i) % 3 == 1) {
                if (sk)
                    str += th[(x - i - 1) / 3] + ' ';
                sk = 0;
            }
        }

        if (x != s.length) {
            var y = s.length;
            str += 'point ';
            for (var i = x + 1; i < y; i++)
                str += dg[n[i]] + ' ';
        }
        return str.replace(/\s+/g, ' ');
    }
    let stringNumber = toWords(data.GrandTotal)
    doc.addImage(upi_qr_code, 'PNG', 470, 710, 80, 60)
    // doc.line(570, 690, 35, 690);//horizontal line Footer 1
    doc.line(460, 745, 30, 745);//horizontal line Footer 2
    doc.line(570, 680, 30, 680);//horizontal line Footer 3
    doc.line(570, 700, 30, 700);//horizontal line Footer 3 Ruppe section
    doc.line(570, 660, 30, 660);//horizontal line Footer 3 Sub Total Section
    doc.line(460, 700, 460, 775);//vertical right1 Qr Left 1
    doc.line(170, 660, 170, 680);//vertical right1 Sub Total
    doc.line(310, 660, 310, 680);//vertical right1 Sub Total
    doc.line(390, 660, 390, 700);//vertical right1 Sub Total
    doc.line(460, 660, 460, 680);//vertical right1 Sub Total
    doc.line(100, 660, 100, 680);//vertical right1 Sub Total

    doc.setFont('Tahoma')
    doc.setFontSize(15)
    doc.line(570, 775, 30, 775);//horizontal line (Bottom)
    doc.text(` Amount :${data.GrandTotal}`, 390, 695,)
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    // doc.text(` Total Basic :${data.Total.BasicAmount}`, 175, 675,)
    // doc.text(` Total SGST :${data.Total.TotalSGst}`, 315, 675,)
    // doc.text(` Total CGST :${data.Total.TotalGGst}`, 392, 675,)
    // const TotalGST = data.Total.TotalSGst + data.Total.TotalGGst;
    // doc.text(`Total GST :${TotalGST}`, 465, 675,)
    doc.setFont('Tahoma')
    doc.setFontSize(8)
    doc.text(`Prepared by `, 35, 785,)
    doc.text(`Received By `, 260, 785,)
    doc.setFontSize(10)
    doc.text(`${data.PartyName} `, 450, 785,)
    doc.setFontSize(10)
    doc.text(`${data.CustomerName} `, 250, 811,)
    doc.setFontSize(9)
    doc.text(`Signature `, 475, 811,)
    doc.setFont("Arimo");
    doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be of the nature and
   quantity whitch it/these purports to be `, 34, 760,)
    doc.text(`A/C No: 2715500356 IFSC Code:BKID00015422 `, 34, 710,)
    doc.text('Bank details ·sdSVvDsdgbvzdfbBzdf', 34, 725,)
    doc.text(`INR NO : 12547yfewyrt5675w6wer78sdf687s6d7f8676yse87fugh43 `, 34, 740)
    doc.text(`Ruppe:${stringNumber} `, 33, 693,)

    let finalY = doc.previousAutoTable.finalY;
    if (finalY > 675) {
        pageBorder(doc)
        reportFooter(doc, data)
    } else {
        pageBorder(doc)
        reportFooter(doc, data)
    }
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 10, 828, {
            align: 'center'
        })
        console.log("aaa", doc.internal.pageSize.height)
    }
}