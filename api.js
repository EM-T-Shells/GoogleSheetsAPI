const { google } = require('googleapis');
const credentials = require('./keys.json');

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
  submitToGoogleSheet: async (req, res) => {
    const name = req.body.name;

    try {
      // Create a new spreadsheet
      const spreadsheetResponse = await sheets.spreadsheets.create({
        resource: {
          properties: {
            title: `Form Responses - ${Date.now()}`,
          },
        },
      });

      // Extract the spreadsheetId from the response
      const spreadsheetId = spreadsheetResponse.data.spreadsheetId;

      // Append data to the new Google Sheet
      const appendResult = await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: 'Sheet1', // Update with your sheet name
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[name]],
        },
      });

      console.log('Data submitted to Google Sheet:', appendResult.data);

      // Redirect to the Google Sheets document
      const googleSheetsUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
      res.redirect(googleSheetsUrl);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error submitting data to Google Sheet');
    }
  },
};
