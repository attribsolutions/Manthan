import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { currentDate_dmy, CurrentTime, loginUserDetails } from '../../../components/Common/CommonFunction';
import { useDispatch } from 'react-redux';
import { Return_PDF_Loading, Return_PDF_Loading_Succcess } from '../../../store/actions';


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


export const PDF_ReturnReport = ({ Table_Data, Supplier }) => {


    return new Promise((resolve, reject) => {
        try {
            const userDetails = loginUserDetails()
            
            const Return_Number = Table_Data.map(item => item.FullReturnNumber).join(',')
            let records = Return_Number.split(',');
            let result = records.reduce((acc, curr, index) => {

                acc += curr + (index % 9 !== 8 ? ',' : '');

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
                <td style="font-size: 25px; border: 1px solid black; width: 500px; padding: 3px;">Supplier Name (SS / CBM)</td>
                <td style="font-size: 25px; border: 1px solid black; width: 500px; padding: 3px;">${Supplier.label}</td>
            </tr>
            <tr>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">Address</td>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">${userDetails.PartyAddress}</td>
            </tr>
            <tr>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">Phone No</td>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">${userDetails.MobileNo}</td>
            </tr>
            <tr>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">Cluster</td>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;"> ${userDetails.ClusterName}</td>
            </tr>
            <tr>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">Sub Cluster</td>
                <td style="font-size: 15px; border: 1px solid black; width: 500px; padding: 3px;">${userDetails.SubClusterName}</td>
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
                <td style="font-size: 25px; border: 1px solid black; width: 500px; padding: 3px; ">Distributors / SS / CX Name</td>
                <td style="font-size: 25px; border: 1px solid black; width: 500px; padding: 3px;">${userDetails.PartyName}</td>
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
                scale: 4, // High resolution scale to capture detailed content
                useCORS: true,
                // Set width and height to fixed values if needed to maintain consistency
                width: element.offsetWidth,  // Use the element's actual width
                height: element.offsetHeight,  // Use the element's actual height
            }).then((canvas) => {
                const pdf = new jsPDF('l', 'pt', 'a5'); // Landscape A5
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                // Get canvas dimensions
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;

                // Calculate the aspect ratio to fit the image on the A5 page
                let imgWidth = pageWidth;
                let imgHeight = (canvasHeight * pageWidth) / canvasWidth;

                // Ensure the image height fits within the page height
                if (imgHeight > pageHeight) {
                    imgWidth = (canvasWidth * pageHeight) / canvasHeight;
                    imgHeight = pageHeight;
                }

                // Add the image to PDF
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

                // Add footer text
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(8);
                pdf.text(`Print Date: ${currentDate_dmy} Time: ${CurrentTime()}`, 32, pageHeight - 20);

                // Set document properties
                pdf.setProperties({
                    title: `Return Report(${currentDate_dmy})`
                });

                // Open PDF in a new tab
                window.open(pdf.output('bloburl'), '_blank');

                // Remove the element after capturing
                document.body.removeChild(element);
                resolve();
            }).catch((error) => {
                document.body.removeChild(element);
                reject(error);
            });



        } catch (error) {
            reject(error); // Catch synchronous errors
        }



    });
    return
};












