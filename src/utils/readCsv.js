const fs = require('fs');
const csvParser = require('csv-parser');

// Function to read CSV file
async function readCSV(filePath) {
  const data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        fs.unlinkSync(filePath); // Remove the file after reading
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = { readCSV };
