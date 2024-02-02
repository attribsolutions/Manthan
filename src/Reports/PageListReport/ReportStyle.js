import reportHederPng from "../../assets/images/reportHeder.png"
import * as table from './TableData'

export const pageBorder = (doc) => {
    doc.line(575, 10, 30, 10);//horizontal line 1
    doc.line(30, 830, 30, 10);//vertical left
    doc.line(575, 830, 30, 830);//horizontal bottom
    doc.line(575, 830, 575, 10);//vertical right 
}
export const pageHeder = (doc) => {
    doc.line(575, 65, 30, 65);//horizontal last line 1
    doc.addImage(reportHederPng, 'PNG', 250, 18, 65, 40);// report page Logo
    //Left Side texts
    doc.setFont('Tahoma', 'bold')
    doc.setFontSize(9)
    doc.text('CHITALE SWEETS & SNACKS PVT.LTD.', 32, 30)
    doc.setFont('Tahoma', 'Normal')
    doc.text('Wholesale II - Anand', 32, 40)
    doc.text("2187, Sadashiv Peth , Anand Bungalow,Pune 411 030", 32, 50)
    //Right side  Texts
    doc.setFont('Tahoma', 'bold')
    doc.setFontSize(9);
    doc.text('ORDER REPORT', 574, 30,{align:"right"});
    doc.text('Date:17/02/2022',574, 40,{align:"right"});
    doc.setFont('Tahoma', 'Normal');
    doc.text('Distributor:Demo Distributor  pune-46',574, 50,{align:"right"});
}
export const reportHederR = (doc) => {
    doc.setFont('Tahoma', 'bold')
    doc.setFontSize(9);
    doc.text('ORDER REPORT  '+'Date:17/02/2022', 32, 25,{align:"left"});
  
}

export const tableBody = (doc, data) => {
    var reportHead = function () {
        pageBorder(doc);
        if (!(doc.internal.getNumberOfPages() === 1)) {
           reportHederR(doc);
        }
    }
    var reportHead2 = function () {
        pageBorder(doc);
        if (!(doc.internal.getNumberOfPages() === 1)) {
            // reportHederR(doc);
        }
    };

    var options = {
        beforePageContent: reportHead,
        margin: {
            top: 27, left: 30, right: 20,// bottom:100 
        },
        //pageBreak: 'avoid',
        // showHead:'always',
        theme: 'grid',
        headStyles: {
            textColor: "black",
            fillColor: "gray"
        },
        styles: {
            overflow: 'hidden',
            fontSize: 8,
            height: 50,
            // valign: 'middle'
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 170,
            },
            1: {
                columnWidth: 60,
                // fontStyle: 'bold',
                halign: 'center',
                //  height:50,
            },
            2: {
                columnWidth: 50,
                // fontStyle: 'bold',
                halign: 'center',
            },
            3: {
                columnWidth: 110,
                fontStyle: 'bold',
                halign: 'center',
            },
        },
        drawHeaderCell: function (cell, data) {
            if (cell.raw === 'ItemName') {//paint.Name header red
                cell.styles.fontSize = 15;
                cell.styles.textColor = [255, 0, 0];
            } else {
                cell.styles.textColor = 255;
                cell.styles.fontSize = 10;
            }
        },
        tableLineColor: "black",
        startY: doc.autoTableEndPosY() + 65,//201,
    };
    var options1 = {
        beforePageContent: reportHead2,
        margin: {
            top: 45, left: 30, right: 20,// bottom:100 
        },
        theme: 'grid',
        headStyles: {
            textColor: "black",
            fillColor: "gray"
        },
        styles: {
            overflow: 'hidden',
            fontSize: 8,
            height: 50,
            // valign: 'middle'
        },
        // startY: doc.autoTableEndPosY() ,// 45,
    }
    doc.autoTable(table.columns, table.Rows(data), options);
    doc.autoTable(table.columns1, table.Rows1(data), options1);

}
export const reportFooter = (doc) => {
    doc.line(575, 710, 30, 710);//horizontal line 1
    doc.line(575, 725, 30, 725);//horizontal line 2
    doc.line(575, 745, 30, 745);//horizontal line 3
    doc.line(575, 760, 30, 760);//horizontal line 4
    doc.line(575, 790, 30, 790);//horizontal line 5

    doc.line(400, 745, 400, 710);//vertical midle

    doc.text('Total GST:1,32,031.95', 410, 720)
    doc.setFontSize(12)
    doc.text('Total Amount:11,94,031.95', 410, 740)

}
export const pageFooter = (doc) => {
    let finalY = doc.previousAutoTable.finalY;
    if (finalY > 675) {
        doc.addPage();
        pageBorder(doc)
        reportFooter(doc)
    }
    else { reportFooter(doc) }
    const pageCount = doc.internal.getNumberOfPages()

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(10)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 10, 828, {
            align: 'center'
        })
    }
}