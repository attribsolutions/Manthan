// import { groupBy } from 'lodash';
import { groupBy, date_ymd_func } from '../../../../components/Common/CommonFunction';
import { customAlert } from '../../../../CustomAlert/ConfirmDialog';

const XLSX = require('xlsx');


export const readExcelFile = async ({ file, compareParameter }) => {


  try {
   
    processing(5)

    function processing(t) {
      // progBar.style.width = `${t}%`
      // progLabe.innerText = `${t}%`
    }


    const reader = new FileReader();
    reader.readAsBinaryString(file);

    const jsonResult = await new Promise(function (myResolve, myReject) {

      reader.onload = (e) => {
        try {
          const bstr = e.target.result;
          const workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const result = XLSX.utils.sheet_to_json(worksheet);
          myResolve(result)
        } catch (g) {
          myReject([])
        }

      }

    });


    let invalidMsg = []
    let count = 0
    const comparefilter = compareParameter.filter(f => (f.Value !== null))
   

    jsonResult.forEach((r1, k) => {
      // 
      comparefilter.forEach((c1) => {
        if (c1.ControlTypeName === "Date") { r1[c1.Value] = date_ymd_func(r1[c1.Value]) }
        const regExp = RegExp(c1.RegularExpression)
        if (!(regExp.test(r1[c1.Value]))) {
          invalidMsg.push(`${c1.Value} :${r1[c1.Value]} is invalid Format`)
        }
      })
      count = count + (70 / jsonResult.length)
      processing(count)
    })
    if (invalidMsg.length > 0) {
      customAlert({
        Type: 3,
        Message: JSON.stringify(invalidMsg),
      })
      return []
    }


    return jsonResult

  } catch (e) { }

}





export async function fileDetails({ compareParameter = [], readjson = [] }) {


  const fileFiled = {}

  await compareParameter.forEach(ele => {
    if ((ele.Value !== null)) {
      fileFiled[ele.FieldName] = ele.Value
    }
  })
  let invoiceNO = []
  let partyNO = []

  const invoice = await groupBy(readjson, (party) => {
    return (party[fileFiled.InvoiceNumber])
  })
  const party = await groupBy(readjson, (party) => (party[fileFiled.Party]))

  await invoice.forEach((ele, a, s) => {
    invoiceNO.push(a)
  });

  await party.forEach((ele, a, s) => {
    partyNO.push(a)
  });

  const invoiceDate = await groupBy(readjson, (party) => (party[fileFiled.InvoiceDate]))
  const amount = await readjson.reduce((total, current,) => {
    return total + Number(current[fileFiled.GrandTotal])
  }, 0)


  return { fileFiled, invoice, party, invoiceDate, amount, invoiceNO, partyNO }
}






// var date = datValid('28-03-2022') ;
// date.format("dddd, MMMM, YYYY")
// date.isValid()


// console.log(date)

// console.log(date.isValid())







// // var dateRegex = /^[0-9]{1,2}\-[0-9]{1,2}\-[0-9]{4}$/;
// var dateRegex = /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/;

// // Extract date from a string
// dateRegex.test(dateString); // Returns true

// console.log(dateRegex.test(dateString))

// var dateRegexG = /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/g;


// console.log(valDate("20/02/2022"))
// function valDate(date) {
//   let dateformat = /^(0?[1-9]|[1-2][0-9]|3[01])[\/](0?[1-9]|1[0-2])/;

//   // Matching the date through regular expression
//   if (date.match(dateformat)) {
//       let operator = date.split('-');

//       // Extract the string into month, date and year
//       let datepart = [];
//       if (operator.length > 1) {
//           datepart = date.split('-');
//       }
//       let day = parseInt(datepart[0]);
//       let month = parseInt(datepart[1]);
//       let year = parseInt(datepart[2]);

//       // Create a list of days of a month
//       let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
//       if (month == 1 || month > 2) {
//           if (day > ListofDays[month - 1]) {
//               //to check if the date is out of range
//               console.log("Invalid date")
//               return false;
//           }
//       } else if (month == 2) {
//           let leapYear = false;
//           if ((!(year % 4) && year % 100) || !(year % 400)) leapYear = true;
//           if ((leapYear == false) && (day >= 29)) {
//               console.log("Invalid date")
//               return false;
//           }
//           else
//               if ((leapYear == true) && (day > 29)) {
//                   console.log('Invalid date format!');
//                   return false;
//               }
//       }
//   } else {
//       console.log("Invalid date format!");
//       return false;
//   }
//   return "Valid date";
// }