import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { CommonConsole } from "../CommonFunction";

function parseAndFormatDate(dateString) {
    if (dateString) {
        const dateParts = dateString.split(/[-/]/);

        // Check if the date is in the format DD-MM-YYYY
        if (dateParts.length === 3 && dateParts[0].length === 2 && dateParts[1].length === 2 && dateParts[2].length === 4) {
            const dd = String(dateParts[0]).padStart(2, '0');
            const mm = String(dateParts[1]).padStart(2, '0');
            const yy = dateParts[2];
            return `${yy}-${mm}-${dd}`;
        }

        // Check if the date is in the format YYYY-MM-DD
        if (dateParts.length === 3 && dateParts[0].length === 4 && dateParts[1].length === 2 && dateParts[2].length === 2) {
            const dd = String(dateParts[2]).padStart(2, '0');
            const mm = String(dateParts[1]).padStart(2, '0');
            const yy = dateParts[0];
            return `${yy}-${mm}-${dd}`;
        }
    }
    // If the format is not recognized, return the original string
    return dateString;
}

export function setDateValue(cell, value) {

    if (value) {
        const formattedDate = parseAndFormatDate(value);
        const dateValue = new Date(formattedDate);
        if (!isNaN(dateValue)) {
            cell.value = dateValue;
            cell.numFmt = 'dd/mm/yyyy';
        }
    }
}

export function setTextValue(cell, value) {

    if (value !== undefined && value !== null) {
        cell.value = value;
    }
}

function getDecimalPlaces(value) {
    const match = value.includes('.') ? value.split('.')[1] : null;
    return match ? match.length : 0;
}

export function setNumberValue(cell, value) {

    if (typeof value === 'string') {
        const numericValue = parseFloat(value.replace(/,/g, ''));
        if (!isNaN(numericValue)) {
            const decimalPlaces = getDecimalPlaces(value);
            if (decimalPlaces > 0) {
                cell.value = numericValue;
                cell.numFmt = `0.${'0'.repeat(decimalPlaces)}`;
            }
            else {
                cell.value = numericValue;
                cell.numFmt = '0';
            }
        }
    } else if (typeof value === 'number') {
        const decimalPlaces = getDecimalPlaces(value.toString());
        if (Number.isInteger(value)) {
            cell.value = value;
            cell.numFmt = '0';
        } else {
            cell.value = value;
            cell.numFmt = `0.${'0'.repeat(decimalPlaces)}`;
        }
    }
}

export function freezeHeaderRow(worksheet,) {
    worksheet.views = [
        {
            state: 'frozen',
            xSplit: 0,
            ySplit: 1,
            showGridLines: true,
        }
    ];
}

export function autoFitColumnWidths(worksheet, excelHeaderLabel, mainExcelRowData, buffer = 2) {

    if (!worksheet || !worksheet.columns) {
        CommonConsole("Worksheet or columns not properly initialized.");
        return;
    }

    const columnCount = excelHeaderLabel.length;
    const maxContentLengths = Array(columnCount).fill(0);

    // Iterate through header labels
    excelHeaderLabel.forEach((header, colIndex) => {
        maxContentLengths[colIndex] = Math.max(maxContentLengths[colIndex], (header || '').toString().length);
    });

    // Iterate through mainExcelRowData
    mainExcelRowData.forEach(row => {
        row.forEach((cellValue, colIndex) => {
            maxContentLengths[colIndex] = Math.max(maxContentLengths[colIndex], (cellValue || '').toString().length);
        });
    });

    // Set column width based on the maximum of header label length and content length in each column
    worksheet.columns.forEach((column, colIndex) => {
        column.width = Math.max(maxContentLengths[colIndex], (excelHeaderLabel[colIndex] || '').toString().length) + buffer;
    });
}

