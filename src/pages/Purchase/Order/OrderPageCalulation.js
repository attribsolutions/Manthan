import $ from 'jquery';


export const basicAmount = i => {

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

export const arrowUpDounFunc = (tableId) => {
    return () => {
        // (function ($) {
        $.fn.enableCellNavigation = function () {

            var arrow = { left: 37, up: 38, right: 39, down: 40 };

            // select all on focus
            this.find('input').keydown(function (e) {

                // shortcut for key other than arrow keys
                if ($.inArray(e.which, [arrow.left, arrow.up, arrow.right, arrow.down]) < 0) { return; }

                if (!($.inArray(e.which, [arrow.up, arrow.down]) < 0)) {
                    let hasSelect = e.target.offsetParent.classList.contains("select2-selection__value-container");
                    if (hasSelect) {
                        e.stopPropagation()
                    }

                }
                var input = e.target;
                var td = $(e.target).closest('td');

                var moveTo = null;

                switch (e.which) {

                    case arrow.left: {
                       

                        if (input.selectionStart == 0) {
                            moveTo = td.prev('td:has(input,textarea)');
                           

                            var tr = td.closest('tr');
                            var pos = td[0].cellIndex;
                            var ctd = tr.children('td')
                       
                            let prevTd = td
                            let in_d = 0
                            while ((in_d < pos)) {
                              
                                moveTo = prevTd.prev('td:has(input,textarea)');
                                if (moveTo.length > 0) { in_d = ctd.length - 1 }
                                prevTd = td.prev('td')
                                in_d++;
                            }

                        }
                        if (moveTo && moveTo.length) {

                            e.preventDefault();
                            var tdInput = moveTo.find('input,textarea')

                            if (tdInput.length > 0) {
                                tdInput[0].focus();
                                tdInput[0].select();
                            }
                        }

                        break;
                    }
                    case arrow.right: {
                        if (input.selectionEnd == input.value.length) {

                            var tr = td.closest('tr');
                            var pos = td[0].cellIndex;
                            var ctd = tr.children('td')
                            debugger
                            let nextTd = td

                            while (pos < ctd.length) {
                                debugger
                                moveTo = nextTd.next('td:has(input,textarea)');
                                if (moveTo.length > 0) { pos = ctd.length + 1 }
                                nextTd = td.next('td')
                                pos++;
                            }

                        }

                        if (moveTo && moveTo.length) {

                            e.preventDefault();
                            var tdInput = moveTo.find('input,textarea')

                            if (tdInput.length > 0) {
                                tdInput[0].focus();
                                tdInput[0].select();
                            }
                        }
                        break;
                    }

                    case arrow.up: {
                        var thisIndex = $(input).index('input:text');
                        var pre = thisIndex - 1;

                        var tdPreInput
                        td.find('input').each(function (i2, tdEle) {
                            debugger
                            var thisIndex = $(tdEle).index('input:text');
                            if (pre === thisIndex) {
                                tdPreInput = tdEle
                            }
                        });

                        if (tdPreInput) {
                            tdPreInput.focus()
                            return
                        }
                        var tr = td.closest('tr');
                        var pos = td[0].cellIndex;
                        var moveToRow = tr.prev('tr');


                        if (moveToRow.length) {
                            moveTo = $(moveToRow[0].cells[pos]);
                        }
                        if (moveTo && moveTo.length) {

                            e.preventDefault();
                            var tdInput = moveTo.find('input,textarea')

                            if (tdInput.length > 0) {
                                tdInput[tdInput.length - 1].focus();
                                tdInput[tdInput.length - 1].select();
                            }
                        }
                        break;
                    }
                    case arrow.down: {
                     
                        var thisIndex = $(input).index('input:text');
                        var next = thisIndex + 1;

                        var tdNextInput
                        td.find('input').each(function (i2, tdEle) {
                          
                            var thisIndex = $(tdEle).index('input:text');
                            if (next === thisIndex) {
                                tdNextInput = tdEle
                            }
                        });

                        if (tdNextInput) {
                            tdNextInput.focus()
                            return
                        }
                        var tr = td.closest('tr');
                        var pos = td[0].cellIndex;

                        var moveToRow = tr.next('tr');

                        if (moveToRow.length) {
                            moveTo = $(moveToRow[0].cells[pos]);
                        }
                        if (moveTo && moveTo.length) {

                            e.preventDefault();
                            var tdInput = moveTo.find('input,textarea')

                            if (tdInput.length > 0) {
                                tdInput[0].focus();
                                tdInput[0].select();
                            }
                        }
                        break;
                    }

                }


            });

        };


        $(function () {
            $(tableId).enableCellNavigation();
        });

    }
}



