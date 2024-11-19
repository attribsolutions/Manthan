

import * as ExcelJS from 'exceljs';
import { autoFitColumnWidths, freezeHeaderRow, generateTableData, saveWorkbookAsExcel, setDateValue, setNumberValue, setTextValue, styleHeaderRow } from "../../components/Common/ReportCommonFunc/ExcelFunctions";



// Function to add title row to the worksheet
function addTitleRow(worksheet, title) {
    const workSheetName = [`Summary For ${title}`];
    worksheet.addRow(workSheetName); // Add title row
    styleHeaderRow(worksheet, 'CCC0DA'); // Apply style to title row
    worksheet.addRow([]); // Add empty row after title
}

// Function to add merged title row to the worksheet
function addMergedTitleRow(worksheet, HeaderColumns) {

    const endColumn = HeaderColumns.length + 1;
    worksheet.mergeCells(1, 1, 1, endColumn); // Merge cells for title
    worksheet.getCell(1, endColumn).alignment = { horizontal: 'center' }; // Align title horizontally to center

}


// Function to add rows and format cells based on table data
function addRowsAndFormatCells(worksheet, HeaderColumns, dataRow, controlTypeName, key) {
    
    const headerRow = worksheet.addRow(HeaderColumns);
    // Merge cells in the header row with the cells in the merge row

    if ((key === "B2B") || (key === "B2CL") || (key === "CDNR")) {
        const mergeRow = worksheet.addRow([])
        const Avoide_Merging_Column = ["C", "D", "E", "F", "K", "L", "M", "N"];
        HeaderColumns.forEach((header, index) => {
            const colLetter = String.fromCharCode(65 + index); // Convert column index to letter (A, B, C, etc.)
            if (!(Avoide_Merging_Column.includes(colLetter))) {
                worksheet.mergeCells(`${colLetter}${headerRow.number}:${colLetter}${mergeRow.number}`);

            }
        });

        // Set values for the second row in specific columns
        HeaderColumns.forEach((header, index) => {
            const colLetter = String.fromCharCode(65 + index);
            if (Avoide_Merging_Column.includes(colLetter)) {
                const cell_1 = worksheet.getCell(`${colLetter}${mergeRow.number}`);
                cell_1.value = header; // Set the value for specific columns in the second row
            }
        });
        worksheet.mergeCells('C6:F6');
        worksheet.mergeCells('K6:N6');

        const mergedCell_1 = worksheet.getCell('C6');
        const mergedCell_2 = worksheet.getCell('K6');

        mergedCell_1.alignment = { vertical: 'middle', horizontal: 'center' };
        mergedCell_1.value = (key === "CDNR") ? "Credit note/Debit note details" : "Invoice Details";
        mergedCell_1.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E4DFEC' }
        };
        mergedCell_1.font = {
            color: {
                argb: '000000',
            },
            bold: true
        };
        mergedCell_1.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        mergedCell_2.alignment = { vertical: 'middle', horizontal: 'center' };
        mergedCell_2.value = "Tax Amount";
        mergedCell_2.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E4DFEC' }
        };
        mergedCell_2.font = {
            color: {
                argb: '000000',
            },
            bold: true
        };
        mergedCell_2.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    };

    if ((key === "B2CS")) {
        const mergeRow = worksheet.addRow([])
        const Avoide_Merging_Column = ["C", "D", "G", "H", "I", "J"];
        HeaderColumns.forEach((header, index) => {
            const colLetter = String.fromCharCode(65 + index); // Convert column index to letter (A, B, C, etc.)
            if (!(Avoide_Merging_Column.includes(colLetter))) {
                worksheet.mergeCells(`${colLetter}${headerRow.number}:${colLetter}${mergeRow.number}`);

            }
        });

        // Set values for the second row in specific columns
        HeaderColumns.forEach((header, index) => {
            const colLetter = String.fromCharCode(65 + index);
            if (Avoide_Merging_Column.includes(colLetter)) {
                const cell_1 = worksheet.getCell(`${colLetter}${mergeRow.number}`);
                cell_1.value = header; // Set the value for specific columns in the second row
            }
        });
        worksheet.mergeCells('C6:D6');
        worksheet.mergeCells('G6:J6');

        const mergedCell_1 = worksheet.getCell('C6');
        const mergedCell_2 = worksheet.getCell('G6');

        mergedCell_1.alignment = { vertical: 'middle', horizontal: 'center' };
        mergedCell_1.value = (key === "CDNR") ? "Credit note/Debit note details" : "Invoice Details";
        mergedCell_1.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E4DFEC' }
        };
        mergedCell_1.font = {
            color: {
                argb: '000000',
            },
            bold: true
        };
        mergedCell_1.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        mergedCell_2.alignment = { vertical: 'middle', horizontal: 'center' };
        mergedCell_2.value = "Tax Amount";
        mergedCell_2.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E4DFEC' }
        };
        mergedCell_2.font = {
            color: {
                argb: '000000',
            },
            bold: true
        };
        mergedCell_2.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    }



    styleHeaderRow(worksheet); // Apply style to header row

    // Iterate through each data row, add rows and format cells accordingly
    dataRow.forEach((item) => {
        const row = worksheet.addRow(item);
        row.eachCell((cell, colNumber) => {
            const controlType = controlTypeName[colNumber - 1];
            formatCellByDataType(cell, controlType, item[colNumber - 1]); // Format cell based on data type
        });
    });
}
function setColumnWidths(worksheet) {
    worksheet.columns.forEach((column) => {
        column.width = Math.max(20, column.width);
        // Adjust column width based on header length or set default width
        column.width = column.header ? Math.max(20, Math.min(100, column.header.length * 1.25)) : 20;
    });
}
function formatCellByDataType(cell, controlType, value) {
    switch (controlType) {
        case 'Date':
            setDateValue(cell, value);
            break;
        case 'Number':
            setNumberValue(cell, value);
            break;
        case 'Text':
            setTextValue(cell, value);
            break;
        default:
            break;
    }
}


