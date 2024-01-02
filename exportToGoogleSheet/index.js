const { google } = require('googleapis');
const credentials = require('./keys.json');
const mysql = require('mysql');
const util = require('util');

const dotenv = require('dotenv');
dotenv.config();

const sheets = google.sheets({
  version: 'v4',
  auth: new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'],
  ),
});

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// Promisify the pool.query function
const query = util.promisify(pool.query).bind(pool);d

exports.handler = async function(event) {
  try {
    const groupName = event.queryStringParameters.groupName;
    const boxNumber = event.queryStringParameters.boxNumber;

    // Queue the processing task asynchronously
    await processAsync(groupName, boxNumber);

    // Respond quickly without waiting for the processing to complete
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Data submission acknowledged' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error processing the request' }),
    };
  }
};

async function processAsync(groupName, boxNumber) {
  try {
    const result = await query('SELECT * FROM u2hdb.ItemBox WHERE GroupName = ? AND BoxNumber = ?', [groupName, boxNumber]);

    console.log('Row Details:', JSON.stringify(result));

    const jsonData = result;

    console.log(jsonData);
    console.log(result);

    // Ensure jsonData is defined and not empty
    if (!jsonData || jsonData.length === 0) {
      console.error('jsonData is undefined or empty.');
      return;
    }

    const newSheetTitle = `Box${boxNumber}_Group${groupName}`;

    console.log('Creating new sheet with title:', newSheetTitle);

    // Create a new sheet
    const createSheetResult = await sheets.spreadsheets.batchUpdate({
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

    console.log('New sheet created successfully.');

    console.log('jsonData:', jsonData);

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
  } catch (error) {
    console.error('Error processing asynchronously:', error);
    // Handle errors as needed
  }
}
