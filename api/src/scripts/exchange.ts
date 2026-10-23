import { google } from 'googleapis';
import * as dotenv from 'dotenv';
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const code = '4/0AdkVLPwg8v4TjhEYB55L6oC_Ao8YbokwHUm4h1wjToOZ6OleydnTm_uMlu1AFqZo24nQvQ';

oauth2Client.getToken(code).then(({tokens}) => {
  console.log('--- REFRESH TOKEN ---');
  console.log(tokens.refresh_token);
  console.log('---------------------');
}).catch(e => {
  console.error('ERROR:', e.message);
});
