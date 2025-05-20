
import cbm_logo from "../../assets/images/cbm_logo.png"

import * as table from './TableData'
import { toWords, numberWithCommas } from "../Report_common_function";
import { CurrentTime, IsSweetAndSnacksCompany, compareGSTINState, convertOnlyTimefunc, currentDate_dmy, date_dmy_func, loginSystemSetting, loginUserIsFranchisesRole } from "../../components/Common/CommonFunction";
import { url } from "../../routes";
let initial_y = 0
const isSweetAndSnacksCompany = IsSweetAndSnacksCompany()


export const pageBorder = (doc) => {
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 815, 30, 16);//vertical line (left)
    doc.line(570, 815, 570, 16);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)    
}




export const pageBorder_A5 = (doc) => {
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 400, 30, 16);//vertical line (left)
    doc.line(570, 400, 570, 16);//vertical line (Right)
    doc.line(570, 400, 30, 400);//horizontal line (Bottom)    
}





export const pageHeder = (doc, data) => {


    if (isSweetAndSnacksCompany) {
        doc.addImage(cbm_logo, 'PNG', 35, 17, 60, 46, null, 'FAST')
    } else {

        doc.addImage(cbm_logo, 'PNG', 33, 1, 95, 80, null, 'FAST')
    }



    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(18)

    if (data.Period.subPageMode === url.ORDER_LIST_4) {
        doc.text('SALES  ORDER', 180, 45,)
    } else {
        doc.text('PURCHASE ORDER', 180, 45,)

    }
}

export const reportHeder1 = (doc, data) => {

    const IsA4Print = Number(loginSystemSetting().OrderA4Print)
    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text("Supplier", 80, 75)
    doc.text('Customer', 280, 75)
    doc.text('Shipping Address', 440, 75)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 63, 30, 63)  //Image below line  1
    doc.line(570, 16, 30, 16);//horizontal line 2
    doc.line(570, 80, 30, 80);//horizontal line 3\

    if (IsA4Print) {
        doc.line(30, 789, 30, 16);//vertical left 1
        doc.line(570, 789, 570, 16);//vertical left 2
    } else {
        doc.line(30, 400, 30, 16);//vertical left 1
        doc.line(570, 400, 570, 16);//vertical left 2
    }



    //Header Table Style 
    var BilledByStyle = {
        didDrawCell: (data1) => {

            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Supplier : ', x, y)
            };
            if (rowIdx === 1 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Address: ', x, y)
            };

            if (rowIdx === 2 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('GSTIN: ', x, y)
            };
            if (rowIdx === 3 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('FSSAI No: ', x, y)
            };


        },
        margin: {
            top: 45, left: 30, right: 35,
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 8,
            fontStyle: 'normal',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 190,
                halign: 'lfet',
            }

        },
        tableLineColor: "black",

        startY: 80,

    };
    var BilledToStyle = {
        didDrawCell: (data1) => {

            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Customer : ', x, y)
            };
            if (rowIdx === 1 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Address: ', x, y)
            };

            if (rowIdx === 2 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('GSTIN: ', x, y)
            };
            if (rowIdx === 3 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('FSSAI No: ', x, y)
            };

        },
        margin: {
            top: 45, left: 220, right: 35,
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 8,
            fontStyle: 'normal',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 188,
                halign: 'lfet',
            },
        },
        tableLineColor: "black",
        startY: 80,

    };
    var DetailsOfTransportStyle = {
        didDrawCell: (data1) => {

            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('PO Type : ', x, y)
            };
            if (rowIdx === 1 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Customer: ', x, y)
            };

            if (rowIdx === 2 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Address: ', x, y)
            };
            if (rowIdx === 3 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('FSSAI No: ', x, y)
            };
            if (rowIdx === 4 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Description: ', x, y)
            };


        },

        margin: {
            top: 45, left: 408, right: 35,
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 8,
            fontStyle: 'normal',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 162,
                halign: 'lfet',
            },

        },
        tableLineColor: "black",

        startY: 80,

    };

    // let initial_y = 0
    const priLength = () => {

        let final_y = doc.previousAutoTable.finalY
        if (final_y > initial_y) {
            initial_y = final_y
        }

    }

    doc.autoTable(table.BilledBy, table.BilledByRow(data), BilledByStyle);
    priLength()

    doc.autoTable(table.BilledTo, table.BilledToRow(data), BilledToStyle);
    priLength()

    doc.autoTable(table.DetailsOfTransport, table.DetailsOfTransportRow(data), DetailsOfTransportStyle);
    priLength()

    doc.line(408, initial_y, 408, 16);//vertical right 1
    doc.line(220, initial_y, 220, 63);//vertical right 2
}