function GST_ExcelDownloadFun({ excelTableData, excelFileName, pageName }) {
    
    const workbook = new ExcelJS.Workbook(); // Create a new Excel workbook

    // Iterate through each key-value pair in the excelTableData object
    for (const [key, value] of Object.entries(excelTableData)) {
        const worksheet = workbook.addWorksheet(key); // Add a new worksheet for each key

        // Add title row for the worksheet
        addTitleRow(worksheet, key);

        if (pageName === "GST-R1") {
            
            // If there are elements in the first index
            if (value.length > 0) {

                const firstIndex = value[0]; // Get the first index of the value array
                const { HeaderColumns, dataRow, controlTypeName } = generateTableData({ excelTableData: [firstIndex] }); // Generate table data

                // Add rows and format cells based on the generated table data
                if (!(key === "WithOutGSTIN" || key === "WithGSTIN")) {
                    addRowsAndFormatCells(worksheet, HeaderColumns, dataRow, controlTypeName);
                }
                worksheet.addRow([]); // Add empty row after title
            }
        }

        setColumnWidths(worksheet)

        if (value.length > 0) {
            
            let valueCopy = value
            if (pageName === "GST-R1" && !(key === "WithOutGSTIN" || key === "WithGSTIN")) {
                valueCopy = value.slice(1); // Create a copy of the value array excluding the first index
            }

            const { HeaderColumns, dataRow, controlTypeName } = generateTableData({ excelTableData: valueCopy }); // Generate table data for copied value array

            // Add merged title row, rows, format cells, freeze header row, and auto fit column widths
            addMergedTitleRow(worksheet, HeaderColumns);
            addRowsAndFormatCells(worksheet, HeaderColumns, dataRow, controlTypeName, key);
            freezeHeaderRow(worksheet);
            autoFitColumnWidths(worksheet, HeaderColumns, dataRow);
        }

    }

    // Save the workbook as an Excel file
    saveWorkbookAsExcel(workbook, excelFileName);
};


export default GST_ExcelDownloadFun