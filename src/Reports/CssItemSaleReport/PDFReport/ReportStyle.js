

import * as table from './TableData'
import { CurrentTime, currentDate_dmy, date_dmy_func, loginUserDetails } from "../../../components/Common/CommonFunction";


export const pageBorder = (doc) => {
    doc.setDrawColor('black');
    doc.line(570, 17, 30, 17);//horizontal line (Top)
    doc.line(30, 815, 30, 17);//vertical line (left)
    doc.line(570, 815, 570, 17);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)   
}
export const pageHeder = (doc, data) => {
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(16)
    doc.text('Item Sale Report', 255, 40,) //Tax invoice Header
}
export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    const UserDetails = loginUserDetails()

    doc.text(`*** ${UserDetails.PartyName} ***`, 300, 75, 'center')  //bill by 
    doc.line(570, 60, 30, 60) //horizontal line 1 billby upper
    doc.line(570, 80, 30, 80);//horizontal line 3


    // doc.line(408, 60, 408, 17);//vertical header report Name Section
    // doc.line(250, 134, 250, 80);//vertical right 2
    // doc.line(570, 134, 30, 134);//horizontal line table 


    doc.line(250, 100, 570, 100) //horizontal line Current date upper
    doc.line(250, 117, 570, 117) //horizontal line Current date upper


    var options3 = {

        didDrawCell: (data1) => {
            debugger

            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 10
                doc.setFontSize(9)
                doc.setFont(undefined, 'bold')
                doc.text('Division: ', x, y)
            };

            if (rowIdx === 1 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 10
                doc.setFontSize(9)
                doc.setFont(undefined, 'bold')
                doc.text('Date: ', x, y)
            };




        },
        margin: {
            top: 20, left: 30, right: 35,
        },
        showHead: 'always',
        theme: 'grid',
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
                columnWidth: 540,
                halign: 'lfet',
            },

        },
        tableLineColor: "black",
        startY: 80
    };
    doc.autoTable(table.PageHedercolumns, table.ReportHederRows(data), options3);
}





export const tableBody = (doc, data) => {
    var options = {


        margin: {
            left: 30, right: 25, top: 55
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',    //'center' or 'right'
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
                columnWidth: 108,
                halign: 'left',

            },
            1: {
                columnWidth: 50,
                halign: 'left',

            },
            2: {
                columnWidth: 50,
                halign: 'left',
            },
            3: {
                columnWidth: 55,
                halign: 'right',
            },
            4: {
                columnWidth: 37,
                halign: 'right',
            },
            5: {
                columnWidth: 55,
                halign: 'right',
            },
            6: {
                columnWidth: 40,
                halign: 'right',
            },
            7: {
                columnWidth: 40,
                halign: 'right',
            },
            8: {
                columnWidth: 60,
                halign: 'right',
            },
            9: {
                columnWidth: 45,
                halign: 'right',
            },



        },
        tableLineColor: "black",
        startY: doc.autoTableEndPosY(),// 45,
    };

    doc.autoTable(table.columns, table.Rows(data), options);

    var GST_Table = {


        margin: {
            left: 30, right: 25, top: 55
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',    //'center' or 'right'
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
                columnWidth: 108,
                halign: 'left',

            },
            1: {
                columnWidth: 80,
                halign: 'left',

            },
            2: {
                columnWidth: 70,
                halign: 'left',
            },
            3: {
                columnWidth: 70,
                halign: 'right',
            },
            4: {
                columnWidth: 70,
                halign: 'right',
            },
            5: {
                columnWidth: 65,
                halign: 'right',
            },
            6: {
                columnWidth: 76,
                halign: 'right',
            },


        },
        tableLineColor: "black",
        startY: doc.autoTableEndPosY() + 20,// 45,
    };
    doc.autoTable(table.GST_Persentage_Table, table.GST_Rows(data), GST_Table);


}


export const pageFooter = (doc, data) => {


    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        pageHeder(doc, data)
        pageBorder(doc)
        doc.setFontSize(8)

        doc.setFont('helvetica', 'Normal')
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), 540, 828,)

        doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 30, 828,)

    }
}



// original