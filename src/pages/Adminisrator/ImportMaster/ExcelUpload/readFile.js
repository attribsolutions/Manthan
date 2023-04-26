import { groupBy } from 'lodash';
import { invertDatefunc } from '../../../../components/Common/CommonFunction';
import { CustomAlert } from '../../../../CustomAlert/ConfirmDialog';

const XLSX = require('xlsx');


export const readExcelFile = async ({ file, compareParam }) => {


  try {
    // const progDiv = document.getElementById("file-proccess")
    // const progBar = document.getElementById("_progressbar")
    // const progLabe = document.getElementById("file-proccess-lable")
    // progDiv.style.display = 'block'
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

    processing(10)

    let invalidMsg = []
    let count = 0
    const comparefilter = compareParam.filter(f => (f.Value !== null))

    jsonResult.forEach((r1, k) => {
      comparefilter.forEach((c1) => {
        if (c1.ControlTypeName === "Date") { r1[c1.Value] = invertDatefunc(r1[c1.Value]) }
        const regExp = RegExp(c1.RegularExpression)
        if (!(regExp.test(r1[c1.Value]))) {
          invalidMsg.push(`${c1.Value} :${r1[c1.Value]} is invalid Format`)
        }
      })
      count = count + (70 / jsonResult.length)
      processing(count)
    })
    if (invalidMsg.length > 0) {
      CustomAlert({
        Type: 3,
        Message: JSON.stringify(invalidMsg),
      })
      return []
    }


    // groupBy(jsonResult, (party) => (party))
    // console.log('Upload data', jsonResult)
    // const aad = await commonPageFiled_API(184)

    return jsonResult

  } catch (e) { }

}





export async function fileDetails({ compareParam = [], readjson = [], setReadJsonDetail }) {


  const fileFiled = {}

  await compareParam.forEach(ele => {
    if ((ele.Value !== null)) {
      fileFiled[ele.FieldName] = ele.Value
    }
  })
  debugger
  const invoice = await groupBy(readjson, (party) => {
    debugger
    return (party[fileFiled.InvoiceNumber])
  })
  const party = await groupBy(readjson, (party) => (party[fileFiled.Party]))
  const invoiceDate = await groupBy(readjson, (party) => (party[fileFiled.InvoiceDate]))
  const amount = await readjson.reduce((total, current,) => {
    return total + Number(current[fileFiled.GrandTotal])
  }, 0)
  setReadJsonDetail({ fileFiled, invoice, party, invoiceDate, amount })
  return { fileFiled, invoice, party, invoiceDate, amount }
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