export const reportHeder3 = (doc, data) => {

    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 30, 408, 30) //horizontal line 1 billby upper
    doc.line(570, 45, 408, 45) //horizontal line 2 billby upper


    doc.line(408, 65, 408, 16);//vertical right 1

    doc.setFont(undefined, 'bold')
    doc.text(`Order No: ${data.FullOrderNumber}`, 415, 25) //Invoice Id
    debugger
    var time = convertOnlyTimefunc(data.CreatedOn)

    const dateOnly = data.CreatedOn.substring(0, 10);
    var Orderdate = date_dmy_func(dateOnly)
    doc.text(`Order Date: ${Orderdate}  ${time}`, 415, 40) //Invoice date
    // var DeliveryDate = date_dmy_func(data.OrderDate)  

    ///   Delivery Date
    const DeliveryDate = data?.DeliveryDate.substring(0, 10);
    var deliveryDate = date_dmy_func(DeliveryDate)
    var Deliverytime = convertOnlyTimefunc(data?.DeliveryDate)

    doc.text(`Delivery Date: ${deliveryDate}  ${Deliverytime}`, 415, 55) //Invoice date
    doc.line(570, 63, 30, 63) //horizontal line 2 billby upper


}
export const tableBody = (doc, data) => {
    const { OrderItem = [] } = data
    var options = {
        didParseCell: (data1) => {

            if (data1.row?.raw[12]?.IsHighlightItemInPrint) {

                data1.row.cells[0].styles.fillColor = [211, 211, 211]
                data1.row.cells[1].styles.fillColor = [211, 211, 211]
                data1.row.cells[2].styles.fillColor = [211, 211, 211]
                data1.row.cells[3].styles.fillColor = [211, 211, 211]
                data1.row.cells[4].styles.fillColor = [211, 211, 211]
                data1.row.cells[5].styles.fillColor = [211, 211, 211]
                data1.row.cells[6].styles.fillColor = [211, 211, 211]
                data1.row.cells[7].styles.fillColor = [211, 211, 211]
                data1.row.cells[8].styles.fillColor = [211, 211, 211]
                data1.row.cells[9].styles.fillColor = [211, 211, 211]
                data1.row.cells[10].styles.fillColor = [211, 211, 211]
                data1.row.cells[11].styles.fillColor = [211, 211, 211]
            }


            if (data1.row.cells[8].raw === "isaddition") {
                data1.row.cells[0].colSpan = 2
                data1.row.cells[2].colSpan = 2
                data1.row.cells[4].colSpan = 2

                data1.row.cells[5].colSpan = 2
                data1.row.cells[7].colSpan = 2
                data1.row.cells[9].colSpan = 2

                data1.row.cells[0].styles.halign = "right"

                data1.row.cells[0].styles.fontSize = 7
                data1.row.cells[4].styles.fontSize = 7
                data1.row.cells[6].styles.fontSize = 7
                data1.row.cells[7].styles.fontSize = 7
                data1.row.cells[9].styles.fontSize = 7
                data1.row.cells[11].styles.fontSize = 7
                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[4].styles.fontStyle = "bold"
                data1.row.cells[6].styles.fontStyle = "bold"
                data1.row.cells[7].styles.fontStyle = "bold"
                data1.row.cells[9].styles.fontStyle = "bold"
                data1.row.cells[11].styles.fontStyle = "bold"


            }
            if (data1.row.cells[0].raw === "HSN Item Name") {
                let TotalBox = 0;
                OrderItem.forEach((element, key) => {
                    if (element.PrimaryUnitName === "Box") {
                        TotalBox = Number(TotalBox) + Number(element.Quantity)
                    }
                })

                data1.row.cells[0].text[0] = ` HSN Item Name (${OrderItem.length})  (${TotalBox} Box)`
                data1.row.cells[7].colSpan = 2
                data1.row.cells[9].colSpan = 2
            }
        },
        didDrawCell: (data1) => {

            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 7) {
                if (data1.row.cells[7].raw === "       CGST           %        Amount") {

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2;  // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 8, startY1vertical + 2, startXVertical - 8, endYvertical + 2);  // Draw a vertical line
                    doc.line(startX, startY, endX, endY);
                }
            }
            if (rowIdx === 0 && colIdx === 9) {
                if (data1.row.cells[9].raw === "       SGST           %        Amount") {

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2;  // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 8, startY1vertical + 2, startXVertical - 8, endYvertical + 2); // Draw a vertical line
                    doc.line(startX, startY, endX, endY);
                }
            }




        },
        margin: {
            left: 30, right: 25, top: 65
        },
        theme: 'grid',
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
            cellPadding: 5,
            fontSize: 7,
            lineColor: [6, 3, 1]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 120,
            },
            1: {
                columnWidth: 45,
                halign: 'right',

            },
            2: {
                columnWidth: 33,
                halign: 'right',
            },

            3: {
                columnWidth: 37,
                halign: 'right',
            },
            4: {
                columnWidth: 37,
                halign: 'right',
            },
            5: {
                columnWidth: 38,
                halign: 'right',
            },
            6: {
                columnWidth: 49,
                halign: 'right',
            },
            7: {
                columnWidth: 25,
                halign: 'right',
            },
            8: {
                columnWidth: 40,
                halign: 'right',
            },
            9: {
                columnWidth: 25,
                fontStyle: 'bold',
                halign: 'right',
            },
            10: {
                columnWidth: 40,
                fontStyle: 'bold',
                halign: 'right',
            },
            11: {
                columnWidth: 51,
                fontStyle: 'bold',
                halign: 'right',
            },


        },

        tableLineColor: "black",
        startY: initial_y,// 45,

    };

    doc.autoTable(table.columns, table.Rows(data, doc), options);

    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 80
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
export const tableBodyWithIGST = (doc, data) => {

    const { OrderItem = [] } = data
    //Body table  Css
    var options = {
        didParseCell: (data1) => {

            if (data1.row.cells[8].raw === "isaddition") {
                data1.row.cells[0].colSpan = 2
                data1.row.cells[2].colSpan = 2
                data1.row.cells[4].colSpan = 2
                data1.row.cells[7].colSpan = 2


                data1.row.cells[0].styles.halign = "right"
                data1.row.cells[1].styles.halign = "right"
                data1.row.cells[1].styles.fontStyle = "bold"


                data1.row.cells[0].styles.fontSize = 8
                data1.row.cells[2].styles.fontSize = 8
                data1.row.cells[4].styles.fontSize = 8
                data1.row.cells[6].styles.fontSize = 8
                data1.row.cells[7].styles.fontSize = 8
                data1.row.cells[9].styles.fontSize = 8




                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[4].styles.fontStyle = "bold"
                data1.row.cells[6].styles.fontStyle = "bold"
                data1.row.cells[7].styles.fontStyle = "bold"
                data1.row.cells[9].styles.fontStyle = "bold"





            }
            if (data1.row.cells[0].raw === "HSN Item Name") {

                let TotalBox = 0;
                OrderItem.forEach((element, key) => {
                    if (element.PrimaryUnitName === "Box") {
                        TotalBox = Number(TotalBox) + Number(element.Quantity)
                    }
                })

                data1.row.cells[0].text[0] = ` HSN Item Name (${OrderItem.length})  (${TotalBox} Box)`
                data1.row.cells[7].colSpan = 2
            }



        },

        didDrawCell: (data1) => {

            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 7) {
                if (data1.row.cells[7].raw === "        IGST        %       Amount") {

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2; // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 13;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 7, startY1vertical, startXVertical - 7, endYvertical); // Draw a vertical line
                    doc.line(startX, startY, endX, endY);
                }
            }

        },
        margin: {
            left: 30, right: 25, top: 65
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',
            fillColor: "white",
            textColor: [0, 0, 0],
            fontSize: 8,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 7,
            // fontStyle: 'bold',
            lineColor: [6, 3, 1]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 140,
            },
            1: {
                columnWidth: 55,
                halign: 'left',

            },
            2: {
                columnWidth: 40,
                halign: 'right',
            },
            3: {
                columnWidth: 40,
                halign: 'right',
            },
            4: {
                columnWidth: 50,
                halign: 'right',
            },
            5: {
                columnWidth: 43,
                halign: 'right',
            },
            6: {
                columnWidth: 45,
                halign: 'right',
            },
            7: {
                columnWidth: 26,
                halign: 'right',
            },
            8: {
                columnWidth: 40,
                halign: 'right',
            },
            9: {
                columnWidth: 61,
                halign: 'right',
            },




        },

        tableLineColor: "black",
        startY: initial_y,// 45,

    };

    doc.autoTable(table.columnsWithIGST, table.RowsWithIGST(data), options);

    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 50
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
export const tableBodyForAmericanOrder = (doc, data) => {

    const { OrderItem = [] } = data
    //Body table  Css
    var options = {
        didParseCell: (data1) => {
            if (data1.row.cells[7].raw === "isaddition") {
                data1.row.cells[0].colSpan = 2
                data1.row.cells[2].colSpan = 2
                data1.row.cells[3].colSpan = 2
                data1.row.cells[6].colSpan = 2


                data1.row.cells[0].styles.halign = "right"
                data1.row.cells[1].styles.halign = "right"
                data1.row.cells[1].styles.fontStyle = "bold"


                data1.row.cells[0].styles.fontSize = 8
                data1.row.cells[2].styles.fontSize = 8
                data1.row.cells[3].styles.fontSize = 8
                data1.row.cells[5].styles.fontSize = 8
                data1.row.cells[6].styles.fontSize = 8
                data1.row.cells[8].styles.fontSize = 8




                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
                data1.row.cells[5].styles.fontStyle = "bold"
                data1.row.cells[6].styles.fontStyle = "bold"
                data1.row.cells[8].styles.fontStyle = "bold"





            }

            if (data1.row.cells[0].raw === "HSN Item Name") {

                let TotalBox = 0;
                OrderItem.forEach((element, key) => {
                    if (element.PrimaryUnitName === "Box") {
                        TotalBox = Number(TotalBox) + Number(element.Quantity)
                    }
                })

                data1.row.cells[0].text[0] = ` HSN Item Name (${OrderItem.length})  (${TotalBox} Box)`
                data1.row.cells[6].colSpan = 2
            }



        },

        didDrawCell: (data1) => {

            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 6) {
                if (data1.row.cells[6].raw === "        IGST        %       Amount") {

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2; // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 13;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 7, startY1vertical, startXVertical - 7, endYvertical); // Draw a vertical line
                    doc.line(startX, startY, endX, endY);
                }
            }

        },
        margin: {
            left: 30, right: 25, top: 65
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',
            fillColor: "white",
            textColor: [0, 0, 0],
            fontSize: 8,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 7,
            // fontStyle: 'bold',
            lineColor: [6, 3, 1]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 180,
            },
            1: {
                columnWidth: 55,
                halign: 'left',

            },
            2: {
                columnWidth: 40,
                halign: 'right',
            },
            3: {
                columnWidth: 50,
                halign: 'right',
            },
            4: {
                columnWidth: 43,
                halign: 'right',
            },
            5: {
                columnWidth: 45,
                halign: 'right',
            },
            6: {
                columnWidth: 26,
                halign: 'right',
            },
            7: {
                columnWidth: 40,
                halign: 'right',
            },
            8: {
                columnWidth: 61,
                halign: 'right',
            },


        },

        tableLineColor: "black",
        startY: initial_y,// 45,

    };

    doc.autoTable(table.columnsForAmerica, table.RowsForAmericanOrder(data), options);

    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 50
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

    var options1 = {
        didParseCell: (data1) => {
            if (data1.row.cells[0].raw === "Terms And Condition") {
                data1.row.cells[0].styles.fontSize = 10
                data1.row.cells[0].styles.fontStyle = "bold"
            }

        },
        margin: {
            top: 45, left: 30, right: 30, bottom: 10
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 1,
            fontSize: 8,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 395,
                halign: 'lfet',
            },

        },
        tableLineColor: "black",

        startY: 765,

    };

    doc.autoTable(table.Footercolumn, table.ReportRows(data), options1);
    doc.setFontSize(9)

    const GrandTotal = Number(data.OrderAmount)
    const Total = numberWithCommas((GrandTotal).toFixed(2))
    // doc.addImage(upi_qr_code, 'PNG', 470, 750, 80, 60)
    doc.setDrawColor(0, 0, 0);

    doc.line(570, 735, 30, 735);//horizontal line Footer 2
    doc.line(430, 735, 430, 815);//vertical right1 Sub Total

    doc.setFont('Tahoma')
    // doc.line(430, 750, 30, 750);//horizontal line (Bottom)

    const a = data.OrderItem.map((data) => ({
        CGST: Number(data.CGST),
        SGST: Number(data.SGST),
        BasicAmount: Number(data.BasicAmount),
        IGST: Number(data.IGST),
        DiscountAmount: Number(data.DiscountAmount),

    }));
    let totalCGST = 0;
    let totalSGST = 0;
    let TotalBasicAmount = 0;
    let totalIGST = 0;
    let totalDiscount = 0;

    a.forEach(arg => {
        totalCGST += arg.CGST;
        totalSGST += arg.SGST;
        TotalBasicAmount += arg.BasicAmount;
        totalIGST += arg.IGST;
        totalDiscount += arg.DiscountAmount;
    });

    const TotalGST = totalCGST + totalSGST;

    const isIGST = compareGSTINState(data.CustomerGSTIN, data.SupplierGSTIN)
    if (isIGST || data.isAmerica) {
        doc.setFontSize(8)
        doc.text(`Total Basic:`, 434, 742,)
        doc.text(`${numberWithCommas(Number(TotalBasicAmount).toFixed(2))}`, 568, 742, 'right')

        doc.text(`Total Disc:`, 434, 752,)
        doc.text(`${numberWithCommas(Number(totalDiscount).toFixed(2))}`, 568, 752, 'right')

        doc.text(`Total IGST:`, 434, 762,)
        doc.text(`${numberWithCommas(Number(totalIGST).toFixed(2))}`, 568, 762, 'right')

        doc.text(`Total GST:`, 434, 772,)
        doc.text(` ${numberWithCommas(Number(totalIGST).toFixed(2))}`, 568, 772, 'right')

        if (loginUserIsFranchisesRole()) {
            doc.text(`Advance Amount:`, 434, 782,)
            doc.text(` ${numberWithCommas(Number(data.AdvanceAmount).toFixed(2))}`, 568, 782, 'right')
        }



    } else {

        doc.setFontSize(8)
        doc.text(`Total Basic:`, 434, 742,)
        doc.text(`${numberWithCommas(Number(TotalBasicAmount).toFixed(2))}`, 568, 742, 'right')

        doc.text(`Total Disc:`, 434, 752,)
        doc.text(`${numberWithCommas(Number(totalDiscount).toFixed(2))}`, 568, 752, 'right')

        doc.text(`Total CGST:`, 434, 762,)
        doc.text(`${numberWithCommas(Number(totalCGST).toFixed(2))}`, 568, 762, 'right')

        doc.text(`Total SGST:`, 434, 772,)
        doc.text(`${numberWithCommas(Number(totalSGST).toFixed(2))}`, 568, 772, 'right')

        doc.text(`Total GST:`, 434, 782,)
        doc.text(` ${numberWithCommas(Number(TotalGST).toFixed(2))}`, 568, 782, 'right')

        if (loginUserIsFranchisesRole()) {
            doc.text(`Advance Amount:`, 434, 792,)
            doc.text(` ${numberWithCommas(Number(data.AdvanceAmount).toFixed(2))}`, 568, 792, 'right')
        }

    }


    doc.setFont(undefined, 'Normal')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text(`Order Amount:`, 433, 810,)
    // const GrandTotal = Math.round(data.OrderAmount)
    //  const GrandTotal = numberWithCommas((56784936).toFixed(2))
    doc.text(`${Total}`, 568, 810, 'right')
    doc.setFont(undefined, 'Normal')
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setFont('Tahoma')
    doc.setFontSize(8)
    const terms = data.OrderTermsAndCondition
    doc.setFont(undefined, 'bold')
    doc.setFontSize(10)
    // doc.text(`Terms And Condition  `, 33, 775, "justify")
    doc.setFont(undefined, 'Normal')
    doc.setFontSize(9)



    doc.setFontSize(10)
    // doc.text(`${data.SupplierName} `, 390, 785, "justify")
    doc.setFontSize(10)
    // doc.text(`${data.CustomerName} `, 175, 811,"justify")
    doc.setFontSize(9)
    // doc.text(`Signature `, 400, 811, "justify")
    doc.setFont("Arimo");



    let DetailsOfCurrencyStyle = {

        didDrawCell: (data1) => {
            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(9)
                doc.setFont(undefined, 'bold')
                if (data.isAmerica) {
                    doc.text('Dollars: ', x, y)
                } else {
                    doc.text('Rupees: ', x, y)
                }
            }
        },

        margin: {
            top: 0, left: 30,
        },
        showHead: 'always',
        theme: 'grid',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: "black",
            cellPadding: 1,
            fontSize: 9,
            lineColor: "black"
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 400,
                halign: 'lfet',
            }

        },
        tableLineColor: "black",
        startY: 735,

    };

    doc.autoTable(table.Currencycolumn, table.CurrencyRow(data), DetailsOfCurrencyStyle,);




    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    // doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        pageHeder(doc, data)
        pageBorder(doc)
        reportHeder3(doc, data)
        doc.setFont('helvetica', 'Normal')

        doc.text('Print Date :' + String(currentDate_dmy) + 'Time' + String(CurrentTime()), 30, 828,)
        doc.text('Page' + String(i) + ' of ' + String(pageCount), 500, 828,)

    }
}
export const pageFooter_A5 = (doc, data) => {


    var options1 = {
        didParseCell: (data1) => {
            if (data1.row.cells[0].raw === "Terms And Condition") {
                data1.row.cells[0].styles.fontSize = 10
                data1.row.cells[0].styles.fontStyle = "bold"
            }

        },
        margin: {
            top: 45, left: 30, right: 30, bottom: 10
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 1,
            fontSize: 8,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 395,
                halign: 'lfet',
            },

        },
        tableLineColor: "black",

        startY: 340,

    };

    doc.autoTable(table.Footercolumn, table.ReportRows(data), options1);
    doc.setFontSize(9)

    const GrandTotal = Number(data.OrderAmount)
    const Total = numberWithCommas((GrandTotal).toFixed(2))
    // doc.addImage(upi_qr_code, 'PNG', 470, 750, 80, 60)
    doc.setDrawColor(0, 0, 0);

    doc.line(570, 320, 30, 320);//horizontal line Footer 2

    doc.line(430, 320, 430, 400);//vertical right1 Sub Total
    doc.setFont('Tahoma')
    // doc.line(430, 750, 30, 750);//horizontal line (Bottom)

    const a = data.OrderItem.map((data) => ({
        CGST: Number(data.CGST),
        SGST: Number(data.SGST),
        BasicAmount: Number(data.BasicAmount),
        IGST: Number(data.IGST),
        DiscountAmount: Number(data.DiscountAmount),

    }));
    let totalCGST = 0;
    let totalSGST = 0;
    let TotalBasicAmount = 0;
    let totalIGST = 0;
    let totalDiscount = 0;

    a.forEach(arg => {
        totalCGST += arg.CGST;
        totalSGST += arg.SGST;
        TotalBasicAmount += arg.BasicAmount;
        totalIGST += arg.IGST;
        totalDiscount += arg.DiscountAmount;
    });

    const TotalGST = totalCGST + totalSGST;

    const isIGST = compareGSTINState(data.CustomerGSTIN, data.SupplierGSTIN)
    if (isIGST || data.isAmerica) {
        doc.setFontSize(8)
        doc.text(`Total Basic:`, 434, 300,)
        doc.text(`${numberWithCommas(Number(TotalBasicAmount).toFixed(2))}`, 568, 300, 'right')

        doc.text(`Total Disc:`, 434, 752,)
        doc.text(`${numberWithCommas(Number(totalDiscount).toFixed(2))}`, 568, 752, 'right')

        doc.text(`Total IGST:`, 434, 762,)
        doc.text(`${numberWithCommas(Number(totalIGST).toFixed(2))}`, 568, 762, 'right')

        doc.text(`Total GST:`, 434, 772,)
        doc.text(` ${numberWithCommas(Number(totalIGST).toFixed(2))}`, 568, 772, 'right')

        if (loginUserIsFranchisesRole()) {
            doc.text(`Advance Amount:`, 434, 782,)
            doc.text(` ${numberWithCommas(Number(data.AdvanceAmount).toFixed(2))}`, 568, 782, 'right')
        }



    } else {

        doc.setFontSize(8)
        doc.text(`Total Basic:`, 434, 330,)
        doc.text(`${numberWithCommas(Number(TotalBasicAmount).toFixed(2))}`, 568, 330, 'right')

        doc.text(`Total Disc:`, 434, 340,)
        doc.text(`${numberWithCommas(Number(totalDiscount).toFixed(2))}`, 568, 340, 'right')

        doc.text(`Total CGST:`, 434, 350,)
        doc.text(`${numberWithCommas(Number(totalCGST).toFixed(2))}`, 568, 350, 'right')

        doc.text(`Total SGST:`, 434, 360,)
        doc.text(`${numberWithCommas(Number(totalSGST).toFixed(2))}`, 568, 360, 'right')

        doc.text(`Total GST:`, 434, 370,)
        doc.text(` ${numberWithCommas(Number(TotalGST).toFixed(2))}`, 568, 370, 'right')

        if (loginUserIsFranchisesRole()) {
            doc.text(`Advance Amount:`, 434, 380,)
            doc.text(` ${numberWithCommas(Number(data.AdvanceAmount).toFixed(2))}`, 568, 380, 'right')
        }

    }


    doc.setFont(undefined, 'Normal')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text(`Order Amount:`, 433, 395,)
    // const GrandTotal = Math.round(data.OrderAmount)
    //  const GrandTotal = numberWithCommas((56784936).toFixed(2))
    doc.text(`${Total}`, 568, 395, 'right')
    doc.setFont(undefined, 'Normal')
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setFont('Tahoma')
    doc.setFontSize(8)
    const terms = data.OrderTermsAndCondition
    doc.setFont(undefined, 'bold')
    doc.setFontSize(10)
    // doc.text(`Terms And Condition  `, 33, 775, "justify")
    doc.setFont(undefined, 'Normal')
    doc.setFontSize(9)



    doc.setFontSize(10)
    // doc.text(`${data.SupplierName} `, 390, 785, "justify")
    doc.setFontSize(10)
    // doc.text(`${data.CustomerName} `, 175, 811,"justify")
    doc.setFontSize(9)
    // doc.text(`Signature `, 400, 811, "justify")
    doc.setFont("Arimo");



    let DetailsOfCurrencyStyle = {

        didDrawCell: (data1) => {
            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(9)
                doc.setFont(undefined, 'bold')
                if (data.isAmerica) {
                    doc.text('Dollars: ', x, y)
                } else {
                    doc.text('Rupees: ', x, y)
                }
            }
        },

        margin: {
            top: 0, left: 30,
        },
        showHead: 'always',
        theme: 'grid',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: "black",
            cellPadding: 1,
            fontSize: 9,
            lineColor: "black"
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 400,
                halign: 'lfet',
            }

        },
        tableLineColor: "black",
        startY: 320,

    };

    doc.autoTable(table.Currencycolumn, table.CurrencyRow(data), DetailsOfCurrencyStyle,);


    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    // doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        pageHeder(doc, data)
        pageBorder_A5(doc)
        reportHeder3(doc, data)
        doc.setFont('helvetica', 'Normal')

        doc.text('Print Date :' + String(currentDate_dmy) + 'Time' + String(CurrentTime()), 30, 828,)
        doc.text('Page' + String(i) + ' of ' + String(pageCount), 500, 828,)

    }
}
