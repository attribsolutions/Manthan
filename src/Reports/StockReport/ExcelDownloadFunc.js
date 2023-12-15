
import Papa from 'papaparse';

export function ExcelDownloadFunc({ pageField, excelData, excelFileName, buttonStateArray }) {

    const newSelectedColumns = buttonStateArray.filter(option => option.showing)
    debugger

    const csvColumns = newSelectedColumns
        .filter(column => column.showing)
        .map(column => column.dataField);

    const csvHeaderColumns = newSelectedColumns
        .filter(column => column.showing)
        .map(column => column.text);

    // Map the data to include only the properties corresponding to the columns
    const csvData = excelData.map(item =>
        csvColumns.map(column => item[column])
    );

    // Combine column headers and data into a single array
    const csvContent = [csvHeaderColumns, ...csvData];

    // Create the CSV content
    const csvContentString = Papa.unparse(csvContent, { header: true });

    // Create and trigger the download
    const blob = new Blob([csvContentString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${excelFileName}.csv`;
    a.click();

    URL.revokeObjectURL(url);
}



