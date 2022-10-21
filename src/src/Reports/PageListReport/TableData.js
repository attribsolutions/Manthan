export const columns = ["Item Name", "Quantity", "	UOM", "Comments "];
export const Rows = (data) => {
    var a = [];
    data.forEach(ticket => {
        const ticketData = [
            ticket.ItemName,
            ticket.OrderID,
            ticket.OrderID,
            ticket.Name,
        ];
        a.push(ticketData);
    });
    return a;
}
export const columns1 = ["Total", "abc", "ayk", "Amount "];
export const Rows1 = (data) => {
    var a1 = [];
    var c = 0;
    data.forEach(ticket => {
        if (c < 2) {
            c = c + 1;
            const ticketData = [
                ticket.ItemName,
                ticket.OrderID,
                ticket.OrderID,
                ticket.Name,
            ];
            a1.push(ticketData);
        }
    });
    return a1;
}