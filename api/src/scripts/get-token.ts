import { google } from 'googleapis';
import * as readline from 'readline';
import * as dotenv from 'dotenv';
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/calendar.events'],
});

console.log('\n=======================================');
console.log('1. Open this URL in your browser:');
console.log(url);
console.log('=======================================\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('2. Enter the "code=" parameter from the URL you were redirected to: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n=======================================');
    console.log('SUCCESS! Here is your Refresh Token:');
    console.log(tokens.refresh_token);
    console.log('=======================================\n');
    console.log('Paste that into GOOGLE_REFRESH_TOKEN in your .env file!');
  } catch (error) {
    console.error('Error fetching token:', error.message);
  }
  rl.close();
});
