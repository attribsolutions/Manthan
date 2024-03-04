
const XLSX = require('xlsx');
export const readExcelFile = async ({ file }) => {
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
    jsonResult.forEach((i) => {
      let RemoveField = []
      for (let key in i) {
        if ((Number.isInteger(i[key])) && i[key] <= 0) {   //  - figure 
          RemoveField.push({ [key]: i[key] })
        }
        if (Object.prototype.hasOwnProperty.call(i, key)) {
          if (key.trim() !== key) {
            i[key.trim()] = i[key];
            delete i[key];
          }
        }
      }
      i["RemoveField"] = RemoveField

    })

    return jsonResult
  } catch (e) { }

}









