import * as ExcelJS from 'exceljs';
import { groupBy } from '../../components/Common/CommonFunction';

export function Cx_DD_ExcelDownload({ pageField, excelData, excelFileName, extraColumn = '', PartyName }) {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const groupbyCx = groupBy(excelData, (item) => item.XpressName);

    const extractCSVData = (_excelData) => {

        let columnsKey = [];
        let headerLabel = [];
        let dataRow = [];

        const listPageColumns = pageField?.PageFieldMaster
            .filter(({ ShowInListPage }) => ShowInListPage)
            .sort((a, b) => a.ListPageSeq - b.ListPageSeq) || [];

        if (extraColumn !== "") {
            columnsKey.push(extraColumn);
            headerLabel.push(extraColumn);
        }

        columnsKey.push(...listPageColumns.map(({ ControlID }) => ControlID));
        headerLabel.push(...listPageColumns.map(({ FieldLabel }) => FieldLabel));

        dataRow = _excelData.map(item => columnsKey.map(column => item[column] || ''));

        return { columnsKey, headerLabel, dataRow };
    };

    let excelHeaderLabel = [];
    let mainExcelRowData = [];

    groupbyCx.forEach((value, xpressName) => {

        const { columnsKey, headerLabel, dataRow } = extractCSVData(value);

        const diffAmtWithoutGSTCol = String.fromCharCode(64 + headerLabel.length);
        const calculationsLabelCol = String.fromCharCode(64 + (headerLabel.length) - 1);

        if (excelHeaderLabel.length === 0) {
            excelHeaderLabel.push(headerLabel);
            mainExcelRowData.push(headerLabel);
            worksheet.addRows([headerLabel]); // Add header labels as a single array

            // Apply formatting to the header row
            const headerRow = worksheet.getRow(worksheet.lastRow.number);
            headerRow.height = 25;  // Set height of the header row to 20
            headerRow.alignment = { vertical: 'middle', horizontal: 'left' };
            headerRow.eachCell({ includeEmpty: true }, (cell) => {
                // Set yellow background color and bold font for header cells
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'cce6f6' }
                };
                cell.font = { bold: true };
            });
        }

        dataRow.forEach(iterator => {
            const row = worksheet.addRow(iterator);
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (colNumber === 8) { // Assuming 'H' is the 8th column
                    cell.numFmt = '0.00'; // Set the desired number format
                }
            });
        });

        mainExcelRowData.push(...dataRow);

        const blankRow = Array(headerLabel.length).fill("");
        worksheet.addRow(blankRow);
        mainExcelRowData.push(blankRow);

        const firstRowStart = mainExcelRowData.length - (dataRow.length);
        const lastRowIndex = worksheet.lastRow.number;

        const mergeColumnCells = (worksheet, columnsKey, columnName, rowIndex, firstRowStart, lastRowIndex, value) => {
            const hasColumn = columnsKey.includes(columnName);
            const position = columnsKey?.indexOf(columnName);
            const colLetter = String.fromCharCode(64 + position + 1);

            if (hasColumn) {
                worksheet.mergeCells(`${colLetter}${firstRowStart}:${colLetter}${lastRowIndex - 1}`);
                const mergedCell = worksheet.getCell(`${colLetter}${firstRowStart}`);
                mergedCell.alignment = { vertical: 'top' };
                mergedCell.font = { bold: true };
                mergedCell.value = value;
            }
        };

        mergeColumnCells(worksheet, columnsKey, 'SupplierName', lastRowIndex, firstRowStart, lastRowIndex, PartyName);

        mergeColumnCells(worksheet, columnsKey, 'XpressName', lastRowIndex, firstRowStart, lastRowIndex, xpressName);

        // Merge cells A to G in the last row of the group
        worksheet.mergeCells(`A${lastRowIndex}:${calculationsLabelCol}${lastRowIndex}`);
        // Access cell A in the last row
        const mergedCellA = worksheet.getCell(`A${lastRowIndex}`);
        // Apply the background color and font style
        mergedCellA.value = xpressName; // Cx party name
        mergedCellA.font = { bold: true };
        mergedCellA.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFCC' } // Light yellow background color
        };
        mergedCellA.alignment = { vertical: 'middle', horizontal: 'right' };

        // Set the formula for cell H in the last row of the group
        const sumFormula = `SUM(${diffAmtWithoutGSTCol}${firstRowStart}:${diffAmtWithoutGSTCol}${lastRowIndex - 1})`;
        const sumCell = worksheet.getCell(`${diffAmtWithoutGSTCol}${lastRowIndex}`);
        sumCell.value = { formula: sumFormula };
        sumCell.font = { bold: true, size: 12, }; // Example style
        sumCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFCC' } // Light yellow background color
        };
    });

    // =============================================================================

    const diffAmtWithoutGSTCol = String.fromCharCode(64 + excelHeaderLabel[0]?.length);

    function addRowWithFormulaAndFormatting(label, formula) {
        const bgColor = 'b3cccc';
        const fontColor = '000000';

        const lastRowIndex = worksheet.lastRow.number;

        // Add a new blank row
        const blankRow = Array(excelHeaderLabel[0].length).fill('');
        worksheet.addRow(blankRow);

        // Merge cells for the total title
        const startCol = String.fromCharCode(64 + excelHeaderLabel[0].length - 2);
        const endCol = String.fromCharCode(64 + excelHeaderLabel[0].length - 1);

        worksheet.mergeCells(`${startCol}${lastRowIndex + 1}:${endCol}${lastRowIndex + 1}`);
        const mergedCellRange = `${startCol}${lastRowIndex + 1}:${endCol}${lastRowIndex + 1}`;
        const mergedCellA = worksheet.getCell(mergedCellRange);
        mergedCellA.value = label;
        mergedCellA.alignment = { vertical: 'middle', horizontal: 'right' };
        mergedCellA.font = { bold: true, size: 12, color: { argb: fontColor } };
        mergedCellA.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: bgColor }
        };

        // Set the background color and border for the specified column
        for (let colIndex = excelHeaderLabel[0].length - 2; colIndex <= excelHeaderLabel[0].length - 1; colIndex++) {
            const colLetter = String.fromCharCode(65 + colIndex); // Convert index to column letter
            const cell = worksheet.getCell(`${colLetter}${lastRowIndex + 1}`);
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: bgColor }
            };
            // Set black border for each cell
            cell.border = {
                top: { style: 'dotted', color: { argb: '000000' } },
                left: { style: 'dotted', color: { argb: '000000' } },
                bottom: { style: 'dotted', color: { argb: '000000' } },
                right: { style: 'dotted', color: { argb: '000000' } }
            };
        }

        // Display the formula in the specified column for the entire sheet
        const diffAmtWithoutGSTCol = String.fromCharCode(64 + excelHeaderLabel[0].indexOf('Diff Amount Without GST') + 1);
        const sumCell = worksheet.getCell(`${diffAmtWithoutGSTCol}${lastRowIndex + 1}`);
        sumCell.value = { formula: formula };
        sumCell.font = { bold: true, size: 12, color: { argb: fontColor } };
        sumCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: bgColor }
        };
        // Set border style for the cell
        sumCell.border = {
            top: { style: 'dotted', color: { argb: '000000' } },
            left: { style: 'dotted', color: { argb: '000000' } },
            bottom: { style: 'dotted', color: { argb: '000000' } },
            right: { style: 'dotted', color: { argb: '000000' } }
        };
    }

    const sumFormulaSheet = `SUM(${diffAmtWithoutGSTCol}1:${diffAmtWithoutGSTCol}${worksheet.lastRow.number})/2`;
    const basicAmount = `${diffAmtWithoutGSTCol}${worksheet.lastRow.number + 1}`

    const without_GSTFormula = `${basicAmount} * 0.18`;
    const with_GSTFormula = `${basicAmount} + ${diffAmtWithoutGSTCol}${worksheet.lastRow.number + 2}`;
    const sumFormulaSheetForTDS = `${basicAmount} * 0.02`;
    const sumFormulaSheetForTDSLess = `${diffAmtWithoutGSTCol}${worksheet.lastRow.number + 3}-${diffAmtWithoutGSTCol}${worksheet.lastRow.number + 4}`;

    addRowWithFormulaAndFormatting(
        `${PartyName} Basic Amount Total`,
        sumFormulaSheet,
    );

    addRowWithFormulaAndFormatting(
        "GST(18%)",
        without_GSTFormula,
    );

    addRowWithFormulaAndFormatting(
        "GST(18%) Addition Amount",
        with_GSTFormula,
    );

    addRowWithFormulaAndFormatting(
        "TDS 2% On Basic",
        sumFormulaSheetForTDS,
    );

    addRowWithFormulaAndFormatting(
        "TDS Less Amt",
        sumFormulaSheetForTDSLess,
    );

    // Function to set frozen panes in the worksheet
    function setFrozenPanes(worksheet, columnsKey) {

        const hasSupplierName = columnsKey.includes('SupplierName');
        const hasXpressName = columnsKey.includes('XpressName');

        if (hasSupplierName && hasXpressName) {
            // If both are present, freeze panes based on SupplierName and XpressName
            worksheet.views = [
                {
                    state: 'frozen',
                    xSplit: columnsKey.indexOf('XpressName') + 1,
                    ySplit: 1,
                    activeCell: 'B2',
                    showGridLines: true,
                }
            ];
        } else if (hasXpressName) {
            // If only XpressName is present, freeze only that column
            worksheet.views = [
                {
                    state: 'frozen',
                    xSplit: columnsKey.indexOf('XpressName') + 1,
                    ySplit: 1,
                    activeCell: 'B2',
                    showGridLines: true,
                }
            ];
        } else {
            // If either SupplierName or XpressName is not present, freeze the first column and top row
            worksheet.views = [
                {
                    state: 'frozen',
                    xSplit: 1,
                    ySplit: 1,
                    activeCell: 'B2',
                    showGridLines: true,
                }
            ];
        }
    }

    // Function to auto-fit width for all columns in the worksheet
    function autoFitColumns(worksheet, excelHeaderLabel, mainExcelRowData) {
        worksheet.columns.forEach((column, colIndex) => {
            column.width = Math.max(
                excelHeaderLabel[0][colIndex].length,
                ...mainExcelRowData.map(row => (row[colIndex] || '').toString().length)
            ) + 2;
        });
    }

    // Function to apply borders to each cell in the worksheet
    function applyBordersToWorksheet(worksheet) {
        const lastRow = worksheet.lastRow.number;
        const lastColumn = worksheet.columns.length;

        // Set borders for each cell in the worksheet
        for (let rowIndex = 1; rowIndex <= lastRow; rowIndex++) {
            for (let colIndex = 1; colIndex <= lastColumn; colIndex++) {
                const cell = worksheet.getCell(`${String.fromCharCode(64 + colIndex)}${rowIndex}`);

                // Set borders for each cell
                cell.border = {
                    top: { style: 'dotted', color: { argb: '000000' } },
                    left: { style: 'dotted', color: { argb: '000000' } },
                    bottom: { style: 'dotted', color: { argb: '000000' } },
                    right: { style: 'dotted', color: { argb: '000000' } }
                };
            }
        }
    }

    // Call this function after extracting CSV data
    const { columnsKey } = extractCSVData(excelData);

    // Call the function to set frozen panes
    setFrozenPanes(worksheet, columnsKey);
    autoFitColumns(worksheet, excelHeaderLabel, mainExcelRowData);
    applyBordersToWorksheet(worksheet);

    // Save the workbook as an Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${excelFileName}.xlsx`;
        a.click();

        URL.revokeObjectURL(url);
    });
}


