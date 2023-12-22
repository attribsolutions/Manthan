// import { groupBy } from 'lodash';
import { groupBy, date_ymd_func, date_dmy_func } from '../../../../components/Common/CommonFunction';
import { customAlert } from '../../../../CustomAlert/ConfirmDialog';

const XLSX = require('xlsx');


export const readExcelFile = async ({ file, compareParameter }) => {
  function isFloat(num) {
    return num % 1 !== 0;
  }
  try {

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

    const comparefilter = compareParameter.filter(f => (f.Value !== null))
    if (comparefilter.length === 0) {
      invalidMsg.push(`Import filed Not Map`)
    }


    jsonResult.forEach((r1) => {
      let shouldRemove = false
      let Invoice_No = ""
      comparefilter.forEach((c1) => {

        if (c1.ControlTypeName === "Date") {
          const date = new Date(Math.round((r1[c1.Value] - 25569) * 86400 * 1000));
          r1[c1.Value] = date_ymd_func(date)
        };
        
        if (c1.FieldName === "InvoiceNumber") {
          Invoice_No = r1[c1.Value]
        };
        const regExp = RegExp(c1.RegularExpression);


        if ((Number.isInteger(r1[c1.Value]) || (isFloat(r1[c1.Value]))) && r1[c1.Value] < 0) {   //  - figure only checking value  that are map in our system 

          shouldRemove = true;
        }
        if (!c1.IsCompulsory && (r1[c1.Value] === '' || r1[c1.Value] === null || r1[c1.Value] === undefined)) {
        }
        else if (!(regExp.test(r1[c1.Value]))) {

          if (!((Number.isInteger(r1[c1.Value]) || (isFloat(r1[c1.Value]))) && (r1[c1.Value] < 0))) {
            invalidMsg.push(`${c1.Value} :${r1[c1.Value]} is invalid Format`)
          }
        }
      })
      r1["Invoice_No"] = Invoice_No
      r1["shouldRemove"] = shouldRemove
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





export async function fileDetails({ compareParameter = [], filteredReadjson = [] }) {


  const fileFiled = {}

  await compareParameter.forEach(ele => {
    if ((ele.Value !== null)) {
      fileFiled[ele.FieldName] = ele.Value
    }
  })
  let invoiceNO = [];
  let partyNO = [];
  let invoiceDate = [];
  let itemCode = [];
  let unitCode = [];

  let amount = 0

  filteredReadjson.forEach((index) => {

    var invoiceFound = invoiceNO.find(i => (i === (index[fileFiled.InvoiceNumber])))
    var partyFound = partyNO.find(i => (i === (index[fileFiled.Customer])))
    var ItemCodeFound = itemCode.find(i => (i === (index[fileFiled.Item])))
    var UnitCodeFound = unitCode.find(i => (i === (index[fileFiled.Unit])))

    var dateFound = partyNO.find(i => (i === (index[fileFiled.InvoiceDate])))
    amount = Number(amount) + Number(index[fileFiled.GrandTotal]);

    if ((invoiceFound === undefined)) {
      invoiceNO.push((index[fileFiled.InvoiceNumber]))
    };
    if ((partyFound === undefined)) {
      partyNO.push((index[fileFiled.Customer]))
    };
    if ((ItemCodeFound === undefined)) {
      itemCode.push((index[fileFiled.Item]))
    };

    if ((UnitCodeFound === undefined)) {
      unitCode.push((index[fileFiled.Unit]))
    };

    if ((dateFound === undefined)) {
      invoiceDate.push(date_dmy_func((index[fileFiled.InvoiceDate])))
    };

  })

  const invoice = await groupBy(filteredReadjson, (index) => {
    return (index[fileFiled.InvoiceNumber])
  })

  return { fileFiled, invoice, invoiceDate, amount, invoiceNO, partyNO, itemCode, unitCode }
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