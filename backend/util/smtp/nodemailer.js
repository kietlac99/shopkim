import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { 
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN,
    REDIRECT_URI
  } from '../../config';

export const nodeMailerSendEmail = async (username, to, cc, subject, html, attachments) => {
    try {
        const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        const accessToken = await oAuth2Client.getAccessToken();
        const transportSMTP = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: username,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            },
        });
        const mailConfig = {
            from: username,
            to,
            cc,
            subject,
            html
        };
        if (attachments) {
            mailConfig.attachments = attachments;
        }
        await transportSMTP.sendMail(mailConfig);
        return true;
    } catch (error) {
        return false;
    }
};