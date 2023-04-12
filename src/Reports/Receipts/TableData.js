export const Address = [
    "Address" 
]


export const AddressDetails = (data) => {
    
    
    var AddressDetails = [
       
        [`Name:${data.Customer}`], 
        [`Address:${data.CustomerAddress}`]  ,
        [`Contact:${data.Contact}`],
        [`Date:${data.ReceiptDate}`],

    ]
    return AddressDetails;
} 


