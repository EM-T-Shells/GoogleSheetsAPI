const { google } = require('googleapis');
const keys = require('./keys.json');

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function(err, tokens){
    if (err) {
        return console.log(err);
    } else {
        console.log("connected!");
    }
});

async function gsrun(client) {
    const sheetsAPI = google.sheets({version:'v4', auth: client});
    const opt = {
        sheetId : '1vk9U8D8WY3EvQcqSVFPE9mzg5Wz1XjWd8vh5HsUMva8',
        range : 'Data!A1:B1000'
    };

    let data = await sheetsAPI.spreadsheets.values.get(opt);
    console.log(data);

};