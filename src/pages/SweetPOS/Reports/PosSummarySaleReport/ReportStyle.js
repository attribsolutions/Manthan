
import cbm_logo from "../../../../assets/images/cbm_logo.png"
import * as table from './TableData'
import { toWords, numberWithCommas } from "../../../../Reports/Report_common_function";
import { CurrentTime, compareGSTINState, convertOnlyTimefunc, currentDate_dmy, date_dmy_func } from "../../../../components/Common/CommonFunction";
import { url } from "../../../../routes";
let initial_y = 0


export const pageBorder = (doc) => {
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 820, 30, 16);//vertical line (left)
    doc.line(570, 820, 570, 16);//vertical line (Right)
    doc.line(570, 820, 30, 820);//horizontal line (Bottom)    
}

export const pageHeder1 = (doc, data) => {

    doc.addImage(cbm_logo, 'PNG', 33, 1, 95, 80, null, 'FAST')
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(18)
    doc.text('POS Item Sale Summary Report', 170, 45,)

}

export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')

    doc.setDrawColor(0, 0, 0);
    doc.line(570, 63, 30, 63)  //Image below line  1
    // doc.line(570, 16, 30, 16);//horizontal line 2
    // doc.line(570, 80, 30, 80);//horizontal line 3
    // doc.line(30, 789, 30, 16);//vertical left 1

    // doc.line(570, 789, 570, 16);//vertical left 2

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
                doc.text('GSTIN: ', x, y)
            };

            if (rowIdx === 2 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Date: ', x, y)
            };

        },
        margin: {
            top: 45, left: 30, right: 35,
        },
        showHead: 'never',
        theme: 'grid',
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
                columnWidth: 540,
                halign: 'lfet',
            }

        },
        tableLineColor: "black",

        startY: 63,

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

    data["initial_y"] = initial_y

    // doc.line(408, initial_y, 408, 16);//vertical right 1
    // doc.line(220, initial_y, 220, 63);//vertical right 2

    doc.line(30, initial_y, 570, initial_y);//vertical right 2


}



export const reportHeder2 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
}



export const reportHeder3 = (doc, data) => {

    // Check if data.CreatedOn is defined and is a valid string before using substring
    if (!data || !data.CreatedOn) {
        console.error('CreatedOn is missing or undefined in the data');
        return; // Exit the function early if the required data is missing
    }

    doc.setFont('Tahoma');
    doc.setFontSize(9);
    doc.setDrawColor(0, 0, 0);

    // Horizontal lines
    doc.line(570, 30, 408, 30); // horizontal line 1
    doc.line(570, 45, 408, 45); // horizontal line 2
    doc.line(408, 65, 408, 16); // vertical right 1

    doc.setFont(undefined, 'bold');
    doc.text(`Order No: ${data.FullOrderNumber}`, 415, 25); // Invoice Id

    // Safely handle the CreatedOn date
    let time = '';
    if (data.CreatedOn) {
        time = convertOnlyTimefunc(data.CreatedOn);
    }

    let Orderdate = '';
    const dateOnly = data.CreatedOn ? data.CreatedOn.substring(0, 10) : ''; // Ensure CreatedOn is valid
    if (dateOnly) {
        Orderdate = date_dmy_func(dateOnly);
    }

    doc.text(`Order Date: ${Orderdate}  ${time}`, 415, 40); // Order date
    const DeliveryDate = data.OrderDate ? date_dmy_func(data.OrderDate) : 'N/A'; // Safe Delivery Date
    doc.text(`Delivery Date: ${DeliveryDate}`, 415, 55); // Delivery date

    // Horizontal line 2
    doc.line(570, 63, 30, 63); // horizontal line 2
};























