
import * as ExcelJS from 'exceljs';
import { autoFitColumnWidths, freezeHeaderRow, saveWorkbookAsExcel, setDateValue, setNumberValue, setTextValue, styleHeaderRow } from '../../components/Common/ReportCommonFunc/ExcelFunctions';

export function ExcelDownloadFunc({ excelTableData, excelFileName, buttonStateArray }) {
    debugger
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    let dataRow = [];
    let controlTypeName = [];
    let csvHeaderColumns = [];
    let columnsKey = [];

    const newSelectedColumns = buttonStateArray.filter(option => option.showing)

    controlTypeName = newSelectedColumns.map((i) => {
        return i.controlTypeName
    })

    columnsKey = newSelectedColumns
        .filter(column => column.showing)
        .map(column => column.dataField);

    csvHeaderColumns = newSelectedColumns
        .filter(column => column.showing)
        .map(column => column.text);

    dataRow = excelTableData.map((item) =>
        columnsKey.map((column) => item[column] || "")
    );

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



