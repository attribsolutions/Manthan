
import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import * as table from './TableData'

export const pageBorder = (doc) => {
    doc.line(570, 10, 30, 10);//horizontal line (Top)
    // doc.setDrawColor(255, 0, 0);
    doc.line(30, 815, 30, 10);//vertical line (left)
    doc.line(570, 815, 570, 10);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)   
}
export const pageHeder = (doc, data) => {
    doc.addImage(reportHederPng, 'PNG', 35, 10, 80, 45)
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(18)
    doc.text('Purchase order', 200, 40,)
}
export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text("Vendor", 80, 75)
    doc.text('Customer', 280, 75)
    doc.text('Shipping Address', 440, 75)

    // doc.text(`GSTIN:${data.Total.TotalAmount}`, 570,95)
    doc.line(570, 60, 30, 60) //horizontal line 1 billby upper
    doc.line(570, 10, 30, 10);//horizontal line 2
    doc.line(570, 80, 30, 80);//horizontal line 3
    // doc.line(409, 100, 30, 100) //horizontal line 4
    doc.line(30, 789, 30, 10);//vertical left 1
    doc.line(570, 789, 570, 10);//vertical left 2
    doc.line(408, 200, 408, 10);//vertical right 1
    doc.line(220, 180, 220, 60);//vertical right 2
    // doc.line(570, 815, 30, 815);//horizontal line buttom 1
    // doc.line(570, 795, 410, 795);//horizontal line buttom Amount 2
    var options3 = {
        margin: {
            top: 45, left: 35, right: 35,// bottom:100 
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
                halign: 'left',
            },
            1: {
                columnWidth: 200,
                halign: 'left',
            },
            2: {
                columnWidth: 200,
                halign: 'left',
            },

        },
        tableLineColor: "black",
        startY: doc.autoTableEndPosY() + 85,// 45,

    };
    doc.autoTable(table.PageHedercolumns, table.ReportHederRows(data), options3);
}



export const reportHeder2 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    // doc.text(`GSTIN:${data.CustomerGSTIN}`, 38, 95)
    // doc.text(`GSTIN:${data.PartyGSTIN}`, 238, 95)
}

export const reportHeder3 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.line(570, 25, 408, 25) //horizontal line 1 billby upper
    doc.line(570, 40, 408, 40) //horizontal line 2 billby upper

    doc.setFont(undefined, 'bold')
    doc.text(`Order No: ${data.OrderNo} `, 415, 20) //Invoice Id
    doc.text(`Order Date: ${data.OrderDate}`, 415, 35) //Invoice date
    doc.text(`DeliveryDate: ${data.DeliveryDate}`, 415, 50) //Invoice date

}

