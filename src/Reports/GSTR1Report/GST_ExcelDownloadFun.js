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
function addRowsAndFormatCells(worksheet, HeaderColumns, dataRow, controlTypeName) {
    worksheet.addRow(HeaderColumns); // Add header row
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


// Component function for generating an Excel report with multiple tabs
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
                addRowsAndFormatCells(worksheet, HeaderColumns, dataRow, controlTypeName);
                worksheet.addRow([]); // Add empty row after title
            }
        }

        setColumnWidths(worksheet)

        if (value.length > 0) {
            
            let valueCopy = value
            if (pageName === "GST-R1") {
                valueCopy = value.slice(1); // Create a copy of the value array excluding the first index
            }

            const { HeaderColumns, dataRow, controlTypeName } = generateTableData({ excelTableData: valueCopy }); // Generate table data for copied value array

            // Add merged title row, rows, format cells, freeze header row, and auto fit column widths
            addMergedTitleRow(worksheet, HeaderColumns);
            addRowsAndFormatCells(worksheet, HeaderColumns, dataRow, controlTypeName);
            freezeHeaderRow(worksheet);
            autoFitColumnWidths(worksheet, HeaderColumns, dataRow);
        }
        
    }

    // Save the workbook as an Excel file
    saveWorkbookAsExcel(workbook, excelFileName);
};


export default GST_ExcelDownloadFun