export const Address = [
    "Address" 
]


export const AddressDetails = (data) => {
    
    
    var AddressDetails = [
       
        [`Name:${data.Customer}`], 
        // [`Address:${data.CustomerAddress}`]  , 1
        [`Address:${`Mohan Nagar Co-Op Society, Baner, Pune, Maharashtra 41102`}`],
        // [`Contact:${data.Contact}`],
        [`Contact:${`7620912345`}`],

        [`Date:${data.ReceiptDate}`],

    ]
    return AddressDetails;
} 


