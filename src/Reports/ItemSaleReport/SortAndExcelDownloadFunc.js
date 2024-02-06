
import { date_dmy_func, loginJsonBody } from "../../components/Common/CommonFunction";
import * as initail from "./hardcodeDetails";
import Papa from 'papaparse';
import { get_PartyType_List_Api } from "../../helpers/backend_helper";
import * as ExcelJS from 'exceljs';
import { autoFitColumnWidths, freezeHeaderRow, saveWorkbookAsExcel, setDateValue, setNumberValue, setTextValue, styleHeaderRow } from "../../components/Common/ReportCommonFunc/ExcelFunctions";
import { allLabelWithBlank } from "../../components/Common/CommonErrorMsg/HarderCodeData";

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
            selectValue: [allLabelWithBlank],
            sequence: 1,
            controlTypeName: "Date",
            sort: true,
            groupBy: true,
            formatter: (cell) => <>{date_dmy_func(cell)}</>
        },
        {
            text: 'Channel From',
            dataField: 'SaleMadeFrom',
            checkboxState: channelFromCheckbox,
            selectValue: [allLabelWithBlank],
            sort: true,
            controlTypeName: "Text",
            groupBy: true,
            sequence: 2
        },
        {
            text: 'Channel To',
            dataField: 'SaleMadeTo',
            checkboxState: channelToCheckbox,
            selectValue: channelToSelect,
            sort: true,
            controlTypeName: "Text",
            groupBy: true,
            sequence: 3
        },
        {
            text: 'Supplier',
            dataField: 'SupplierName',
            checkboxState: supplierCheckbox,
            selectValue: [allLabelWithBlank],
            sort: true,
            groupBy: true,
            sequence: 5,
            controlTypeName: "Text",
        },
        {
            text: 'Invoice Number',
            dataField: 'FullInvoiceNumber',
            checkboxState: showAlsoSelect.some(item => item.value === 1) ? true : false,
            selectValue: [allLabelWithBlank],
            sort: true,
            groupBy: true,
            sequence: 6,
            controlTypeName: "Text",
        },

        {
            text: 'Route',
            dataField: 'RouteName',
            checkboxState: routeCheckbox,
            selectValue: routeSelect,
            sort: true,
            groupBy: true,
            sequence: 7,
            controlTypeName: "Text",
        },
        {
            text: 'Customer',
            dataField: 'CustomerName',
            checkboxState: customerCheckbox,
            selectValue: customerSelect,
            sort: true,
            groupBy: true,
            sequence: 4,
            controlTypeName: "Text",
        },
        {
            text: 'Product',
            dataField: 'GroupName',
            checkboxState: productCheckbox,
            selectValue: productSelect,
            sort: true,
            groupBy: true,
            sequence: 8,
            controlTypeName: "Text",
        },
        {
            text: 'Sub Product',
            dataField: 'SubGroupName',
            checkboxState: subProductCheckbox,
            selectValue: subProductSelect,
            sort: true,
            groupBy: true,
            sequence: 9,
            controlTypeName: "Text",
        },
        {
            text: 'ItemName',
            dataField: 'ItemName',
            checkboxState: itemNameCheckbox,
            selectValue: itemNameSelect,
            sort: true,
            groupBy: true,
            sequence: 10,
            controlTypeName: "Text",
        },
        {
            text: 'QtyInNo',
            dataField: 'QtyInNo',
            selectValue: [allLabelWithBlank],
            checkboxState: unitDropdownSelect.value === 1 ? true : false,
            sort: true,
            isSum: true,
            toFixed: 0,
            sequence: 11,
            controlTypeName: "Number",
        },
        {
            text: 'QtyInKg',
            dataField: 'QtyInKg',
            selectValue: [allLabelWithBlank],
            checkboxState: unitDropdownSelect.value === 2 ? true : false,
            sort: true,
            isSum: true,
            toFixed: 3,
            sequence: 12,
            controlTypeName: "Number",
        },
        {
            text: 'QtyInBox',
            dataField: 'QtyInBox',
            selectValue: [allLabelWithBlank],
            checkboxState: unitDropdownSelect.value === 3 ? true : false,
            sort: true,
            isSum: true,
            toFixed: 3,
            sequence: 13,
            controlTypeName: "Number",
        },
        {
            text: 'InvoiceGrandTotal',
            dataField: 'GrandTotal',
            selectValue: [allLabelWithBlank],
            checkboxState: showAlsoSelect.some(item => item.value === 5),
            sort: true,
            toFixed: 2,
            sequence: 15,
            controlTypeName: "Number",
        },
        {
            text: 'DiscountInRS',
            dataField: 'DiscountAmount',
            selectValue: [allLabelWithBlank],
            checkboxState: showAlsoSelect.some(item => item.value === 4),
            sort: true,
            isSum: true,
            toFixed: 2,
            sequence: 16,
            controlTypeName: "Number",
        },
        {
            text: 'RoundOffAmount',
            dataField: 'RoundOffAmount',
            selectValue: [allLabelWithBlank],
            checkboxState: showAlsoSelect.some(item => item.value === 6),
            isSum: true,
            sort: true,
            toFixed: 2,
            sequence: 17,
            controlTypeName: "Number",
        },
        {
            text: 'TCSAmount',
            dataField: 'TCSAmount',
            selectValue: [allLabelWithBlank],
            checkboxState: showAlsoSelect.some(item => item.value === 7),
            isSum: true,
            sort: true,
            sequence: 18,
            toFixed: 2,
            controlTypeName: "Number",
        },
        {
            text: 'GRNID',
            dataField: 'FullGRNNumber',
            selectValue: [allLabelWithBlank],
            checkboxState: showAlsoSelect.some(item => item.value === 3),
            sort: true,
            groupBy: true,
            sequence: 19,
            controlTypeName: "Text",
        },
        { //this filed not Show intable 
            text: "Show Discounted Items",
            dataField: "ShowDiscountedItems",
            selectValue: showAlsoSelect.find(item => item.value === 2),
            controlTypeName: "Text",
        },
        {
            text: "Amount",
            dataField: "Amount",
            selectValue: [allLabelWithBlank],
            checkboxState: true,
            sort: true,
            isSum: true,
            toFixed: 2,
            sequence: 14,
            controlTypeName: "Number",
        },
        {
            text: 'MRP',
            dataField: 'MRPValue',
            checkboxState: showAlsoSelect.some(item => item.value === 8) ? true : false,
            selectValue: [allLabelWithBlank],
            sort: true,
            groupBy: true,
            toFixed: 2,
            sequence: 20,
            controlTypeName: "Number",
        },

    ];

    //************************************************************************************************** */

    let manupulatedData = [...baseData];
    let tableColumns = [];
    let selectedColumns = [];


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

export const fetchDataAndSetDropdown = async (CompanyID, setDropdown) => {
    const jsonBody = {
        ...loginJsonBody(),
        "CompanyID": CompanyID,
        "id": 0

    };

    const resp = await get_PartyType_List_Api(JSON.stringify(jsonBody));
    if (resp.StatusCode === 200) {
        setDropdown(
            resp.Data.map((index) => ({
                value: index.id,
                label: index.Name,
            })));
    }
};