
import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import { date_dmy_func, convertOnlyTimefunc } from "../../components/Common/CommonFunction";
import * as table from './TableData'

export const pageBorder = (doc) => {
    doc.line(570, 10, 30, 10);//horizontal line (Top)
    doc.line(30, 815, 30, 10);//vertical line (left)
    doc.line(570, 815, 570, 10);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)   
}
export const pageHeder = (doc, data) => {

    // doc.addImage(reportHederPng, 'PNG', 35, 10, 80, 45)
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(15)

    doc.text('Van Loading Sheet SKU Wise Summary', 100, 40,)
}
export const pageHeder1 = (doc, data) => {

    // doc.addImage(reportHederPng, 'PNG', 35, 10, 80, 45)
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(15)
    doc.text('Van Loading Party Wise Invoice List', 100, 40,)
}
export const reportHeder1 = (doc, data) => {

    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    const Party = data.PartyDetails.Party
    doc.text(`*** ${Party} ***`, 300, 75, 'center')  //bill by 
    doc.line(570, 60, 30, 60) //horizontal line 1 billby upper
    doc.line(570, 10, 30, 10);//horizontal line 2
    doc.line(570, 80, 30, 80);//horizontal line 3
    doc.line(570, 100, 30, 100);//horizontal line middle address routes 

    // doc.line(409, 100, 30, 100) //horizontal line 4
    doc.line(30, 789, 30, 10);//vertical left 1
    doc.line(570, 789, 570, 10);//vertical left 2
    doc.line(408, 60, 408, 10);//vertical right 1
    // doc.line(250, 134, 250, 80);//vertical right 2
    doc.line(570, 134, 30, 134);//horizontal line table 


    // doc.line(250, 100, 408, 100) //horizontal line Current date upper
    // doc.line(250, 117, 408, 117) //horizontal line Current date upper
    // doc.line(408, 107, 570, 107) //horizontal line Current date upper



    var options3 = {
        didParseCell: (data1) => {

            if (data1.row.cells[0].raw === "Address:") {
                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[1].colSpan = 5
            }
            if (data1.row.cells[0].raw === "Routes:") {
                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[4].styles.fontStyle = "bold"
            }
        },

        margin: {
            // top: 20, left: 35, right: 35,// bottom:100 /
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
        },

        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 3,
            fontSize: 9,
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 45,
                halign: 'lfet',
            },

            1: {
                columnWidth: 100,
                halign: 'left',
            },
            2: {
                valign: "top",
                columnWidth: 65,
                halign: 'left',
            },
            3: {
                columnWidth: 140,
                halign: 'left',
            },
            4: {
                columnWidth: 60,
                halign: 'left',
            },
            5: {
                columnWidth: 120,
                halign: 'left',
            },




        },
        tableLineColor: "black",
        startY: 85
    };
    doc.autoTable(table.PageHedercolumns, table.ReportHederRows(doc, data), options3);
}

export const reportHeder2 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')

}

export const reportHeder3 = (doc, data) => {

    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.line(570, 35, 408, 35) //horizontal line 1 billby upper
    doc.setFont(undefined, 'bold')
    doc.text(`Loading No:${data.PartyDetails.LoadingSheetNo}`, 415, 30) //Invoice Id
    var date = date_dmy_func(data.PartyDetails.Date)
    var time = convertOnlyTimefunc(data.CreatedOn)
    doc.text(`Loading Date:${date} `, 415, 50) //Invoice date
    doc.setFontSize(11)
}
// original
export const tableBody = (doc, data) => {
    const tableRow = table.Rows(data);
    console.log(tableRow)
    var options = {
        didParseCell: (data1) => {

            if (data1.row.cells[1].raw === "Total") {
                data1.row.cells[1].styles.fontStyle = "bold"

                data1.row.cells[4].styles.fontStyle = "bold"
                data1.row.cells[5].styles.fontStyle = "bold"
                // data1.row.cells[6].styles.fontStyle = "bold"

                data1.row.cells[1].styles.fontSize = 9
                data1.row.cells[4].styles.fontSize = 9
                data1.row.cells[5].styles.fontSize = 9
                // data1.row.cells[6].styles.fontSize = 9
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
            halign: 'center',
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
            lineColor: [0, 0, 0],
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 20,
            },
            1: {
                columnWidth: 200,
                // halign: 'right',

            },
            2: {
                columnWidth: 80,
                halign: 'right',
            },
            3: {
                columnWidth: 80,
                halign: 'right',
            },
            4: {
                columnWidth: 80,
                halign: 'right',
            },

            5: {
                columnWidth: 80,
                halign: 'right',
            },
            // 6: {
            //     columnWidth: 70,
            //     halign: 'right',
            // },

        },
        tableLineColor: "black",
        startY: doc.autoTableEndPosY(45),// 45,
    };
    var options1 = {
        didParseCell: (data1) => {

            if (data1.row.cells[1].raw === "Total") {
                data1.row.cells[1].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
                data1.row.cells[4].styles.fontStyle = "bold"
                data1.row.cells[6].styles.fontStyle = "bold"
                data1.row.cells[7].styles.fontStyle = "bold"

                data1.row.cells[1].styles.fontSize = 9
                data1.row.cells[3].styles.fontSize = 9
                data1.row.cells[4].styles.fontSize = 9
                data1.row.cells[6].styles.fontSize = 9
                data1.row.cells[7].styles.fontSize = 9
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
            halign: 'center',
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
            lineColor: [0, 0, 0],
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 20,
            },
            1: {
                columnWidth: 80,
                // halign: 'right',

            },
            2: {
                columnWidth: 70,
                halign: 'right',
            },
            3: {
                columnWidth: 120,
                // halign: 'right',
            },
            4: {
                columnWidth: 50,
                halign: 'right',
            },
            // 5: {
            //     columnWidth: 50,
            //     halign: 'right',
            // },
            6: {
                columnWidth: 40,
                halign: 'right',
            },
            7: {
                columnWidth: 60,
                halign: 'right',
            },
            // 8: {
            //     columnWidth: 50,
            //     halign: 'right',
            // },
        },
        tableLineColor: "black",
        startY: doc.autoTableEndPosY(45),// 45,
    };

    doc.autoTable(table.columns, table.Rows(data), options);
    doc.addPage();
    pageBorder(doc, data);
    pageHeder1(doc, data);     //Title
    reportHeder1(doc, data);
    reportHeder2(doc, data);
    reportHeder3(doc, data);
    doc.autoTable(table.columns1, table.Rows1(data), options1);

    // Auto table for footer
    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 100
        },
        showHead: 'never',
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



// original