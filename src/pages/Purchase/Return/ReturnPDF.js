import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { currentDate_dmy, CurrentTime, loginUserDetails } from '../../../components/Common/CommonFunction';


function formatDate(dateString) {
    // Split the input date string (format: dd-mm-yyyy)
    const [day, month, year] = dateString.split('-');

    // Array of month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Convert the month number to a month name (subtract 1 for zero-based index)
    const monthName = monthNames[parseInt(month, 10) - 1];

    // Return the formatted date
    return `${day} ${monthName} ${year}`;
}


export const MarathiReport = ({ Table_Data, Supplier }) => {
    debugger
    const userDetails = loginUserDetails()
    const Return_Number = Table_Data.map(item => item.FullReturnNumber).join(',')
    debugger
    let records = Return_Number.split(',');
    let result = records.reduce((acc, curr, index) => {
        // Add a comma to separate numbers except for the last in each group
        acc += curr + (index % 9 !== 8 ? ',' : '');
        // Add a line break after every 9th record except the last group
        if ((index + 1) % 9 === 0 && index !== records.length - 1) {
            acc += '<br>';
        }
        return acc;
    }, '');



    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.top = '-9999px'; // Move the element out of the viewport
    element.innerHTML = `
    <div style="font-family: 'Noto Sans Devanagari'; font-size: 10px; sans-serif; color: black; padding: 60px;">
        <table border="1" style="width: 100%; margin-top:-20px; border-collapse: collapse ;">
            <tr>
                <td style="font-size: 25px; border: 1px solid black; width: 500px; padding: 3px; ">Distributors / SS / CX Name</td>
                <td style="font-size: 25px; border: 1px solid black; width: 500px; padding: 3px;">${userDetails.PartyName}</td>
            </tr>
            <tr>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">Address</td>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">${userDetails.PartyAddress}</td>
            </tr>
            <tr>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">Phone No</td>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;"></td>
            </tr>
            <tr>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">Cluster</td>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;"></td>
            </tr>
            <tr>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">Sub Cluster</td>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;"></td>
            </tr>
            <tr>
                <td style="font-size: 25px; border: 1px solid black; width: 500px; padding: 3px;">Date of Return</td>
                <td style="font-size: 25px; border: 1px solid black; width: 500px; padding: 3px; text-align: center;">${formatDate(currentDate_dmy)}</td>

            </tr>
            <tr>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">Return Note Number</td>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">${result}</td>
            </tr>
            <tr>
                <td style="font-size: 25px; border: 1px solid black; width: 500px; padding: 3px;">Supplier Name (SS / CBM)</td>
                <td style="font-size: 25px; border: 1px solid black; width: 500px; padding: 3px;">${Supplier.label}</td>
            </tr>
            <tr>
                <td style="font-size: 18px; border: 1px solid black; width: 500px; padding: 3px;"> या बॉक्स मधील स्वच्छ केलेली एक्सपायरी झालेल्या स्टॉकची रिकामी पॅकेट आम्ही सॉर्टीग केलेली आहेत व QTY. चेक केलेली आहे.</br>
बॉक्स भरताना स्वच्छ व रिकामी पॅकेट, तसेच QTY. आमच्या एरियामधील विक्री प्रतिनिधीकडून सुद्धा चेक करून घेतली आहेत, विक्री प्रतिनिधीचे अप्रूव्हल म्हणून सेल्स रिटर्न नोट वरती सही घेतलेली आहे.</br>
या बॉक्स मधील कुठलीही कमर्शियल व्हॅल्यू नसलेली रिकामी पाकिटे कंपनीकडे क्लेम अप्रूव्हल व ऑडिटसाठी परत पाठवीत आहोत</td>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">We have sorted the empty packets of expired stock and counted the quantity before placing them in this box. The empty packets are cleaned while filling the box, and the quantity is checked by a company representative, who signs the sales return note as primary approval for verifying the quantity and cleanliness of the packets.</br></br>
                The empty packets, which have no commercial value, are then sent back to the company for claim approval and re-audit</td>
            </tr>
            <tr>
                <td style="font-size: 20px; border: 1px solid black;  padding: 25px 0; width: 500px; padding: 3px;">Distributors Signature</td>
                <td style="font-size: 20px; border: 1px solid black;  padding: 25px 0; width: 500px; padding: 3px;"></td>
            </tr><tr>
                <td style="font-size: 40px; border: 1px solid black; width: 500px; padding: 3px;"><b>Box Count</b></td>
                <td style="font-size: 40px; border: 1px solid black; width: 500px; padding: 3px;"></td>
            </tr>
             </tr><tr>
                <td style="font-size: 25px; border: 1px solid black; width: 500px; padding: 3px;">Box Accepted By Name</td>
                <td style="font-size: 25px; border: 1px solid black; width: 500px; padding: 3px;"></td>
            </tr> </tr><tr>
                <td style="font-size: 25px; border: 1px solid black; width: 500px; padding: 3px;">Box Accepted By Signature</td>
                <td style="font-size: 25px; border: 1px solid black; width: 500px; padding: 3px;"></td>
            </tr>
        </table>
    </div>
`;

    document.body.appendChild(element);
    html2canvas(element, {
        scale: 3, // Increase the scale for better resolution
        useCORS: true,
    }).then((canvas) => {

        const imgData = canvas.toDataURL('image/png', 1.0); // 1.0 for full image quality
        const pdf = new jsPDF('l', 'pt', 'a5');

        const imgWidth = 590; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST'); // 'FAST' for better quality rendering
        pdf.setFont('helvetica', 'Normal')
        pdf.setFontSize(8)
        pdf.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 32, 403,)
        pdf.setProperties({
            title: `Return Report(${currentDate_dmy})`
        });

        // Open the PDF in a new browser tab
        window.open(pdf.output('bloburl'), '_blank');

        // Remove the temporary element after PDF generation
        document.body.removeChild(element);
    });
};



