

export const basicAmount = i => {
    
    const a = i.inpRate * i.inpQty
    return a
}

export const GstAmount = (i) => {
    
    const a = basicAmount(i);
    const b = (i.GST / 100);
    
    return a * b
}

export const totalAmount = (i) => {
    
    const a = GstAmount(i);
    const b = basicAmount(i);
    const c = a + b
    
    return c
}
