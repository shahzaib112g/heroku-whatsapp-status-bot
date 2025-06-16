const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox'] }
});

let qrCode = null;

client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
        qrCode = url;
        console.log('QR RECEIVED');
    });
});

client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

client.initialize();

app.get('/', (req, res) => {
    res.send('WhatsApp Status Bot is running.');
});

app.get('/qr', (req, res) => {
    if (qrCode) {
        res.send(`<img src="${qrCode}" />`);
    } else {
        res.send('QR Code not generated yet. Please refresh in a moment.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
