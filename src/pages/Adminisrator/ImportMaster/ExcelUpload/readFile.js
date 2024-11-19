// import { groupBy } from 'lodash';
import { groupBy, invertDatefunc } from '../../../../components/Common/CommonFunction';
import { customAlert } from '../../../../CustomAlert/ConfirmDialog';

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
      customAlert({
        Type: 3,
        Message: JSON.stringify(invalidMsg),
      })
      return []
    }

    return jsonResult

  } catch (e) { }

}





export async function fileDetails({ compareParam = [], readjson = [] }) {


  const fileFiled = {}

  await compareParam.forEach(ele => {
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
