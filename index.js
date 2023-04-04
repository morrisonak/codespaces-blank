const fs = require('fs');

const logText = fs.readFileSync('log.txt', 'utf-8');

const regexDate = /\d{2}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/;
const regexVital = /^(\d{2}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+Vital Recorder Entry\s+([\s\S]*?)$/gm;
const regexNonVital = /^(\d{2}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+Non-Vital Recorder Entry\s+([\s\S]*?)$/gm;

const resultData = [];

let match;
while ((match = regexVital.exec(logText)) !== null) {
  const [, dateTime, data] = match;
  const parsedData = {};
  data.split(/\s+/).forEach((entry) => {
    const [key, value] = entry.split('=');
    parsedData[key] = value === 'T';
  });
  resultData.push({
    dateTime,
    data: parsedData,
    type: 'Vital',
  });
}

while ((match = regexNonVital.exec(logText)) !== null) {
  const [, dateTime, data] = match;
  const parsedData = {};
  data.split(/\s+/).forEach((entry) => {
    const [key, value] = entry.split('=');
    parsedData[key] = value === 'T';
  });
  resultData.push({
    dateTime,
    data: parsedData,
    type: 'Non-Vital',
  });
}

fs.writeFile('output.json', JSON.stringify(resultData), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File created!');
  });