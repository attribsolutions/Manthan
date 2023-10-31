// import { groupBy } from 'lodash';
import { groupBy, date_ymd_func, date_dmy_func } from '../../../../components/Common/CommonFunction';
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
          const fileData = e.target.result;
          const workbook = XLSX.read(fileData, { type: "binary" });
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
    if (comparefilter.length === 0) {
      invalidMsg.push(`Import filed Not Map`)
    }


    jsonResult.forEach((r1) => {

      comparefilter.forEach((c1) => {
        if (c1.ControlTypeName === "Date") {
          const date = new Date(Math.round((r1[c1.Value] - 25569) * 86400 * 1000));
          r1[c1.Value] = date_ymd_func(date)
        };
        const regExp = RegExp(c1.RegularExpression);


        if (!c1.IsCompulsory && (r1[c1.Value] === '' || r1[c1.Value] === null || r1[c1.Value] === undefined)) {
        }
        else if (!(regExp.test(r1[c1.Value]))) {
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
  let invoiceDate = []
  let amount = 0

  readjson.forEach((index) => {

    var invoiceFound = invoiceNO.find(i => (i === (index[fileFiled.InvoiceNumber])))
    var partyFound = partyNO.find(i => (i === (index[fileFiled.Party])))
    var dateFound = partyNO.find(i => (i === (index[fileFiled.InvoiceDate])))
    amount = Number(amount) + Number(index[fileFiled.GrandTotal]);

    if ((invoiceFound === undefined)) {
      invoiceNO.push((index[fileFiled.InvoiceNumber]))
    };
    if ((partyFound === undefined)) {
      partyNO.push((index[fileFiled.Party]))
    };
    if ((dateFound === undefined)) {
      invoiceDate.push(date_dmy_func((index[fileFiled.InvoiceDate])))
    };

  })

  const invoice = await groupBy(readjson, (index) => {
    return (index[fileFiled.InvoiceNumber])
  })


  return { fileFiled, invoice, invoiceDate, amount, invoiceNO, partyNO }
}



export async function downloadDummyFormatHandler(jsonData) {

  jsonData.sort((a, b) => {
    return a.Sequence - b.Sequence;
  });
  // / Extract unique column names for the header
  const uniqueValuesAndFormats = jsonData.reduce((result, entry) => {
    const value = entry.Value;
    const format = entry.Format;
    if (value !== '' && value !== null) {
      const index = result.values.indexOf(value);
      if (index === -1) {
        result.values.push(value);
        result.formats.push([format]);
      }
    }

    return result;
  }, { values: [], formats: [] });



  const columnNames = uniqueValuesAndFormats.values;
  const emptyData = uniqueValuesAndFormats.formats;

  const ws = XLSX.utils.aoa_to_sheet([columnNames, emptyData]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, 'download  Format.xlsx');

}