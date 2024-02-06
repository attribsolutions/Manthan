import { allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";

export const DEFAULT_TABLE_COLUMNS = [
    {
        text: "Product",
        dataField: "GroupName",
        sort: true
    },
    {
        text: "	Amount",
        dataField: "Amount",
        sort: true
    },
];

export const ALL_TABLE_COLUMNS = [
    {
        text: "FromDate",
        dataField: "InvoiceDate",
    },
    {
        text: "Channel From",
        dataField: "SaleMadeFrom",
    },
    {
        text: "Channel to",
        dataField: "SaleMadeTo",
    },
    {
        text: "	FullInvoiceNumber",
        dataField: "FullInvoiceNumber",
    },
    {
        text: "Supplier",
        dataField: "SupplierName",
    },
    {
        text: "Route",
        dataField: "RouteName",
    },
    {
        text: "Customer",
        dataField: "CustomerName",
    },
    {
        text: "	Product",
        dataField: "GroupName",
    },
    {
        text: "	Sub Product",
        dataField: "SubGroupName",
    },
    {
        text: "	ItemName",
        dataField: "ItemName",
    },
    {
        text: "	Rate",
        dataField: "Rate",
    },
    {
        text: "	BasicAmount",
        dataField: "BasicAmount",
    },
    {
        text: "	GSTPercentage",
        dataField: "GSTPercentage",
    },
    {
        text: "	GSTAmount",
        dataField: "GSTAmount",
    },
    {
        text: "	Amount",
        dataField: "Amount",
    },
    {
        text: "	FullGRNNumber",
        dataField: "FullGRNNumber",
    },
];

export const INITIAL_ZERO = allLabelWithZero;
export const INITIAL_ARRAY = [allLabelWithZero];

// export const INITIAL_BLANK = allLabelWithZero;

export const SHOW_ALSO_OPTIONS = [{
    value: 1,
    label: "Invoice Number",
},
{
    value: 2,
    label: "Show Discounted Items",
},
{
    value: 3,
    label: "GRNID",
},
{
    value: 4,
    label: "DiscountInRS",
},
{
    value: 5,
    label: "InvoiceGrandTotal",
},
{
    value: 6,
    label: "RoundOffAmount",
},
{
    value: 7,
    label: "TCSAmount",
},
{
    value: 8,
    label: "MRP",
},

]

export const UNIT_DROPDOWN_OPTIONS = [
    {
        value: '', label: "Select..."
    },
    {
        value: 1, label: "QtyInNo"
    },
    {
        value: 2, label: "QtyInKg"
    },
    {
        value: 3, label: "QtyInBox"
    },
]
