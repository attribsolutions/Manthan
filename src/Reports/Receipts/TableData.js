import { toWords } from "../Report_common_function"

export const Address = [
    "Address"
]

export const Details = [
    "ReceiptDetail"
]





export const ReceiptDetails = (doc, data) => {
    debugger
    let stringNumber = toWords(Number(data.AmountPaid))
    var ReceiptDetails = [

        [` ${stringNumber}`],

    ]

    return ReceiptDetails;
}

export const AddressDetails = (data) => {


    var AddressDetails = [

        [`${data.Party}`],
        [`Address:${data.Address === null ? "" : data.Address}`],
        [`Contact:${data.MobileNo}`],
        [`Date:${data.ReceiptDate}`],
        ""


    ]
    return AddressDetails;
}


