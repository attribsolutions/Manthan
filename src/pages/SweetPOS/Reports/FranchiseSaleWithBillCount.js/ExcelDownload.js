import * as ExcelJS from 'exceljs';

export const downloadExcel = async (data, excelFileName = 'Franchise_Bills') => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Franchise Bills');

    let rowIndex = 1;

    data.forEach((franchise) => {
        // === Parent Row (Merged and Styled) ===
        const parentText = `Franchise: ${franchise.Name} (ID: ${franchise.id})  |  Bills: ${franchise.Bills}  |  Total: ${franchise.GrandTotal}`;
        worksheet.mergeCells(`A${rowIndex}:D${rowIndex}`);
        const parentRow = worksheet.getRow(rowIndex);
        parentRow.getCell(1).value = parentText;
        parentRow.font = { bold: true };
        parentRow.alignment = { horizontal: 'left' };
        rowIndex++;

        // === Header Row ===
        const headers = ['Client ID', 'Bills', 'Grand Total', 'Last Bill Time'];
        const headerRow = worksheet.getRow(rowIndex);
        headerRow.values = headers;
        headerRow.font = { bold: true };
        headerRow.alignment = { horizontal: 'center' };
        headerRow.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' },
            };
        });
        rowIndex++;

        // === Child Rows ===
        franchise.BillDetails.forEach((detail) => {
            const row = worksheet.getRow(rowIndex);
            row.getCell(1).value = detail.ClientID;
            row.getCell(2).value = detail.Bills;
            row.getCell(3).value = parseFloat(detail.GrandTotal);
            row.getCell(4).value = new Date(detail.LastBillTime);

            row.getCell(3).numFmt = '#,##0.00';
            row.getCell(4).numFmt = 'yyyy-mm-dd hh:mm:ss';

            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });

            rowIndex++;
        });

        // Spacer row
        rowIndex++;
    });

    // Set column widths
    worksheet.columns = [
        { key: 'col1', width: 20 },
        { key: 'col2', width: 12 },
        { key: 'col3', width: 18 },
        { key: 'col4', width: 25 },
    ];

    try {
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${excelFileName}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('Error creating Excel file:', error);
    }
};
