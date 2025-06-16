const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const fs = require('fs');

const app = express();
let qrCodeSvg = 'QR not generated yet';

// ✅ Ensure session directory exists (for Heroku runtime)
const sessionDir = './wweb-session';
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir);
}

// ✅ Initialize WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth({ 
        clientId: "bot",
        dataPath: sessionDir
    }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on('qr', async (qr) => {
    console.log('QR RECEIVED');
    qrCodeSvg = await qrcode.toDataURL(qr);
});

client.on('ready', () => {
    console.log('✅ WhatsApp client is ready!');
});

client.on('authenticated', () => {
    console.log('🔐 Client authenticated');
});

client.on('auth_failure', msg => {
    console.error('❌ Auth failure', msg);
});

client.on('disconnected', () => {
    console.log('🚫 Client disconnected');
});

client.initialize();

// ✅ Express routes
app.get('/', (req, res) => {
    res.send(`<h2>Visit <a href="/qr">/qr</a> to scan</h2>`);
});

app.get('/qr', (req, res) => {
    res.send(`<h2>Scan QR:</h2><img src="${qrCodeSvg}" style="width:300px;"><br><p>Reload if blank.</p>`);
});

// ✅ Heroku port fix
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Server running at http://localhost:${PORT}`);
});