export function saveWorkbookAsExcel(workbook, excelFileName) {
    workbook.xlsx.writeBuffer()
        .then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${excelFileName}.xlsx`;
            link.click();
            URL.revokeObjectURL(link.href);
        })
        .catch((error) => {
            console.error('Error creating Excel file:', error);
        });
}

export function styleHeaderRow(worksheet) {

    const headerRow = worksheet.getRow(worksheet.lastRow.number);

    headerRow.height = 25;

    headerRow.alignment = { vertical: 'middle', horizontal: 'left' };

    headerRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'cce6f6' }
        };
        cell.font = { bold: true };
    });
}

export function styleLastRow(worksheet) {
    // Style the last row with data
    let lastRowWithData = null;

    worksheet.eachRow({ reverse: true }, (row, rowNumber) => {
        if (row.values.some(cellValue => cellValue !== undefined && cellValue !== null && cellValue !== '')) {
            lastRowWithData = row;
            return false; // Stop iterating after finding the last non-empty row
        }
    });

    if (lastRowWithData) {
        lastRowWithData.eachCell({ includeEmpty: true }, (cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFCC' } // Yellow color code for the last row
            };
            cell.font = { bold: true };
        });
    }
}

export function generateTableData({
    pageField,
    customKeyColumns,
    excelTableData,
    extraColumn,
    numericHeaders,
    dateHeader,
    listExcelDownload }) {
    let columnsKey = [];
    let HeaderColumns = [];
    let dataRow = [];
    let controlTypeName = [];

    if ((pageField) && (listExcelDownload === undefined)) {

        const listPageColumns = (pageField?.PageFieldMaster || []).filter(({ ShowInListPage }) => ShowInListPage).sort((a, b) => a.ListPageSeq - b.ListPageSeq);
        if (listPageColumns.length === 0) {
            customAlert({
                Type: 4,
                Message: "No fields selected for download"
            })
            return { noDataForDownload: true };
        }
        columnsKey = [extraColumn, ...listPageColumns.map(({ ControlID }) => ControlID)].filter(Boolean);
        HeaderColumns = [extraColumn, ...listPageColumns.map(({ FieldLabel }) => FieldLabel)].filter(Boolean);
        controlTypeName = [extraColumn && "Text", ...listPageColumns.map(({ ControlTypeName }) => ControlTypeName)].filter(Boolean);

    } else if (customKeyColumns) {
        const { tableData, isButton } = customKeyColumns;
        const selectedColumns = isButton ? tableData.filter(option => option.showing) : tableData;

        controlTypeName = selectedColumns.map(({ controlTypeName }) => controlTypeName);
        columnsKey = selectedColumns.map(({ dataField }) => dataField);
        HeaderColumns = selectedColumns.map(({ text }) => text);
    }
    else if (listExcelDownload) {

        controlTypeName = findProperties(listExcelDownload, pageField.PageFieldMaster, "ControlTypeName");
        columnsKey = findProperties(listExcelDownload, pageField.PageFieldMaster, "ControlID",);
        HeaderColumns = findProperties(listExcelDownload, pageField.PageFieldMaster, "FieldLabel");
    }
    else {
        const keys = Object.keys(excelTableData[0] || {});
        HeaderColumns = keys;
        columnsKey = keys;
        controlTypeName = HeaderColumns.map((header) => {
            if (numericHeaders.includes(header)) {
                return 'Number';
            } else if (header === dateHeader) {
                return 'Date';
            } else {
                return 'Text';
            }
        });
    }

    dataRow = excelTableData.map(item =>
        columnsKey.map(column => item[column] || "")
    );

    return { HeaderColumns, dataRow, controlTypeName, noDataForDownload: false };
}

function findProperties(checkedValues, pageFieldMaster, propertyName) {
    const result = [];
    checkedValues.forEach((value) => {
        const foundItem = pageFieldMaster.find((item) => item.ControlID === value);
        if (foundItem) {
            const propertyValue = foundItem[propertyName];
            result.push({ [propertyName]: propertyValue });
        }
    });
    return result.map((item) => item[propertyName]);
}