// ***************************    Party All Selected then Cx_DD_ExcelDownload_PartyAll function call  ********************
export function Cx_DD_ExcelDownload_PartyAll({ pageField, excelData, excelFileName, extraColumn = "" }) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    let csvColumns = []
    let csvHeaderColumns = []
    let csvData = []
    if (pageField) {
        csvColumns = pageField.PageFieldMaster
            .filter(column => column.ShowInListPage) // Only include columns where ShowInListPage is true
            .sort((a, b) => a.ListPageSeq - b.ListPageSeq) // Sort columns by ListPageSeq in ascending order
            .map(column => column.ControlID); // Extract ControlID as column headers

        csvHeaderColumns = pageField.PageFieldMaster
            .filter(column => column.ShowInListPage) // Only include columns where ShowInListPage is true
            .sort((a, b) => a.ListPageSeq - b.ListPageSeq) // Sort columns by ListPageSeq in ascending order
            .map(column => column.FieldLabel); // Extract FieldLabel as column headers

        if (extraColumn !== "") {
            csvColumns.unshift(extraColumn);
            csvHeaderColumns.unshift(extraColumn);
        }

        // Map the data to include only the properties corresponding to the columns
        csvData = excelData.map(item =>
            csvColumns.map(column => item[column])
        );
    } else {
        const objectAtIndex0 = ((excelData[0]));
        for (const key in objectAtIndex0) {
            csvHeaderColumns.push(key)
        }
        // Map the data to include only the properties corresponding to the columns
        csvData = excelData.map(item =>
            csvHeaderColumns.map(column => item[column])
        );
    }

    // Add headers to the worksheet
    worksheet.addRow(csvHeaderColumns);

    // Style the header row
    const headerRow = worksheet.getRow(worksheet.lastRow.number);
    headerRow.height = 25;
    headerRow.alignment = { vertical: 'middle', horizontal: 'left' };

    headerRow.eachCell({ includeEmpty: true }, (cell) => {
        // Set yellow background color and bold font for header cells
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'cce6f6' } // Yellow background color
        };
        cell.font = { bold: true };
    });

    // Add data to the worksheet
    csvData.forEach((rowData) => {
        worksheet.addRow(rowData);
    });

    // Freeze the header row
    worksheet.views = [
        {
            state: 'frozen',
            xSplit: 0,
            ySplit: 1,  // Set to the row number you want to freeze (1 for the first row)
            showGridLines: true,
        }
    ];

    // Auto-fit column widths
    worksheet.columns.forEach((column) => {
        let maxContentWidth = 0;
        column.eachCell((cell) => {
            const contentWidth = cell.value ? cell.value.toString().length : 0;
            maxContentWidth = Math.max(maxContentWidth, contentWidth);
        });
        column.width = maxContentWidth + 2; // Add a little padding
    });


    // Save the workbook as an Excel file
    workbook.xlsx.writeBuffer()
        .then((buffer) => {
            // Create a Blob from the buffer
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Create a download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${excelFileName}.xlsx`;

            // Trigger the download
            link.click();

            // Clean up
            URL.revokeObjectURL(link.href);
        })
        .catch((error) => {
            console.error('Error creating Excel file:', error);
        });
}
