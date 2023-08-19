
// var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
// var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

// export function toWords(num) {
//   
//   if ((num = num.toString()).length > 9) return 'overflow';
//   const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);

//   if (!n) return; var str = '';
//   str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
//   str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
//   str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
//   str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
//   str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only' : '';
//   return str;
// }


export function numberWithCommas(x) {
  return x.toString().split('.')[0].length > 3 ? x.toString().substring(0, x.toString().split('.')[0].length - 3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length - 3) : x.toString();
}





export function toWords(number) {
  
  // Define word mappings
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  // Function to convert a given three-digit number to words
  function convertThreeDigits(num) {
    let word = '';
    const hundred = Math.floor(num / 100);
    num %= 100;
    if (hundred !== 0) {
      word += units[hundred] + ' Hundred ';
    }
    if (num >= 10 && num <= 19) {
      word += teens[num - 10] + ' ';
    } else {
      const ten = Math.floor(num / 10);
      num %= 10;
      if (ten !== 0) {
        word += tens[ten] + ' ';
      }
      if (num !== 0) {
        word += units[num] + ' ';
      }
    }
    return word.trim();
  }

  // Check if the number is zero
  if (number === 0) {
    return 'Zero Rupees Only';
  }

  // Separate the whole and decimal parts of the number
  let wholePart = Math.floor(number);
  let decimalPart = Math.round((number - wholePart) * 100);

  // Convert the whole part to words
  const crore = Math.floor(wholePart / 10000000);
  wholePart %= 10000000;
  const lakh = Math.floor(wholePart / 100000);
  wholePart %= 100000;
  const thousand = Math.floor(wholePart / 1000);
  const remaining = wholePart % 1000;

  let rupeesWords = '';

  if (crore !== 0) {
    rupeesWords += convertThreeDigits(crore) + ' Crore ';
  }

  if (lakh !== 0) {
    rupeesWords += convertThreeDigits(lakh) + ' Lakh ';
  }

  if (thousand !== 0) {
    rupeesWords += convertThreeDigits(thousand) + ' Thousand ';
  }

  if (remaining !== 0) {
    rupeesWords += convertThreeDigits(remaining);
  }

  // Construct the final representation
  rupeesWords += ' Rupees';

  if (decimalPart !== 0) {
    rupeesWords += ' and ' + convertThreeDigits(decimalPart) + ' Paise';
  }

  rupeesWords += ' Only';
  return rupeesWords;
}


export function toWordswithoutRS(number) {
  // Define word mappings
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  // Function to convert a given three-digit number to words
  function convertThreeDigits(num) {
    let word = '';
    const hundred = Math.floor(num / 100);
    num %= 100;
    if (hundred !== 0) {
      word += units[hundred] + ' Hundred ';
    }
    if (num >= 10 && num <= 19) {
      word += teens[num - 10] + ' ';
    } else {
      const ten = Math.floor(num / 10);
      num %= 10;
      if (ten !== 0) {
        word += tens[ten] + ' ';
      }
      if (num !== 0) {
        word += units[num] + ' ';
      }
    }
    return word.trim();
  }

  // Check if the number is zero
  if (number === 0) {
    return 'Zero Rupees Only';
  }

  // Separate the whole and decimal parts of the number
  let wholePart = Math.floor(number);
  let decimalPart = Math.round((number - wholePart) * 100);

  // Convert the whole part to words
  const crore = Math.floor(wholePart / 10000000);
  wholePart %= 10000000;
  const lakh = Math.floor(wholePart / 100000);
  wholePart %= 100000;
  const thousand = Math.floor(wholePart / 1000);
  const remaining = wholePart % 1000;

  let rupeesWords = '';

  if (crore !== 0) {
    rupeesWords += convertThreeDigits(crore) + ' Crore ';
  }

  if (lakh !== 0) {
    rupeesWords += convertThreeDigits(lakh) + ' Lakh ';
  }

  if (thousand !== 0) {
    rupeesWords += convertThreeDigits(thousand) + ' Thousand ';
  }

  if (remaining !== 0) {
    rupeesWords += convertThreeDigits(remaining);
  }

  // Construct the final representation
  rupeesWords += ' ';

  if (decimalPart !== 0) {
    rupeesWords += ' and ' + convertThreeDigits(decimalPart) + ' Paise';
  }

  rupeesWords += ' Only';
  return rupeesWords;
}