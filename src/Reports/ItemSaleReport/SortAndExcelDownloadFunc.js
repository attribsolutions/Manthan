
import { date_dmy_func } from "../../components/Common/CommonFunction";
import * as initail from "./hardcodeDetails";
import Papa from 'papaparse';

export const SortButtonFunc = (props) => {

    const {
        baseData = [],
        fromDateCheckbox,
        channelFromCheckbox,
        channelToCheckbox,
        supplierCheckbox,
        showAlsoSelect,
        routeCheckbox,
        customerCheckbox,
        productCheckbox,
        subProductCheckbox,
        itemNameCheckbox,
        unitDropdownSelect,
        routeSelect,
        channelToSelect,
        customerSelect,
        itemNameSelect,
        subProductSelect,
        productSelect,
    } = props

    const buttonStateArray = [
        {
            text: 'FromDate',
            dataField: 'InvoiceDate',
            checkboxState: fromDateCheckbox,
            selectValue: [{ value: "", label: "All" }],
            sequence: 1,
            sort: true,
            groupBy: true,
            formatter: (cell) => <>{date_dmy_func(cell)}</>
        },
        {
            text: 'Channel From',
            dataField: 'SaleMadeFrom',
            checkboxState: channelFromCheckbox,
            selectValue: [{ value: "", label: "All" }],
            sort: true,
            groupBy: true,
            sequence: 2
        },
        {
            text: 'Channel To',
            dataField: 'SaleMadeTo',
            checkboxState: channelToCheckbox,
            selectValue: channelToSelect,
            sort: true,
            groupBy: true,
            sequence: 3
        },
        {
            text: 'Supplier',
            dataField: 'SupplierName',
            checkboxState: supplierCheckbox,
            selectValue: [{ value: "", label: "All" }],
            sort: true,
            groupBy: true,
            sequence: 4
        },
        {
            text: 'Invoice Number',
            dataField: 'FullInvoiceNumber',
            checkboxState: showAlsoSelect.some(item => item.value === 1) ? true : false,
            selectValue: [{ value: "", label: "All" }],
            sort: true,
            groupBy: true,
            sequence: 5
        },
        {
            text: 'Route',
            dataField: 'RouteName',
            checkboxState: routeCheckbox,
            selectValue: routeSelect,
            sort: true,
            groupBy: true,
            sequence: 6
        },
        {
            text: 'Customer',
            dataField: 'CustomerName',
            checkboxState: customerCheckbox,
            selectValue: customerSelect,
            sort: true,
            groupBy: true,
            sequence: 7
        },
        {
            text: 'Product',
            dataField: 'GroupName',
            checkboxState: productCheckbox,
            selectValue: productSelect,
            sort: true,
            groupBy: true,
            sequence: 8
        },
        {
            text: 'Sub Product',
            dataField: 'SubGroupName',
            checkboxState: subProductCheckbox,
            selectValue: subProductSelect,
            sort: true,
            groupBy: true,
            sequence: 9
        },
        {
            text: 'ItemName',
            dataField: 'ItemName',
            checkboxState: itemNameCheckbox,
            selectValue: itemNameSelect,
            sort: true,
            groupBy: true,
            sequence: 10
        },
        {
            text: 'QtyInNo',
            dataField: 'QtyInNo',
            selectValue: [{ value: "", label: "All" }],
            checkboxState: unitDropdownSelect.value === 1 ? true : false,
            sort: true,
            isSum: true,
            toFixed: 0,
            sequence: 11
        },
        {
            text: 'QtyInKg',
            dataField: 'QtyInKg',
            selectValue: [{ value: "", label: "All" }],
            checkboxState: unitDropdownSelect.value === 2 ? true : false,
            sort: true,
            isSum: true,
            toFixed: 3,
            sequence: 12
        },
        {
            text: 'QtyInBox',
            dataField: 'QtyInBox',
            selectValue: [{ value: "", label: "All" }],
            checkboxState: unitDropdownSelect.value === 3 ? true : false,
            sort: true,
            isSum: true,
            toFixed: 3,
            sequence: 13
        },
        {
            text: 'InvoiceGrandTotal',
            dataField: 'GrandTotal',
            selectValue: [{ value: "", label: "All" }],
            checkboxState: showAlsoSelect.some(item => item.value === 5),
            sort: true,
            toFixed: 2,
            sequence: 15
        },
        {
            text: 'DiscountInRS',
            dataField: 'DiscountAmount',
            selectValue: [{ value: "", label: "All" }],
            checkboxState: showAlsoSelect.some(item => item.value === 4),
            sort: true,
            isSum: true,
            toFixed: 2,
            sequence: 16
        },
        {
            text: 'RoundOffAmount',
            dataField: 'RoundOffAmount',
            selectValue: [{ value: "", label: "All" }],
            checkboxState: showAlsoSelect.some(item => item.value === 6),
            isSum: true,
            sort: true,
            toFixed: 2,
            sequence: 17,
        },
        {
            text: 'TCSAmount',
            dataField: 'TCSAmount',
            selectValue: [{ value: "", label: "All" }],
            checkboxState: showAlsoSelect.some(item => item.value === 7),
            isSum: true,
            sort: true,
            sequence: 18,
            toFixed: 2
        },
        {
            text: 'GRNID',
            dataField: 'FullGRNNumber',
            selectValue: [{ value: "", label: "All" }],
            checkboxState: showAlsoSelect.some(item => item.value === 3),
            sort: true,
            groupBy: true,
            sequence: 19
        },
        { //this filed not Show intable 
            text: "Show Discounted Items",
            dataField: "ShowDiscountedItems",
            selectValue: showAlsoSelect.find(item => item.value === 2),
        },
        {
            text: "Amount",
            dataField: "Amount",
            selectValue: [{ value: "", label: "All" }],
            checkboxState: true,
            sort: true,
            isSum: true,
            toFixed: 2,
            sequence: 14,
        }

    ];

    //************************************************************************************************** */

    // let manupulatedData = [...baseData];
    // let tableColumns = [];
    // let selectedColumns = [];

    // const filterParameter = buttonStateArray.filter(option => (option.selectValue?.value > 0));

    // if (filterParameter.length > 0) {
    //     manupulatedData = baseData.filter(item => {
    //         return filterParameter.every(option => {
    //             if ((option.dataField === 'ShowDiscountedItems') && (option.selectValue?.value > 0)) {
    //                 return (Number(item.DiscountAmount) > 0) ? true : false
    //             }
    //             return item[option.dataField] === option.selectValue.label;

    //         });
    //     });
    // }

    // if (buttonStateArray.some(option => option.checkboxState)) {

    //     //*********************************************************** *******************************/
    //     tableColumns = buttonStateArray.filter(option => option.checkboxState);

    //     tableColumns.sort((a, b) => a.sequence - b.sequence);
    //     selectedColumns = tableColumns;
    //     // **********************************************************************************************
    //     const groupedData = {};

    //     manupulatedData.forEach(item => {
    //         const groupValues = buttonStateArray
    //             .filter(option => option.checkboxState && (option.groupBy === true))
    //             .map(option => item[option.dataField]);

    //         const groupKey = groupValues.join('-');
    //         if (!groupedData[groupKey]) {
    //             groupedData[groupKey] = {
    //                 ...item,
    //                 Amount: 0,
    //                 QtyInNo: 0,
    //                 QtyInKg: 0,
    //                 QtyInBox: 0,
    //                 DiscountAmount: 0,
    //                 RoundOffAmount: 0,
    //                 TCSAmount: 0
    //             };
    //         }

    //         buttonStateArray.forEach(field => {
    //             if (field.isSum === true) {
    //                 groupedData[groupKey][field.dataField] += parseFloat(item[field.dataField]);
    //                 groupedData[groupKey][field.dataField] = parseFloat((groupedData[groupKey][field.dataField]).toFixed(field.toFixed));
    //             }
    //         })

    //     });
    //     manupulatedData = Object.values(groupedData);
    // }
    
    let manupulatedData = [...baseData];
    let tableColumns = [];
    let selectedColumns = [];

    // const filterParameter = buttonStateArray.filter(option => {

    //      option.selectValue.some(index => index.value > 0) });
    const filterParameter = buttonStateArray.filter(option => {
        // Check if option.selectValue is an array and has at least one element with a value > 0
        return Array.isArray(option.selectValue) &&
            option.selectValue.some(index => typeof index.value === 'number' && index.value > 0);
    });

    if (filterParameter.length > 0) {
        manupulatedData = baseData.filter(item => {
            return filterParameter.every(option => {

                if ((option.dataField === 'ShowDiscountedItems') && (option.selectValue.some(value => value.value > 0))) {
                    return (Number(item.DiscountAmount) > 0) ? true : false
                }
                return option.selectValue.some(valueObj => item[option.dataField] === valueObj.label);
            });
        });
    }

    if (buttonStateArray.some(option => option.checkboxState)) {
        
        //*********************************************************** *******************************/
        tableColumns = buttonStateArray.filter(option => option.checkboxState);

        tableColumns.sort((a, b) => a.sequence - b.sequence);
        selectedColumns = tableColumns;
        // **********************************************************************************************
        const groupedData = {};

        manupulatedData.forEach(item => {
            const groupValues = buttonStateArray
                .filter(option => option.checkboxState && (option.groupBy === true))
                .map(option => item[option.dataField]);

            const groupKey = groupValues.join('-');
            if (!groupedData[groupKey]) {
                groupedData[groupKey] = {
                    ...item,
                    Amount: 0,
                    QtyInNo: 0,
                    QtyInKg: 0,
                    QtyInBox: 0,
                    DiscountAmount: 0,
                    RoundOffAmount: 0,
                    TCSAmount: 0
                };
            }

            buttonStateArray.forEach(field => {
                if (field.isSum === true) {
                    groupedData[groupKey][field.dataField] += parseFloat(item[field.dataField]);
                    groupedData[groupKey][field.dataField] = parseFloat((groupedData[groupKey][field.dataField]).toFixed(field.toFixed));
                }
            })

        });
        manupulatedData = Object.values(groupedData);
    }
    else {
        selectedColumns = initail.ALL_TABLE_COLUMNS;
    }

    let totalAmount = 0
    manupulatedData = manupulatedData.map((item, key) => {
        totalAmount += parseFloat(item.Amount);
        item.id = key + 1
        return item
    });
    
    return { selectedColumns, manupulatedData, totalAmount };
}

export const ExcelButtonFunc = ({ selectedColumns, manupulatedData }) => {

    const csvColumns = selectedColumns.map(column => column.dataField); // Extract column headers

    const csvHeaderColumns = selectedColumns.map(column => column.text); // Extract column headers

    // Map the data to include only the properties corresponding to the columns
    const csvData = manupulatedData.map(item =>
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
    a.download = `Item Sale Report.csv`;
    a.click();

    URL.revokeObjectURL(url);
}