
export const initialTableColumns = [
    {
        text: "Channel to",
        dataField: "SaleMadeTo",
        sort:true
    },
        {
        text: "	Amount",
        dataField: "Amount",
        sort:true
    },
];

export const defaultTableColumns = [
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
export const initialSlected_zero={ value: 0, label: "All" };
export const initialSlected_blank={ value: 0, label: "All" };

export const showAlsoOption = [{
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
}
]
export const UnitDropdownOptions = [
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
