

export const basicAmount = i => {
debugger
    let rate = 0
    let qty = 0
    if (!(i.Rate == '')) { rate = i.Rate; };
    if (!(i.Quantity == '')) { qty = i.Quantity; };

    let val = parseFloat(rate) * parseFloat(qty)
    if (!val) {
        val = 0
    }

    return val
}

export const GstAmount = (i) => {
    let rowGst = 0
    let qty = 0
    if (!(i.GSTPercentage == '')) { rowGst = i.GSTPercentage; };
    const base = basicAmount(i);
    const gst = parseFloat(rowGst);
    return ((base * gst) / 100)
}

export const Amount = (i) => {

    const gstAmt = GstAmount(i);
    const baseAmt = basicAmount(i);
    const total = gstAmt + parseFloat(baseAmt)
    return total.toFixed(2)
}

export function handleKeyDown(e, item) {

    const a = ((e.keyCode > 36) && (e.keyCode < 40));
    const b = e.keyCode === 46;
    const c = e.keyCode === 110;

    if (!/[0-9]/.test(e.key) && a && b && c) {
        e.preventDefault();
        return
    }

    let inpTarget = e.target.id
    let split = inpTarget.split("y");
    let inp_ID = parseInt(split[1])
    let count = inp_ID;
    let inp_lable = split[0] + 'y';

    if (e.keyCode === 40 && (item.length - 1 > count)) {

        let next_inpDoun = document.getElementById(inp_lable + (count + 1)).disabled;
        while (next_inpDoun && (item.length - 1 > count)) {
            count = ++count;
            next_inpDoun = document.getElementById(inp_lable + (count)).disabled;
        }
        if (count === inp_ID) { count = ++count; }
        document.getElementById(inp_lable + count).focus();
        return
    }

    if (e.keyCode === 38 && count > 0) {

        let next_inp_UP = document.getElementById(inp_lable + (count - 1)).disabled;
        while (next_inp_UP && count > 0) {
            count = count - 1;
            next_inp_UP = document.getElementById(inp_lable + (count)).disabled;
        }
        if (count === inp_ID) { count = count - 1; }
        document.getElementById(inp_lable + count).focus();
    }
}