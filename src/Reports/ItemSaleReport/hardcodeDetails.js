import { allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";
import { date_dmy_func } from "../../components/Common/CommonFunction";

export const DEFAULT_TABLE_COLUMNS = [
    {
        text: 'CreatedOn',
        dataField: 'CreatedOn',
        formatter: (cell) => <>{date_dmy_func(cell)}</>
    },

    {
        text: "Product",
        dataField: "GroupName",
        sort: true
    },
    {
        text: "	Amount",
        dataField: "GrandTotal",
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
        dataField: "GrandTotal",
    },
    {
        text: "	FullGRNNumber",
        dataField: "FullGRNNumber",
    },
    {
        text: 'CreatedOn',
        dataField: 'CreatedOn',

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
{
    value: 9,
    label: "MobileNo",
},
{
    value: 10,
    label: "Cashier",
},
{
    value: 11,
    label: "GST",
},

{
    value: 12,
    label: "Basic Amount",
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
    {
        value: 4, label: "Base Unit Qty"
    },
]
