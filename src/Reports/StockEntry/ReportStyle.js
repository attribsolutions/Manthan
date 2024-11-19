
import cbm_logo from "../../assets/images/cbm_logo.png"
import * as table from './TableData'
import { convertOnlyTimefunc, date_dmy_func } from "../../components/Common/CommonFunction";
let initial_y = 0


export const pageBorder = (doc) => {
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 815, 30, 16);//vertical line (left)
    doc.line(570, 815, 570, 16);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)    
}

export const pageHeder = (doc, data) => {

    doc.addImage(cbm_logo, 'PNG', 33, 1, 95, 80, null, 'FAST')
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(18)
    doc.text('Stock Entry', 170, 45,)

}






export const reportHeder3 = (doc, data) => {

    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setDrawColor(0, 0, 0);
    doc.line(408, 65, 408, 16);//vertical right 1
    doc.setFont(undefined, 'bold')
    doc.text(`Closing Stock Date: ${date_dmy_func(data.Closingdate)}`, 415, 40) //Invoice date
    doc.line(570, 63, 30, 63) //horizontal line 2 billby upper

}

























