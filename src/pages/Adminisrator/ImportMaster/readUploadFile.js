import { groupBy } from '../../../components/Common/CommonFunction';
import { commonPageFiled_API } from '../../../helpers/backend_helper';
const XLSX = require('xlsx');

const readUploadFile = async ({ dispatch, useState, useEffect, file, compairField }) => {


  try {
    const progDiv = document.getElementById("file-proccess")
    const progBar = document.getElementById("_progressbar")
    const progLabe = document.getElementById("file-proccess-lable")
    progDiv.style.display = 'block'

    processing(5)
    function processing(t) {
      progBar.style.width = `${t}%`
      progLabe.innerText = `${t}%`
    }

    debugger
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    const  jsonResult = await new Promise(function (myResolve, myReject) {
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const result = XLSX.utils.sheet_to_json(worksheet);
          myResolve(result)
        } catch (g) {
          myReject([])
        }

      }

    });

    debugger

    processing(10)

    let invalidMsg = []
    let count = 0
    jsonResult.forEach((r1, k) => {
      compairField.forEach((c1) => {
        const regExp = RegExp(c1.ValidationRegX)
        if (!(regExp.test(r1[c1.RelatedKeyField]))) {
          invalidMsg.push(`${c1.RelatedKeyField} :${r1[c1.RelatedKeyField]} is invalid Format`)
        }
      })
      count = count + (70 / jsonResult.length)
      processing(count)
    })
    if (invalidMsg.length > 0) {
      alert(JSON.stringify(invalidMsg))
    }
    groupBy(jsonResult,(party)=>(party))
    console.log('Upload data', jsonResult)
    const aad = await commonPageFiled_API(184)
    debugger
  } catch (e) { }
}

export default readUploadFile



