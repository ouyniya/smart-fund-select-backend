let csvToJson = require('convert-csv-to-json');

let fileInputName = './feedetial.csv'; 

let json = csvToJson.fieldDelimiter(',')
            .getJsonFromCsv(fileInputName);

console.log(json)
