import { date_dmy_func } from "../../components/Common/CommonFunction"
import { toWordswithoutRS } from "../Report_common_function"

export const Address = [
    "Address"
]

export const Details = [
    "ReceiptDetail"
]

export const ReceiptDetails = (doc, data) => {

    let stringNumber = toWordswithoutRS(Number(data.AmountPaid))
    var ReceiptDetails = [

        [`Rupees ${stringNumber}`],

    ]

    return ReceiptDetails;
}

export const AddressDetails = (data) => {

    var AddressDetails = [

        [`${data.Party}`],
        [`Address:${data.Address === null ? "" : data.Address}`],
        [`Contact:${data.MobileNo}`],
        [`Date:${date_dmy_func(data.ReceiptDate)}`],
        ""

    ]
    return AddressDetails;
}


