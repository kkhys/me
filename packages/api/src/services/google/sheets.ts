import { env } from '../../../env';
import { GoogleSheetsError } from '../../exceptions';
import { authenticate } from './token';

export const appendGoogleSheets = async ({
  sheetName,
  values,
}: {
  sheetName: string;
  values: string[][];
}) => {
  const { access_token } = await authenticate();

  const params = {
    range: `${sheetName}!A2`,
    insertDataOption: 'INSERT_ROWS',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values,
    },
  };

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEETS_ID}/values/${encodeURIComponent(params.range)}:append?valueInputOption=${params.valueInputOption}&insertDataOption=${params.insertDataOption}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params.resource),
    },
  );

  if (!response.ok) {
    throw new GoogleSheetsError(
      'Google Sheets API request failed: ' + response.statusText,
    );
  }

  console.log('Append to Google Sheets was successful');
};
