import * as ExcelJS from 'exceljs';
import { autoFitColumnWidths, freezeHeaderRow, saveWorkbookAsExcel, setDateValue, setNumberValue, setTextValue, styleHeaderRow } from "./ExcelFunctions";
import { url } from '../../../routes';

export function ExcelReportComponent({ pageName, pageField, excelTableData, excelFileName, extraColumn, numericHeaders, dateHeader, buttonStateArray }) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    debugger

    let columnsKey = [];
    let csvHeaderColumns = [];
    let dataRow = [];
    let controlTypeName = [];

    if (pageField) {
        const pageFieldData = pageField?.PageFieldMaster;
        const listPageColumns = pageFieldData.filter(({ ShowInListPage }) => ShowInListPage).sort((a, b) => a.ListPageSeq - b.ListPageSeq);

        columnsKey = [extraColumn, ...listPageColumns.map(({ ControlID }) => ControlID)].filter(Boolean);
        csvHeaderColumns = [extraColumn, ...listPageColumns.map(({ FieldLabel }) => FieldLabel)].filter(Boolean);
        controlTypeName = [extraColumn && "Text", ...listPageColumns.map(({ ControlTypeName }) => ControlTypeName)].filter(Boolean);

        dataRow = excelTableData.map((item) =>
            columnsKey.map((column) => item[column] || "")
        );
    }

    else {

        const keys = Object.keys(excelTableData[0] || {});
        csvHeaderColumns = keys;
        dataRow = excelTableData.map((item) =>
            keys.map((column) => item[column] || "")
        );

        controlTypeName = csvHeaderColumns.map((header) => {
            if (numericHeaders.includes(header)) {
                return 'Number';
            } else if (header === dateHeader) {
                return 'Date';
            } else {
                return 'Text';
            }
        });
    }

    // Add headers to the worksheet
    worksheet.addRow(csvHeaderColumns);

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

    freezeHeaderRow(worksheet);  // freeze Header Row
    autoFitColumnWidths(worksheet, csvHeaderColumns, dataRow); // Auto Fit Columns
    saveWorkbookAsExcel(workbook, excelFileName);  // Save Work Book
}

