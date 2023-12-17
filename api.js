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

      // Append data to the new sheet
      const appendResult = await sheets.spreadsheets.values.append({
        spreadsheetId: '1vk9U8D8WY3EvQcqSVFPE9mzg5Wz1XjWd8vh5HsUMva8',
        range: `${newSheetTitle}!A1`, // Use dynamic range
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[name]],
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
