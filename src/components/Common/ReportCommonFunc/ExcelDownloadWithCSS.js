import * as ExcelJS from 'exceljs';
import { autoFitColumnWidths, freezeHeaderRow, generateTableData, saveWorkbookAsExcel, setDateValue, setNumberValue, setTextValue, styleHeaderRow, styleLastRow } from "./ExcelFunctions";

export function ExcelReportComponent({ pageField,
    excelTableData,
    excelFileName,
    extraColumn,
    numericHeaders,
    dateHeader,
    lastRowStyle = false,
    customKeyColumns,
    listExcelDownload
}) {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const { HeaderColumns, dataRow, controlTypeName, noDataForDownload } = generateTableData({
        pageField,
        customKeyColumns,
        excelTableData,
        extraColumn,
        numericHeaders,
        dateHeader,
        listExcelDownload
    });

    if (!(noDataForDownload)) {

        // Add headers to the worksheet
        worksheet.addRow(HeaderColumns);

        styleHeaderRow(worksheet);  // Header Style

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

        dataRow.forEach((item) => {
            const row = worksheet.addRow(item);

            row.eachCell((cell, colNumber) => {
                const controlType = controlTypeName[colNumber - 1];
                formatCellByDataType(cell, controlType, item[colNumber - 1]);
            });
        });

        if (lastRowStyle) {
            styleLastRow(worksheet, dataRow);
        }

        freezeHeaderRow(worksheet);  // freeze Header Row
        autoFitColumnWidths(worksheet, HeaderColumns, dataRow); // Auto Fit Columns
        saveWorkbookAsExcel(workbook, excelFileName);  // Save Work Book
    }
}