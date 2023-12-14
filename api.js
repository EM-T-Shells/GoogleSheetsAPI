const { google } = require('googleapis');

// Load credentials from the JSON file you downloaded
const credentials = require('./keys.json');

// Configure the Google Sheets API
const sheets = google.sheets({
    version: 'v4',
    auth: new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
    ),
});

module.exports = {
  submitToGoogleSheet: (req, res) => {
    const name = req.body.name;

    // Append data to the Google Sheet
    sheets.spreadsheets.values.append({
      spreadsheetId: '1vk9U8D8WY3EvQcqSVFPE9mzg5Wz1XjWd8vh5HsUMva8',
      range: 'Sheet1', // Update with your sheet name
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[name]],
      },
    }, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error submitting data to Google Sheet');
      } else {
        console.log('Data submitted to Google Sheet:', result.data);
        res.send('Data submitted successfully!');
      }
    });
  },
};
