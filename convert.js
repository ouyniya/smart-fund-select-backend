// convert to json format
const csvToJson = require('convert-csv-to-json');

let fileInputName = 'feedetial.csv'; 
let feeDetialData = csvToJson.fieldDelimiter(',')
            .getJsonFromCsv(fileInputName);
console.log(feeDetialData)