export const reportFooter = (doc, data) => {
    var optionsTable2 = {
        margin: {
            top: 45, left: 35, right: 35,
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
                columnWidth: 80,
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

    // const optionsTable3 = {
    //     margin: {
    //         // top: 70, left: 35, right: 200
    //     },
    //     showHead: 'never',
    //     theme: 'plain',
    //     headerStyles: {
    //         cellPadding: 1,
    //     },
    //     bodyStyles: {
    //         cellPadding: 1,
    //     },
    //     columnStyles: {
    //         0: {
                
    //         },
    //         1: {
                
    //         },
    //     },
    //     didParseCell: function (cell, data) {
    //         if (cell.row.index === 0) {
    //             cell.cell.styles.fontSize = 7;
    //             // cell.cell.styles.lineColor = ''
    //             cell.cell.styles.lineWidth = 0.5
    //         }
    //     },
    //     startY: 790,
    // };

    // doc.autoTable(table.ReportFotterColumns2, table.ReportFooterRows(data),optionsTable3);

    const optionsTable4 = {
        margin: {
            top: 410, left: 410, right: 30,
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
    // doc.autoTable(table.ReportFotterColumns2, table.ReportFooterRow2(data), optionsTable3);
    // doc.autoTable(table.ReportFotterColumns4, table.ReportFooterRow4(data), optionsTable4);
    // let finalY = doc.previousAutoTable.finalY;

    // if (finalY < 745) {
    //     doc.line(35, finalY, 35, 815);//horizontal line 3
    //     doc.line(561, finalY, 561, 815);//horizontal line 3
    // }
    doc.setFontSize(9)
}
export const tableBody = (doc, data) => {
    const tableRow = table.Rows(data);
    console.log(tableRow)
    var options = {
        didParseCell: (data1) => {
            debugger
            if (data1.row.cells[5].raw === "isaddition") {
                data1.row.cells[0].colSpan = 3
                data1.row.cells[4].colSpan = 2
                data1.row.cells[6].colSpan = 2
                data1.row.cells[7].colSpan = 2


                data1.row.cells[0].styles.fontSize = 8
                data1.row.cells[4].styles.fontSize = 8
                data1.row.cells[6].styles.fontSize = 8
                data1.row.cells[8].styles.fontSize = 8



                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[4].styles.fontStyle = "bold"
                data1.row.cells[6].styles.fontStyle = "bold"
                data1.row.cells[8].styles.fontStyle = "bold"

               

                // data1.row.cells[3].colSpan=4
                // .colSpan = 3;
                //description above refer to the column of the table on the lastrow
            }
        },
        margin: {
            left: 30, right: 25,//200 bottom
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
            columnWidth: 'wrap',
            // fontStyle: 'bold',
            lineColor: [0, 0, 0],
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 124,
            },
            1: {
                columnWidth: 70,
                halign: 'right',

            },
            2: {
                columnWidth: 30,
                halign: 'right',
            },
            3: {
                columnWidth: 45,
                halign: 'right',
            },
            4: {
                columnWidth: 40,
                halign: 'right',
            },
            5: {
                columnWidth: 50,
                halign: 'right',
            },
            6: {
                columnWidth: 40,
                halign: 'right',
            },
            7: {
                columnWidth: 50,
                halign: 'right',
            },
            8: {
                columnWidth: 90,
                fontStyle: 'bold',
                halign: 'right',
            },
            9: {
                columnWidth: 60,
                fontStyle: 'bold',
                halign: 'right',
            },
            10: {
                fontStyle: 'bold',
                halign: 'right',
            },
        },



        // drawHeaderCell: function (cell, data) {
        //     if (cell.raw === 'Total GST') {//paint.Name header red
        //         cell.styles.fontSize = 20;
        //         cell.styles.textColor = [255, 0, 0];
        //     } else {
        //         cell.styles.textColor = 255;
        //         cell.styles.fontSize = 10;
        //     }
        // },


        tableLineColor: "black",
        startY: doc.autoTableEndPosY(45),// 45,



    };

    doc.autoTable(table.columns, table.Rows(data), options);

    const optionsTable4 = {

        margin: {
            left: 30, right: 30, bottom: 140
        },
        showHead: 'never',
        // theme: 'plain',
        headerStyles: {
            // columnWidth: 'wrap',
            // cellPadding: 1,
            // lineWidth: 0,
            // valign: 'top',
            // fontStyle: 'bold',
            // halign: 'left',    //'center' or 'right'
            // fillColor: "white",
            // textColor: [0, 0, 0], //Black     
            // // textColor: [255, 255, 255], //White     
            // // fillColor: "white"
            // fontSize: 8,
            // rowHeight: 10,
            // lineColor: [0, 0, 0]
        },
        bodyStyles: {
            // columnWidth: 'wrap',
            // textColor: [30, 30, 30],
            // cellPadding: 2,
            // fontSize: 7,
            // fontStyle: 'bold',
            // lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                // columnWidth:10,
                // fontStyle: 'bold',
            },
            1: {
                halign: 'right',    //'center' or 'left'
                valign: "top",
                // columnWidth: 140,
                // fontStyle: 'bold',
            },
        },
        didParseCell: function (cell, data) {
            console.log("didParseCell", cell)
            console.log(" didParse data", data)

            if (cell.row.index === 4) {
                // cell.cell.styles.fontSize = 12;
                // cell.cell.styles.lineColor = 'gray'
                // cell.cell.styles.lineWidth = 0.5

            }
        },

    };

    doc.autoTable(optionsTable4);

    doc.autoTable({
        html: '#table',
        didParseCell(data) {
            if (data.cell.row.index === 0) {
                data.cell.styles.textColor = [255, 255, 255];
                data.cell.styles.fillColor = '#FF5783';
            }
        }
    })


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
    let stringNumber = toWords(45757)
    // doc.addImage(upi_qr_code, 'PNG', 470, 750, 80, 60)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 745, 30, 745);//horizontal line Footer 2
    doc.line(570, 680, 30, 680);//horizontal line Footer 3
    doc.line(430, 700, 30, 700);//horizontal line Footer 3 Ruppe section
    // doc.line(460, 745, 460, 815);//vertical right1 Qr Left 1
    doc.line(430, 680, 430, 745);//vertical right1 Sub Total
    doc.setFont('Tahoma')
    doc.line(570, 775, 30, 775);//horizontal line (Bottom)

    const a = data.OrderItem.map((data) => ({
        CGST: Number(data.CGST),
        SGST: Number(data.SGST),
        BasicAmount: Number(data.BasicAmount),
    }));
    var totalCGST = 0;
    var totalSGST = 0;
    var TotalBasicAmount = 0;
    a.forEach(arg => {
        totalCGST += arg.CGST;
        totalSGST += arg.SGST;
        TotalBasicAmount += arg.BasicAmount

    });

    const TotalGST = totalCGST + totalSGST;
    // console.log(arr)
    doc.setFontSize(8)

    doc.text(`CGST:`, 434, 690,)
    doc.text(`${(totalCGST).toFixed(2)}`, 560, 690, 'right')

    doc.text(`SGST:`, 434, 700,)
    doc.text(`${(totalSGST).toFixed(2)}`, 560, 700, 'right')

    doc.text(`TotalGST:`, 434, 710,)
    doc.text(` ${(TotalGST).toFixed(2)}`, 560, 710, 'right')

    doc.text(`BasicAmount:`, 434, 720,)
    doc.text(`${(TotalBasicAmount).toFixed(2)}`, 560, 720, 'right')

    doc.setFont(undefined, 'Normal')
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text(`Order Amt:`, 434, 740,)
    doc.text(`${data.OrderAmount}`, 560, 740, 'right')
    doc.setFont(undefined, 'Normal')
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setFont('Tahoma')
    doc.setFontSize(8)
    const terms = data.OrderTermsAndCondition
    doc.setFont(undefined, 'bold')
    doc.setFontSize(10)
    doc.text(`Terms And Condition  `, 35, 784, "justify")
    doc.setFont(undefined, 'Normal')
    doc.setFontSize(9)
    debugger
    doc.autoTable(terms);
    const slicedArray = terms.slice(0, 3);
    // doc.text(`${slicedArray[0]}`, 35, 793, "justify")
     doc.text(`${slicedArray[0]===undefined?"":slicedArray[0].TermsAndCondition}`, 35, 793, "justify")
     doc.text(`${slicedArray[1]===undefined?"":slicedArray[1].TermsAndCondition}`, 35, 803, "justify")
     doc.text(`${slicedArray[2]===undefined?"":slicedArray[2].TermsAndCondition}`, 35, 813, "justify")
    // doc.text(`${slicedArray[2]}`, 35, 813, "justify")
    // doc.text(`Received By `, 180, 785,"justify")
    doc.setFontSize(10)
    // doc.text(`${data.SupplierName} `, 390, 785, "justify")
    doc.setFontSize(10)
    // doc.text(`${data.CustomerName} `, 175, 811,"justify")
    doc.setFontSize(9)
    // doc.text(`Signature `, 400, 811, "justify")
    doc.setFont("Arimo");
    doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be of the nature and
    quantity whitch it/these purports to be `, 34, 760,)
    doc.text(`A/C No: 2715500356 IFSC Code:BKID00015422 `, 34, 710,)
    doc.text('Bank details ·sdSVvDsdgbvzdfbBzdf', 34, 725,)
    // doc.text(`INR NO : 12547yfewyrt5675w6wer78sdf687s6d7f8676yse87fugh43 `, 34, 740)
    doc.setFont(undefined, 'bold')
    doc.text(`Ruppe:`, 33, 693,)
    doc.setFont(undefined, 'Normal')
    doc.text(`${stringNumber}`, 63, 693,)


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
