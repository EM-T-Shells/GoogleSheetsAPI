const { google } = require('googleapis');
const credentials = require('./keys.json');

const mysql = require('mysql');
const util = require('util');

let jsonData = null;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "united2heal.cxsnwexuvrto.us-east-1.rds.amazonaws.com",
  user: "united2heal",
  password: "ilovevcu123",
  port: "3306",
  database: "u2hdb"
});

// Promisify the pool.query function
const query = util.promisify(pool.query).bind(pool);

module.exports = {
  submitToGoogleSheet: async (req, res) => {
    const name = req.body.name;
    const box = req.body.box;

    try {
      const result = await query('SELECT * FROM u2hdb.ItemBox WHERE GroupName = ? AND BoxNumber = ?', [name, box]);

      console.log('Row Details:', JSON.stringify(result));

      jsonData = result;

      console.log(jsonData);
      console.log(result);

      // The rest of your code...
    } catch (err) {
      console.error(err);
      res.status(500).send('Error querying database');
      return; // Exit the function on error
    }

    const sheets = google.sheets({
      version: 'v4',
      auth: new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ['https://www.googleapis.com/auth/spreadsheets'],
      ),
    });

    try {
      // Get the spreadsheet information
      const spreadsheetInfo = await sheets.spreadsheets.get({
        spreadsheetId: '1vk9U8D8WY3EvQcqSVFPE9mzg5Wz1XjWd8vh5HsUMva8',
      });

      // Create a new sheet
      const newSheetTitle = `Sheet${spreadsheetInfo.data.sheets.length + 1}`;
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: '1vk9U8D8WY3EvQcqSVFPE9mzg5Wz1XjWd8vh5HsUMva8',
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: newSheetTitle,
                },
              },
            },
          ],
        },
      });

      console.log(jsonData);

      // Extract column names from the first row of the result
      const headers = Object.keys(jsonData[0]);

      // Combine headers with data
      const values = [headers, ...jsonData.map(row => Object.values(row))];

      // Append data to the new sheet
      const appendResult = await sheets.spreadsheets.values.append({
        spreadsheetId: '1vk9U8D8WY3EvQcqSVFPE9mzg5Wz1XjWd8vh5HsUMva8',
        range: `${newSheetTitle}!A1`, // Use dynamic range
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: values,
        },
      });

      console.log('Data submitted to Google Sheet:', appendResult.data);

      // Redirect to the Google Sheets document
      const googleSheetsUrl = `https://docs.google.com/spreadsheets/d/1vk9U8D8WY3EvQcqSVFPE9mzg5Wz1XjWd8vh5HsUMva8/edit`;
      res.redirect(googleSheetsUrl);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error submitting data to Google Sheet');
    }
  },
};
