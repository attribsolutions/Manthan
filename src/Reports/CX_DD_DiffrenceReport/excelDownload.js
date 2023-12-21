import * as ExcelJS from 'exceljs';
import { groupBy } from '../../components/Common/CommonFunction';

export function Cx_DD_ExcelDownload({ pageField, excelData, excelFileName, PartyName }) {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const groupbyCx = groupBy(excelData, (item) => item.XpressName);

    const extractCSVData = (_excelData) => {

        const columnsKey = ["XpressName", "ItemName", "MRP", "Quantity", "Unit", "CXRate", "DDRate", "Diff", "SumofDiff"]
        const headerLabel = ["CX Name", "Item Name", "MRP", "Sale Qty", "Unit", "CX Purchase Rate Without GST", "DD Purchase Rate Without GST", "Difference Without GST", "Diff Amount Without GST"]
        const dataRow = _excelData.map(item => columnsKey.map(column => item[column] || ''));
        return { columnsKey, headerLabel, dataRow };
    };

    let excelHeaderLabel = [];
    let mainExcelRowData = [];

    groupbyCx.forEach((value, xpressName) => {
        const { headerLabel, dataRow } = extractCSVData(value);

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
                    fgColor: { argb: 'b3d9ff' } // Yellow background color
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



        worksheet.mergeCells(`A${firstRowStart}:A${lastRowIndex - 1}`);
        const mergedCellVerticalA = worksheet.getCell(`A${firstRowStart}`);
        mergedCellVerticalA.alignment = { vertical: 'top' };
        mergedCellVerticalA.font = { bold: true, };
        mergedCellVerticalA.value = xpressName



        // Merge cells A to G in the last row of the group
        worksheet.mergeCells(`A${lastRowIndex}:H${lastRowIndex}`);
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
        const sumFormula = `SUM(I${firstRowStart}:I${lastRowIndex - 1})`;
        const sumCellH = worksheet.getCell(`I${lastRowIndex}`);
        sumCellH.value = { formula: sumFormula };
        sumCellH.font = { bold: true, size: 12, }; // Example style
        sumCellH.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFCC' } // Light yellow background color
        };

    });

    worksheet.views = [
        {
            state: 'frozen',
            xSplit: 1,  // Set xSplit to 1 to freeze the first column
            ySplit: 1,  // Set ySplit to 1 to freeze the top row
            activeCell: 'B2',  // Set the active cell after freezing
            showGridLines: true,
        }
    ];

    //=============================================================================

    // Auto-fit width for all columns
    worksheet.columns.forEach((column, colIndex) => {
        column.width = Math.max(excelHeaderLabel[0][colIndex].length, ...mainExcelRowData.map(row => (row[colIndex] || '').toString().length)) + 2;
    });

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

    // Call the function after populating the worksheet
    applyBordersToWorksheet(worksheet);

    function addRowWithFormulaAndFormatting(label, formula, bgColor, fontColor, startCol, endCol) {

        const lastRowIndex = worksheet.lastRow.number;

        // Add a new blank row
        const blankRow = Array(excelHeaderLabel[0].length).fill("");
        worksheet.addRow(blankRow);

        // Merge cells F to G for the total title
        worksheet.mergeCells(`${String.fromCharCode(64 + startCol)}${lastRowIndex + 1}:${String.fromCharCode(64 + endCol)}${lastRowIndex + 1}`);
        const mergedCellRange = `${String.fromCharCode(64 + startCol)}${lastRowIndex + 1}:${String.fromCharCode(64 + endCol)}${lastRowIndex + 1}`;
        const mergedCellA = worksheet.getCell(mergedCellRange);
        mergedCellA.value = label;
        mergedCellA.alignment = { vertical: 'middle', horizontal: 'right' };
        mergedCellA.font = { bold: true, size: 12, color: { argb: fontColor } };
        mergedCellA.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: bgColor }
        };

        // Set the background color for the entire row
        for (let colIndex = 7; colIndex <= 8; colIndex++) {
            const cell = worksheet.getCell(`${String.fromCharCode(64 + colIndex)}${lastRowIndex + 1}`);
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

        // Display the formula in cell H for the entire sheet
        const sumCellH = worksheet.getCell(`I${lastRowIndex + 1}`);
        sumCellH.value = { formula: formula };
        sumCellH.font = { bold: true, size: 12, color: { argb: fontColor } };
        sumCellH.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: bgColor }
        };
        // Set border style for each cell
        sumCellH.border = {
            top: { style: 'dotted', color: { argb: '000000' } },
            left: { style: 'dotted', color: { argb: '000000' } },
            bottom: { style: 'dotted', color: { argb: '000000' } },
            right: { style: 'dotted', color: { argb: '000000' } }
        };

        // Set border style for each cell
        sumCellH.border = {
            top: { style: 'dotted', color: { argb: '000000' } },
            left: { style: 'dotted', color: { argb: '000000' } },
            bottom: { style: 'dotted', color: { argb: '000000' } },
            right: { style: 'dotted', color: { argb: '000000' } }
        };

    }

    const sumFormulaSheet = `SUM(F1:F${worksheet.lastRow.number})/2`;
    const basicAmount = `I${worksheet.lastRow.number + 1}`

    const without_GSTFormula = `${basicAmount} * 0.18`;
    const with_GSTFormula = `${basicAmount} + I${worksheet.lastRow.number + 2}`;
    const sumFormulaSheetForTDS = `${basicAmount} * 0.02`;
    const sumFormulaSheetForTDSLess = `I${worksheet.lastRow.number + 3}-I${worksheet.lastRow.number + 4}`;


    addRowWithFormulaAndFormatting(
        `${PartyName} Basic Amount Total`,
        sumFormulaSheet,
        'b3cccc',
        '000000',
        7, 8
    );

    addRowWithFormulaAndFormatting(
        "GST(18%)",
        without_GSTFormula,
        'b3cccc',
        '000000',
        7, 8

    );

    addRowWithFormulaAndFormatting(

        "GST(18%) Addition Amount",
        with_GSTFormula,
        'b3cccc',
        '000000',
        7, 8

    );

    addRowWithFormulaAndFormatting(

        "TDS 2% On Basic",
        sumFormulaSheetForTDS,
        'b3cccc',
        '000000',
        7, 8
    );

    addRowWithFormulaAndFormatting(

        "TDS Less Amt",
        sumFormulaSheetForTDSLess,
        'b3cccc',
        '000000',
        7, 8
    );

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
