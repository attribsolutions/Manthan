import Papa from 'papaparse';

export function ExcelDownloadFunc({ pageField, excelData, excelFileName }) {

    const csvColumns = pageField.PageFieldMaster
        .filter(column => column.ShowInListPage) // Only include columns where ShowInListPage is true
        .sort((a, b) => a.ListPageSeq - b.ListPageSeq) // Sort columns by ListPageSeq in ascending order
        .map(column => column.ControlID); // Extract ControlID as column headers

    const csvHeaderColumns = pageField.PageFieldMaster
        .filter(column => column.ShowInListPage) // Only include columns where ShowInListPage is true
        .sort((a, b) => a.ListPageSeq - b.ListPageSeq) // Sort columns by ListPageSeq in ascending order
        .map(column => column.FieldLabel); // Extract FieldLabel as column headers

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