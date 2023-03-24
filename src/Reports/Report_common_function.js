// var th = ['', 'thousand', 'million', 'billion', 'trillion'];
// var th = ['', 'thousand', 'tenthousand', 'lac', 'crore'];

// var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
// var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
// var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

// export function toWords(s) {
//     s = s.toString();
//     s = s.replace(/[\, ]/g, '');
//     if (s != parseFloat(s)) return 'not a number';
//     var x = s.indexOf('.');
//     if (x == -1)
//         x = s.length;
//     if (x > 15)
//         return 'too big';
//     var n = s.split('');
//     var str = '';
//     var sk = 0;
//     for (var i = 0; i < x; i++) {
//         if ((x - i) % 3 == 2) {
//             if (n[i] == '1') {
//                 str += tn[Number(n[i + 1])] + ' ';
//                 i++;
//                 sk = 1;
//             } else if (n[i] != 0) {
//                 str += tw[n[i] - 2] + ' ';
//                 sk = 1;
//             }
//         } else if (n[i] != 0) { // 0235
//             str += dg[n[i]] + ' ';
//             if ((x - i) % 3 == 0) str += 'hundred ';
//             sk = 1;
//         }
//         if ((x - i) % 3 == 1) {
//             if (sk)
//                 str += th[(x - i - 1) / 3] + ' ';
//             sk = 0;
//         }
//     }

//     if (x != s.length) {
//         var y = s.length;
//         str += 'point ';
//         for (var i = x + 1; i < y; i++)
//             str += dg[n[i]] + ' ';
//     }
//     return str.replace(/\s+/g, ' ');
// }






var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

export function toWords (num) {
    if ((num = num.toString()).length > 9) return 'overflow';
  const  n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
}